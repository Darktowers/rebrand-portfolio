"use client";

import Hero from "../sections/Hero";
import BackgroundPicker from "./backgrounds/BackgroundPicker";
import HudOverlay from "./HudOverlay";

export default function HomeExperience() {
	return (
		<>
			<BackgroundPicker />
			<HudOverlay />
			<Hero />
		</>
	);
}
