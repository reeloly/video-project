import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";

interface AnimatedTextProps {
	text: string;
	color?: string;
	fontSize?: number;
	animationType?: "fade" | "scale" | "slide";
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
	text,
	color = "white",
	fontSize = 60,
	animationType = "scale",
}) => {
	const frame = useCurrentFrame();
	const { fps, width } = useVideoConfig();

	const style: React.CSSProperties = {
		fontSize,
		fontWeight: "bold",
		color,
		textAlign: "center",
	};

	if (animationType === "fade") {
		const opacity = interpolate(frame, [0, 30], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		});
		style.opacity = opacity;
	} else if (animationType === "scale") {
		const scale = spring({
			fps,
			frame,
			config: { damping: 200 },
		});
		style.transform = `scale(${scale})`;
	} else if (animationType === "slide") {
		const translateX = interpolate(frame, [0, 30], [-width, 0], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		});
		style.transform = `translateX(${translateX}px)`;
	}

	return (
		<AbsoluteFill
			style={{
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<div style={style}>{text}</div>
		</AbsoluteFill>
	);
};
