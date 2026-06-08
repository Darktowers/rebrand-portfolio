"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type Vector2 = { x: number; y: number };

type Palette = {
	accent: THREE.Color;
	accent2: THREE.Color;
	bright: THREE.Color;
	streak: THREE.Color;
	signal: THREE.Color;
	blending: THREE.Blending;
	starOpacity: number;
	signalOpacity: number;
	streakOpacity: number;
};

type SignalSeed = {
	x: number;
	y: number;
	z: number;
	speed: number;
	wave: number;
};

type StreakSeed = {
	x: number;
	y: number;
	z: number;
	speed: number;
};

function getPalette(isDark: boolean): Palette {
	if (isDark) {
		return {
			accent: new THREE.Color("#7bf0ff"),
			accent2: new THREE.Color("#8eb0ff"),
			bright: new THREE.Color("#effcff"),
			streak: new THREE.Color("#7defff"),
			signal: new THREE.Color("#8feeff"),
			blending: THREE.AdditiveBlending,
			starOpacity: 0.9,
			signalOpacity: 0.22,
			streakOpacity: 0.3,
		};
	}
	// Light theme — brand pink, normal blending so particles read on white.
	return {
		accent: new THREE.Color("#f2199c"),
		accent2: new THREE.Color("#b5179e"),
		bright: new THREE.Color("#7a0f54"),
		streak: new THREE.Color("#d11a8c"),
		signal: new THREE.Color("#e23aa3"),
		blending: THREE.NormalBlending,
		starOpacity: 0.55,
		signalOpacity: 0.16,
		streakOpacity: 0.22,
	};
}

function createPointTexture(kind: "pixel" | "signal") {
	const canvas = document.createElement("canvas");
	canvas.width = 64;
	canvas.height = 64;
	const context = canvas.getContext("2d");
	if (!context) {
		return new THREE.CanvasTexture(canvas);
	}

	context.clearRect(0, 0, 64, 64);

	if (kind === "pixel") {
		context.fillStyle = "rgba(255, 255, 255, 0.16)";
		context.fillRect(24, 24, 16, 16);
		context.fillStyle = "rgba(255, 255, 255, 1)";
		context.fillRect(28, 28, 8, 8);
	} else {
		context.fillStyle = "rgba(255, 255, 255, 0.18)";
		context.fillRect(22, 16, 20, 8);
		context.fillRect(22, 40, 20, 8);
		context.fillStyle = "rgba(255, 255, 255, 0.9)";
		context.fillRect(26, 20, 12, 4);
		context.fillRect(26, 44, 12, 4);
	}

	const texture = new THREE.CanvasTexture(canvas);
	texture.needsUpdate = true;
	return texture;
}

