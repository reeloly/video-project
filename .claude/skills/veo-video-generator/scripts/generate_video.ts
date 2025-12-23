#!/usr/bin/env bun

/**
 * Google Veo 3 Video Generation Script
 *
 * Generates videos using Google's Veo 3.1 API from text prompts or images.
 * Handles polling, error handling, and automatic download of generated videos.
 *
 * Usage:
 *   bun run generate_video.ts --prompt "Your video description" --output video.mp4
 *   bun run generate_video.ts --prompt "Description" --image input.jpg --output video.mp4
 */

import {
	type GenerateVideosOperation,
	type GenerateVideosParameters,
	GoogleGenAI,
} from "@google/genai";

interface VideoGenerationOptions {
	prompt: string;
	imagePath?: string;
	outputPath: string;
	model?: string;
	pollInterval?: number;
	maxRetries?: number;
}

async function generateVideo(options: VideoGenerationOptions): Promise<void> {
	const {
		prompt,
		imagePath,
		outputPath,
		model = "veo-3.1-generate-preview",
		pollInterval = 10000,
		maxRetries = 3,
	} = options;

	// Initialize Google GenAI client
	const apiKey = process.env.GOOGLE_API_KEY;
	if (!apiKey) {
		throw new Error("GOOGLE_API_KEY environment variable is not set");
	}
	const ai = new GoogleGenAI({ apiKey });

	console.log("🎬 Starting video generation...");
	console.log(`📝 Prompt: ${prompt}`);
	if (imagePath) {
		console.log(`🖼️  Image: ${imagePath}`);
	}

	let retries = 0;
	let operation: GenerateVideosOperation | undefined;

	// Generate video with retry logic
	while (retries < maxRetries) {
		try {
			const generateParams: GenerateVideosParameters = {
				model: model,
				prompt: prompt,
			};

			// Add image if provided (for image-to-video generation)
			if (imagePath) {
				const imageFile = Bun.file(imagePath);
				if (await imageFile.exists()) {
					const imageData = await imageFile.arrayBuffer();
					generateParams.image = {
						imageBytes: Buffer.from(imageData).toString("base64"),
						mimeType: imageFile.type || getMimeType(imagePath),
					};
				}
			}

			operation = await ai.models.generateVideos(generateParams);
			console.log("✅ Video generation request submitted");
			break;
		} catch (error: unknown) {
			retries++;
			console.error(
				`❌ Error submitting request (attempt ${retries}/${maxRetries}):`,
				error instanceof Error ? error.message : String(error),
			);

			if (retries >= maxRetries) {
				throw new Error(
					`Failed to submit video generation request after ${maxRetries} attempts`,
				);
			}

			// Wait before retrying
			await Bun.sleep(5000);
		}
	}

	if (!operation) {
		throw new Error("Failed to create video generation operation");
	}

	// Poll the operation status until the video is ready
	let pollCount = 0;
	while (!operation.done) {
		pollCount++;
		const waitTime = pollInterval / 1000;
		console.log(
			`⏳ Waiting for video generation to complete... (${pollCount * waitTime}s elapsed)`,
		);

		await Bun.sleep(pollInterval);

		try {
			operation = await ai.operations.getVideosOperation({
				operation: operation,
			});

			// Check for errors in the operation
			if (operation.error) {
				throw new Error(
					`Video generation failed: ${JSON.stringify(operation.error)}`,
				);
			}
		} catch (error: unknown) {
			console.error(
				"❌ Error polling operation status:",
				error instanceof Error ? error.message : String(error),
			);
			throw error;
		}
	}

	console.log("✅ Video generation completed!");

	// Download the generated video
	try {
		if (!operation.response?.generatedVideos?.[0]?.video) {
			throw new Error("No video found in the response");
		}

		await ai.files.download({
			file: operation.response.generatedVideos[0].video,
			downloadPath: outputPath,
		});

		console.log(`🎉 Generated video saved to: ${outputPath}`);

		// Display file size
		const outputFile = Bun.file(outputPath);
		const fileSizeMB = (outputFile.size / (1024 * 1024)).toFixed(2);
		console.log(`📊 File size: ${fileSizeMB} MB`);
	} catch (error: unknown) {
		console.error(
			"❌ Error downloading video:",
			error instanceof Error ? error.message : String(error),
		);
		throw error;
	}
}

function getMimeType(filePath: string): string {
	const ext = filePath.toLowerCase().split(".").pop();
	const mimeTypes: { [key: string]: string } = {
		jpg: "image/jpeg",
		jpeg: "image/jpeg",
		png: "image/png",
		webp: "image/webp",
	};
	return mimeTypes[ext || ""] || "image/jpeg";
}

// Parse command line arguments
function parseArgs(): VideoGenerationOptions {
	const args = Bun.argv.slice(2);
	const options: Partial<VideoGenerationOptions> = {};

	for (let i = 0; i < args.length; i++) {
		switch (args[i]) {
			case "--prompt":
				options.prompt = args[++i];
				break;
			case "--image":
				options.imagePath = args[++i];
				break;
			case "--output":
				options.outputPath = args[++i];
				break;
			case "--model":
				options.model = args[++i];
				break;
			case "--poll-interval":
				options.pollInterval = parseInt(args[++i], 10);
				break;
			case "--max-retries":
				options.maxRetries = parseInt(args[++i], 10);
				break;
		}
	}

	if (!options.prompt) {
		console.error("Error: --prompt is required");
		process.exit(1);
	}

	if (!options.outputPath) {
		console.error("Error: --output is required");
		process.exit(1);
	}

	return options as VideoGenerationOptions;
}

// Main execution
if (import.meta.main) {
	const options = parseArgs();

	generateVideo(options)
		.then(() => {
			console.log("✅ Success!");
			process.exit(0);
		})
		.catch((error) => {
			console.error("❌ Fatal error:", error.message);
			process.exit(1);
		});
}

export { generateVideo, type VideoGenerationOptions };
