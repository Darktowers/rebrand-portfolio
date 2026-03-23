"use client";

import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "motion/react";
import Link from "next/link";
import { useLanguage } from "../../context/LanguageContext";
import profile from "../../data/profile.json";

export default function Hero() {
	const { t } = useLanguage();

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

			<div className="relative max-w-3xl mx-auto">
				{/* Greeting */}
				<motion.p
					className="text-base md:text-lg font-mono mb-2"
					style={{ color: "var(--accent)" }}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
				>
					{t("hero.greeting")}
				</motion.p>

				{/* Name */}
				<motion.h1
					className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-4"
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
				>
					<span className="text-glow" style={{ color: "var(--accent)" }}>
						{profile.displayName}
					</span>
				</motion.h1>

				{/* Role */}
				<motion.h2
					className="text-xl sm:text-2xl md:text-3xl font-medium mb-6"
					style={{ color: "var(--fg-muted)" }}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.35 }}
				>
					{t("hero.role")}
				</motion.h2>

				{/* Bio */}
				<motion.p
					className="text-base md:text-lg max-w-xl mx-auto mb-10"
					style={{ color: "var(--fg-muted)" }}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.5 }}
				>
					{t("hero.bio")}
				</motion.p>

				{/* CTA buttons */}
				<motion.div
					className="flex flex-col sm:flex-row gap-4 justify-center"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.65 }}
				>
					<motion.div
						className="inline-block rounded-full"
						whileHover={{ scale: 1.05, boxShadow: "0 0 28px var(--accent)" }}
						whileTap={{ scale: 0.97 }}
						transition={{ type: "spring", stiffness: 400, damping: 20 }}
						data-no-transition
					>
						<Link
							href="/projects"
							className="inline-block px-8 py-3 rounded-full font-semibold text-sm"
							style={{ background: "var(--accent)", color: "var(--bg)" }}
						>
							{t("hero.cta_work")}
						</Link>
					</motion.div>
					<motion.div
						className="inline-block rounded-full"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.97 }}
						transition={{ type: "spring", stiffness: 400, damping: 20 }}
						data-no-transition
					>
						<Link
							href="/contact"
							className="inline-block px-8 py-3 rounded-full font-semibold text-sm glass"
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
						transition={{ duration: 1.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
						data-no-transition
					>
						<Link href="/about" aria-label="Go to About">
							<FontAwesomeIcon icon={faChevronDown} className="w-4 h-4" />
						</Link>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}
