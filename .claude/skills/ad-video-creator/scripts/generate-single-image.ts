#!/usr/bin/env bun

/**
 * Generate Single Image Script
 *
 * Generates a single image using Fal AI's Nano Banana Pro Edit model.
 *
 * Usage:
 *   bun run generate-single-image.ts --prompt "The prompt to generate the image" --output-image-path "The output image path to save the image" --reference-image-directory "The reference image directory to generate the image"
 */

import { readdir } from "node:fs/promises";
import { type CompletedQueueStatus, fal } from "@fal-ai/client";
import { program } from "commander";

interface SingleImageOptions {
	prompt: string;
	outputImagePath: string;
	referenceImageDirectory: string;
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

async function generateSingleImage(options: SingleImageOptions): Promise<void> {
	const { prompt, referenceImageDirectory, outputImagePath } = options;

	fal.config({
		credentials: process.env.FAL_KEY,
	});

	const imageModel = "fal-ai/nano-banana-pro/edit";
	const referenceImageUrls = await uploadFiles(referenceImageDirectory);
	const imageQueueStatus = await fal.queue.submit(imageModel, {
		input: {
			prompt: prompt,
			image_urls: referenceImageUrls,
		},
	});

	await waitUntilCompleted([imageQueueStatus.request_id], imageModel);

	const imageOutput = await fal.queue.result(imageModel, {
		requestId: imageQueueStatus.request_id,
	});

	const imageUrl = imageOutput.data.images[0].url;
	const image = await fetch(imageUrl);
	const imageBuffer = await image.arrayBuffer();
	await Bun.write(`${outputImagePath}`, imageBuffer);

	console.log(`✅ Image generated and saved to: ${outputImagePath}`);
}

program
	.description("Generate a single image")
	.requiredOption("-p, --prompt <prompt>", "The prompt to generate the image")
	.requiredOption(
		"-r, --reference-image-directory <reference-image-directory>",
		"The reference image directory to generate the image",
	)
	.requiredOption(
		"-o, --output-image-path <output-image-path>",
		"The output image path to save the image",
	)
	.action(
		async (options: {
			prompt: string;
			referenceImageDirectory: string;
			outputImagePath: string;
		}) => {
			try {
				await generateSingleImage({
					prompt: options.prompt,
					referenceImageDirectory: options.referenceImageDirectory,
					outputImagePath: options.outputImagePath,
				});
			} catch (error) {
				console.error("❌ Error generating single image:", error);
				process.exit(1);
			}
		},
	);

if (import.meta.main) {
	program.parseAsync(process.argv);
}
