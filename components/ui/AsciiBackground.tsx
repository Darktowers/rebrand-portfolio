"use client";

import { useEffect, useRef } from "react";

const CHARS = "01アイウエオカキクケコ@#$%&*<>[]{}|/\\~^";
const FONT_SIZE = 14;

export default function AsciiBackground() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let animationId: number;
		let cols: number;
		let drops: number[];

		function init() {
			if (!canvas) return;
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			cols = Math.floor(canvas.width / FONT_SIZE);
			drops = Array.from({ length: cols }, () =>
				Math.floor(Math.random() * -50),
			);
		}

		function draw() {
			if (!canvas || !ctx) return;

			// Read theme from DOM directly — no React state dependency
			const isDark = document.documentElement.classList.contains("dark");
			const bgColor = isDark
				? "rgba(13,17,23,0.05)"
				: "rgba(255,255,255,0.08)";
			const charColor = isDark
				? "rgba(1,248,193,0.18)"
				: "rgba(242,25,156,0.13)";

			ctx.fillStyle = bgColor;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			ctx.fillStyle = charColor;
			ctx.font = `${FONT_SIZE}px 'Courier New', monospace`;

			for (let i = 0; i < drops.length; i++) {
				const char = CHARS[Math.floor(Math.random() * CHARS.length)];
				const x = i * FONT_SIZE;
				const y = drops[i] * FONT_SIZE;

				if (y > 0 && y < canvas.height) {
					ctx.fillText(char, x, y);
				}

				if (drops[i] * FONT_SIZE > canvas.height && Math.random() > 0.975) {
					drops[i] = 0;
				}
				drops[i]++;
			}

			animationId = requestAnimationFrame(draw);
		}

		init();
		draw();

		const onResize = () => {
			cancelAnimationFrame(animationId);
			init();
			draw();
		};
		window.addEventListener("resize", onResize);

		return () => {
			cancelAnimationFrame(animationId);
			window.removeEventListener("resize", onResize);
		};
	}, []); // Run once — theme is read live from DOM inside draw()

	return (
		<canvas
			ref={canvasRef}
			id="ascii-bg"
			aria-hidden="true"
			data-no-transition
		/>
	);
}
