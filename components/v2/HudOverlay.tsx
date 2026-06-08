"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";

const surface = {
	border: "1px solid var(--border-strong)",
	background: "color-mix(in srgb, var(--bg) 62%, transparent)",
	backdropFilter: "blur(6px)",
	WebkitBackdropFilter: "blur(6px)",
};

/**
 * Cockpit telemetry HUD for the Singularity background. Reads pointer +
 * elapsed time and writes straight to the DOM via rAF (no React re-renders).
 * Purely decorative; pointer-events none.
 */
export default function HudOverlay() {
	const { t } = useLanguage();
	const [open, setOpen] = useState(true);
	const velRef = useRef<HTMLSpanElement>(null);
	const velBarRef = useRef<HTMLSpanElement>(null);
	const inclRef = useRef<HTMLSpanElement>(null);
	const timeRef = useRef<HTMLSpanElement>(null);
	const distRef = useRef<HTMLSpanElement>(null);
	const lockRef = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		const reduce = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		let px = 0;
		let py = 0;
		let sx = 0;
		let sy = 0;
		const start = performance.now();
		let raf = 0;

		const onMove = (e: PointerEvent) => {
			px = (e.clientX / window.innerWidth) * 2 - 1;
			py = (e.clientY / window.innerHeight) * 2 - 1;
		};
		window.addEventListener("pointermove", onMove, { passive: true });

		const pad = (n: number) => String(Math.floor(n)).padStart(2, "0");

		const tick = (now: number) => {
			raf = requestAnimationFrame(tick);
			sx += (px - sx) * 0.04;
			sy += (py - sy) * 0.04;
			const mag = Math.min(1, Math.abs(sx) * 0.6 + Math.abs(sy) * 0.4);
			const base = reduce ? 0.11 : 0.182;
			const v = base + mag * 0.806;
			const elapsed = (now - start) / 1000;

			// Values only — units/labels are localized JSX (reactive to lang).
			if (velRef.current) velRef.current.textContent = v.toFixed(3);
			if (velBarRef.current) {
				const n = Math.round(v * 14);
				velBarRef.current.textContent =
					"█".repeat(n) + "░".repeat(14 - n);
			}
			if (inclRef.current) {
				// pitch from vertical steer; pointer up = nose up (positive)
				const incl = -sy * 32;
				inclRef.current.textContent = `${incl >= 0 ? "+" : ""}${incl.toFixed(1)}°`;
			}
			if (timeRef.current) {
				timeRef.current.textContent = `${pad(elapsed / 3600)}:${pad((elapsed / 60) % 60)}:${pad(elapsed % 60)}`;
			}
			if (distRef.current) {
				// massive distance: light-years, ticking down almost imperceptibly
				const ly = 4.2371 - elapsed * 0.00004;
				distRef.current.textContent = ly.toFixed(4);
			}
			if (lockRef.current) {
				const approach = 1 - Math.exp(-elapsed / 240);
				const n = Math.round(approach * 12);
				lockRef.current.textContent =
					"█".repeat(n) + "░".repeat(12 - n);
			}
		};
		raf = requestAnimationFrame(tick);

		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener("pointermove", onMove);
		};
	}, []);

	return (
		<div
			className="pointer-events-none fixed bottom-4 right-3 z-20 font-mono text-[10px] leading-relaxed sm:bottom-5 sm:right-5 sm:text-[11px]"
			style={{ color: "var(--fg-muted)" }}
		>
			{!open && (
				<button
					type="button"
					onClick={() => setOpen(true)}
					aria-label={t("hud.telemetry")}
					className="pointer-events-auto flex items-center gap-1.5 rounded-[8px] px-2.5 py-1.5 text-[9px] uppercase tracking-[0.18em]"
					style={{ ...surface, color: "var(--accent)" }}
				>
					◢ {t("hud.telemetry")}
				</button>
			)}
			<div
				className="flex flex-col gap-1 rounded-[8px] px-2.5 py-2 sm:px-3 sm:py-2.5"
				style={{ ...surface, display: open ? undefined : "none" }}
			>
				<div className="mb-0.5 flex items-center justify-between gap-3">
					<span
						className="tracking-[0.22em] uppercase text-[9px]"
						style={{ color: "var(--accent)" }}
					>
						◢ {t("hud.telemetry")}
					</span>
					<button
						type="button"
						onClick={() => setOpen(false)}
						aria-label={t("hud.minimize")}
						className="pointer-events-auto -my-1 flex h-4 w-4 items-center justify-center rounded-[3px] leading-none opacity-70 transition-opacity hover:opacity-100"
						style={{ color: "var(--accent)", border: "1px solid var(--border-strong)" }}
					>
						_
					</button>
				</div>
				<div className="flex items-center justify-between gap-4">
					<span style={{ color: "var(--accent)" }}>{t("hud.vel")}</span>
					<span>
						<span ref={velBarRef} className="mr-2 hidden opacity-60 sm:inline">
							░░░░░░░░░░░░░░
						</span>
						<span style={{ color: "var(--fg)" }}>
							<span ref={velRef}>0.182</span> c
						</span>
					</span>
				</div>
				<div className="hidden items-center justify-between gap-4 sm:flex">
					<span style={{ color: "var(--accent)" }}>{t("hud.incl")}</span>
					<span ref={inclRef} style={{ color: "var(--fg)" }}>
						+0.0°
					</span>
				</div>
				<div className="flex items-center justify-between gap-4">
					<span style={{ color: "var(--accent)" }}>{t("hud.time")}</span>
					<span ref={timeRef} style={{ color: "var(--fg)" }}>
						00:00:00
					</span>
				</div>
				<div className="flex items-center justify-between gap-4">
					<span style={{ color: "var(--accent)" }}>{t("hud.dist")}</span>
					<span style={{ color: "var(--fg)" }}>
						<span ref={distRef}>4.2371</span> {t("hud.unit_dist")}
					</span>
				</div>
				<div className="hidden items-center justify-between gap-4 sm:flex">
					<span style={{ color: "var(--accent)" }}>{t("hud.lock")}</span>
					<span ref={lockRef} className="opacity-60">
						░░░░░░░░░░░░
					</span>
				</div>
			</div>
		</div>
	);
}
