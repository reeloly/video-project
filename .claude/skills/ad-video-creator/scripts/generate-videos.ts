#!/usr/bin/env bun

/**
 * Generate Videos Script
 *
 * Generates videos from storyboard frames using Fal AI's Veo 3.1 model.
 *
 * Usage:
 *   bun run generate-videos.ts --storyboard-file "path/to/storyboard.json"
 */

import { dirname } from "node:path";
import { type CompletedQueueStatus, fal } from "@fal-ai/client";
import { program } from "commander";
import pMap from "p-map";
import { z } from "zod";

const storyboardJsonSchema = z.object({
	sceneTitle: z.string(),
	firstFramePath: z.string(),
	lastFramePath: z.string(),
	duration: z.enum(["4s", "6s", "8s"]),
	videoTransitionPrompt: z.string(),
});

type StoryboardScene = z.infer<typeof storyboardJsonSchema>;

interface VideoGenerationOptions {
	storyboardFile: string;
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

async function generateVideos(options: VideoGenerationOptions): Promise<void> {
	const { storyboardFile } = options;

	fal.config({
		credentials: process.env.FAL_KEY,
	});

	const videoModel = "fal-ai/veo3.1/fast/first-last-frame-to-video";

	// Read storyboard file
	const storyboardJson = await Bun.file(storyboardFile).text();
	const storyboard = z
		.array(storyboardJsonSchema)
		.safeParse(JSON.parse(storyboardJson)).data;

	if (!storyboard) {
		throw new Error("Invalid storyboard file");
	}

	const outputDirectory = dirname(storyboardFile);

	const mapper = async (scene: StoryboardScene) => {
		// Upload first and last frame images
		const firstFrameFile = Bun.file(scene.firstFramePath);
		const lastFrameFile = Bun.file(scene.lastFramePath);

		const [firstFrameUrl, lastFrameUrl] = await Promise.all([
			fal.storage.upload(firstFrameFile),
			fal.storage.upload(lastFrameFile),
		]);

		// Generate video
		const videoQueueStatus = await fal.queue.submit(videoModel, {
			input: {
				prompt: scene.videoTransitionPrompt,
				first_frame_url: firstFrameUrl,
				last_frame_url: lastFrameUrl,
				generate_audio: false,
				duration: scene.duration,
			},
		});

		await waitUntilCompleted([videoQueueStatus.request_id], videoModel);

		const videoOutput = await fal.queue.result(videoModel, {
			requestId: videoQueueStatus.request_id,
		});

		return {
			sceneTitle: scene.sceneTitle,
			videoUrl: videoOutput.data.video.url,
		};
	};

	const results = await pMap(storyboard, mapper, {
		concurrency: 5,
	});

	// Download and save videos
	const updatedStoryboard = await Promise.all(
		results.map(async (result, index) => {
			const videoUrl = result.videoUrl;
			const video = await fetch(videoUrl);
			const videoBuffer = await video.arrayBuffer();
			const videoPath = `${outputDirectory}/${index}-${result.sceneTitle}/video.mp4`;
			await Bun.write(videoPath, videoBuffer);

			return {
				...storyboard[index],
				videoPath,
			};
		}),
	);

	// Update storyboard file with video paths
	await Bun.write(storyboardFile, JSON.stringify(updatedStoryboard, null, 2));

	console.log(
		`✅ Videos generated and storyboard updated at: ${storyboardFile}`,
	);
}

program
	.description("Generate videos from a storyboard")
	.requiredOption(
		"-s, --storyboard-file <storyboard-file>",
		"The storyboard.json file path",
	)
	.action(async (options: { storyboardFile: string }) => {
		try {
			await generateVideos({
				storyboardFile: options.storyboardFile,
			});
		} catch (error) {
			console.error("❌ Error generating videos:", error);
			process.exit(1);
		}
	});

if (import.meta.main) {
	program.parseAsync(process.argv);
}
