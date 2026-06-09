"use client";

import { type BgVersion, useBackground } from "../BackgroundContext";

const VERSIONS: { id: BgVersion; label: string; tag: string }[] = [
	{ id: "blackhole", label: "Singularity", tag: "01" },
	{ id: "flow", label: "Signal Flow", tag: "02" },
	{ id: "iso", label: "HUD Terrain", tag: "03" },
];

/** Home-only char-UI picker that drives the global background version. */
export default function BackgroundPicker() {
	const { version, setVersion } = useBackground();

	return (
		<div className="fixed bottom-5 left-5 z-20 flex flex-col gap-1.5">
			<span className="pl-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--fg-muted)]">
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
							className="focus-ring rounded-[6px] px-2.5 py-1.5 font-mono text-[11px] transition-colors"
							style={{
								border: `1px solid ${active ? "var(--accent)" : "var(--border-strong)"}`,
								background: active ? "var(--accent-soft)" : "transparent",
								color: active ? "var(--accent)" : "var(--fg-muted)",
								boxShadow: active ? "0 0 14px -2px var(--accent-glow)" : "none",
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
	);
}
