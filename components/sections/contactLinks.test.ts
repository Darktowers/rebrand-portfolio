import { describe, expect, it } from "vitest";
import { getWhatsAppHref } from "./contactLinks";

describe("getWhatsAppHref", () => {
	it("rejects placeholder WhatsApp numbers", () => {
		expect(getWhatsAppHref("+57XXXXXXXXXX")).toBeNull();
	});

	it("rejects empty WhatsApp numbers", () => {
		expect(getWhatsAppHref("")).toBeNull();
	});

	it("rejects short numeric WhatsApp numbers", () => {
		expect(getWhatsAppHref("+57")).toBeNull();
	});

	it("returns a wa.me URL for plausible international WhatsApp numbers", () => {
		expect(getWhatsAppHref("+573001112233")).toBe("https://wa.me/573001112233");
	});
});
