"use client";

import Hero from "../sections/Hero";
import { BackgroundProvider } from "./BackgroundContext";
import BackgroundPicker from "./backgrounds/BackgroundPicker";
import BackgroundScene from "./backgrounds/BackgroundScene";
import HudOverlay from "./HudOverlay";

export default function HomeExperience() {
	return (
		<BackgroundProvider>
			<BackgroundScene />
			<div className="v2-hud-grid" aria-hidden="true" />
			<BackgroundPicker />
			<HudOverlay />
			<Hero />
		</BackgroundProvider>
	);
}
