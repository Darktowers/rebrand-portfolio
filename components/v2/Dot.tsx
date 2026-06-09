type Props = {
	/** diameter in px */
	size?: number;
	/** active = rose, glowing, pulsing; inactive = muted, static */
	active?: boolean;
	className?: string;
};

/** Centralized accent dot. Active dots are rose, glowing and auto-pulsing
 *  (.v2-chip-dot); inactive dots are a muted, static marker. */
export default function Dot({
	size = 6,
	active = true,
	className = "",
}: Props) {
	if (!active) {
		return (
			<span
				className={className}
				style={{
					display: "inline-block",
					width: size,
					height: size,
					borderRadius: "50%",
					background: "var(--fg-muted)",
					opacity: 0.45,
				}}
				aria-hidden="true"
			/>
		);
	}
	return (
		<span
			className={`v2-chip-dot ${className}`}
			style={{
				display: "inline-block",
				width: size,
				height: size,
				boxShadow: `0 0 ${Math.round(size * 1.4)}px var(--accent)`,
			}}
			aria-hidden="true"
		/>
	);
}
