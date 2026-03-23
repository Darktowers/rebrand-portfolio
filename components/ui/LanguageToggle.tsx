"use client";

import { motion } from "motion/react";
import { useLanguage } from "../../context/LanguageContext";

export default function LanguageToggle() {
	const { lang, setLang } = useLanguage();
	const isEN = lang === "en";

	return (
		<button
			onClick={() => setLang(isEN ? "es" : "en")}
			className="relative flex items-center w-16 h-8 rounded-full cursor-pointer overflow-hidden shrink-0"
			style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}
			aria-label={isEN ? "Switch to Spanish" : "Switch to English"}
			type="button"
		>
			{/* Sliding pill — no data-no-transition so background-color animates on theme change */}
			<motion.div
				className="absolute top-1 bottom-1 w-[calc(50%-2px)] rounded-full"
				style={{ background: "var(--accent)" }}
				animate={{ left: isEN ? "4px" : "calc(50% - 2px)" }}
				transition={{ type: "spring", stiffness: 500, damping: 35 }}
			/>
			{/* Labels */}
			<span
				className="relative z-10 w-1/2 text-center text-xs font-bold select-none"
				style={{ color: isEN ? "var(--bg)" : "var(--fg-muted)" }}
			>
				EN
			</span>
			<span
				className="relative z-10 w-1/2 text-center text-xs font-bold select-none"
				style={{ color: !isEN ? "var(--bg)" : "var(--fg-muted)" }}
			>
				ES
			</span>
		</button>
	);
}
