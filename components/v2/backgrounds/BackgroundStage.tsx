"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import BlackHole from "./BlackHole";
import FlowField from "./FlowField";
import IsoTerrain from "./IsoTerrain";

type Version = "blackhole" | "flow" | "iso";

const VERSIONS: { id: Version; label: string; tag: string }[] = [
	{ id: "blackhole", label: "Singularity", tag: "01" },
	{ id: "flow", label: "Signal Flow", tag: "02" },
	{ id: "iso", label: "HUD Terrain", tag: "03" },
];

export default function BackgroundStage() {
	const { resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const [version, setVersion] = useState<Version>("blackhole");

	useEffect(() => setMounted(true), []);
	if (!mounted) return null;

	const dark = resolvedTheme !== "light";
	const accent = dark ? "#fb4d6a" : "#e11d48";

	return (
		<>
			{version === "blackhole" && <BlackHole accent={accent} dark={dark} />}
			{version === "flow" && <FlowField accent={accent} dark={dark} />}
			{version === "iso" && <IsoTerrain accent={accent} dark={dark} />}

			{/* char-UI background picker */}
			<div className="fixed bottom-5 left-5 z-20 flex flex-col gap-1.5">
				<span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--fg-muted)] pl-1">
					./background
				</span>
				<div className="flex gap-1.5">
					{VERSIONS.map((v) => {
						const active = v.id === version;
						return (
							<button
								key={v.id}
								type="button"
								onClick={() => setVersion(v.id)}
								className="group focus-ring rounded-[6px] px-2.5 py-1.5 font-mono text-[11px] transition-colors"
								style={{
									border: `1px solid ${active ? "var(--accent)" : "var(--border-strong)"}`,
									background: active ? "var(--accent-soft)" : "transparent",
									color: active ? "var(--accent)" : "var(--fg-muted)",
								}}
								aria-pressed={active}
							>
								<span className="opacity-50">{v.tag}</span>{" "}
								<span className="hidden sm:inline">{v.label}</span>
							</button>
						);
					})}
				</div>
			</div>
		</>
	);
}
