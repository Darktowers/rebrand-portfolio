"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useRef, useState } from "react";
import ProceduralSpaceCanvas from "./ProceduralSpaceCanvas";
import ProceduralSpaceThree from "./ProceduralSpaceThree";

type LabVersion = "v1" | "v2" | "v3";
type Vector2 = { x: number; y: number };

const VERSION_COPY: Record<
	LabVersion,
	{ label: string; note: string; engine: string }
> = {
	v1: {
		label: "Current Drift",
		note: "Baseline from the current direction, but turned into a real forward run.",
		engine: "2D canvas / procedural stars + planets",
	},
	v2: {
		label: "Nebula Chase",
		note: "More arcade and more aggressive, with denser dust and warmer celestial hits.",
		engine: "2D canvas / procedural stars + clouds",
	},
	v3: {
		label: "Warp Corridor",
		note: "Dark-tech signal flow with fluid 3D particles and a cleaner forward pull.",
		engine: "Three.js / procedural signal field",
	},
};

const TRIM_PRESETS = [
	{ label: "Up", x: 0, y: -0.72 },
	{ label: "Left", x: -0.8, y: 0 },
	{ label: "Center", x: 0, y: 0 },
	{ label: "Right", x: 0.8, y: 0 },
	{ label: "Down", x: 0, y: 0.72 },
] as const;

export default function SpaceBackgroundLab({
	version,
}: {
	version: LabVersion;
}) {
	const pointerRef = useRef<Vector2>({ x: 0, y: 0 });
	const [trim, setTrim] = useState<Vector2>({ x: 0, y: 0 });
	const current = VERSION_COPY[version];

	function setPointerFromEvent(event: React.PointerEvent<HTMLElement>) {
		const rect = event.currentTarget.getBoundingClientRect();
		const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
		const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
		pointerRef.current.x = Math.max(-1, Math.min(1, x));
		pointerRef.current.y = Math.max(-1, Math.min(1, y));
	}

	function clearPointer() {
		pointerRef.current.x = 0;
		pointerRef.current.y = 0;
	}

	return (
		<section
			className={`space-lab space-lab-${version}`}
			onPointerMove={setPointerFromEvent}
			onPointerLeave={clearPointer}
		>
			{version === "v3" ? (
				<ProceduralSpaceThree pointerRef={pointerRef} trim={trim} />
			) : (
				<ProceduralSpaceCanvas
					mode={version}
					pointerRef={pointerRef}
					trim={trim}
				/>
			)}

			{version !== "v3" && (
				<div className="space-lab-noise" aria-hidden="true" />
			)}

			<motion.div
				className="space-lab-overlay"
				initial={{ opacity: 0, y: 24 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.45, ease: "easeOut" }}
			>
				<div className="space-lab-copy">
					<span className="space-chip">procedural / live</span>
					<h1>{current.label}</h1>
					<p>{current.note}</p>
					<div className="space-readout">
						<span>{current.engine}</span>
						<span>cursor steer + trim pad</span>
					</div>
				</div>

				<div className="space-lab-controls">
					<fieldset className="space-pad" aria-label="Steering trim pad">
						{TRIM_PRESETS.map((preset) => {
							const active = trim.x === preset.x && trim.y === preset.y;
							return (
								<button
									key={preset.label}
									type="button"
									className={active ? "active" : undefined}
									onClick={() => setTrim({ x: preset.x, y: preset.y })}
								>
									{preset.label}
								</button>
							);
						})}
					</fieldset>
					<div className="space-version-nav">
						{(["v1", "v2", "v3"] as const).map((item) => (
							<Link
								key={item}
								href={`/${item}`}
								className={item === version ? "active" : undefined}
							>
								<span>{item}</span>
								<strong>{VERSION_COPY[item].label}</strong>
							</Link>
						))}
					</div>
				</div>
			</motion.div>
		</section>
	);
}
