"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useBackground } from "../BackgroundContext";

const BlackHole = dynamic(() => import("./BlackHole"), { ssr: false });
const FlowField = dynamic(() => import("./FlowField"), { ssr: false });
const IsoTerrain = dynamic(() => import("./IsoTerrain"), { ssr: false });

/** Global background scene. Version is shared via BackgroundContext so the
 *  home-only picker can drive it. */
export default function BackgroundScene() {
	const { resolvedTheme } = useTheme();
	const { version } = useBackground();

	const dark = !resolvedTheme || resolvedTheme !== "light";
	const accent = dark ? "#fb4d6a" : "#e11d48";

	return (
		<>
			{version === "blackhole" && <BlackHole accent={accent} dark={dark} />}
			{version === "flow" && <FlowField accent={accent} dark={dark} />}
			{version === "iso" && <IsoTerrain accent={accent} dark={dark} />}
		</>
	);
}
