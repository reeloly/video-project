# Veo 3 Prompt Engineering Guide

## A formula for effective prompts
A structured prompt yields consistent, high-quality results. Consider this five-part formula for optimal control.

[Cinematography] + [Subject] + [Action] + [Context] + [Style & Ambiance]

- Cinematography: Define the camera work and shot composition.

- Subject: Identify the main character or focal point.

- Action: Describe what the subject is doing.

- Context: Detail the environment and background elements.

- Style & ambiance: Specify the overall aesthetic, mood, and lighting.

Example prompt: Medium shot, a tired corporate worker, rubbing his temples in exhaustion, in front of a bulky 1980s computer in a cluttered office late at night. The scene is lit by the harsh fluorescent overhead lights and the green glow of the monochrome monitor. Retro aesthetic, shot as if on 1980s color film, slightly grainy.

## Essential prompting techniques

Mastering these core techniques will give you granular control over every aspect of your generation.

**The language of cinematography**

The [Cinematography] element of your prompt is the most powerful tool for conveying tone and emotion.

- **Camera movement:** Dolly shot, tracking shot, crane shot, aerial view, slow pan, POV shot.

*Crane shot example*

Prompt: Crane shot starting low on a lone hiker and ascending high above, revealing they are standing on the edge of a colossal, mist-filled canyon at sunrise, epic fantasy style, awe-inspiring, soft morning light.

**Composition:** Wide shot, close-up, extreme close-up, low angle, two-shot.

**Lens & focus:** Shallow depth of field, wide-angle lens, soft focus, macro lens, deep focus.

*Shallow depth of field example*

Prompt: Close-up with very shallow depth of field, a young woman's face, looking out a bus window at the passing city lights with her reflection faintly visible on the glass, inside a bus at night during a rainstorm, melancholic mood with cool blue tones, moody, cinematic.

**Directing the soundstage**

Veo 3.1 can generate a complete soundtrack based on your text instructions.

- Dialogue: Use quotation marks for specific speech (e.g., A woman says, "We have to leave now.").

- Sound effects (SFX): Describe sounds with clarity (e.g., SFX: thunder cracks in the distance).

- Ambient noise: Define the background soundscape (e.g., Ambient noise: the quiet hum of a starship bridge).

**Mastering negative prompts**

To refine your output, describe what you wish to exclude. For example, specify "a desolate landscape with no buildings or roads" instead of "no man-made structures".

**Prompt enhancement with Gemini**

If you need to add more detail, use Gemini to analyze and enrich a simple prompt with more descriptive and cinematic language. 

## Advanced creative workflows
While a single, detailed prompt is powerful, a multi-step workflow offers unparalleled control by breaking down the creative process into manageable stages. The following workflows demonstrate how to combine Veo 3.1's new capabilities with Gemini 2.5 Flash Image (Nano Banana) to execute complex visions.

**Workflow 1: The dynamic transition with "first and last frame"** 

This technique allows you to create a specific and controlled camera movement or transformation between two distinct points of view.

**Step 1: Create the starting frame:** Use Gemini 2.5 Flash Image to generate your initial shot. 

Gemini 2.5 Flash Image prompt:

“Medium shot of a female pop star singing passionately into a vintage microphone. She is on a dark stage, lit by a single, dramatic spotlight from the front. She has her eyes closed, capturing an emotional moment. Photorealistic, cinematic.”

**Step 2: Create the ending frame:** Generate a second, complementary image with Gemini 2.5 Flash Image, such as a different POV angle. 

Gemini 2.5 Flash Image prompt:

“POV shot from behind the singer on stage, looking out at a large, cheering crowd. The stage lights are bright, creating lens flare. You can see the back of the singer's head and shoulders in the foreground. The audience is a sea of lights and silhouettes. Energetic atmosphere.”

**Step 3: Animate with Veo.** Input both images into Veo using the First and Last Frame feature. In your prompt, describe the transition and the audio you want. 

Veo 3.1 prompt: “The camera performs a smooth 180-degree arc shot, starting with the front-facing view of the singer and circling around her to seamlessly end on the POV shot from behind her on stage. The singer sings “when you look me in the eyes, I can see a million stars.”

**Workflow 2: Building a dialogue scene with "ingredients to video"**

This workflow is ideal for creating a multi-shot scene with consistent characters engaged in conversation, leveraging Veo 3.1's ability to craft a dialogue.

**Step 1: Generate your "ingredients":** Create reference images using Gemini 2.5 Flash Image for your characters and the setting.

**Step 2: Compose the scene:** Use the Ingredients to Video feature with the relevant reference images. 

Prompt “Using the provided images for the detective, the woman, and the office setting, create a medium shot of the detective behind his desk. He looks up at the woman and says in a weary voice, "Of all the offices in this town, you had to walk into mine."

Prompt: “Using the provided images for the detective, the woman, and the office setting, create a shot focusing on the woman. A slight, mysterious smile plays on her lips as she replies, "You were highly recommended."

**Workflow 3: Timestamp prompting**

This workflow allows you to direct a complete, multi-shot sequence with precise cinematic pacing, all within a single generation. By assigning actions to timed segments, you can efficiently create a full scene with multiple distinct shots, saving time and ensuring visual consistency.

Prompt example:

[00:00-00:02] Medium shot from behind a young female explorer with a leather satchel and messy brown hair in a ponytail, as she pushes aside a large jungle vine to reveal a hidden path.

[00:02-00:04] Reverse shot of the explorer's freckled face, her expression filled with awe as she gazes upon ancient, moss-covered ruins in the background. SFX: The rustle of dense leaves, distant exotic bird calls.

[00:04-00:06] Tracking shot following the explorer as she steps into the clearing and runs her hand over the intricate carvings on a crumbling stone wall. Emotion: Wonder and reverence.

[00:06-00:08] Wide, high-angle crane shot, revealing the lone explorer standing small in the center of the vast, forgotten temple complex, half-swallowed by the jungle. SFX: A swelling, gentle orchestral score begins to play.

## Notes
- DO NOT montages because current AI video models generate continuous motion (frame by frame). They struggle with the concept of cinematic cuts or montages within a single prompt.