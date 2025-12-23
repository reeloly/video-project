import { Video } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";

interface VideoWithCaptionProps {
	videoSrc: string;
	caption: string;
	captionStartFrame?: number;
	captionDuration?: number;
}

export const VideoWithCaption: React.FC<VideoWithCaptionProps> = ({
	videoSrc,
	caption,
	captionStartFrame = 30,
	captionDuration = 60,
}) => {
	return (
		<AbsoluteFill>
			{/* Background video */}
			<Video src={videoSrc} style={{ width: "100%", height: "100%" }} />

			{/* Caption overlay */}
			<Sequence from={captionStartFrame} durationInFrames={captionDuration}>
				<CaptionOverlay text={caption} />
			</Sequence>
		</AbsoluteFill>
	);
};

const CaptionOverlay: React.FC<{ text: string }> = ({ text }) => {
	const frame = useCurrentFrame();

	const opacity = interpolate(frame, [0, 20], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<AbsoluteFill
			style={{
				justifyContent: "flex-end",
				alignItems: "center",
				padding: 40,
			}}
		>
			<div
				style={{
					opacity,
					fontSize: 48,
					color: "white",
					backgroundColor: "rgba(0, 0, 0, 0.7)",
					padding: "20px 40px",
					borderRadius: 10,
					fontWeight: "bold",
				}}
			>
				{text}
			</div>
		</AbsoluteFill>
	);
};
