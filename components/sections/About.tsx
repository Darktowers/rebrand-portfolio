"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useLanguage } from "../../context/LanguageContext";
import profile from "../../data/profile.json";
import skills from "../../data/skills.json";
import ElectricBorderCard from "../ui/ElectricBorderCard";
import SectionFrame, {
	revealFromLeft,
	revealFromRight,
	revealItem,
} from "../ui/SectionFrame";

const SKILL_CATEGORY_KEYS = [
	{ key: "frontend", labelKey: "about.frontend" },
	{ key: "backend", labelKey: "about.backend" },
	{ key: "cloud", labelKey: "about.cloud" },
	{ key: "tools", labelKey: "about.tools" },
] as const;

export default function About() {
	const { t } = useLanguage();

	return (
		<SectionFrame id="about" number="00" title={t("about.title")}>
			{/* Photo + Bio row */}
			<div className="flex flex-col md:flex-row items-center gap-10 mb-16">
				{/* Photo with ElectricBorderCard */}
				<motion.div className="shrink-0" variants={revealFromLeft}>
					<ElectricBorderCard
						className="rounded-full w-52 h-52 md:w-64 md:h-64"
						color="var(--accent)"
						rounded="rounded-full"
					>
						<div className="w-full h-full rounded-full overflow-hidden">
							<Image
								src="/avatar.webp"
								alt={profile.displayName}
								width={256}
								height={256}
								className="w-full h-full object-cover object-top"
								priority
							/>
						</div>
					</ElectricBorderCard>
				</motion.div>

				{/* Bio */}
				<motion.p
					className="text-base md:text-lg leading-relaxed"
					style={{ color: "var(--fg-muted)" }}
					variants={revealFromRight}
				>
					{t("about.bio")}
				</motion.p>
			</div>

			{/* Skills grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-14">
				{SKILL_CATEGORY_KEYS.map(({ key, labelKey }, gi) => (
					<motion.div
						key={key}
						className="glass rounded-xl p-5"
						variants={revealItem}
					>
						<h3
							className="text-xs font-mono font-bold uppercase tracking-widest mb-3"
							style={{ color: "var(--accent)" }}
						>
							{t(labelKey)}
						</h3>
						<div className="flex flex-wrap gap-2">
							{skills[key].map((skill, i) => (
								<motion.span
									key={skill}
									className="px-2.5 py-1 text-xs rounded-full font-medium"
									style={{
										background: "var(--bg-secondary)",
										color: "var(--fg)",
										border: "1px solid var(--border)",
									}}
									initial={{ opacity: 0, scale: 0.9 }}
									whileInView={{ opacity: 1, scale: 1 }}
									viewport={{ once: true }}
									transition={{
										type: "spring",
										stiffness: 420,
										damping: 28,
										delay: gi * 0.04 + i * 0.02,
									}}
									whileHover={{
										scale: 1.08,
										borderColor: "var(--accent)",
										color: "var(--accent)",
									}}
									data-no-transition
								>
									{skill}
								</motion.span>
							))}
						</div>
					</motion.div>
				))}
			</div>

			{/* Languages + Certs + Education row */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
				{/* Languages */}
				<motion.div className="glass rounded-xl p-5" variants={revealItem}>
					<h3
						className="text-xs font-mono font-bold uppercase tracking-widest mb-3"
						style={{ color: "var(--accent)" }}
					>
						{t("about.languages_title")}
					</h3>
					<ul className="space-y-1">
						{profile.languages.map((lang) => (
							<li
								key={lang}
								className="text-sm"
								style={{ color: "var(--fg-muted)" }}
							>
								{lang}
							</li>
						))}
					</ul>
				</motion.div>

				{/* Certifications */}
				<motion.div className="glass rounded-xl p-5" variants={revealItem}>
					<h3
						className="text-xs font-mono font-bold uppercase tracking-widest mb-3"
						style={{ color: "var(--accent)" }}
					>
						{t("about.certifications_title")}
					</h3>
					<ul className="space-y-2">
						{profile.certifications.map((cert) => (
							<li key={cert.name}>
								<p
									className="text-sm font-medium"
									style={{ color: "var(--fg)" }}
								>
									{cert.name}
								</p>
								<p className="text-xs" style={{ color: "var(--fg-muted)" }}>
									{cert.score} · {cert.level}
								</p>
							</li>
						))}
					</ul>
				</motion.div>

				{/* Education */}
				<motion.div className="glass rounded-xl p-5" variants={revealItem}>
					<h3
						className="text-xs font-mono font-bold uppercase tracking-widest mb-3"
						style={{ color: "var(--accent)" }}
					>
						{t("about.education_title")}
					</h3>
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
								<p className="text-xs" style={{ color: "var(--fg-muted)" }}>
									{edu.period}
								</p>
							</li>
						))}
					</ul>
				</motion.div>
			</div>
		</SectionFrame>
	);
}
