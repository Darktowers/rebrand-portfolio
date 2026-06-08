"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useBackground } from "../BackgroundContext";
import BlackHole from "./BlackHole";
import FlowField from "./FlowField";
import IsoTerrain from "./IsoTerrain";

/** Global background scene. Version is shared via BackgroundContext so the
 *  home-only picker can drive it. */
export default function BackgroundScene() {
	const { resolvedTheme } = useTheme();
	const { version } = useBackground();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);
	if (!mounted) return null;

	const dark = resolvedTheme !== "light";
	const accent = dark ? "#fb4d6a" : "#e11d48";

	return (
		<>
			{version === "blackhole" && <BlackHole accent={accent} dark={dark} />}
			{version === "flow" && <FlowField accent={accent} dark={dark} />}
			{version === "iso" && <IsoTerrain accent={accent} dark={dark} />}
		</>
	);
}
