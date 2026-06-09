"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = { accent: string; dark: boolean };

const vert = /* glsl */ `
	attribute float aSeed;
	varying float vSeed;
	void main() {
		vSeed = aSeed;
		vec4 mv = modelViewMatrix * vec4(position, 1.0);
		gl_PointSize = (0.6 + 1.3 * aSeed) * (180.0 / -mv.z);
		gl_Position = projectionMatrix * mv;
	}
`;

const frag = /* glsl */ `
	precision highp float;
	uniform vec3 uAccent;
	varying float vSeed;
	void main() {
		vec2 c = gl_PointCoord - 0.5;
		float d = 1.0 - smoothstep(0.0, 0.5, length(c));
		gl_FragColor = vec4(mix(uAccent, vec3(1.0), vSeed * 0.25), d * (0.16 + vSeed * 0.2));
	}
`;

export default function FlowField({ accent, dark }: Props) {
	const mountRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const mount = mountRef.current;
		if (!mount) return;
		const reduce = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		let renderer: THREE.WebGLRenderer;
		try {
			renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
		} catch {
			return;
		}
		renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setClearColor(0x000000, 0);
		mount.appendChild(renderer.domElement);

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(
			55,
			window.innerWidth / window.innerHeight,
			0.1,
			100,
		);
		camera.position.set(0, 0, 9);

		const COUNT = 1500;
		const BOUND = 13;
		const positions = new Float32Array(COUNT * 3);
		const seed = new Float32Array(COUNT);
		const Z_FAR = -16;
		const Z_NEAR = 7;
		for (let i = 0; i < COUNT; i++) {
			positions[3 * i] = (Math.random() - 0.5) * BOUND * 2;
			positions[3 * i + 1] = (Math.random() - 0.5) * BOUND * 1.3;
			positions[3 * i + 2] = Z_FAR + Math.random() * (Z_NEAR - Z_FAR);
			seed[i] = Math.random();
		}
		const geo = new THREE.BufferGeometry();
		geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
		geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
		const mat = new THREE.ShaderMaterial({
			vertexShader: vert,
			fragmentShader: frag,
			uniforms: { uAccent: { value: new THREE.Color(accent) } },
			transparent: true,
			blending: dark ? THREE.AdditiveBlending : THREE.NormalBlending,
			depthWrite: false,
		});
		const points = new THREE.Points(geo, mat);
		scene.add(points);

		const clock = new THREE.Clock();
		const pointer = new THREE.Vector2(0, 0);
		const slow = reduce ? 0.5 : 1;
		let raf = 0;
		let running = true;

		const advect = (dt: number, t: number) => {
			for (let i = 0; i < COUNT; i++) {
				const x = positions[3 * i];
				const y = positions[3 * i + 1];
				// cheap curl-ish flow field
				const ang =
					(Math.sin(x * 0.32 + t * 0.18) + Math.cos(y * 0.34 - t * 0.14)) *
					Math.PI;
				const sp = (0.3 + seed[i] * 0.5) * dt * slow;
				positions[3 * i] += Math.cos(ang) * sp;
				positions[3 * i + 1] += Math.sin(ang) * sp;
				// forward travel toward camera → flythrough feel
				positions[3 * i + 2] += (3.0 + seed[i] * 5.0) * dt * slow;
				if (positions[3 * i + 2] > Z_NEAR) {
					positions[3 * i] = (Math.random() - 0.5) * BOUND * 2;
					positions[3 * i + 1] = (Math.random() - 0.5) * BOUND * 1.3;
					positions[3 * i + 2] = Z_FAR;
				}
				// wrap
				if (positions[3 * i] > BOUND) positions[3 * i] = -BOUND;
				if (positions[3 * i] < -BOUND) positions[3 * i] = BOUND;
				if (positions[3 * i + 1] > BOUND) positions[3 * i + 1] = -BOUND;
				if (positions[3 * i + 1] < -BOUND) positions[3 * i + 1] = BOUND;
			}
			geo.attributes.position.needsUpdate = true;
		};
		advect(0, 0);

		const onMove = (e: PointerEvent) => {
			pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
			pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
		};
		const onResize = () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		};
		const loop = () => {
			if (!running) return;
			raf = requestAnimationFrame(loop);
			const dt = Math.min(clock.getDelta(), 0.05);
			advect(dt, clock.elapsedTime);
			camera.position.x += (pointer.x * 0.8 - camera.position.x) * 0.03;
			camera.position.y += (-pointer.y * 0.5 - camera.position.y) * 0.03;
			camera.lookAt(0, 0, 0);
			renderer.render(scene, camera);
		};
		const onVisibility = () => {
			running = !document.hidden;
			if (running) {
				clock.start();
				loop();
			} else cancelAnimationFrame(raf);
		};

		window.addEventListener("pointermove", onMove, { passive: true });
		window.addEventListener("resize", onResize);
		document.addEventListener("visibilitychange", onVisibility);
		loop();

		return () => {
			running = false;
			cancelAnimationFrame(raf);
			window.removeEventListener("pointermove", onMove);
			window.removeEventListener("resize", onResize);
			document.removeEventListener("visibilitychange", onVisibility);
			geo.dispose();
			mat.dispose();
			renderer.dispose();
			renderer.forceContextLoss();
			renderer.domElement.remove();
		};
	}, [accent, dark]);

	return (
		<div
			ref={mountRef}
			aria-hidden="true"
			data-no-transition
			style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
		/>
	);
}
