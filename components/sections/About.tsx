"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useLanguage } from "../../context/LanguageContext";
import profile from "../../data/profile.json";
import skills from "../../data/skills.json";
import GlowCard from "../v2/GlowCard";
import PageHeader from "../v2/PageHeader";

const SKILL_CATEGORY_KEYS = [
	{ key: "frontend", labelKey: "about.frontend" },
	{ key: "backend", labelKey: "about.backend" },
	{ key: "cloud", labelKey: "about.cloud" },
	{ key: "tools", labelKey: "about.tools" },
] as const;

export default function About() {
	const { t } = useLanguage();
	const reduce = useReducedMotion();

	const reveal = (delay = 0) => ({
		initial: reduce ? false : { opacity: 0, y: 24 },
		whileInView: { opacity: 1, y: 0 },
		viewport: { once: true, amount: 0.3 },
		transition: {
			duration: 0.5,
			delay,
			ease: [0.21, 0.47, 0.32, 0.98] as const,
		},
	});

	return (
		<section id="about" className="relative w-full py-24 md:py-32">
			<div className="max-w-6xl mx-auto px-5">
				<PageHeader index="00" eyebrow="WHOAMI" title={t("about.title")} />

				{/* Identity card: photo + bio (featured signal border) */}
				<motion.div className="mb-16" {...reveal(0.05)}>
					<div className="v2-signal-border">
						<div
							className="glass rounded-[14px] p-6 md:p-9 flex flex-col md:flex-row items-center gap-9"
							style={{ borderRadius: "var(--r-card)" }}
						>
							{/* Photo */}
							<div className="shrink-0">
								<div
									className="v2-avatar-glow relative w-44 h-44 md:w-56 md:h-56 rounded-full overflow-hidden"
									style={{
										border: "1px solid var(--border-strong)",
									}}
								>
									<Image
										src="/avatar.webp"
										alt={profile.displayName}
										width={256}
										height={256}
										className="w-full h-full object-cover object-top"
										priority
									/>
								</div>
							</div>

							{/* Bio + identity readout */}
							<div className="flex-1 text-center md:text-left">
								<p
									className="font-mono text-xs uppercase tracking-[0.18em] mb-3"
									style={{ color: "var(--accent)" }}
								>
									{profile.title} / {profile.subtitle}
								</p>
								<p
									className="text-base md:text-lg leading-relaxed"
									style={{ color: "var(--fg-muted)" }}
								>
									{t("about.bio")}
								</p>
								<p
									className="font-mono text-xs mt-4"
									style={{ color: "var(--fg-muted)" }}
								>
									<span style={{ color: "var(--accent)" }}>{"> "}</span>
									{profile.location}
								</p>
							</div>
						</div>
					</div>
				</motion.div>

				{/* Skills grid */}
				<motion.div className="mb-6" {...reveal(0.05)}>
					<h3
						className="font-mono text-xs font-bold uppercase tracking-[0.18em] mb-5"
						style={{ color: "var(--fg-muted)" }}
					>
						<span style={{ color: "var(--accent)" }}>{"// "}</span>
						{t("about.skills_title")}
					</h3>
				</motion.div>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-14">
					{SKILL_CATEGORY_KEYS.map(({ key, labelKey }, gi) => (
						<motion.div key={key} {...reveal(0.05 + gi * 0.06)}>
							<GlowCard className="h-full p-5">
								<h4
									className="text-xs font-mono font-bold uppercase tracking-[0.18em] mb-4"
									style={{ color: "var(--accent)" }}
								>
									{t(labelKey)}
								</h4>
								<div className="flex flex-wrap gap-2">
									{skills[key].map((skill, i) => (
										<motion.span
											key={skill}
											className="px-2.5 py-1 text-xs font-mono font-medium"
											style={{
												borderRadius: "var(--r-chip)",
												background: "var(--surface)",
												color: "var(--fg)",
												border: "1px solid var(--border)",
											}}
											initial={reduce ? false : { opacity: 0, scale: 0.9 }}
											whileInView={{ opacity: 1, scale: 1 }}
											viewport={{ once: true }}
											transition={{
												type: "spring",
												stiffness: 420,
												damping: 28,
												delay: gi * 0.04 + i * 0.02,
											}}
											whileHover={{
												borderColor: "var(--accent)",
												color: "var(--accent)",
											}}
											data-no-transition
										>
											{skill}
										</motion.span>
									))}
								</div>
							</GlowCard>
						</motion.div>
					))}
				</div>

				{/* Languages + Certs + Education row */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
					{/* Languages */}
					<motion.div {...reveal(0.05)}>
						<GlowCard className="h-full p-5">
							<h4
								className="text-xs font-mono font-bold uppercase tracking-[0.18em] mb-4"
								style={{ color: "var(--accent)" }}
							>
								{t("about.languages_title")}
							</h4>
							<ul className="space-y-1.5">
								{profile.languages.map((lang) => (
									<li
										key={lang}
										className="text-sm font-mono"
										style={{ color: "var(--fg-muted)" }}
									>
										<span style={{ color: "var(--accent)" }}>{"- "}</span>
										{lang}
									</li>
								))}
							</ul>
						</GlowCard>
					</motion.div>

					{/* Certifications */}
					<motion.div {...reveal(0.1)}>
						<GlowCard className="h-full p-5">
							<h4
								className="text-xs font-mono font-bold uppercase tracking-[0.18em] mb-4"
								style={{ color: "var(--accent)" }}
							>
								{t("about.certifications_title")}
							</h4>
							<ul className="space-y-2">
								{profile.certifications.map((cert) => (
									<li key={cert.name}>
										<p
											className="text-sm font-medium"
											style={{ color: "var(--fg)" }}
										>
											{cert.name}
										</p>
										<p
											className="text-xs font-mono"
											style={{ color: "var(--fg-muted)" }}
										>
											{cert.score} · {cert.level}
										</p>
									</li>
								))}
							</ul>
						</GlowCard>
					</motion.div>

					{/* Education */}
					<motion.div {...reveal(0.15)}>
						<GlowCard className="h-full p-5">
							<h4
								className="text-xs font-mono font-bold uppercase tracking-[0.18em] mb-4"
								style={{ color: "var(--accent)" }}
							>
								{t("about.education_title")}
							</h4>
							<ul className="space-y-3">
								{profile.education.map((edu) => (
									<li key={edu.institution}>
										<p
											className="text-sm font-medium"
											style={{ color: "var(--fg)" }}
										>
											{edu.institution}
										</p>
										<p className="text-xs" style={{ color: "var(--fg-muted)" }}>
											{edu.degree}
										</p>
										<p
											className="text-xs font-mono"
											style={{ color: "var(--fg-muted)" }}
										>
											{edu.period}
										</p>
									</li>
								))}
							</ul>
						</GlowCard>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
