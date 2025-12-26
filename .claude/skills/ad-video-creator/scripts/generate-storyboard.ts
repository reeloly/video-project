#!/usr/bin/env bun

/**
 * Generate Storyboard Script
 *
 * Generates storyboards using Fal AI's Nano Banana Pro Edit model.
 *
 * Usage:
 *   bun run generate-storyboard.ts --scenes-description "Your scenes description" --image-folder "images folder path" --output storyboard.png
 */

import { readdir } from "node:fs/promises";
import { type CompletedQueueStatus, fal } from "@fal-ai/client";
import { program } from "commander";
import storyboardPrompt from "./storyboard-prompt.md";

interface StoryboardOptions {
	scenesDescription: string;
	imageFolder: string;
	outputPath: string;
}

async function generateStoryboard(options: StoryboardOptions): Promise<void> {
	const { scenesDescription, imageFolder, outputPath } = options;

	const prompt = storyboardPrompt.replace(
		"{{ SCENES_DESCRIPTION }}",
		scenesDescription,
	);

	fal.config({
		credentials: process.env.FAL_KEY,
	});

	const model = "fal-ai/nano-banana-pro/edit";
	const urls = await uploadFiles(imageFolder);

	const { request_id } = await fal.queue.submit(model, {
		input: {
			prompt: prompt,
			image_urls: urls,
		},
	});

	await waitUntilCompleted(request_id, model);

	const result = await fal.queue.result(model, {
		requestId: request_id,
	});
	const imageUrl = result.data.images[0].url;
	const image = await fetch(imageUrl);
	const imageBuffer = await image.arrayBuffer();
	await Bun.write(outputPath, imageBuffer);

	console.log(`✅ Storyboard generated and saved to: ${outputPath}`);
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
	requestId: string,
	model: string,
): Promise<CompletedQueueStatus> {
	let status = await fal.queue.status(model, {
		requestId: requestId,
		logs: true,
	});
	while (status.status !== "COMPLETED") {
		await Bun.sleep(1000);
		status = await fal.queue.status(model, {
			requestId: requestId,
		});
	}
	return status;
}

program
	.command("generate-storyboard")
	.description("Generate a storyboard for a video")
	.requiredOption(
		"-d, --scenes-description <scenes-description>",
		"The scenes description to generate the storyboard",
	)
	.requiredOption(
		"-i, --image-folder <image-folder>",
		"The reference image folder to generate the storyboard",
	)
	.requiredOption("-o, --output <output>", "The output file")
	.action(
		async (options: {
			scenesDescription: string;
			imageFolder: string;
			output: string;
		}) => {
			try {
				await generateStoryboard({
					scenesDescription: options.scenesDescription,
					imageFolder: options.imageFolder,
					outputPath: options.output,
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
