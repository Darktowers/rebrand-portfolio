"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type Vector2 = { x: number; y: number };

type ProceduralSpaceThreeProps = {
	pointerRef: React.RefObject<Vector2>;
	trim: Vector2;
};

type StreakSeed = {
	x: number;
	y: number;
	z: number;
	speed: number;
};

type SignalSeed = {
	x: number;
	y: number;
	z: number;
	speed: number;
	wave: number;
};

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
		context.fillStyle = "rgba(120, 240, 255, 0.16)";
		context.fillRect(24, 24, 16, 16);
		context.fillStyle = "rgba(220, 250, 255, 1)";
		context.fillRect(28, 28, 8, 8);
	} else {
		context.fillStyle = "rgba(110, 240, 255, 0.18)";
		context.fillRect(22, 16, 20, 8);
		context.fillRect(22, 40, 20, 8);
		context.fillStyle = "rgba(226, 251, 255, 0.9)";
		context.fillRect(26, 20, 12, 4);
		context.fillRect(26, 44, 12, 4);
	}

	const texture = new THREE.CanvasTexture(canvas);
	texture.needsUpdate = true;
	return texture;
}

export default function ProceduralSpaceThree({
	pointerRef,
	trim,
}: ProceduralSpaceThreeProps) {
	const mountRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const mount = mountRef.current;
		if (!mount) return;

		const reducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
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
		const accent = new THREE.Color("#7bf0ff");
		const accent2 = new THREE.Color("#8eb0ff");
		const white = new THREE.Color("#effcff");

		const starCount = 2400;
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
				Math.random() > 0.86 ? white : Math.random() > 0.52 ? accent2 : accent;
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
				opacity: 0.94,
				alphaTest: 0.08,
				blending: THREE.AdditiveBlending,
				depthWrite: false,
			}),
		);
		scene.add(stars);

		const signalCount = 680;
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
				color: new THREE.Color("#8feeff"),
				transparent: true,
				opacity: 0.24,
				alphaTest: 0.08,
				depthWrite: false,
			}),
		);
		scene.add(signalField);

		const streakCount = 760;
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
				color: new THREE.Color("#7defff"),
				transparent: true,
				opacity: 0.32,
				blending: THREE.AdditiveBlending,
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
			const targetX = Math.max(
				-1,
				Math.min(1, pointer.x * 0.72 + trim.x * 0.96),
			);
			const targetY = Math.max(
				-1,
				Math.min(1, pointer.y * 0.72 + trim.y * 0.96),
			);
			steerX += (targetX - steerX) * 0.042;
			steerY += (targetY - steerY) * 0.042;
			const warp = reducedMotion
				? 0.68
				: 1.4 + Math.abs(steerX) * 0.62 + Math.abs(steerY) * 0.26;

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
				seed.z += seed.speed * (reducedMotion ? 0.52 : 0.9 + warp * 0.18);
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

			camera.position.x = steerX * 0.96;
			camera.position.y = -steerY * 0.68;
			camera.lookAt(steerX * 2.2, -steerY * 1.3, -22);

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
	}, [pointerRef, trim.x, trim.y]);

	return <div ref={mountRef} className="space-lab-three" data-no-transition />;
}
