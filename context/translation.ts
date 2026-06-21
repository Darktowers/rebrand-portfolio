import en from "../i18n/en.json";
import es from "../i18n/es.json";

export type Lang = "en" | "es";

export const LANGUAGE_COOKIE_NAME = "lang";

export const translations: Record<Lang, Record<string, unknown>> = { en, es };

const metadataByLang: Record<
	Lang,
	{
		title: string;
		description: string;
		openGraphDescription: string;
	}
> = {
	en: {
		title: "Cristian Arrieta - React Developer",
		description:
			"React Developer & JavaScript Engineer with 8+ years of experience building fast, scalable web applications.",
		openGraphDescription:
			"React Developer & JavaScript Engineer based in Bogotá, Colombia.",
	},
	es: {
		title: "Cristian Arrieta - Desarrollador React",
		description:
			"Desarrollador React e ingeniero JavaScript con más de 8 años de experiencia creando aplicaciones web rápidas y escalables.",
		openGraphDescription:
			"Desarrollador React e ingeniero JavaScript ubicado en Bogotá, Colombia.",
	},
};

export function parseLang(value: unknown): Lang {
	return value === "en" || value === "es" ? value : "en";
}

export function getMetadataForLang(lang: Lang) {
	return metadataByLang[lang];
}

export function resolveTranslation(
	obj: Record<string, unknown>,
	path: string,
): string {
	const parts = path.split(".");
	let current: unknown = obj;
	for (const part of parts) {
		if (current == null || typeof current !== "object") return path;
		current = (current as Record<string, unknown>)[part];
	}
	return typeof current === "string" ? current : path;
}
