"use client";

import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	motion,
	useReducedMotion,
	useScroll,
	useTransform,
	type Variants,
} from "motion/react";
import Link from "next/link";
import { useLanguage } from "../../context/LanguageContext";
import profile from "../../data/profile.json";

const heroContainer: Variants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.12,
			delayChildren: 0.08,
		},
	},
};

const heroItem: Variants = {
	hidden: { opacity: 0, y: 24 },
	show: {
		opacity: 1,
		y: 0,
		transition: { type: "spring", stiffness: 320, damping: 30 },
	},
};

export default function Hero() {
	const { t } = useLanguage();
	const shouldReduceMotion = useReducedMotion();
	const { scrollY } = useScroll();
	const heroY = useTransform(
		scrollY,
		[0, 420],
		[0, shouldReduceMotion ? 0 : 60],
	);
	const heroOpacity = useTransform(
		scrollY,
		[0, 360],
		[1, shouldReduceMotion ? 1 : 0.3],
	);

	return (
		<section className="relative min-h-dvh flex flex-col items-center justify-center px-4 text-center">
			{/* Radial glow */}
			<div
				className="absolute inset-0 pointer-events-none"
				style={{
					background:
						"radial-gradient(ellipse 80% 60% at 50% 50%, var(--accent-glow), transparent 70%)",
				}}
				aria-hidden="true"
			/>

			<motion.div
				className="relative max-w-3xl mx-auto"
				style={{ y: heroY, opacity: heroOpacity }}
				variants={heroContainer}
				initial="hidden"
				animate="show"
				data-no-transition
			>
				{/* Greeting */}
				<motion.p
					className="text-base md:text-lg font-mono mb-2"
					style={{ color: "var(--accent)" }}
					variants={heroItem}
				>
					{t("hero.greeting")}
				</motion.p>

				{/* Name */}
				<motion.h1
					className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-4"
					variants={heroItem}
				>
					<span className="text-glow" style={{ color: "var(--accent)" }}>
						{profile.displayName}
					</span>
				</motion.h1>

				{/* Role */}
				<motion.h2
					className="text-xl sm:text-2xl md:text-3xl font-medium mb-6"
					style={{ color: "var(--fg-muted)" }}
					variants={heroItem}
				>
					{t("hero.role")}
				</motion.h2>

				{/* Bio */}
				<motion.p
					className="text-base md:text-lg max-w-xl mx-auto mb-10"
					style={{ color: "var(--fg-muted)" }}
					variants={heroItem}
				>
					{t("hero.bio")}
				</motion.p>

				{/* CTA buttons */}
				<motion.div
					className="flex flex-col sm:flex-row items-center gap-4 justify-center"
					variants={heroItem}
				>
					<motion.div
						className="w-fit rounded-full"
						whileHover={{
							scale: 1.04,
							boxShadow: "0 0 18px var(--accent), 0 0 36px var(--accent-glow)",
						}}
						whileTap={{ scale: 0.97 }}
						transition={{ type: "spring", stiffness: 420, damping: 26 }}
						data-no-transition
					>
						<Link
							href="/projects"
							className="focus-ring inline-flex min-w-44 justify-center px-8 py-3 rounded-full font-semibold text-sm"
							style={{ background: "var(--accent)", color: "var(--bg)" }}
						>
							{t("hero.cta_work")}
						</Link>
					</motion.div>
					<motion.div
						className="w-fit rounded-full"
						whileHover={{
							scale: 1.04,
							boxShadow: "0 0 16px var(--accent-glow)",
						}}
						whileTap={{ scale: 0.97 }}
						transition={{ type: "spring", stiffness: 420, damping: 26 }}
						data-no-transition
					>
						<Link
							href="/contact"
							className="focus-ring inline-flex min-w-44 justify-center px-8 py-3 rounded-full font-semibold text-sm glass hover:border-[var(--accent)]"
							style={{ color: "var(--fg)" }}
						>
							{t("hero.cta_contact")}
						</Link>
					</motion.div>
				</motion.div>

				{/* Down arrow */}
				<motion.div
					className="absolute -bottom-16 left-1/2 -translate-x-1/2"
					style={{ color: "var(--fg-muted)" }}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1.2 }}
				>
					<motion.div
						className="inline-block rounded-full"
						animate={{ y: [0, 6, 0] }}
						transition={{
							duration: 1.4,
							repeat: Number.POSITIVE_INFINITY,
							ease: "easeInOut",
						}}
						data-no-transition
					>
						<Link
							href="/about"
							aria-label="Go to About"
							className="focus-ring inline-flex rounded-full p-2"
						>
							<FontAwesomeIcon icon={faChevronDown} className="w-4 h-4" />
						</Link>
					</motion.div>
				</motion.div>
			</motion.div>
		</section>
	);
}
