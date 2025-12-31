#!/usr/bin/env bun

/**
 * Generate Storyboard Script
 *
 * Generates first and last frames for each scene using Fal AI's Nano Banana Pro Edit model.
 *
 * Usage:
 *   bun run generate-storyboard.ts --scenes-description-file "scenes description file path" --image-directory "images directory path" --output-directory "output directory path"
 */

import { readdir } from "node:fs/promises";
import { type CompletedQueueStatus, fal } from "@fal-ai/client";
import { program } from "commander";
import pMap from "p-map";
import { z } from "zod";

interface StoryboardOptions {
	scenesDescriptionFile: string;
	imageDirectory: string;
	outputDirectory: string;
}

const scenesDescriptionJsonSchema = z.object({
	scenes: z.array(
		z.object({
			scene_title: z.string(),
			duration: z.enum(["4s", "6s", "8s"]),
			first_frame_prompt: z.string(),
			last_frame_prompt: z.string(),
			video_transition_prompt: z.string(),
		}),
	),
});

async function generateStoryboard(options: StoryboardOptions): Promise<void> {
	const { scenesDescriptionFile, imageDirectory, outputDirectory } = options;

	const scenesDescriptionJson = await Bun.file(scenesDescriptionFile).text();
	const scenesDescription = scenesDescriptionJsonSchema.safeParse(
		JSON.parse(scenesDescriptionJson),
	).data;
	if (!scenesDescription) {
		throw new Error("Invalid scenes description file");
	}

	fal.config({
		credentials: process.env.FAL_KEY,
	});

	const imageModel = "fal-ai/nano-banana-pro/edit";
	const referenceImageUrls = await uploadFiles(imageDirectory);

	const mapper = async (scene: (typeof scenesDescription.scenes)[number]) => {
		const firstFrameQueueStatus = await fal.queue.submit(imageModel, {
			input: {
				prompt: scene.first_frame_prompt,
				image_urls: referenceImageUrls,
			},
		});
		const lastFrameQueueStatus = await fal.queue.submit(imageModel, {
			input: {
				prompt: scene.last_frame_prompt,
				image_urls: referenceImageUrls,
			},
		});
		await waitUntilCompleted(
			[firstFrameQueueStatus.request_id, lastFrameQueueStatus.request_id],
			imageModel,
		);

		const firstFrameOutput = await fal.queue.result(imageModel, {
			requestId: firstFrameQueueStatus.request_id,
		});
		const lastFrameOutput = await fal.queue.result(imageModel, {
			requestId: lastFrameQueueStatus.request_id,
		});

		return {
			sceneTitle: scene.scene_title,
			firstFrameUrl: firstFrameOutput.data.images[0].url,
			lastFrameUrl: lastFrameOutput.data.images[0].url,
			duration: scene.duration,
			videoTransitionPrompt: scene.video_transition_prompt,
		};
	};

	const results = await pMap(scenesDescription.scenes, mapper, {
		concurrency: 10,
	});

	const storyboard = await Promise.all(
		results.map(async (result, index) => {
			const firstFrameUrl = result.firstFrameUrl;
			const lastFrameUrl = result.lastFrameUrl;
			const firstFrame = await fetch(firstFrameUrl);
			const firstFrameBuffer = await firstFrame.arrayBuffer();
			await Bun.write(
				`${outputDirectory}/${index}-${result.sceneTitle}/first-frame.png`,
				firstFrameBuffer,
			);
			const lastFrame = await fetch(lastFrameUrl);
			const lastFrameBuffer = await lastFrame.arrayBuffer();
			await Bun.write(
				`${outputDirectory}/${index}-${result.sceneTitle}/last-frame.png`,
				lastFrameBuffer,
			);

			return {
				sceneTitle: result.sceneTitle,
				firstFramePath: `${outputDirectory}/${index}-${result.sceneTitle}/first-frame.png`,
				lastFramePath: `${outputDirectory}/${index}-${result.sceneTitle}/last-frame.png`,
				duration: result.duration,
				videoTransitionPrompt: result.videoTransitionPrompt,
			};
		}),
	);

	await Bun.write(
		`${outputDirectory}/storyboard.json`,
		JSON.stringify(storyboard, null, 2),
	);

	console.log(
		`✅ Storyboard generated and saved to: ${outputDirectory}/storyboard.json`,
	);
}

async function uploadFiles(folderPath: string): Promise<string[]> {
	const filePaths = await readdir(folderPath);
	return await Promise.all(
		filePaths.map(async (fileName) => {
			const fullPath = `${folderPath}/${fileName}`;
			const file = Bun.file(fullPath);
			const url = await fal.storage.upload(file);
			return url;
		}),
	);
}

async function waitUntilCompleted(
	requestIds: string[],
	model: string,
): Promise<CompletedQueueStatus[]> {
	let statuses = await Promise.all(
		requestIds.map(async (requestId) => {
			return await fal.queue.status(model, {
				requestId: requestId,
				logs: true,
			});
		}),
	);
	while (!statuses.every((status) => status.status === "COMPLETED")) {
		await Bun.sleep(1000);
		statuses = await Promise.all(
			requestIds.map(async (requestId) => {
				return await fal.queue.status(model, {
					requestId: requestId,
					logs: true,
				});
			}),
		);
	}
	return statuses;
}

program
	.description("Generate a storyboard for a video")
	.requiredOption(
		"-d, --scenes-description-file <scenes-description-file>",
		"The scenes description file to generate the storyboard",
	)
	.requiredOption(
		"-i, --image-directory <image-directory>",
		"The reference images directory to generate the storyboard",
	)
	.requiredOption(
		"-o, --output-directory <output-directory>",
		"The output directory to save the storyboard images",
	)
	.action(
		async (options: {
			scenesDescriptionFile: string;
			imageDirectory: string;
			outputDirectory: string;
		}) => {
			try {
				await generateStoryboard({
					scenesDescriptionFile: options.scenesDescriptionFile,
					imageDirectory: options.imageDirectory,
					outputDirectory: options.outputDirectory,
				});
			} catch (error) {
				console.error("❌ Error generating storyboard:", error);
				process.exit(1);
			}
		},
	);

if (import.meta.main) {
	program.parseAsync(process.argv);
}
