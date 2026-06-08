"use client";

import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import type { ReactNode } from "react";

type Props = {
	children: ReactNode;
	className?: string;
};

/**
 * Proximity glow card (jh3y "Proximity Glow Cards" technique):
 * pointer position drives a masked gradient border + interior spotlight,
 * via motion values so pointer moves never re-render React.
 */
export default function GlowCard({ children, className = "" }: Props) {
	const x = useMotionValue(-200);
	const y = useMotionValue(-200);

	const border = useMotionTemplate`radial-gradient(220px circle at ${x}px ${y}px, var(--accent), transparent 45%)`;
	const spotlight = useMotionTemplate`radial-gradient(320px circle at ${x}px ${y}px, var(--accent-soft), transparent 60%)`;

	function onMove(e: React.PointerEvent<HTMLDivElement>) {
		const r = e.currentTarget.getBoundingClientRect();
		x.set(e.clientX - r.left);
		y.set(e.clientY - r.top);
	}

	return (
		<div
			onPointerMove={onMove}
			className={`group relative rounded-[14px] ${className}`}
			style={{
				background: "var(--card-bg)",
				border: "1px solid var(--border)",
				backdropFilter: "blur(10px)",
				WebkitBackdropFilter: "blur(10px)",
			}}
		>
			{/* masked gradient border */}
			<motion.div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 rounded-[14px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
				style={{
					background: border,
					padding: "1px",
					WebkitMask:
						"linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
					WebkitMaskComposite: "xor",
					maskComposite: "exclude",
				}}
			/>
			{/* interior spotlight */}
			<motion.div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 rounded-[14px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
				style={{ background: spotlight }}
			/>
			<div className="relative">{children}</div>
		</div>
	);
}
