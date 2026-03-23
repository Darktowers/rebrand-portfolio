"use client";

import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLanguage } from "../../context/LanguageContext";
import profile from "../../data/profile.json";

const FOOTER_LINKS = [
	{ href: profile.github, icon: faGithub, label: "GitHub" },
	{ href: profile.linkedin, icon: faLinkedin, label: "LinkedIn" },
	{ href: `mailto:${profile.email}`, icon: faEnvelope, label: "Email" },
] as const;

export default function Footer() {
	const { t } = useLanguage();
	const year = new Date().getFullYear();

	return (
		<footer
			className="relative z-10 border-t py-8 mt-0"
			style={{ borderColor: "var(--border)" }}
		>
			<div
				className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm"
				style={{ color: "var(--fg-muted)" }}
			>
				<span className="font-mono" style={{ color: "var(--accent)" }}>
					{profile.displayName}
				</span>
				<span>{t("footer.built")} — © {year}</span>
				<div className="flex gap-5">
					{FOOTER_LINKS.map(({ href, icon, label }) => (
						<a
							key={label}
							href={href}
							target={href.startsWith("mailto") ? undefined : "_blank"}
							rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
							aria-label={label}
							className="hover:text-[var(--accent)] transition-colors"
						>
							<FontAwesomeIcon icon={icon} className="w-4 h-4" />
						</a>
					))}
				</div>
			</div>
		</footer>
	);
}
