---
name: remotion-video-creator
description: Create programmatic videos using Remotion (React-based video framework). Use when users request video components, animations, transitions, captions, text effects, or any programmatic video creation tasks. Supports common requests like "add a caption that fades in", "create a slideshow", "add animated text", "transition between scenes", or "create a video component". Handles TypeScript/React code generation for Remotion projects.
---

# Remotion Video Creator

Generate Remotion components for programmatic video creation using React and TypeScript.

## Quick Reference

For detailed API documentation, see [references/remotion-core.md](references/remotion-core.md).

## Common Patterns

### Text Animations

**Fade in text:**
```tsx
import {useCurrentFrame, interpolate} from 'remotion';

export const FadeInText: React.FC<{text: string}> = ({text}) => {
	const frame = useCurrentFrame();
	const opacity = interpolate(frame, [0, 30], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return <div style={{opacity, fontSize: 60, color: 'blue'}}>{text}</div>;
};
```

**Scale animation (small to big):**
```tsx
import {useCurrentFrame, spring, useVideoConfig} from 'remotion';

export const ScaleText: React.FC<{text: string}> = ({text}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const scale = spring({
		fps,
		frame,
		config: {damping: 200},
	});

	return (
		<div style={{
			transform: `scale(${scale})`,
			fontSize: 60,
			color: 'blue',
		}}>
			{text}
		</div>
	);
};
```

**Slide in from side:**
```tsx
import {useCurrentFrame, interpolate, useVideoConfig} from 'remotion';

export const SlideInText: React.FC<{text: string}> = ({text}) => {
	const frame = useCurrentFrame();
	const {width} = useVideoConfig();

	const translateX = interpolate(frame, [0, 30], [-width, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<div style={{
			transform: `translateX(${translateX}px)`,
			fontSize: 60,
			color: 'blue',
		}}>
			{text}
		</div>
	);
};
```

### Combining Multiple Effects

```tsx
import {useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';

export const FancyCaption: React.FC<{text: string}> = ({text}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Fade in
	const opacity = interpolate(frame, [0, 20], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Scale up with spring
	const scale = spring({
		fps,
		frame,
		config: {damping: 200},
	});

	return (
		<div style={{
			opacity,
			transform: `scale(${scale})`,
			fontSize: 60,
			fontWeight: 'bold',
			color: 'blue',
			textAlign: 'center',
		}}>
			{text}
		</div>
	);
};
```

### Timing Multiple Elements

**Sequential captions:**
```tsx
import {Series} from 'remotion';

export const CaptionSequence: React.FC = () => {
	return (
		<Series>
			<Series.Sequence durationInFrames={60}>
				<FadeInText text="First caption" />
			</Series.Sequence>
			<Series.Sequence durationInFrames={60}>
				<FadeInText text="Second caption" />
			</Series.Sequence>
			<Series.Sequence durationInFrames={60}>
				<FadeInText text="Third caption" />
			</Series.Sequence>
		</Series>
	);
};
```

**Overlapping elements:**
```tsx
import {Sequence, AbsoluteFill} from 'remotion';

export const OverlayScene: React.FC = () => {
	return (
		<AbsoluteFill>
			{/* Background video */}
			<Sequence from={0}>
				<Video src="background.mp4" />
			</Sequence>

			{/* Caption appears at frame 30 */}
			<Sequence from={30} durationInFrames={60}>
				<AbsoluteFill style={{
					justifyContent: 'center',
					alignItems: 'center',
				}}>
					<FadeInText text="Caption overlay" />
				</AbsoluteFill>
			</Sequence>
		</AbsoluteFill>
	);
};
```

### Common Layout Patterns

**Centered content:**
```tsx
import {AbsoluteFill} from 'remotion';

export const CenteredText: React.FC<{text: string}> = ({text}) => {
	return (
		<AbsoluteFill style={{
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: 'white',
		}}>
			<div style={{fontSize: 60, color: 'blue'}}>{text}</div>
		</AbsoluteFill>
	);
};
```

**Positioned content:**
```tsx
import {AbsoluteFill} from 'remotion';

export const BottomCaption: React.FC<{text: string}> = ({text}) => {
	return (
		<AbsoluteFill style={{
			justifyContent: 'flex-end',
			alignItems: 'center',
			padding: 40,
		}}>
			<div style={{
				fontSize: 48,
				color: 'white',
				backgroundColor: 'rgba(0, 0, 0, 0.7)',
				padding: '20px 40px',
				borderRadius: 10,
			}}>
				{text}
			</div>
		</AbsoluteFill>
	);
};
```

## Workflow

1. **Understand the request:** Parse what animation/effect is needed
2. **Choose timing approach:**
   - Single element: Use `Sequence` with `from` prop
   - Sequential elements: Use `Series`
   - Overlapping elements: Use multiple `Sequence` components with `AbsoluteFill`
   - Transitions: Use `TransitionSeries`

3. **Select animation method:**
   - Smooth fade/slide: Use `interpolate()`
   - Bouncy/spring effect: Use `spring()`
   - Random values: Use `random()` with a seed

4. **Write TypeScript code:** Always use proper TypeScript syntax and Remotion imports

5. **Use proper structure:**
   - All code must be valid React/TypeScript
   - Import hooks and components from 'remotion' or '@remotion/media'
   - Use `useCurrentFrame()` for frame-based animations
   - Use `useVideoConfig()` for composition dimensions/fps

## Animation Guidelines

**Typical durations (at 30 fps):**
- Quick fade in/out: 15-30 frames (0.5-1 second)
- Moderate animation: 30-60 frames (1-2 seconds)
- Slow transition: 60-90 frames (2-3 seconds)

**Default spring config:** `{damping: 200}` for most use cases

**Extrapolation:** Always include `extrapolateLeft: 'clamp'` and `extrapolateRight: 'clamp'` with `interpolate()`

## Code Style

- Use TypeScript with proper typing (`React.FC<Props>`)
- Prefer functional components
- Use inline styles (Remotion renders to video, not DOM)
- Keep components reusable with props
- Use descriptive prop names

## Example Response Format

When a user asks "add a caption in blue that transitions from small to big":

```tsx
import {useCurrentFrame, spring, useVideoConfig, AbsoluteFill} from 'remotion';

export const Caption: React.FC<{text: string}> = ({text}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const scale = spring({
		fps,
		frame,
		config: {damping: 200},
	});

	return (
		<AbsoluteFill style={{
			justifyContent: 'center',
			alignItems: 'center',
		}}>
			<div style={{
				transform: `scale(${scale})`,
				fontSize: 60,
				fontWeight: 'bold',
				color: 'blue',
			}}>
				{text}
			</div>
		</AbsoluteFill>
	);
};
```

Usage in composition:
```tsx
<Sequence from={0} durationInFrames={90}>
	<Caption text="Your caption here" />
</Sequence>
```
