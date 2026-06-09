"use client";

import { AnimatePresence, m as motion } from "motion/react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const SUN_RAYS = [0, 45, 90, 135, 180, 225, 270, 315];

function subscribeToHydration(onStoreChange: () => void) {
	queueMicrotask(onStoreChange);
	return () => {};
}

function SunIcon() {
	return (
		<motion.div
			animate={{ rotate: 360 }}
			transition={{
				duration: 18,
				repeat: Number.POSITIVE_INFINITY,
				ease: "linear",
			}}
			style={{ display: "block" }}
			data-no-transition
		>
			<svg
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="none"
				aria-hidden="true"
			>
				<circle cx="12" cy="12" r="4.5" fill="var(--accent)" />
				{SUN_RAYS.map((deg) => (
					<line
						key={deg}
						x1="12"
						y1="1.5"
						x2="12"
						y2="5"
						stroke="var(--accent)"
						strokeWidth="2"
						strokeLinecap="round"
						style={{
							transformOrigin: "12px 12px",
							transform: `rotate(${deg}deg)`,
						}}
					/>
				))}
			</svg>
		</motion.div>
	);
}

function MoonIcon() {
	return (
		<svg
			width="14"
			height="14"
			viewBox="0 0 24 24"
			fill="none"
			style={{ display: "block" }}
			aria-hidden="true"
		>
			<path
				d="M20.354 15.354A9 9 0 0 1 8.646 3.646 9.003 9.003 0 0 0 12 21a9.003 9.003 0 0 0 8.354-5.646z"
				fill="var(--accent)"
			/>
			<circle cx="19.5" cy="4.5" r="1" fill="var(--accent)" opacity="0.75" />
			<circle cx="17" cy="2" r="0.6" fill="var(--accent)" opacity="0.5" />
		</svg>
	);
}

export default function ThemeToggleV2() {
	const { resolvedTheme, setTheme } = useTheme();
	const mounted = useSyncExternalStore(
		subscribeToHydration,
		() => true,
		() => false,
	);

	if (!mounted) return <div className="w-16 h-8" />;

	const isDark = resolvedTheme !== "light";

	function toggle() {
		const next = isDark ? "light" : "dark";
		setTheme(next);
	}

	return (
		<motion.button
			onClick={toggle}
			className="focus-ring relative w-16 h-8 rounded-full cursor-pointer shrink-0 overflow-hidden"
			style={{
				background: "var(--bg-secondary)",
				border: "1px solid var(--border-strong)",
			}}
			whileHover={{
				boxShadow: "0 0 16px 3px var(--accent-glow), 0 0 0 1px var(--accent)",
				borderColor: "var(--accent)",
			}}
			whileTap={{ scale: 0.93 }}
			transition={{ duration: 0.15 }}
			aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
			type="button"
			data-no-transition
		>
			<motion.div
				className="absolute top-0 bottom-0 w-8 rounded-full pointer-events-none"
				style={{
					background:
						"linear-gradient(90deg, transparent, var(--accent-soft), transparent)",
				}}
				animate={{ x: ["-32px", "72px"] }}
				transition={{
					duration: 2.2,
					repeat: Number.POSITIVE_INFINITY,
					ease: "linear",
					repeatDelay: 1.8,
				}}
			/>

			<motion.div
				className="absolute top-1 w-6 h-6 rounded-full flex items-center justify-center"
				style={{
					background: "var(--bg)",
					boxShadow:
						"0 0 8px 2px var(--accent-glow), 0 1px 4px rgba(0,0,0,0.25)",
				}}
				animate={{ left: isDark ? "4px" : "calc(100% - 28px)" }}
				transition={{ type: "spring", stiffness: 500, damping: 35 }}
				data-no-transition
			>
				<AnimatePresence mode="wait">
					<motion.div
						key={isDark ? "moon" : "sun"}
						initial={{ opacity: 0, scale: 0.35, rotate: isDark ? 40 : -40 }}
						animate={{ opacity: 1, scale: 1, rotate: 0 }}
						exit={{ opacity: 0, scale: 0.35, rotate: isDark ? -40 : 40 }}
						transition={{ duration: 0.18, ease: "easeOut" }}
					>
						{isDark ? <MoonIcon /> : <SunIcon />}
					</motion.div>
				</AnimatePresence>
			</motion.div>

			<div
				className="absolute bottom-0 left-4 right-4 h-px pointer-events-none"
				style={{
					background:
						"linear-gradient(90deg, transparent, var(--accent), transparent)",
					opacity: 0.5,
				}}
			/>
		</motion.button>
	);
}
