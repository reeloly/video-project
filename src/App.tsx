import "./App.css";

// Import reference images
import plantFriendRef from "./assets/reference-images/plant-friend-different-angle.png";
import plantFriendJpg from "./assets/reference-images/plant-friend-2.jpg";

// Import storyboard images
import hookFirst from "./assets/storyboard/Hook - Wilting Plant Problem/first-frame.png";
import hookLast from "./assets/storyboard/Hook - Wilting Plant Problem/last-frame.png";
import productFirst from "./assets/storyboard/Product Introduction - Plant Friend Reveal/first-frame.png";
import productLast from "./assets/storyboard/Product Introduction - Plant Friend Reveal/last-frame.png";
import wateringFirst from "./assets/storyboard/Feature Demo - Automated Watering/first-frame.png";
import wateringLast from "./assets/storyboard/Feature Demo - Automated Watering/last-frame.png";
import healthFirst from "./assets/storyboard/Feature Demo - Health Monitoring & Photo Taking/first-frame.png";
import healthLast from "./assets/storyboard/Feature Demo - Health Monitoring & Photo Taking/last-frame.png";
import lifestyleFirst from "./assets/storyboard/Lifestyle Moment & Call-to-Action/first-frame.png";
import lifestyleLast from "./assets/storyboard/Lifestyle Moment & Call-to-Action/last-frame.png";

function App() {
	const allImages = [
		{ src: plantFriendRef, label: "Ref: Plant Friend" },
		{ src: plantFriendJpg, label: "Ref: Plant Friend 2" },
		{ src: hookFirst, label: "Hook: First" },
		{ src: hookLast, label: "Hook: Last" },
		{ src: productFirst, label: "Product: First" },
		{ src: productLast, label: "Product: Last" },
		{ src: wateringFirst, label: "Watering: First" },
		{ src: wateringLast, label: "Watering: Last" },
		{ src: healthFirst, label: "Health: First" },
		{ src: healthLast, label: "Health: Last" },
		{ src: lifestyleFirst, label: "Lifestyle: First" },
		{ src: lifestyleLast, label: "Lifestyle: Last" },
	];

	return (
		<div style={{
			padding: "0.5rem",
			backgroundColor: "#f5f5f5",
			height: "100vh",
			display: "flex",
			flexDirection: "column",
			overflow: "hidden",
			boxSizing: "border-box"
		}}>
			<h1 style={{ margin: "0 0 0.5rem 0", fontSize: "1.25rem", textAlign: "center", flexShrink: 0 }}>Video Project Gallery</h1>

			<div style={{
				display: "grid",
				gridTemplateColumns: "repeat(4, 1fr)",
				gridTemplateRows: "repeat(3, 1fr)",
				gap: "0.5rem",
				flex: 1,
				minHeight: 0,
				width: "100%"
			}}>
				{allImages.map((img) => (
					<div key={img.label} style={{
						backgroundColor: "white",
						padding: "0.35rem",
						borderRadius: "4px",
						boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
						display: "flex",
						flexDirection: "column",
						overflow: "hidden"
					}}>
						<img
							src={img.src}
							alt={img.label}
							style={{
								width: "100%",
								flex: 1,
								minHeight: 0,
								objectFit: "contain",
								display: "block",
								borderRadius: "2px"
							}}
						/>
						<p style={{
							margin: "0.2rem 0 0 0",
							fontSize: "0.65rem",
							color: "#666",
							textAlign: "center",
							flexShrink: 0
						}}>
							{img.label}
						</p>
					</div>
				))}
			</div>
		</div>
	);
}

export default App;
