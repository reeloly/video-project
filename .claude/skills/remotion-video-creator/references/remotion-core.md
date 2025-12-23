# Remotion Core Documentation

## Overview

Remotion is a framework for creating videos programmatically using React.js. All output must be valid React code written in TypeScript.

## Project Structure

A Remotion project consists of:
- **Entry file** (usually `src/index.ts`)
- **Root file** (usually `src/Root.tsx`)
- **Component files** (React components)

### Entry File Example (`src/index.ts`)

```ts
import {registerRoot} from 'remotion';
import {Root} from './Root';

registerRoot(Root);
```

### Root File Example (`src/Root.tsx`)

```tsx
import {Composition} from 'remotion';
import {MyComp} from './MyComp';

export const Root: React.FC = () => {
	return (
		<>
			<Composition
				id="MyComp"
				component={MyComp}
				durationInFrames={120}
				width={1920}
				height={1080}
				fps={30}
				defaultProps={{}}
			/>
		</>
	);
};
```

### Composition Parameters

- **component**: The React component to render
- **id**: Unique identifier (default: "MyComp")
- **durationInFrames**: Length of the video in frames
- **width**: Video width in pixels (default: 1920)
- **height**: Video height in pixels (default: 1080)
- **fps**: Frame rate (default: 30)
- **defaultProps**: Props matching the component's expected shape

## Core Hooks

### useCurrentFrame()

Returns the current frame number (starts at 0).

```tsx
export const MyComp: React.FC = () => {
	const frame = useCurrentFrame();
	return <div>Frame {frame}</div>;
};
```

### useVideoConfig()

Returns composition configuration.

```tsx
import {useVideoConfig} from 'remotion';

export const MyComp: React.FC = () => {
	const {fps, durationInFrames, height, width} = useVideoConfig();
	return (
		<div>
			fps: {fps}, duration: {durationInFrames}, size: {width}x{height}
		</div>
	);
};
```

## Media Components

### Video

```tsx
import {Video} from '@remotion/media';

export const MyComp: React.FC = () => {
	return (
		<Video
			src="https://remotion.dev/bbb.mp4"
			style={{width: '100%'}}
		/>
	);
};
```

**Props:**
- `trimBefore`: Trim frames from the start
- `trimAfter`: Limit video duration
- `volume`: Volume level (0-1)

### Image

```tsx
import {Img} from 'remotion';

export const MyComp: React.FC = () => {
	return <Img src="https://remotion.dev/logo.png" style={{width: '100%'}} />;
};
```

### Animated GIF

Requires installing `@remotion/gif` package.

```tsx
import {Gif} from '@remotion/gif';

export const MyComp: React.FC = () => {
	return (
		<Gif
			src="https://media.giphy.com/media/l0MYd5y8e1t0m/giphy.gif"
			style={{width: '100%'}}
		/>
	);
};
```

### Audio

```tsx
import {Audio} from '@remotion/media';

export const MyComp: React.FC = () => {
	return <Audio src="https://remotion.dev/audio.mp3" />;
};
```

**Props:**
- `trimBefore`: Trim frames from the start
- `trimAfter`: Limit audio duration
- `volume`: Volume level (0-1)

### Static Files

Use `staticFile()` for assets in the `public/` folder:

```tsx
import {staticFile} from 'remotion';
import {Audio} from '@remotion/media';

export const MyComp: React.FC = () => {
	return <Audio src={staticFile('audio.mp3')} />;
};
```

## Layout Components

### AbsoluteFill

Layer elements on top of each other:

```tsx
import {AbsoluteFill} from 'remotion';

export const MyComp: React.FC = () => {
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: 'blue'}}>
				<div>This is in the back</div>
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'transparent'}}>
				<div>This is in front</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
```

## Timing Components

### Sequence

Place elements at specific time points:

```tsx
import {Sequence} from 'remotion';

export const MyComp: React.FC = () => {
	return (
		<Sequence from={10} durationInFrames={20}>
			<div>This appears after 10 frames</div>
		</Sequence>
	);
};
```

**Props:**
- `from`: Frame number when the element appears (can be negative to trim start)
- `durationInFrames`: How long the element appears

**Note:** Inside a Sequence, `useCurrentFrame()` starts at 0 when the Sequence begins.

