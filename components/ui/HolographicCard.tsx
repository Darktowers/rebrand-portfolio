"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";

interface HolographicCardProps {
	children: ReactNode;
	className?: string;
}

export default function HolographicCard({
	children,
	className = "",
}: HolographicCardProps) {
	const cardRef = useRef<HTMLDivElement>(null);

	const rawRotX = useMotionValue(0);
	const rawRotY = useMotionValue(0);
	const rotateX = useSpring(rawRotX, { stiffness: 180, damping: 22 });
	const rotateY = useSpring(rawRotY, { stiffness: 180, damping: 22 });
	const scale = useSpring(useMotionValue(1), { stiffness: 280, damping: 28 });

	function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
		const card = cardRef.current;
		if (!card) return;
		const rect = card.getBoundingClientRect();
		const cx = rect.left + rect.width / 2;
		const cy = rect.top + rect.height / 2;
		const dx = e.clientX - cx;
		const dy = e.clientY - cy;
		rawRotX.set(-(dy / (rect.height / 2)) * 8);
		rawRotY.set((dx / (rect.width / 2)) * 8);
	}

	function handleMouseEnter() {
		scale.set(1.02);
	}

	function handleMouseLeave() {
		rawRotX.set(0);
		rawRotY.set(0);
		scale.set(1);
	}

	return (
		<motion.div
			ref={cardRef}
			className={`relative rounded-xl cursor-pointer ${className}`}
			style={{
				rotateX,
				rotateY,
				scale,
				transformPerspective: 1000,
			}}
			onMouseMove={handleMouseMove}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			data-no-transition
		>
			{children}
		</motion.div>
	);
}
