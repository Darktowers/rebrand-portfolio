"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = { accent: string; dark: boolean };

// Soft pixel sprite for stars (v0 handling).
function createPixelTexture() {
	const canvas = document.createElement("canvas");
	canvas.width = 64;
	canvas.height = 64;
	const ctx = canvas.getContext("2d");
	if (!ctx) return new THREE.CanvasTexture(canvas);
	ctx.clearRect(0, 0, 64, 64);
	ctx.fillStyle = "rgba(255,255,255,0.18)";
	ctx.fillRect(24, 24, 16, 16);
	ctx.fillStyle = "rgba(255,255,255,1)";
	ctx.fillRect(28, 28, 8, 8);
	const tex = new THREE.CanvasTexture(canvas);
	tex.needsUpdate = true;
	return tex;
}

const diskVert = /* glsl */ `
	varying float vRadius;
	varying float vAngle;
	void main() {
		vec3 p = position;
		vRadius = length(p.xy);
		vAngle = atan(p.y, p.x);
		gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
	}
`;

const diskFrag = /* glsl */ `
	precision highp float;
	uniform float uTime;
	uniform float uIntensity;
	uniform vec3 uColorHot;
	uniform vec3 uColorCool;
	uniform float uInner;
	uniform float uOuter;
	varying float vRadius;
	varying float vAngle;

	float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
	float noise(vec2 p){
		vec2 i=floor(p), f=fract(p);
		vec2 u=f*f*(3.0-2.0*f);
		return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),u.x),
		           mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),u.x),u.y);
	}

	void main() {
		float r = clamp((vRadius - uInner) / (uOuter - uInner), 0.0, 1.0);
		// Angular shear falls off faster with radius → outer edge moves slower.
		float spin = uTime * (0.4 / (vRadius * 2.2 + 0.2));
		float a = vAngle + spin;
		// Layered noise (extra fine octave) for crisper filament structure.
		float n = noise(vec2(a * 4.0, vRadius * 7.0 - uTime * 0.3));
		n += 0.5 * noise(vec2(a * 9.0, vRadius * 15.0 + uTime * 0.15));
		n += 0.25 * noise(vec2(a * 18.0, vRadius * 26.0));
		n /= 1.75;
		n = pow(n, 1.3); // contrast → sharper, more defined bands
		float edge = smoothstep(0.0, 0.08, r) * smoothstep(1.0, 0.45, r);
		float glow = edge * (0.32 + 0.72 * n);
		vec3 col = mix(uColorHot, uColorCool, pow(r, 0.5));
		float alpha = clamp(glow * uIntensity, 0.0, 1.0);
		gl_FragColor = vec4(col, alpha);
	}
`;

const ringFrag = /* glsl */ `
	precision highp float;
	uniform float uTime;
	uniform vec3 uAccent;
	varying float vRadius;
	varying float vAngle;
	void main() {
		// vRadius runs uInner..uOuter; normalize roughly to 0..1 across the thin ring
		float band = smoothstep(0.0, 0.5, vRadius) * smoothstep(1.0, 0.5, vRadius);
		float shimmer = 0.6 + 0.4 * sin(vAngle * 24.0 + uTime * 1.5);
		float a = band * shimmer;
		vec3 col = mix(uAccent, vec3(1.0), band * 0.1);
		gl_FragColor = vec4(col * a * 0.22, a * 0.26);
	}
`;

const pointVert = /* glsl */ `
	attribute float aSeed;
	varying float vGlow;
	void main() {
		vec4 mv = modelViewMatrix * vec4(position, 1.0);
		float dist = length(position.xy);
		// Glow peaks mid-fall and fades toward the horizon → no bright pile-up
		// at the center (keeps the core dark and the scene crisp).
		vGlow = smoothstep(3.2, 1.5, dist) * smoothstep(0.85, 1.5, dist);
		gl_PointSize = (1.2 + 2.8 * vGlow) * (300.0 / -mv.z);
		gl_Position = projectionMatrix * mv;
	}
`;

