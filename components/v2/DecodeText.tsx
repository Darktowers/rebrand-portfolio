"use client";

import { useReducedMotion } from "motion/react";
import { type ElementType, useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789/\\<>[]{}=+*#%";

type Props = {
	text: string;
	as?: ElementType;
	className?: string;
	/** ms to fully decode */
	duration?: number;
	/** ms before decoding starts */
	delay?: number;
};

/**
 * Dependency-free "decode/scramble" reveal for the CLI / terminal vibe.
 * Left-to-right settle: unsettled chars cycle random glyphs, settled chars
 * lock to the final text. Honors prefers-reduced-motion (shows final text).
 */
export default function DecodeText({
	text,
	as: Tag = "span",
	className = "",
	duration = 900,
	delay = 0,
}: Props) {
	const reduce = useReducedMotion();
	const [display, setDisplay] = useState("");
	const rafRef = useRef(0);
	const startRef = useRef(0);

	useEffect(() => {
		if (reduce) return;

		let frame = 0;
		let timeout: ReturnType<typeof setTimeout>;
		const len = text.length;

		const tick = (now: number) => {
			if (!startRef.current) startRef.current = now;
			const p = Math.min((now - startRef.current) / duration, 1);
			const settled = Math.floor(p * len);
			let out = "";

			for (let i = 0; i < len; i++) {
				const ch = text[i];
				if (ch === " ") {
					out += " ";
				} else if (i < settled) {
					out += ch;
				} else {
					out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
				}
			}

			if (p < 1) {
				setDisplay(out);
				frame = requestAnimationFrame(tick);
				rafRef.current = frame;
			} else {
				setDisplay(text);
			}
		};

		timeout = setTimeout(() => {
			startRef.current = 0;
			frame = requestAnimationFrame(tick);
			rafRef.current = frame;
		}, delay);

		return () => {
			clearTimeout(timeout);
			cancelAnimationFrame(frame);
		};
	}, [text, duration, delay, reduce]);

	return (
		<Tag className={className} aria-label={text}>
			<span aria-hidden="true">{reduce ? text : display || " "}</span>
		</Tag>
	);
}
