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
