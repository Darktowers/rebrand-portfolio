"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import {
	LANGUAGE_COOKIE_NAME,
	type Lang,
	parseLang,
	resolveTranslation,
	translations,
} from "./translation";

interface LanguageContextValue {
	lang: Lang;
	setLang: (lang: Lang) => Promise<void>;
	t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
	lang: "en",
	setLang: async () => {},
	t: (k) => k,
});

function getBrowserCookieStore() {
	return "cookieStore" in window ? window.cookieStore : null;
}

async function persistLang(lang: Lang) {
	localStorage.setItem(LANGUAGE_COOKIE_NAME, lang);
	const cookieStore = getBrowserCookieStore();
	if (cookieStore) {
		await cookieStore.set({
			name: LANGUAGE_COOKIE_NAME,
			value: lang,
			path: "/",
			expires: Date.now() + 31536000 * 1000,
			sameSite: "lax",
		});
	} else {
		// biome-ignore lint/suspicious/noDocumentCookie: fallback when Cookie Store API is unavailable.
		document.cookie = `${LANGUAGE_COOKIE_NAME}=${lang}; path=/; max-age=31536000; samesite=lax`;
	}
	document.documentElement.lang = lang;
}

export function LanguageProvider({
	children,
	initialLang = "en",
}: {
	children: React.ReactNode;
	initialLang?: Lang;
}) {
	const [lang, setLangState] = useState<Lang>(initialLang);

	useEffect(() => {
		document.documentElement.lang = initialLang;
		localStorage.setItem(LANGUAGE_COOKIE_NAME, initialLang);
	}, [initialLang]);

	const setLang = useCallback(async (l: Lang) => {
		const nextLang = parseLang(l);
		setLangState(nextLang);
		await persistLang(nextLang);
	}, []);

	const t = useCallback(
		(key: string) =>
			resolveTranslation(translations[lang] as Record<string, unknown>, key),
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