const pointFrag = /* glsl */ `
	precision highp float;
	uniform vec3 uAccent;
	varying float vGlow;
	void main() {
		vec2 c = gl_PointCoord - 0.5;
		float d = 1.0 - smoothstep(0.0, 0.5, length(c));
		gl_FragColor = vec4(mix(uAccent, vec3(1.0), vGlow * 0.3) * d, d * (0.22 + vGlow * 0.5));
	}
`;

export default function BlackHole({ accent, dark }: Props) {
	const mountRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const mount = mountRef.current;
		if (!mount) return;

		const reduce = window.matchMedia(
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
			45,
			window.innerWidth / window.innerHeight,
			0.1,
			100,
		);
		camera.position.set(0, 0, 10);

		const accentColor = new THREE.Color(accent);
		const hotColor = dark
			? new THREE.Color("#ff4d6a")
			: new THREE.Color("#ff7095");
		// Disk/ring use normal blending so rose stays rose (additive clips
		// to white). Particles stay additive for sparkle.
		const diskBlending = THREE.NormalBlending;
		const pointsBlending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
		const intensity = dark ? 0.95 : 0.85;

		// Tilted system group → flat ring reads as an ellipse with an open
		// dark core (the event horizon). Offset upper-right to keep the
		// left-aligned hero legible.
		const group = new THREE.Group();
		// Orientation: angled, near edge-on with a roll → reads as a disk in
		// 3D space rather than a flat ring.
		group.rotation.x = -0.8;
		group.rotation.z = 0.4;
		group.position.set(2.4, 1.4, 0);
		scene.add(group);

		// Event horizon (opaque, occludes particles behind it)
		const horizon = new THREE.Mesh(
			new THREE.SphereGeometry(0.92, 48, 48),
			new THREE.MeshBasicMaterial({
				color: dark ? 0x000000 : 0x140f1a,
			}),
		);
		group.add(horizon);

		// Accretion disk
		const diskGeo = new THREE.RingGeometry(1.3, 2.6, 160, 1);
		const diskMat = new THREE.ShaderMaterial({
			vertexShader: diskVert,
			fragmentShader: diskFrag,
			uniforms: {
				uTime: { value: 0 },
				uIntensity: { value: intensity },
				uInner: { value: 1.3 },
				uOuter: { value: 2.6 },
				uColorHot: { value: hotColor },
				uColorCool: { value: accentColor },
			},
			transparent: true,
			blending: diskBlending,
			depthWrite: false,
			side: THREE.DoubleSide,
		});
		const disk = new THREE.Mesh(diskGeo, diskMat);
		group.add(disk);

		// Lensing shimmer ring
		const ringGeo = new THREE.RingGeometry(0.95, 1.22, 160, 1);
		const ringMat = new THREE.ShaderMaterial({
			vertexShader: diskVert,
			fragmentShader: ringFrag,
			uniforms: {
				uTime: { value: 0 },
				uAccent: { value: accentColor },
			},
			transparent: true,
			blending: pointsBlending,
			depthWrite: false,
			side: THREE.DoubleSide,
		});
		const ring = new THREE.Mesh(ringGeo, ringMat);
		group.add(ring);

		// Particle infall
		const COUNT = 450;
		const positions = new Float32Array(COUNT * 3);
		const angle = new Float32Array(COUNT);
		const radius = new Float32Array(COUNT);
		const speed = new Float32Array(COUNT);
		const seed = new Float32Array(COUNT);
		const R_SPAWN = 3.2;
		const R_DEATH = 0.95;
		const spawn = (i: number) => {
			angle[i] = Math.random() * Math.PI * 2;
			radius[i] = R_DEATH + Math.random() * (R_SPAWN - R_DEATH);
			speed[i] = 0.15 + Math.random() * 0.25;
			seed[i] = Math.random();
		};
		for (let i = 0; i < COUNT; i++) spawn(i);
		const pointsGeo = new THREE.BufferGeometry();
		pointsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
		pointsGeo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
		const pointsMat = new THREE.ShaderMaterial({
			vertexShader: pointVert,
			fragmentShader: pointFrag,
			uniforms: { uAccent: { value: accentColor } },
			transparent: true,
			blending: pointsBlending,
			depthWrite: false,
			depthTest: false,
		});
		const points = new THREE.Points(pointsGeo, pointsMat);
		group.add(points);

		let steerX = 0;
		let steerY = 0;
		const pixelTexture = createPixelTexture();

		// ── Warp starfield (v0 handling) ──
		// Depth-graded frustum: far stars cluster near the axis, near stars
		// spread wide → proper warp-tunnel perspective. Vertex-colored soft
		// sprites stream down -z toward the camera. The hole is a separate
		// object you fly past, NOT the source of the stars.
		const starBright = new THREE.Color(dark ? "#ffe7ee" : "#f43f5e");
		const starAccent2 = new THREE.Color(dark ? "#ff9bb3" : "#be123c");
		const starCount = dark ? 1700 : 1000;
		const starGeometry = new THREE.BufferGeometry();
		const starPositions = new Float32Array(starCount * 3);
		const starColors = new Float32Array(starCount * 3);
		const starSpeeds = new Float32Array(starCount);
		for (let i = 0; i < starCount; i++) {
			const depth = Math.random();
			const spread = 2.4 + depth * 30;
			starPositions[i * 3] = (Math.random() - 0.5) * spread;
			starPositions[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.66;
			starPositions[i * 3 + 2] = -Math.random() * 120 - 4;
			starSpeeds[i] = Math.random() * 0.4 + 0.28;
			const c =
				Math.random() > 0.86
					? starBright
					: Math.random() > 0.52
						? starAccent2
						: accentColor;
			starColors[i * 3] = c.r;
			starColors[i * 3 + 1] = c.g;
			starColors[i * 3 + 2] = c.b;
		}
		starGeometry.setAttribute(
			"position",
			new THREE.BufferAttribute(starPositions, 3),
		);
		starGeometry.setAttribute(
			"color",
			new THREE.BufferAttribute(starColors, 3),
		);
		const starMaterial = new THREE.PointsMaterial({
			map: pixelTexture,
			size: 0.12,
			sizeAttenuation: true,
			vertexColors: true,
			transparent: true,
			opacity: dark ? 0.9 : 0.6,
			alphaTest: 0.06,
			blending: pointsBlending,
			depthWrite: false,
		});
		const stars = new THREE.Points(starGeometry, starMaterial);
		scene.add(stars);

		// ── Warp streaks (v0 handling) ── tails ∝ speed × warp, stream down -z.
		const streakCount = dark ? 320 : 180;
		const streakSeeds = Array.from({ length: streakCount }, () => ({
			x: (Math.random() - 0.5) * 24,
			y: (Math.random() - 0.5) * 14,
			z: -Math.random() * 100 - 3,
			speed: Math.random() * 0.5 + 0.4,
		}));
		const streakPositions = new Float32Array(streakCount * 6);
		const streakGeometry = new THREE.BufferGeometry();
		streakGeometry.setAttribute(
			"position",
			new THREE.BufferAttribute(streakPositions, 3),
		);
		const streakMaterial = new THREE.LineBasicMaterial({
			color: new THREE.Color(dark ? "#ff6a86" : accent),
			transparent: true,
			opacity: dark ? 0.4 : 0.28,
			blending: pointsBlending,
			depthWrite: false,
		});
		const streaks = new THREE.LineSegments(streakGeometry, streakMaterial);
		scene.add(streaks);

		const updateParticles = (dt: number, slow: number) => {
			for (let i = 0; i < COUNT; i++) {
				radius[i] -= speed[i] * dt * slow * (0.4 + 0.9 / radius[i]);
				angle[i] += dt * slow * (0.6 + 1.8 / radius[i]);
				if (radius[i] <= R_DEATH) spawn(i);
				const r = radius[i];
				positions[3 * i] = Math.cos(angle[i]) * r;
				positions[3 * i + 1] = Math.sin(angle[i]) * r;
				positions[3 * i + 2] = (seed[i] - 0.5) * 0.12;
			}
			pointsGeo.attributes.position.needsUpdate = true;
		};
		updateParticles(0, 1); // seed initial positions

		const clock = new THREE.Clock();
		const pointer = new THREE.Vector2(0, 0);
		// Reduced motion → gentle drift, not a full freeze (matches v0 feel).
		const slow = reduce ? 0.5 : 1;
		let raf = 0;
		let running = true;

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
			const t = clock.elapsedTime;
			// Hole churns very slowly; it is a distant destination.
			diskMat.uniforms.uTime.value = t * 0.18;
			ringMat.uniforms.uTime.value = t * 0.18;
			// Game-like piloting: cursor steers + accelerates the warp (v0 feel).
			steerX += (pointer.x - steerX) * 0.04;
			steerY += (pointer.y - steerY) * 0.04;
			const warp =
				slow * (1.15 + Math.abs(steerX) * 0.5 + Math.abs(steerY) * 0.22);

			// Stars stream down the tunnel toward the camera (v0 handling).
			const sp = starGeometry.attributes.position.array as Float32Array;
			for (let i = 0; i < starCount; i++) {
				const zi = i * 3 + 2;
				sp[zi] += starSpeeds[i] * warp;
				sp[i * 3] += steerX * 0.014;
				sp[i * 3 + 1] -= steerY * 0.012;
				if (sp[zi] > 11) {
					const depth = Math.random();
					const spread = 2.4 + depth * 30;
					sp[i * 3] = (Math.random() - 0.5) * spread;
					sp[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.66;
					sp[zi] = -120;
				}
			}
			starGeometry.attributes.position.needsUpdate = true;

			// Streaks with tails ∝ speed × warp (v0 handling).
			for (let i = 0; i < streakCount; i++) {
				const s = streakSeeds[i];
				s.z += s.speed * warp;
				s.x += steerX * 0.034;
				s.y -= steerY * 0.02;
				if (s.z > 11) {
					s.x = (Math.random() - 0.5) * 24;
					s.y = (Math.random() - 0.5) * 14;
					s.z = -100;
					s.speed = Math.random() * 0.5 + 0.4;
				}
				const tail = 2.4 + s.speed * 5.8 * warp;
				const k = i * 6;
				streakPositions[k] = s.x;
				streakPositions[k + 1] = s.y;
				streakPositions[k + 2] = s.z;
				streakPositions[k + 3] = s.x - steerX * 0.28;
				streakPositions[k + 4] = s.y + steerY * 0.18;
				streakPositions[k + 5] = s.z - tail;
			}
			streakGeometry.attributes.position.needsUpdate = true;

			// Fake an approach over a massive time/distance: the hole eases
			// closer asymptotically (gets bigger, but never arrives). Starts
			// small. Everything about the hole stays very slow.
			const approach = 0.74 * (1 + 0.26 * (1 - Math.exp(-t / 240)));
			group.scale.setScalar(approach);
			group.rotation.z += dt * slow * 0.005;
			updateParticles(dt, slow * 0.6);

			const roll = -steerX * 0.1;
			camera.up.set(Math.sin(roll), Math.cos(roll), 0);
			camera.position.x += (steerX * 0.8 - camera.position.x) * 0.04;
			camera.position.y += (-steerY * 0.56 - camera.position.y) * 0.04;
			camera.lookAt(steerX * 1.8, -steerY * 1.1, -22);
			renderer.render(scene, camera);
		};
		const onVisibility = () => {
			running = !document.hidden;
			if (running) {
				clock.start();
				loop();
			} else {
				cancelAnimationFrame(raf);
			}
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
			horizon.geometry.dispose();
			(horizon.material as THREE.Material).dispose();
			diskGeo.dispose();
			diskMat.dispose();
			ringGeo.dispose();
			ringMat.dispose();
			pointsGeo.dispose();
			pointsMat.dispose();
			starGeometry.dispose();
			starMaterial.dispose();
			pixelTexture.dispose();
			streakGeometry.dispose();
			streakMaterial.dispose();
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
