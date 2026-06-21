import { describe, expect, it } from "vitest";
import {
	getMetadataForLang,
	parseLang,
	resolveTranslation,
	translations,
} from "./translation";

describe("resolveTranslation", () => {
	it("returns a known English string for an existing key", () => {
		expect(resolveTranslation(translations.en, "nav.home")).toBe("Home");
	});

	it("returns a known Spanish string for an existing key", () => {
		expect(resolveTranslation(translations.es, "nav.home")).toBe("Inicio");
	});

	it("returns the key for a missing path", () => {
		expect(resolveTranslation(translations.en, "nav.notFound")).toBe(
			"nav.notFound",
		);
	});
});

describe("parseLang", () => {
	it("accepts supported cookie-backed document languages", () => {
		expect(parseLang("en")).toBe("en");
		expect(parseLang("es")).toBe("es");
	});

	it("falls back to English for unsupported languages", () => {
		expect(parseLang("fr")).toBe("en");
		expect(parseLang(undefined)).toBe("en");
	});
});

describe("getMetadataForLang", () => {
	it("selects different English and Spanish metadata descriptions", () => {
		expect(getMetadataForLang("en").description).toContain("React Developer");
		expect(getMetadataForLang("es").description).toContain(
			"Desarrollador React",
		);
		expect(getMetadataForLang("en").description).not.toBe(
			getMetadataForLang("es").description,
		);
	});
});