export default function WarpBackground() {
	const mountRef = useRef<HTMLDivElement>(null);
	const pointerRef = useRef<Vector2>({ x: 0, y: 0 });
	const pathname = usePathname();
	const isSpaceLab = /^\/v[123](\/|$)/.test(pathname);

	const [isDark, setIsDark] = useState(true);

	// Track theme live from the <html> class (same approach as AsciiBackground).
	useEffect(() => {
		if (isSpaceLab) return;
		const root = document.documentElement;
		const sync = () => setIsDark(root.classList.contains("dark"));
		sync();
		const observer = new MutationObserver(sync);
		observer.observe(root, { attributes: true, attributeFilter: ["class"] });
		return () => observer.disconnect();
	}, [isSpaceLab]);

	// Window-level pointer steering — gentle, no trim pad.
	useEffect(() => {
		if (isSpaceLab) return;
		const onMove = (event: PointerEvent) => {
			const x = (event.clientX / window.innerWidth) * 2 - 1;
			const y = (event.clientY / window.innerHeight) * 2 - 1;
			pointerRef.current.x = Math.max(-1, Math.min(1, x));
			pointerRef.current.y = Math.max(-1, Math.min(1, y));
		};
		window.addEventListener("pointermove", onMove);
		return () => window.removeEventListener("pointermove", onMove);
	}, [isSpaceLab]);

	useEffect(() => {
		if (isSpaceLab) return;
		const mount = mountRef.current;
		if (!mount) return;

		const reducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		const palette = getPalette(isDark);
		let renderer: THREE.WebGLRenderer;

		try {
			renderer = new THREE.WebGLRenderer({
				alpha: true,
				antialias: true,
				powerPreference: "high-performance",
			});
		} catch {
			return;
		}

		renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setClearColor(0x000000, 0);
		mount.appendChild(renderer.domElement);

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(
			60,
			window.innerWidth / window.innerHeight,
			0.1,
			160,
		);
		camera.position.set(0, 0, 7.2);

		const pixelTexture = createPointTexture("pixel");
		const signalTexture = createPointTexture("signal");

		// ── Star field ──────────────────────────────────────────────
		const starCount = 2200;
		const starGeometry = new THREE.BufferGeometry();
		const starPositions = new Float32Array(starCount * 3);
		const starColors = new Float32Array(starCount * 3);
		const starSpeeds = new Float32Array(starCount);

		for (let i = 0; i < starCount; i++) {
			const depth = Math.random();
			const spread = 2.4 + depth * 30;
			starPositions[i * 3] = (Math.random() - 0.5) * spread;
			starPositions[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.66;
			starPositions[i * 3 + 2] = -Math.random() * 110 - 4;
			starSpeeds[i] = Math.random() * 0.44 + 0.34;
			const color =
				Math.random() > 0.86
					? palette.bright
					: Math.random() > 0.52
						? palette.accent2
						: palette.accent;
			starColors[i * 3] = color.r;
			starColors[i * 3 + 1] = color.g;
			starColors[i * 3 + 2] = color.b;
		}

		starGeometry.setAttribute(
			"position",
			new THREE.BufferAttribute(starPositions, 3),
		);
		starGeometry.setAttribute(
			"color",
			new THREE.BufferAttribute(starColors, 3),
		);

		const stars = new THREE.Points(
			starGeometry,
			new THREE.PointsMaterial({
				map: pixelTexture,
				size: 0.11,
				sizeAttenuation: true,
				vertexColors: true,
				transparent: true,
				opacity: palette.starOpacity,
				alphaTest: 0.08,
				blending: palette.blending,
				depthWrite: false,
			}),
		);
		scene.add(stars);

		// ── Signal field ────────────────────────────────────────────
		const signalCount = 620;
		const signalSeeds: SignalSeed[] = Array.from(
			{ length: signalCount },
			() => ({
				x: (Math.random() - 0.5) * 18,
				y: (Math.random() - 0.5) * 10,
				z: -Math.random() * 78 - 6,
				speed: Math.random() * 0.18 + 0.12,
				wave: Math.random() * Math.PI * 2,
			}),
		);
		const signalGeometry = new THREE.BufferGeometry();
		const signalPositions = new Float32Array(signalCount * 3);
		for (let i = 0; i < signalCount; i++) {
			const seed = signalSeeds[i];
			signalPositions[i * 3] = seed.x;
			signalPositions[i * 3 + 1] = seed.y;
			signalPositions[i * 3 + 2] = seed.z;
		}
		signalGeometry.setAttribute(
			"position",
			new THREE.BufferAttribute(signalPositions, 3),
		);

		const signalField = new THREE.Points(
			signalGeometry,
			new THREE.PointsMaterial({
				map: signalTexture,
				size: 0.22,
				sizeAttenuation: true,
				color: palette.signal,
				transparent: true,
				opacity: palette.signalOpacity,
				alphaTest: 0.08,
				blending: palette.blending,
				depthWrite: false,
			}),
		);
		scene.add(signalField);

		// ── Warp streaks ────────────────────────────────────────────
		const streakCount = 700;
		const streakSeeds: StreakSeed[] = Array.from(
			{ length: streakCount },
			() => ({
				x: (Math.random() - 0.5) * 24,
				y: (Math.random() - 0.5) * 14,
				z: -Math.random() * 90 - 3,
				speed: Math.random() * 0.62 + 0.48,
			}),
		);
		const streakGeometry = new THREE.BufferGeometry();
		const streakPositions = new Float32Array(streakCount * 6);
		streakGeometry.setAttribute(
			"position",
			new THREE.BufferAttribute(streakPositions, 3),
		);
		const streaks = new THREE.LineSegments(
			streakGeometry,
			new THREE.LineBasicMaterial({
				color: palette.streak,
				transparent: true,
				opacity: palette.streakOpacity,
				blending: palette.blending,
				depthWrite: false,
			}),
		);
		scene.add(streaks);

		const clock = new THREE.Clock();
		let animationId = 0;
		let steerX = 0;
		let steerY = 0;

		function resize() {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		}

		function animate() {
			const t = clock.getElapsedTime();
			const pointer = pointerRef.current;
			// Gentle steering for a background — less than the interactive lab.
			const targetX = Math.max(-1, Math.min(1, pointer.x * 0.5));
			const targetY = Math.max(-1, Math.min(1, pointer.y * 0.5));
			steerX += (targetX - steerX) * 0.04;
			steerY += (targetY - steerY) * 0.04;
			const warp = reducedMotion
				? 0.5
				: 1.15 + Math.abs(steerX) * 0.5 + Math.abs(steerY) * 0.22;

			const starPositionAttribute = starGeometry.attributes.position
				.array as Float32Array;
			for (let i = 0; i < starCount; i++) {
				const xIndex = i * 3;
				const yIndex = xIndex + 1;
				const zIndex = xIndex + 2;
				starPositionAttribute[zIndex] += starSpeeds[i] * warp;
				starPositionAttribute[xIndex] += steerX * 0.014;
				starPositionAttribute[yIndex] -= steerY * 0.012;
				if (starPositionAttribute[zIndex] > 10) {
					const depth = Math.random();
					const spread = 2.4 + depth * 30;
					starPositionAttribute[xIndex] = (Math.random() - 0.5) * spread;
					starPositionAttribute[yIndex] = (Math.random() - 0.5) * spread * 0.66;
					starPositionAttribute[zIndex] = -110;
				}
			}
			starGeometry.attributes.position.needsUpdate = true;

			const signalPositionAttribute = signalGeometry.attributes.position
				.array as Float32Array;
			for (let i = 0; i < signalCount; i++) {
				const seed = signalSeeds[i];
				seed.z += seed.speed * (reducedMotion ? 0.42 : 0.78 + warp * 0.16);
				seed.x += steerX * 0.008;
				seed.y -= steerY * 0.006;
				const driftX = Math.sin(t * 0.9 + seed.wave) * 0.02;
				const driftY = Math.cos(t * 0.7 + seed.wave) * 0.016;

				if (seed.z > 9) {
					seed.x = (Math.random() - 0.5) * 18;
					seed.y = (Math.random() - 0.5) * 10;
					seed.z = -78;
					seed.speed = Math.random() * 0.18 + 0.12;
					seed.wave = Math.random() * Math.PI * 2;
				}

				signalPositionAttribute[i * 3] = seed.x + driftX;
				signalPositionAttribute[i * 3 + 1] = seed.y + driftY;
				signalPositionAttribute[i * 3 + 2] = seed.z;
			}
			signalGeometry.attributes.position.needsUpdate = true;

			for (let i = 0; i < streakCount; i++) {
				const seed = streakSeeds[i];
				seed.z += seed.speed * warp;
				seed.x += steerX * 0.034;
				seed.y -= steerY * 0.02;
				if (seed.z > 10) {
					seed.x = (Math.random() - 0.5) * 24;
					seed.y = (Math.random() - 0.5) * 14;
					seed.z = -90;
					seed.speed = Math.random() * 0.62 + 0.48;
				}

				const tail = 2.4 + seed.speed * 5.8 * warp;
				const index = i * 6;
				streakPositions[index] = seed.x;
				streakPositions[index + 1] = seed.y;
				streakPositions[index + 2] = seed.z;
				streakPositions[index + 3] = seed.x - steerX * 0.28;
				streakPositions[index + 4] = seed.y + steerY * 0.18;
				streakPositions[index + 5] = seed.z - tail;
			}
			streakGeometry.attributes.position.needsUpdate = true;

			camera.position.x = steerX * 0.8;
			camera.position.y = -steerY * 0.56;
			camera.lookAt(steerX * 1.8, -steerY * 1.1, -22);

			renderer.render(scene, camera);
			animationId = requestAnimationFrame(animate);
		}

		resize();
		animate();
		window.addEventListener("resize", resize);

		return () => {
			cancelAnimationFrame(animationId);
			window.removeEventListener("resize", resize);
			starGeometry.dispose();
			(stars.material as THREE.Material).dispose();
			signalGeometry.dispose();
			(signalField.material as THREE.Material).dispose();
			streakGeometry.dispose();
			(streaks.material as THREE.Material).dispose();
			pixelTexture.dispose();
			signalTexture.dispose();
			renderer.dispose();
			renderer.domElement.remove();
		};
	}, [isSpaceLab, isDark]);

	if (isSpaceLab) return null;

	return <div ref={mountRef} id="warp-bg" data-no-transition />;
}
