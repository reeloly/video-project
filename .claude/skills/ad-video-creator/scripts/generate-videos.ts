import { readdir } from "node:fs/promises";
import { type CompletedQueueStatus, fal } from "@fal-ai/client";
import { program } from "commander";
import { z } from "zod";

async function uploadFiles(
	folderPath: string,
): Promise<Record<string, string>> {
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

const scenesDescriptionJsonSchema = z.object({
	scenes: z.array(
		z.object({
			scene_title: z.string(),
			duration: z.string(),
			first_frame_prompt: z.string(),
			last_frame_prompt: z.string(),
			video_transition_prompt: z.string(),
		}),
	),
});

async function generateVideos(options: {
	scenesDescriptionFile: string;
	imageDirectory: string;
	outputDirectory: string;
}) {
	const { scenesDescriptionFile, imageDirectory, outputDirectory } = options;

	fal.config({
		credentials: process.env.FAL_KEY,
	});

	const model = "fal-ai/veo3.1/fast/first-last-frame-to-video";

	const scenesDescriptionJson = await Bun.file(scenesDescriptionFile).text();
	const scenesDescription = scenesDescriptionJsonSchema.safeParse(
		JSON.parse(scenesDescriptionJson),
	).data;
	if (!scenesDescription) {
		throw new Error("Invalid scenes description file");
	}

	for (const scene of scenesDescription.scenes) {
		const videoResult = await fal.queue.submit(model, {
			input: {
				prompt: scene.video_transition_prompt,
				first_frame_url: urls[0],
				last_frame_url: urls[1],
			},
		});
	}
}

program
	.command("generate-storyboard")
	.description("Generate a storyboard for a video")
	.requiredOption(
		"-d, --scenes-description-file <scenes-description-file>",
		"The scenes description file to generate the videos",
	)
	.requiredOption(
		"-i, --image-directory <image-directory>",
		"The reference images directory to generate the videos",
	)
	.requiredOption(
		"-o, --output-directory <output-directory>",
		"The output directory to save the videos",
	)
	.action(
		async (options: {
			scenesDescriptionFile: string;
			imageDirectory: string;
			outputDirectory: string;
		}) => {
			try {
				await generateVideos({
					scenesDescriptionFile: options.scenesDescriptionFile,
					imageDirectory: options.imageDirectory,
					outputDirectory: options.outputDirectory,
				});
			} catch (error) {
				console.error("❌ Error generating videos:", error);
				process.exit(1);
			}
		},
	);

if (import.meta.main) {
	program.parseAsync(process.argv);
}
