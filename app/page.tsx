import Hero from "../components/sections/Hero";
import BackgroundPicker from "../components/v2/backgrounds/BackgroundPicker";
import HudOverlay from "../components/v2/HudOverlay";

export default function Home() {
	return (
		<>
			<BackgroundPicker />
			<HudOverlay />
			<Hero />
		</>
	);
}
