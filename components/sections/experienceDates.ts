export function formatExperienceDate(
	dateStr: string | null,
	presentLabel: string,
): string {
	if (!dateStr) return presentLabel;
	const [year, month] = dateStr.split("-");
	const date = new Date(Number(year), Number(month) - 1);
	return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
