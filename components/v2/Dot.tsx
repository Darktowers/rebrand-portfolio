type Props = {
	/** diameter in px */
	size?: number;
	className?: string;
};

/** Centralized accent dot: rose, glowing, auto-pulsing (.v2-chip-dot).
 *  Used for chip indicators and timeline nodes so they're all identical. */
export default function Dot({ size = 6, className = "" }: Props) {
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
