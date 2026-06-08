"use client";

import {
	faGithub,
	faLinkedin,
	faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, useReducedMotion } from "motion/react";
import { useLanguage } from "../../context/LanguageContext";
import profile from "../../data/profile.json";
import SectionFrame, { revealItem } from "../ui/SectionFrame";
import DecodeText from "../v2/DecodeText";
import GlowButton from "../v2/GlowButton";
import GlowCard from "../v2/GlowCard";

const SOCIALS = [
	{
		key: "linkedin",
		labelKey: "contact.linkedin",
		handle: "in/cristian-arrieta",
		href: profile.linkedin,
		icon: faLinkedin,
	},
	{
		key: "github",
		labelKey: "contact.github",
		handle: "Darktowers",
		href: profile.github,
		icon: faGithub,
	},
	{
		key: "whatsapp",
		labelKey: "contact.whatsapp",
		handle: "direct message",
		href: `https://wa.me/${profile.whatsapp.replace(/\D/g, "")}`,
		icon: faWhatsapp,
	},
] as const;

export default function Contact() {
	const { t } = useLanguage();
	const reduce = useReducedMotion();

	return (
		<SectionFrame
			id="contact"
			number="04"
			title={t("contact.title")}
			innerClassName="max-w-6xl"
		>
			<div className="mx-auto max-w-3xl px-5">
				{/* Heading row: decoded label + availability chip */}
				<motion.div
					className="mb-4 flex flex-wrap items-center justify-center gap-3"
					variants={revealItem}
				>
					<DecodeText
						text="Contact"
						className="text-glow font-mono text-xs uppercase tracking-[0.2em]"
						as="span"
					/>
					<span className="v2-chip v2-chip-live" aria-hidden="false">
						<span className="v2-chip-dot" />
						available for work
					</span>
				</motion.div>

				<motion.p
					className="mx-auto mb-3 max-w-md text-center text-base md:text-lg"
					style={{ color: "var(--fg-muted)" }}
					variants={revealItem}
				>
					{t("contact.subtitle")}
				</motion.p>

				{/* Location chip */}
				<motion.div className="mb-10 flex justify-center" variants={revealItem}>
					<span className="v2-chip">
						<span className="v2-chip-dot" />
						{profile.location}
					</span>
				</motion.div>

				{/* Primary CTA: email (signal-bordered highlight card) */}
				<motion.div variants={revealItem} className="mb-8">
					<div className="v2-signal-border">
						<GlowCard className="p-6 sm:p-7">
							<div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
								<div className="min-w-0">
									<p
										className="font-mono text-xs uppercase tracking-[0.16em]"
										style={{ color: "var(--accent)" }}
									>
										&gt; {t("contact.email")}
									</p>
									<a
										href={`mailto:${profile.email}`}
										className="focus-ring mt-1 block truncate rounded-[6px] font-mono text-lg font-semibold transition-colors hover:text-[var(--accent)] sm:text-xl"
										style={{ color: "var(--fg)" }}
									>
										{profile.email}
									</a>
								</div>
								<GlowButton href={`mailto:${profile.email}`} variant="solid">
									<FontAwesomeIcon
										icon={faEnvelope}
										className="h-4 w-4"
										aria-hidden="true"
									/>
									{t("contact.email")}
								</GlowButton>
							</div>
						</GlowCard>
					</div>
				</motion.div>

				{/* Secondary contact methods */}
				<div className="grid gap-4 sm:grid-cols-3">
					{SOCIALS.map((social, i) => (
						<motion.div
							key={social.key}
							variants={revealItem}
							transition={
								reduce
									? undefined
									: {
											type: "spring",
											stiffness: 360,
											damping: 28,
											delay: i * 0.05,
										}
							}
						>
							<GlowCard className="h-full">
								<a
									href={social.href}
									target="_blank"
									rel="noopener noreferrer"
									className="focus-ring flex h-full items-center gap-3 rounded-[14px] p-4"
									style={{ color: "var(--fg)" }}
								>
									<span
										className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
										style={{
											background: "var(--accent-soft)",
											border: "1px solid var(--border-strong)",
											color: "var(--accent)",
										}}
									>
										<FontAwesomeIcon
											icon={social.icon}
											className="h-4 w-4"
											aria-hidden="true"
										/>
									</span>
									<span className="min-w-0">
										<span className="block text-sm font-medium">
											{t(social.labelKey)}
										</span>
										<span
											className="block truncate font-mono text-xs"
											style={{ color: "var(--fg-muted)" }}
										>
											&gt; {social.handle}
										</span>
									</span>
								</a>
							</GlowCard>
						</motion.div>
					))}
				</div>
			</div>
		</SectionFrame>
	);
}
