"use client";

import { type DependencyList, type RefObject, useEffect } from "react";
import * as THREE from "three";
import { createSteeringInput } from "./steeringInput";

type CameraOptions = {
	fov: number;
	near?: number;
	far?: number;
	position: [number, number, number];
	lookAt?: [number, number, number];
};

type RuntimeContext = {
	mount: HTMLDivElement;
	renderer: THREE.WebGLRenderer;
	scene: THREE.Scene;
	camera: THREE.PerspectiveCamera;
	clock: THREE.Clock;
	pointer: THREE.Vector2;
	reduce: boolean;
};

type SceneHandle = {
	render: (dt: number, elapsed: number) => void;
	resize?: () => void;
	dispose?: () => void;
};

type Options = {
	camera: CameraOptions;
	renderer?: THREE.WebGLRendererParameters;
	steering?: boolean;
	setup: (context: RuntimeContext) => SceneHandle;
	dependencies: DependencyList;
};

export function useThreeScene(
	mountRef: RefObject<HTMLDivElement | null>,
	{
		camera: cameraOptions,
		renderer: rendererOptions,
		steering = true,
		setup,
		dependencies,
	}: Options,
) {
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
				...rendererOptions,
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
			cameraOptions.fov,
			window.innerWidth / window.innerHeight,
			cameraOptions.near ?? 0.1,
			cameraOptions.far ?? 100,
		);
		camera.position.set(...cameraOptions.position);
		if (cameraOptions.lookAt) {
			camera.lookAt(...cameraOptions.lookAt);
		}

		const clock = new THREE.Clock();
		const pointer = new THREE.Vector2(0, 0);
		const destroySteeringInput = steering
			? createSteeringInput(pointer, { enableOrientation: !reduce })
			: undefined;

		let handle: SceneHandle;
		try {
			handle = setup({
				mount,
				renderer,
				scene,
				camera,
				clock,
				pointer,
				reduce,
			});
		} catch (error) {
			destroySteeringInput?.();
			renderer.dispose();
			renderer.forceContextLoss();
			renderer.domElement.remove();
			throw error;
		}

		let raf = 0;
		let running = true;

		const onResize = () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
			handle.resize?.();
		};

		const loop = () => {
			if (!running) return;
			raf = requestAnimationFrame(loop);
			handle.render(Math.min(clock.getDelta(), 0.05), clock.elapsedTime);
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

		window.addEventListener("resize", onResize);
		document.addEventListener("visibilitychange", onVisibility);
		loop();

		return () => {
			running = false;
			cancelAnimationFrame(raf);
			destroySteeringInput?.();
			window.removeEventListener("resize", onResize);
			document.removeEventListener("visibilitychange", onVisibility);
			handle.dispose?.();
			renderer.dispose();
			renderer.forceContextLoss();
			renderer.domElement.remove();
		};
		// biome-ignore lint/correctness/useExhaustiveDependencies: Scene adapters pass the dependency list that should rebuild this runtime.
	}, dependencies);
}
