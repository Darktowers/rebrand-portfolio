"use client";

import { motion, useReducedMotion } from "motion/react";
import DecodeText from "./DecodeText";

type Props = {
	/** Two-digit CLI index, e.g. "00". */
	index: string;
	/** Mono CLI eyebrow label, e.g. "WHOAMI". */
	eyebrow: string;
	/** Localized page title (rendered with the decode effect). */
	title: string;
	className?: string;
};

/** Uniform page header: an auto-glowing CLI pill (NN / LABEL) above a
 *  decode-reveal heading. Used across all routes for consistency. */
export default function PageHeader({
	index,
	eyebrow,
	title,
	className = "",
}: Props) {
	const reduce = useReducedMotion();
	return (
		<motion.div
			className={`mb-14 ${className}`}
			initial={reduce ? false : { opacity: 0, y: 24 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.3 }}
			transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
		>
			<span className="v2-chip v2-chip-live mb-4">
				<span className="v2-chip-dot" />
				{index} / {eyebrow}
			</span>
			<DecodeText
				text={title}
				as="h2"
				className="block text-3xl font-bold tracking-tight text-glow md:text-5xl"
			/>
		</motion.div>
	);
}
