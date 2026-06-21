const MIN_INTERNATIONAL_WHATSAPP_DIGITS = 10;
const PLACEHOLDER_MARKER = /x/i;

export function getWhatsAppHref(value: string): string | null {
	if (PLACEHOLDER_MARKER.test(value)) {
		return null;
	}

	const digits = value.replace(/\D/g, "");

	if (digits.length < MIN_INTERNATIONAL_WHATSAPP_DIGITS) {
		return null;
	}

	return `https://wa.me/${digits}`;
}
