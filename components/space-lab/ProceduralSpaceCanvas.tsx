"use client";

import { useEffect, useRef } from "react";

type Vector2 = { x: number; y: number };

type Star = {
	x: number;
	y: number;
	z: number;
	size: number;
	speed: number;
	tint: number;
};

type Planet = {
	x: number;
	y: number;
	z: number;
	radius: number;
	speed: number;
	drift: number;
	ring: boolean;
	hue: number;
};

type ProceduralSpaceCanvasProps = {
	mode: "v1" | "v2";
	pointerRef: React.RefObject<Vector2>;
	trim: Vector2;
};

type Palette = {
	bgA: string;
	bgB: string;
	accent: string;
	accent2: string;
	planet: string;
	ring: string;
	dust: string;
};

export default function ProceduralSpaceCanvas({
	mode,
	pointerRef,
	trim,
}: ProceduralSpaceCanvasProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const context = canvas.getContext("2d");
		if (!context) return;

		const ctx = context;
		const target = canvas;
		let animationId = 0;
		let width = 0;
		let height = 0;
		let dpr = 1;
		let stars: Star[] = [];
		let planets: Planet[] = [];
		let steerX = 0;
		let steerY = 0;
		let frame = 0;
		const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
		let reducedMotion = motionQuery.matches;

		const palettes = {
			v1: {
				bgA: "#040810",
				bgB: "#0a1630",
				accent: "#55e6ff",
				accent2: "#8aa8ff",
				planet: "#73d8ff",
				ring: "#c1e6ff",
				dust: "rgba(100, 216, 255, 0.06)",
			},
			v2: {
				bgA: "#02060d",
				bgB: "#111f33",
				accent: "#9ef7ff",
				accent2: "#ffc16b",
				planet: "#7fd4ff",
				ring: "#ffe4b8",
				dust: "rgba(255, 193, 107, 0.05)",
			},
		} as const;

		function makePlanet(seed = Math.random()): Planet {
			const lane = Math.random() > 0.5 ? 1 : -1;
			return {
				x: lane * (0.95 + Math.random() * 2.2) + (seed - 0.5) * 0.65,
				y: (Math.random() - 0.5) * 1.6,
				z: 6 + Math.random() * 10,
				radius: 0.45 + Math.random() * 0.72,
				speed: 0.022 + Math.random() * 0.022,
				drift: (Math.random() - 0.5) * 0.01,
				ring: Math.random() > 0.45,
				hue: Math.random(),
			};
		}

		function seedScene() {
			const starCount =
				mode === "v1"
					? Math.min(720, Math.floor((width * height) / 1800))
					: Math.min(920, Math.floor((width * height) / 1500));
			stars = Array.from({ length: starCount }, () => ({
				x: (Math.random() - 0.5) * 4.8,
				y: (Math.random() - 0.5) * 2.8,
				z: 0.25 + Math.random() * 7,
				size: 0.6 + Math.random() * 1.6,
				speed: 0.032 + Math.random() * 0.03,
				tint: Math.random(),
			}));
			planets = Array.from({ length: mode === "v1" ? 3 : 4 }, () =>
				makePlanet(),
			);
		}

		function resize() {
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			width = window.innerWidth;
			height = window.innerHeight;
			target.width = Math.floor(width * dpr);
			target.height = Math.floor(height * dpr);
			target.style.width = `${width}px`;
			target.style.height = `${height}px`;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			seedScene();
		}

		function drawPlanet(
			planet: Planet,
			palette: Palette,
			vpX: number,
			vpY: number,
		) {
			const perspective = 1 / Math.max(planet.z, 0.25);
			const x = vpX + planet.x * width * 0.22 * perspective;
			const y = vpY + planet.y * height * 0.2 * perspective;
			const radius = planet.radius * width * 0.11 * perspective;
			const gradient = ctx.createRadialGradient(
				x - radius * 0.35,
				y - radius * 0.42,
				radius * 0.08,
				x,
				y,
				radius,
			);
			gradient.addColorStop(0, "#f7fdff");
			gradient.addColorStop(0.25, palette.planet);
			gradient.addColorStop(1, "rgba(0,0,0,0)");
			ctx.globalAlpha = 0.16 + Math.min(0.34, perspective * 0.78);
			ctx.fillStyle = gradient;
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, Math.PI * 2);
			ctx.fill();

			const halo = ctx.createRadialGradient(
				x,
				y,
				radius * 0.05,
				x,
				y,
				radius * 1.9,
			);
			halo.addColorStop(0, `rgba(247, 253, 255, ${0.14 + perspective * 0.14})`);
			halo.addColorStop(
				0.25,
				`rgba(115, 216, 255, ${0.1 + perspective * 0.08})`,
			);
			halo.addColorStop(1, "rgba(0, 0, 0, 0)");
			ctx.globalAlpha = 1;
			ctx.fillStyle = halo;
			ctx.beginPath();
			ctx.arc(x, y, radius * 1.9, 0, Math.PI * 2);
			ctx.fill();

			if (planet.ring) {
				ctx.save();
				ctx.translate(x, y);
				ctx.rotate(-0.28 + frame * 0.0006);
				ctx.globalAlpha = 0.22 + perspective * 0.2;
				ctx.strokeStyle = palette.ring;
				ctx.lineWidth = Math.max(0.8, perspective * 2.4);
				ctx.beginPath();
				ctx.ellipse(0, 0, radius * 1.45, radius * 0.34, 0, 0, Math.PI * 2);
				ctx.stroke();
				ctx.restore();
			}
		}

		function draw() {
			const palette = palettes[mode];
			const pointer = pointerRef.current;
			const targetX = Math.max(
				-1,
				Math.min(1, pointer.x * 0.68 + trim.x * 0.92),
			);
			const targetY = Math.max(
				-1,
				Math.min(1, pointer.y * 0.68 + trim.y * 0.92),
			);
			steerX += (targetX - steerX) * 0.045;
			steerY += (targetY - steerY) * 0.045;

			const vpX = width * 0.5 + steerX * width * 0.24;
			const vpY = height * 0.45 + steerY * height * 0.16;
			const warp = reducedMotion
				? 0.7
				: 1.25 + Math.abs(steerX) * 0.58 + Math.abs(steerY) * 0.34;

			const bg = ctx.createRadialGradient(
				vpX,
				vpY,
				0,
				width * 0.5,
				height * 0.58,
				Math.max(width, height) * 0.8,
			);
			bg.addColorStop(0, palette.bgB);
			bg.addColorStop(1, palette.bgA);
			ctx.fillStyle = bg;
			ctx.fillRect(0, 0, width, height);

			const coreGlow = ctx.createRadialGradient(
				vpX,
				vpY,
				0,
				vpX,
				vpY,
				Math.max(width, height) * 0.28,
			);
			coreGlow.addColorStop(0, "rgba(255,255,255,0.05)");
			coreGlow.addColorStop(0.22, palette.dust);
			coreGlow.addColorStop(1, "rgba(0,0,0,0)");
			ctx.fillStyle = coreGlow;
			ctx.fillRect(0, 0, width, height);

			if (mode === "v2") {
				const nebula = ctx.createRadialGradient(
					width * 0.68,
					height * 0.32,
					0,
					width * 0.68,
					height * 0.32,
					width * 0.28,
				);
				nebula.addColorStop(0, "rgba(92, 168, 255, 0.16)");
				nebula.addColorStop(0.45, "rgba(255, 193, 107, 0.09)");
				nebula.addColorStop(1, "rgba(0,0,0,0)");
				ctx.fillStyle = nebula;
				ctx.fillRect(0, 0, width, height);
			}

			ctx.fillStyle = palette.dust;
			for (let i = 0; i < 18; i++) {
				const dustX = ((i * 91 + frame * 0.6) % (width + 160)) - 80;
				const dustY = height * (0.16 + (i % 6) * 0.12);
				ctx.beginPath();
				ctx.arc(dustX, dustY, 38 + (i % 4) * 20, 0, Math.PI * 2);
				ctx.fill();
			}

			for (const planet of planets) {
				planet.z -= planet.speed * warp * 1.25;
				planet.x += planet.drift + steerX * 0.0022;
				planet.y += steerY * 0.0008;
				if (planet.z < 0.42) {
					Object.assign(planet, makePlanet(Math.random()));
				}
				drawPlanet(planet, palette, vpX, vpY);
			}

			for (const star of stars) {
				const previousZ = star.z;
				star.z -= star.speed * warp;
				if (star.z < 0.06) {
					star.x = (Math.random() - 0.5) * 4.8;
					star.y = (Math.random() - 0.5) * 2.8;
					star.z = 7;
				}

				const perspective = 1 / Math.max(star.z, 0.05);
				const tailZ = previousZ + star.speed * warp * 7;
				const previousPerspective = 1 / Math.max(tailZ, 0.05);
				const x = vpX + star.x * width * 0.24 * perspective;
				const y = vpY + star.y * height * 0.22 * perspective;
				const prevX = vpX + star.x * width * 0.24 * previousPerspective;
				const prevY = vpY + star.y * height * 0.22 * previousPerspective;
				if (x < -120 || x > width + 120 || y < -120 || y > height + 120) {
					star.z = 7;
					continue;
				}

				const alpha = Math.min(1, 0.18 + perspective * 0.68);
				ctx.globalAlpha = alpha;
				ctx.strokeStyle = star.tint > 0.8 ? palette.accent2 : palette.accent;
				ctx.lineWidth = Math.max(0.7, star.size * (0.3 + perspective * 1.35));
				ctx.beginPath();
				ctx.moveTo(prevX, prevY);
				ctx.lineTo(x, y);
				ctx.stroke();

				ctx.fillStyle = star.tint > 0.75 ? "#f7fdff" : palette.accent;
				ctx.beginPath();
				ctx.arc(
					x,
					y,
					Math.max(0.45, star.size * 0.14 + perspective * 1.2),
					0,
					Math.PI * 2,
				);
				ctx.fill();
			}

			ctx.globalAlpha = 0.18;
			ctx.strokeStyle = palette.accent;
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(width * 0.02, height);
			ctx.lineTo(width * 0.22, height * 0.14);
			ctx.lineTo(width * 0.5, height * 0.05);
			ctx.lineTo(width * 0.78, height * 0.14);
			ctx.lineTo(width * 0.98, height);
			ctx.stroke();

			frame++;
			animationId = requestAnimationFrame(draw);
		}

		function onMotionChange() {
			reducedMotion = motionQuery.matches;
		}

		resize();
		draw();
		window.addEventListener("resize", resize);
		motionQuery.addEventListener("change", onMotionChange);

		return () => {
			cancelAnimationFrame(animationId);
			window.removeEventListener("resize", resize);
			motionQuery.removeEventListener("change", onMotionChange);
		};
	}, [mode, pointerRef, trim.x, trim.y]);

	return (
		<canvas ref={canvasRef} className="space-lab-canvas" data-no-transition />
	);
}
