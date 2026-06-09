"use client";

import { m as motion, useMotionTemplate, useMotionValue } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
	children: ReactNode;
	href: string;
	variant?: "solid" | "ghost";
	className?: string;
	/** Render a native download anchor (e.g. a static file) instead of a Link. */
	download?: boolean;
};

export default function GlowButton({
	children,
	href,
	variant = "solid",
	className = "",
	download = false,
}: Props) {
	const x = useMotionValue(0);
	const y = useMotionValue(0);
	const bg = useMotionTemplate`radial-gradient(120px circle at ${x}px ${y}px, var(--accent-glow), transparent 70%)`;

	function onMove(e: React.PointerEvent<HTMLAnchorElement>) {
		const r = e.currentTarget.getBoundingClientRect();
		x.set(e.clientX - r.left);
		y.set(e.clientY - r.top);
	}

	const solid = variant === "solid";

	const className_ = `focus-ring group relative inline-flex items-center gap-2 overflow-hidden rounded-[10px] px-6 py-3 font-mono text-sm font-semibold ${className}`;
	const style = solid
		? { background: "var(--accent)", color: "var(--bg)" }
		: {
				color: "var(--fg)",
				border: "1px solid var(--border-strong)",
				background: "var(--surface)",
			};
	const inner = (
		<>
			{!solid && (
				<motion.span
					aria-hidden="true"
					className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
					style={{ background: bg }}
				/>
			)}
			<span className="relative flex items-center gap-2">{children}</span>
		</>
	);

	return (
		<motion.div
			whileHover={{ y: -1 }}
			whileTap={{ scale: 0.98 }}
			transition={{ type: "spring", stiffness: 420, damping: 26 }}
			className="w-fit"
			data-no-transition
		>
			{download ? (
				<a
					href={href}
					download
					onPointerMove={onMove}
					className={className_}
					style={style}
				>
					{inner}
				</a>
			) : (
				<Link
					href={href}
					onPointerMove={onMove}
					className={className_}
					style={style}
				>
					{inner}
				</Link>
			)}
		</motion.div>
	);
}
