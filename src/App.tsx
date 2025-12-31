import "./App.css";
import { useMemo } from "react";

interface MediaItem {
	src: string;
	label: string;
	type: "image" | "video";
}

interface Scene {
	name: string;
	items: MediaItem[];
}

function App() {
	const { referenceImages, scenes } = useMemo(() => {
		// Dynamically import all media from assets with eager loading
		const refImages = import.meta.glob(
			"./assets/reference-images/*.{png,jpg,jpeg}",
			{ eager: true, as: "url" },
		);
		const storyboardImages = import.meta.glob(
			"./assets/storyboard/**/*.{png,jpg,jpeg}",
			{ eager: true, as: "url" },
		);
		const storyboardVideos = import.meta.glob(
			"./assets/storyboard/**/*.{mp4,webm}",
			{ eager: true, as: "url" },
		);
		const videos = import.meta.glob("./assets/videos/*.{mp4,webm}", {
			eager: true,
			as: "url",
		});

		// Process reference images
		const refs: MediaItem[] = [];
		Object.entries(refImages).forEach(([path, url]) => {
			const filename =
				path
					.split("/")
					.pop()
					?.replace(/\.(png|jpg|jpeg)$/, "") || "";
			refs.push({
				src: url as string,
				label: filename,
				type: "image",
			});
		});

		// Group storyboard media by scene
		const sceneMap: Record<string, MediaItem[]> = {};

		// Add images to scenes
		Object.entries(storyboardImages).forEach(([path, url]) => {
			const parts = path.split("/");
			const sceneName = parts[parts.length - 2];
			const filename = parts[parts.length - 1];

			if (!sceneMap[sceneName]) {
				sceneMap[sceneName] = [];
			}

			let label = "Image";
			if (filename.includes("first-frame")) {
				label = "First Frame";
			} else if (filename.includes("last-frame")) {
				label = "Last Frame";
			}

			sceneMap[sceneName].push({
				src: url as string,
				label,
				type: "image",
			});
		});

		// Add videos to scenes
		Object.entries(storyboardVideos).forEach(([path, url]) => {
			const parts = path.split("/");
			const sceneName = parts[parts.length - 2];

			if (!sceneMap[sceneName]) {
				sceneMap[sceneName] = [];
			}

			sceneMap[sceneName].push({
				src: url as string,
				label: "Video",
				type: "video",
			});
		});

		// Add standalone videos
		Object.entries(videos).forEach(([path, url]) => {
			const filename =
				path
					.split("/")
					.pop()
					?.replace(/\.(mp4|webm)$/, "") || "";

			if (!sceneMap["Standalone Videos"]) {
				sceneMap["Standalone Videos"] = [];
			}

			sceneMap["Standalone Videos"].push({
				src: url as string,
				label: filename,
				type: "video",
			});
		});

		// Convert to scene array and sort
		const sceneArray: Scene[] = Object.entries(sceneMap).map(([name, items]) => ({
			name: name.replace(/^(Hook|Feature Demo|Feature \d+|Product Introduction|Outro) - /, ""),
			items,
		}));

		return {
			referenceImages: refs,
			scenes: sceneArray,
		};
	}, []);

	const totalItems = referenceImages.length + scenes.reduce((acc, scene) => acc + scene.items.length, 0);

	if (totalItems === 0) {
		return (
			<div
				style={{
					padding: "2rem",
					backgroundColor: "#f5f5f5",
					height: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					flexDirection: "column",
					gap: "1rem",
				}}
			>
				<h1 style={{ margin: 0, fontSize: "1.5rem", color: "#666" }}>
					Video Project Gallery
				</h1>
				<p style={{ margin: 0, fontSize: "1rem", color: "#999" }}>
					No media files found. Generate storyboard images and videos to see
					them here.
				</p>
			</div>
		);
	}

	const renderMediaItem = (item: MediaItem, index: number) => (
		<div
			key={`${item.label}-${index}`}
			style={{
				backgroundColor: "white",
				padding: "0.5rem",
				borderRadius: "4px",
				boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
				display: "flex",
				flexDirection: "column",
				overflow: "hidden",
			}}
		>
			{item.type === "image" ? (
				<img
					src={item.src}
					alt={item.label}
					style={{
						width: "100%",
						height: "auto",
						maxHeight: "300px",
						objectFit: "contain",
						display: "block",
						borderRadius: "2px",
					}}
				/>
			) : (
				<video
					controls
					style={{
						width: "100%",
						height: "auto",
						maxHeight: "300px",
						display: "block",
						borderRadius: "2px",
					}}
				>
					<source src={item.src} type="video/mp4" />
					<track kind="captions" label="No captions available" />
				</video>
			)}
			<p
				style={{
					margin: "0.5rem 0 0 0",
					fontSize: "0.75rem",
					color: "#666",
					textAlign: "center",
				}}
			>
				{item.label}
			</p>
		</div>
	);

	return (
		<div
			style={{
				padding: "1rem",
				backgroundColor: "#f5f5f5",
				minHeight: "100vh",
				boxSizing: "border-box",
			}}
		>
			<h1
				style={{
					margin: "0 0 1rem 0",
					fontSize: "1.5rem",
					textAlign: "center",
				}}
			>
				Video Project Gallery ({totalItems} {totalItems === 1 ? "item" : "items"})
			</h1>

			{/* Reference Images Section */}
			{referenceImages.length > 0 && (
				<div style={{ marginBottom: "2rem" }}>
					<h2
						style={{
							margin: "0 0 0.75rem 0",
							fontSize: "1.1rem",
							color: "#555",
							borderBottom: "2px solid #ddd",
							paddingBottom: "0.5rem",
						}}
					>
						Reference Images
					</h2>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
							gap: "0.75rem",
						}}
					>
						{referenceImages.map(renderMediaItem)}
					</div>
				</div>
			)}

			{/* Scenes Section */}
			{scenes.map((scene) => (
				<div key={scene.name} style={{ marginBottom: "2rem" }}>
					<h2
						style={{
							margin: "0 0 0.75rem 0",
							fontSize: "1.1rem",
							color: "#555",
							borderBottom: "2px solid #ddd",
							paddingBottom: "0.5rem",
						}}
					>
						{scene.name}
					</h2>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
							gap: "0.75rem",
						}}
					>
						{scene.items.map(renderMediaItem)}
					</div>
				</div>
			))}
		</div>
	);
}

export default App;
