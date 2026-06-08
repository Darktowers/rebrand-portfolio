"use client";

import {
	faGithub,
	faLinkedin,
	faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "motion/react";
import { useLanguage } from "../../context/LanguageContext";
import profile from "../../data/profile.json";
import SectionFrame, { revealItem } from "../ui/SectionFrame";

const SOCIALS = [
	{
		key: "linkedin",
		labelKey: "contact.linkedin",
		href: profile.linkedin,
		icon: faLinkedin,
		color: "#0a66c2",
	},
	{
		key: "github",
		labelKey: "contact.github",
		href: profile.github,
		icon: faGithub,
		color: "#6e40c9",
	},
	{
		key: "whatsapp",
		labelKey: "contact.whatsapp",
		href: `https://wa.me/${profile.whatsapp.replace(/\D/g, "")}`,
		icon: faWhatsapp,
		color: "#25d366",
	},
	{
		key: "email",
		labelKey: "contact.email",
		href: `mailto:${profile.email}`,
		icon: faEnvelope,
		color: "#00d4ff",
	},
] as const;

export default function Contact() {
	const { t } = useLanguage();

	return (
		<SectionFrame
			id="contact"
			number="04"
			title={t("contact.title")}
			innerClassName="max-w-2xl"
		>
			<div className="text-center">
				<p
					className="text-base md:text-lg max-w-md mx-auto mb-10"
					style={{ color: "var(--fg-muted)" }}
				>
					{t("contact.subtitle")}
				</p>

				{/* Social links */}
				<div className="flex flex-wrap justify-center gap-4">
					{SOCIALS.map((social, i) => (
						<motion.a
							key={social.key}
							href={social.href}
							target={social.key !== "email" ? "_blank" : undefined}
							rel={social.key !== "email" ? "noopener noreferrer" : undefined}
							className="focus-ring flex items-center gap-3 px-5 py-3 rounded-xl glass font-medium text-sm"
							style={{ color: "var(--fg)" }}
							variants={revealItem}
							transition={{
								type: "spring",
								stiffness: 360,
								damping: 28,
								delay: i * 0.04,
							}}
							whileHover={{
								scale: 1.06,
								y: -3,
								boxShadow: `0 8px 24px ${social.color}33`,
							}}
							whileTap={{ scale: 0.96 }}
							data-no-transition
						>
							<span
								className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
								style={{ background: social.color, color: "#fff" }}
							>
								<FontAwesomeIcon icon={social.icon} className="w-4 h-4" />
							</span>
							{t(social.labelKey)}
						</motion.a>
					))}
				</div>

				{/* Email direct */}
				<motion.p
					className="mt-8 text-sm font-mono"
					style={{ color: "var(--fg-muted)" }}
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ delay: 0.5 }}
				>
					<a
						href={`mailto:${profile.email}`}
						className="focus-ring rounded-md hover:text-[var(--accent)] transition-colors"
					>
						{profile.email}
					</a>
				</motion.p>
			</div>
		</SectionFrame>
	);
}
