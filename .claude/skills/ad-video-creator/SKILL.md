---
name: ad-video-creator
description: Generate actual product advertisement videos (.mp4 files) using AI video generation APIs like Veo 3. Use when creating marketing videos, product ads, social media reels, or promotional content for TikTok, Instagram, YouTube, or websites.
allowed-tools: Read, Write, Bash, AskUserQuestion
---

# Ad Video Creator

## Video creation workflow

### Step 1: View the Product

If user provides an image:

1. Use Read tool to view the product image
2. Analyze what the product looks like
3. Identify visual elements for video generation

If the product is a real physical product and the product images are lack of different angles and positions, add more images.
See references/physical-product.md

### Step 2: Ask About Video Type and Requirements (REQUIRED)

ALWAYS ask these questions using AskUserQuestion:

```
Question 1: "What type of ad video are you creating?"
Options:
- Explainer Video (Explain what product is and problem it solves) - Best for new brand launches, SaaS/Apps
- Product Demo (Show product in action to prove it works) - Best for e-commerce, gadgets, makeup
- UGC-Style Ad (Looks like regular customer post - unboxing, reviews) - Best for TikTok, Instagram Reels
- Testimonial (Customer success stories to build trust) - Best for high-ticket services, B2B
- Behind-the-Scenes (Show team, office, making-of process) - Best for brand loyalty, recruitment
- Educational/How-To (Teach something related to your niche) - Best for YouTube, LinkedIn, Pinterest

Question 2: "What are the main features or key points about your product?"
- Let user describe key capabilities, benefits, or story elements
- This is an open text response
- Use their answer to build the video narrative

Question 3: "What platform will this video be used on?"
Options:
- TikTok/Instagram Reels (Vertical 9:16)
- YouTube (Horizontal 16:9)
- Website/Landing Page (Flexible)
- Multiple platforms

Question 4: "What tone should the video have?"
Options:
- Fun and playful
- Professional and trustworthy
- Tech-focused (innovation)
- Lifestyle (aspirational)

Question 5: "How long should the video be?"
Options:
- 15-30 seconds (Quick social media)
- 30-60 seconds (Standard showcase)
- 60-90 seconds (Detailed story)
```

### Step 3: Create Video Prompt Based on Type

Based on the video type selected, use the appropriate structure and veo-prompt-crafter agent to create prompt json file.

#### For Explainer Videos
See references/explainer-video.md for components

#### For Product Demos
See references/product-demo.md for components

#### For UGC-Style Ads
See references/ugc-style-ads.md for components

#### For Testimonials
See references/testimonials.md for components

#### For Behind-the-Scenes
See references/behind-scenes.md for components

#### For Educational/How-To
See references/educational.md for components

### Step 4: Create Storyboard

Run ```bun run .claude/skills/ad-video-creator/scripts/generate-storyboard.ts --scenes-description-file "scenes description file path" --image-directory src/assets/reference-images --output-directory src/assets/storyboard```

### Step 5: Review the images created

**CRITICAL: You must carefully validate each storyboard image against reference images.**

**YOU MUST COMPLETE THIS ENTIRE STEP. DO NOT SKIP TO STEP 6.**

**Validate ONE scene at a time. Do not try to validate all scenes at once.**

For EACH scene directory in src/assets/storyboard:

1. **Read the reference images** to understand what the product should look like

2. **Read both frames of the current scene:**
   - Read first-frame.png
   - Read last-frame.png

3. **Validate the scene** by checking:
   - ✅ PASS: Products are consistent with reference (same colors, shape, features)
   - ❌ FAIL: Product are not consistent (different colors, wrong objects, missing features)
   - ✅ PASS: Background style is consistent between first and last frame
   - ❌ FAIL: Background drastically changes (indoor→outdoor, day→night)

4. **If validation fails for this scene:**
   - 4.1 Improve the prompt for the problematic frame
   - 4.2 Recreate the image by running:
   ```
   bun run generate-single-image.ts --prompt "The corrected prompt" --output-image-path "path/to/problematic/image.png" --reference-image-directory "src/assets/reference-images"
   ```
   - 4.3 Re-validate this scene after regenerating

5. **Only after this scene passes, move to the next scene**

**Example of what to catch:**
- Reference shows white & green plant-watering robot → Storyboard shows robot with camera = FAIL
- Reference shows red sneaker → Storyboard shows blue sneaker = FAIL
- Reference shows minimalist bottle → Storyboard shows ornate bottle = FAIL

### Step 6: Generate Videos (ONLY after Step 5 validation passes)

**DO NOT proceed to this step until ALL storyboard images have been validated in Step 5.**

Once all images pass validation, generate the final videos by running:

```
bun run .claude/skills/ad-video-creator/scripts/generate-videos.ts --scenes-description-file "scenes description file path" --storyboard-directory src/assets/storyboard --output-directory .claude/skills/ad-video-creator/outputs
```

This will create video clips for each scene that can be combined into the final advertisement.

### Step 7: Generate the final video

Use ffmpeg to concat all the generated videos