```tsx
import {Sequence, useCurrentFrame} from 'remotion';

export const Child: React.FC = () => {
	const frame = useCurrentFrame();
	return <div>At frame 10 of video, this shows: {frame}</div>; // Shows 0
};

export const MyComp: React.FC = () => {
	return (
		<Sequence from={10} durationInFrames={20}>
			<Child />
		</Sequence>
	);
};
```

### Series

Display multiple elements sequentially:

```tsx
import {Series} from 'remotion';

export const MyComp: React.FC = () => {
	return (
		<Series>
			<Series.Sequence durationInFrames={20}>
				<div>Appears immediately</div>
			</Series.Sequence>
			<Series.Sequence durationInFrames={30}>
				<div>Appears after 20 frames</div>
			</Series.Sequence>
			<Series.Sequence durationInFrames={30} offset={-8}>
				<div>Appears after 42 frames (30 + 20 - 8)</div>
			</Series.Sequence>
		</Series>
	);
};
```

**Props:**
- `durationInFrames`: Duration of this sequence
- `offset`: Shift the start time (negative = overlap with previous)

### TransitionSeries

Display elements with transitions:

```tsx
import {
	linearTiming,
	springTiming,
	TransitionSeries,
} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {wipe} from '@remotion/transitions/wipe';

export const MyComp: React.FC = () => {
	return (
		<TransitionSeries>
			<TransitionSeries.Sequence durationInFrames={60}>
				<Fill color="blue" />
			</TransitionSeries.Sequence>
			<TransitionSeries.Transition
				timing={springTiming({config: {damping: 200}})}
				presentation={fade()}
			/>
			<TransitionSeries.Sequence durationInFrames={60}>
				<Fill color="black" />
			</TransitionSeries.Sequence>
			<TransitionSeries.Transition
				timing={linearTiming({durationInFrames: 30})}
				presentation={wipe()}
			/>
			<TransitionSeries.Sequence durationInFrames={60}>
				<Fill color="white" />
			</TransitionSeries.Sequence>
		</TransitionSeries>
	);
};
```

**Important:**
- `TransitionSeries.Sequence` has no `offset` prop
- `TransitionSeries.Transition` must be placed between Sequences

## Animation Utilities

### interpolate()

Animate values over time:

```tsx
import {interpolate, useCurrentFrame} from 'remotion';

export const MyComp: React.FC = () => {
	const frame = useCurrentFrame();
	const opacity = interpolate(frame, [0, 100], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return <div style={{opacity}}>Fading in</div>;
};
```

**Parameters:**
1. Input value (usually current frame)
2. Input range array
3. Output range array
4. Options (should include `extrapolateLeft: 'clamp'` and `extrapolateRight: 'clamp'`)

### spring()

Create spring-based animations:

```tsx
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const MyComp: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const scale = spring({
		fps,
		frame,
		config: {
			damping: 200,
		},
	});

	return <div style={{transform: `scale(${scale})`}}>Bouncing in</div>;
};
```

**Default config:** `{damping: 200}`

### random()

Generate deterministic random values (required instead of Math.random()):

```tsx
import {random} from 'remotion';

export const MyComp: React.FC = () => {
	const randomValue = random('my-seed'); // Returns 0-1
	return <div>Random number: {randomValue}</div>;
};
```

**Important:** Remotion requires deterministic code. Never use `Math.random()` - always use `random()` with a static seed.

## Rendering

### Local Rendering

**Render video:**
```bash
npx remotion render MyComp
```

**Render still image:**
```bash
npx remotion still MyComp
```

### Cloud Rendering (AWS Lambda)

Setup required: https://www.remotion.dev/docs/lambda/setup

**CLI approach:**

1. Deploy Lambda function:
```bash
npx remotion lambda functions deploy
```

2. Deploy site to S3:
```bash
npx remotion lambda sites create [entry-point]
```

3. Render video:
```bash
npx remotion lambda render [comp-id]
```

**Node.js API approach:**

- Deploy function: `deployFunction()` - https://www.remotion.dev/docs/lambda/deployfunction
- Deploy site: `deploySite()` - https://www.remotion.dev/docs/lambda/deploysite
- Render video: `renderMediaOnLambda()` - https://www.remotion.dev/docs/lambda/rendermediaonlambda
- Poll progress: `getRenderProgress()` - https://www.remotion.dev/docs/lambda/getrenderprogress
