---
name: veo-video-generator
description: Generate videos using Google's Veo 3 API from text prompts or images. Use when users request video generation, video creation from text descriptions, or animating images - including requests like "create a video of...", "generate a video showing...", "animate this image", or any AI-powered video generation task. Handles text-to-video and image-to-video generation with automatic polling, error handling, and download.
---

# Veo Video Generator

Generate professional videos using Google's Veo 3.1 API. This skill supports text-to-video generation and image-to-video generation with built-in prompt engineering guidance, error handling, and automatic video download.

## Quick Start

### Text-to-Video Generation

Use the provided script for reliable video generation:

```bash
bun run scripts/generate_video.ts \
  --prompt "Your detailed video description" \
  --output output.mp4
```

**Example:**
```bash
bun run scripts/generate_video.ts \
  --prompt "A close-up of two people staring at a cryptic drawing on a wall, torchlight flickering. A man murmurs, 'This must be it. That's the secret code.' The woman looks at him and whispering excitedly, 'What did you find?'" \
  --output dialogue_example.mp4
```

### Image-to-Video Generation

Animate a static image by providing both a prompt and image path:

```bash
bun run scripts/generate_video.ts \
  --prompt "Camera slowly pushes in while background elements gently sway" \
  --image input.jpg \
  --output animated_output.mp4
```

### Direct Code Usage

For integration into existing code:

```typescript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

// Submit generation request
let operation = await ai.models.generateVideos({
    model: "veo-3.1-generate-preview",
    prompt: "Your detailed prompt here",
});

// Poll until complete
while (!operation.done) {
    await Bun.sleep(10000);
    operation = await ai.operations.getVideosOperation({
        operation: operation,
    });
}

// Download the video
await ai.files.download({
    file: operation.response.generatedVideos[0].video,
    downloadPath: "output.mp4",
});
```

## Workflow

### 1. Understand User Intent

Determine the type of video generation needed:
- **Text-to-video**: User provides a description of what they want to see
- **Image-to-video**: User has an existing image to animate

### 2. Craft Effective Prompt

**For detailed prompt engineering guidance**, read [references/prompt_engineering.md](references/prompt_engineering.md).

**Quick tips:**
- Include camera work (shot type, movement, angle)
- Describe subject and action clearly
- Specify environment and setting
- Add lighting and mood details
- Use dialogue in quotes if needed

**Strong prompt structure:**
```
[Camera angle/movement] [Subject performing action] [Setting/location]. [Lighting]. [Mood/style].
```

**Example prompts:**
- "Wide shot of a bustling city street at golden hour. People walking in slow motion, warm sunlight filtering through buildings, lens flare, cinematic look"
- "Overhead drone shot descending through forest canopy, morning mist, revealing a hidden clearing"
- "Close-up of hands carefully assembling a watch mechanism, soft workshop lighting, shallow depth of field"

### 3. Execute Generation

Use `scripts/generate_video.ts` for robust execution:

**Standard generation:**
```bash
bun run scripts/generate_video.ts --prompt "..." --output video.mp4
```

**With custom settings:**
```bash
bun run scripts/generate_video.ts \
  --prompt "..." \
  --output video.mp4 \
  --poll-interval 15000 \
  --max-retries 5
```

**Script features:**
- Automatic polling with progress updates
- Retry logic for failed requests
- Error handling and detailed logging
- File size reporting

### 4. Handle Errors

Common issues and solutions:

**API key not configured:**
```
Error: API key missing
Solution: Ensure GOOGLE_API_KEY environment variable is set
```

**Generation timeout:**
```
Error: Operation taking too long
Solution: Increase poll-interval or check API status
```

**Invalid image format:**
```
Error: Unsupported image type
Solution: Use JPG, PNG, or WEBP formats
```

**Prompt too vague:**
```
Result: Generic or unexpected output
Solution: Add more specific details about camera, lighting, action
```

## Advanced Usage

### Custom Model Selection

```bash
bun run scripts/generate_video.ts \
  --model "veo-3.1-generate-preview" \
  --prompt "..." \
  --output video.mp4
```

### Programmatic Integration

Import and use the generation function directly:

```typescript
import { generateVideo } from "./scripts/generate_video";

await generateVideo({
  prompt: "Cinematic shot of ocean waves at sunset",
  outputPath: "./videos/ocean.mp4",
  pollInterval: 10000,
  maxRetries: 3,
});
```

### Batch Generation

Generate multiple videos from a list of prompts:

```typescript
const prompts = [
  "Morning coffee being poured into a cup",
  "City traffic time-lapse at night",
  "Flowers blooming in fast-forward",
];

for (const [index, prompt] of prompts.entries()) {
  await generateVideo({
    prompt,
    outputPath: `./videos/video_${index}.mp4`,
  });
}
```

## Setup Requirements

### Prerequisites

1. **Google AI API Key**: Obtain from Google AI Studio
2. **Environment Variable**: Set `GOOGLE_API_KEY` in your environment
3. **Dependencies**: Install required package:

```bash
bun add @google/genai
```

### Environment Configuration

Add to your `.env` file:
```bash
GOOGLE_API_KEY=your_api_key_here
```

Or export in your shell:
```bash
export GOOGLE_API_KEY=your_api_key_here
```

## Prompt Engineering

For comprehensive prompt engineering guidance, **read [references/prompt_engineering.md](references/prompt_engineering.md)** when:
- User needs help crafting better prompts
- Generated videos don't match expectations
- Creating complex or specific scenes
- Working with image-to-video animation

The guide includes:
- Effective prompt structure and templates
- Camera work and cinematography terms
- Lighting and mood descriptions
- Image-to-video specific techniques
- Common pitfalls and optimization tips
- Extensive examples for different video types

## Tips for Best Results

1. **Be specific**: Detailed prompts produce better results than vague ones
2. **Use cinematography language**: Camera angles, movements, lighting create professional results
3. **Include temporal structure**: "begins with," "transitions to," "ends with"
4. **Iterate on prompts**: Refine based on initial results
5. **Reference the guide**: Check [references/prompt_engineering.md](references/prompt_engineering.md) for examples and patterns
6. **Keep it realistic**: Veo excels at natural motion and physics
7. **Add dialogue**: Use quotation marks for spoken text in scenes
8. **Consider pacing**: Specify motion speed (slow motion, time-lapse, real-time)

## Resources

### scripts/generate_video.ts
Robust video generation script with polling, retry logic, and error handling. Use this for all video generation tasks to ensure reliability.

### references/prompt_engineering.md
Comprehensive guide to writing effective Veo 3 prompts. Read when users need prompt help or when improving video quality.
