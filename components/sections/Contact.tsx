"use client";

import {
	faGithub,
	faLinkedin,
	faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { faDownload, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { m as motion, useReducedMotion } from "motion/react";
import { useLanguage } from "../../context/LanguageContext";
import profile from "../../data/profile.json";
import Dot from "../v2/Dot";
import GlowButton from "../v2/GlowButton";
import GlowCard from "../v2/GlowCard";
import PageHeader from "../v2/PageHeader";

const SOCIALS = [
	{
		key: "linkedin",
		labelKey: "contact.linkedin",
		handle: "in/cristian-arrieta",
		href: profile.linkedin,
		icon: faLinkedin,
		download: false,
	},
	{
		key: "github",
		labelKey: "contact.github",
		handle: "Darktowers",
		href: profile.github,
		icon: faGithub,
		download: false,
	},
	{
		key: "whatsapp",
		labelKey: "contact.whatsapp",
		handle: "direct message",
		href: `https://wa.me/${profile.whatsapp.replace(/\D/g, "")}`,
		icon: faWhatsapp,
		download: false,
	},
	{
		key: "cv",
		labelKey: "hero.cta_cv",
		handle: "resume.pdf",
		href: "/cv.pdf",
		icon: faDownload,
		download: true,
	},
] as const;

export default function Contact() {
	const { t } = useLanguage();
	const reduce = useReducedMotion();

	const rise = reduce
		? {}
		: {
				initial: { opacity: 0, y: 18 },
				whileInView: { opacity: 1, y: 0 },
				viewport: { once: true, amount: 0.3 },
				transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
			};

	return (
		<section
			id="contact"
			className="relative z-10 mx-auto max-w-6xl px-5 py-24 md:py-32"
		>
			<PageHeader index="03" eyebrow="CONNECT" title={t("contact.title")} />

			<div className="max-w-3xl">
				<motion.div
					className="mb-6 flex flex-wrap items-center gap-3"
					{...rise}
				>
					<span className="v2-chip v2-chip-live">
						<Dot />
						{t("hero.available")}
					</span>
					<span className="v2-chip">
						<Dot />
						{profile.location}
					</span>
				</motion.div>

				<motion.p
					className="mb-8 max-w-md text-base md:text-lg"
					style={{ color: "var(--fg-muted)" }}
					{...rise}
				>
					{t("contact.subtitle")}
				</motion.p>

				{/* Primary CTA: email (signal-bordered highlight card) */}
				<motion.div className="mb-8" {...rise}>
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

				{/* Contact methods + CV download (CV is mobile-accessible here) */}
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{SOCIALS.map((social) => (
						<motion.div key={social.key} {...rise}>
							<GlowCard className="h-full">
								<a
									href={social.href}
									download={social.download}
									target={social.download ? undefined : "_blank"}
									rel={social.download ? undefined : "noopener noreferrer"}
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
		</section>
	);
}
