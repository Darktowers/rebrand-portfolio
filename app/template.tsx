"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export default function Template({ children }: { children: ReactNode }) {
	const shouldReduceMotion = useReducedMotion();

	return (
		<motion.div
			initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 10 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{
				type: "spring",
				stiffness: 520,
				damping: 42,
				mass: 0.6,
			}}
			data-no-transition
		>
			{children}
		</motion.div>
	);
}
