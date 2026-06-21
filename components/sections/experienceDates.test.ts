import { describe, expect, it } from "vitest";
import { formatExperienceDate } from "./experienceDates";

describe("formatExperienceDate", () => {
	it("formats year-month strings as abbreviated month and year", () => {
		expect(formatExperienceDate("2024-10", "Present")).toBe("Oct 2024");
	});

	it("uses the provided present label for null dates", () => {
		expect(formatExperienceDate(null, "Present")).toBe("Present");
	});
});
