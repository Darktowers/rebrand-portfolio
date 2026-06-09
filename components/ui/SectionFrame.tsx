"use client";

import type { Variants } from "motion/react";
import { m as motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

interface SectionFrameProps {
	id: string;
	number: string;
	title: string;
	children: ReactNode;
	className?: string;
	innerClassName?: string;
}

const sectionVariants: Variants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.08,
			delayChildren: 0.08,
		},
	},
};

const headerVariants: Variants = {
	hidden: { opacity: 0, y: 24 },
	show: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5, ease: "easeOut" },
	},
};

export default function SectionFrame({
	id,
	number,
	title,
	children,
	className = "",
	innerClassName = "max-w-4xl",
}: SectionFrameProps) {
	const shouldReduceMotion = useReducedMotion();
	const hiddenHeader = shouldReduceMotion
		? { opacity: 0 }
		: headerVariants.hidden;
	const showHeader = shouldReduceMotion
		? { opacity: 1, transition: { duration: 0.2 } }
		: headerVariants.show;

	return (
		<motion.section
			id={id}
			className={`relative z-10 py-24 px-4 ${className}`}
			variants={sectionVariants}
			initial="hidden"
			whileInView="show"
			viewport={{ once: true, margin: "-80px" }}
		>
			<div className={`${innerClassName} mx-auto`}>
				<motion.div
					className="mb-12 text-center"
					variants={{ hidden: hiddenHeader, show: showHeader }}
				>
					<p
						className="font-mono text-sm mb-2"
						style={{ color: "var(--accent)" }}
					>
						{number}.
					</p>
					<h2
						className="text-3xl md:text-4xl font-bold"
						style={{ color: "var(--fg)" }}
					>
						{title}
					</h2>
					<motion.div
						className="w-12 h-0.5 mx-auto mt-3 origin-center"
						style={{ background: "var(--accent)" }}
						initial={{ scaleX: 0 }}
						whileInView={{ scaleX: 1 }}
						viewport={{ once: true }}
						transition={{
							duration: shouldReduceMotion ? 0 : 0.45,
							ease: "easeOut",
							delay: shouldReduceMotion ? 0 : 0.12,
						}}
						data-no-transition
					/>
				</motion.div>
				{children}
			</div>
		</motion.section>
	);
}
