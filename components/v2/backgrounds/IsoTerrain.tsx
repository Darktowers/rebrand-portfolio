"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useThreeScene } from "./useThreeScene";

type Props = { accent: string; dark: boolean };

const vert = /* glsl */ `
	uniform float uTime;
	uniform float uSlow;
	varying float vHeight;
	float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
	float noise(vec2 p){
		vec2 i=floor(p), f=fract(p);
		vec2 u=f*f*(3.0-2.0*f);
		return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),u.x),
		           mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),u.x),u.y);
	}
	void main() {
		vec3 p = position;
		// travel scrolls the heightfield toward the camera → flying over terrain
		float travel = uTime * uSlow * 0.9;
		float h = noise(p.xy * 0.25 + vec2(0.0, travel));
		h += 0.5 * noise(p.xy * 0.6 + vec2(0.0, travel * 1.7));
		h /= 1.5;
		vHeight = h;
		p.z += h * 2.4;
		gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
	}
`;

const frag = /* glsl */ `
	precision highp float;
	uniform vec3 uAccent;
	uniform float uOpacity;
	varying float vHeight;
	void main() {
		// isolines: thin bands at regular height intervals
		float bands = fract(vHeight * 12.0);
		float line = smoothstep(0.0, 0.06, bands) * smoothstep(0.18, 0.06, bands);
		float glow = line * (0.4 + vHeight * 0.8);
		gl_FragColor = vec4(uAccent * glow, glow * uOpacity);
	}
`;

export default function IsoTerrain({ accent, dark }: Props) {
	const mountRef = useRef<HTMLDivElement>(null);

	useThreeScene(mountRef, {
		camera: { fov: 50, position: [0, 4.2, 7], lookAt: [0, 0, -2] },
		dependencies: [accent, dark],
		setup: ({ scene, camera, pointer, reduce }) => {
			const geo = new THREE.PlaneGeometry(30, 30, 200, 200);
			const mat = new THREE.ShaderMaterial({
				vertexShader: vert,
				fragmentShader: frag,
				uniforms: {
					uTime: { value: 0 },
					uSlow: { value: reduce ? 0.5 : 1 },
					uAccent: { value: new THREE.Color(accent) },
					uOpacity: { value: dark ? 0.9 : 0.7 },
				},
				transparent: true,
				blending: dark ? THREE.AdditiveBlending : THREE.NormalBlending,
				depthWrite: false,
				wireframe: false,
			});
			const mesh = new THREE.Mesh(geo, mat);
			mesh.rotation.x = -Math.PI / 2.1;
			scene.add(mesh);

			return {
				render: (_dt, elapsed) => {
					mat.uniforms.uTime.value = elapsed;
					camera.position.x += (pointer.x * 1.2 - camera.position.x) * 0.03;
					camera.lookAt(0, 0, -2);
				},
				dispose: () => {
					geo.dispose();
					mat.dispose();
				},
			};
		},
	});

	return (
		<div
			ref={mountRef}
			aria-hidden="true"
			data-no-transition
			style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
		/>
	);
}
