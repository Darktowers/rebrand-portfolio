"use client";

import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useLanguage } from "../../context/LanguageContext";
import profile from "../../data/profile.json";
import DecodeText from "../v2/DecodeText";
import GlowButton from "../v2/GlowButton";

export default function Hero() {
	const { t } = useLanguage();
	const reduce = useReducedMotion();

	return (
		<section className="relative mx-auto flex min-h-[100dvh] max-w-6xl flex-col justify-center px-5 pb-16">
			<motion.span
				className="v2-chip v2-chip-live mb-6 w-fit"
				initial={reduce ? false : { opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<span className="v2-chip-dot" />
				{t("hero.available")}
			</motion.span>

			<h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
				<DecodeText text={profile.displayName} duration={900} />
			</h1>

			<motion.p
				className="mt-3 font-mono text-lg md:text-2xl"
				style={{ color: "var(--accent)" }}
				initial={reduce ? false : { opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.4, duration: 0.6 }}
			>
				{t("hero.role")}
			</motion.p>

			<motion.p
				className="mt-6 max-w-xl text-base leading-relaxed md:text-lg"
				style={{ color: "var(--fg-muted)" }}
				initial={reduce ? false : { opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.55, duration: 0.6 }}
			>
				{t("hero.bio")}
			</motion.p>

			<motion.div
				className="mt-9 flex flex-wrap items-center gap-4"
				initial={reduce ? false : { opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.7, duration: 0.6 }}
			>
				<GlowButton href="/projects">{t("hero.cta_work")}</GlowButton>
				<GlowButton href="/contact" variant="ghost">
					{t("hero.cta_contact")}
				</GlowButton>
			</motion.div>

			<motion.div
				className="absolute bottom-8 left-1/2 -translate-x-1/2"
				style={{ color: "var(--fg-muted)" }}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1.2 }}
			>
				<motion.div
					className="inline-block"
					animate={reduce ? undefined : { y: [0, 6, 0] }}
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
						<FontAwesomeIcon icon={faChevronDown} className="h-4 w-4" />
					</Link>
				</motion.div>
			</motion.div>
		</section>
	);
}
