"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import en from "../i18n/en.json";
import es from "../i18n/es.json";

type Lang = "en" | "es";

const translations: Record<Lang, Record<string, unknown>> = { en, es };

function resolve(obj: Record<string, unknown>, path: string): string {
	const parts = path.split(".");
	let current: unknown = obj;
	for (const part of parts) {
		if (current == null || typeof current !== "object") return path;
		current = (current as Record<string, unknown>)[part];
	}
	return typeof current === "string" ? current : path;
}

interface LanguageContextValue {
	lang: Lang;
	setLang: (lang: Lang) => void;
	t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
	lang: "en",
	setLang: () => {},
	t: (k) => k,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
	const [lang, setLangState] = useState<Lang>("en");

	useEffect(() => {
		const stored = localStorage.getItem("lang") as Lang | null;
		if (stored === "en" || stored === "es") setLangState(stored);
	}, []);

	const setLang = useCallback((l: Lang) => {
		setLangState(l);
		localStorage.setItem("lang", l);
	}, []);

	const t = useCallback(
		(key: string) => resolve(translations[lang] as Record<string, unknown>, key),
		[lang],
	);

	return (
		<LanguageContext.Provider value={{ lang, setLang, t }}>
			{children}
		</LanguageContext.Provider>
	);
}

export function useLanguage() {
	return useContext(LanguageContext);
}
