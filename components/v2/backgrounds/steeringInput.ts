"use client";

type SteeringTarget = {
	x: number;
	y: number;
};

type PermissionedOrientationEvent = typeof DeviceOrientationEvent & {
	requestPermission?: () => Promise<PermissionState>;
};

type PermissionedMotionEvent = typeof DeviceMotionEvent & {
	requestPermission?: () => Promise<PermissionState>;
};

type Options = {
	enableOrientation?: boolean;
	tiltXDivisor?: number;
	tiltYDivisor?: number;
};

let orientationPermissionGranted = false;
let orientationPermissionRequest: Promise<PermissionState> | null = null;
let motionPermissionGranted = false;
let motionPermissionRequest: Promise<PermissionState> | null = null;

const clamp = (value: number, min: number, max: number) =>
	Math.min(max, Math.max(min, value));

function requestSharedOrientationPermission(
	OrientationEvent: PermissionedOrientationEvent,
) {
	orientationPermissionRequest ??=
		OrientationEvent.requestPermission?.()
			.then((permission) => {
				orientationPermissionGranted = permission === "granted";
				return permission;
			})
			.catch((error: unknown) => {
				orientationPermissionRequest = null;
				throw error;
			}) ?? Promise.resolve("granted" as PermissionState);

	return orientationPermissionRequest;
}

function requestSharedMotionPermission(MotionEvent: PermissionedMotionEvent) {
	motionPermissionRequest ??=
		MotionEvent.requestPermission?.()
			.then((permission) => {
				motionPermissionGranted = permission === "granted";
				return permission;
			})
			.catch((error: unknown) => {
				motionPermissionRequest = null;
				throw error;
			}) ?? Promise.resolve("granted" as PermissionState);

	return motionPermissionRequest;
}

export function createSteeringInput(
	target: SteeringTarget,
	{
		enableOrientation = true,
		tiltXDivisor = 24,
		tiltYDivisor = 34,
	}: Options = {},
) {
	const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
	const canUseDeviceSteering = enableOrientation && coarsePointer;
	const canUseOrientation =
		canUseDeviceSteering && "DeviceOrientationEvent" in window;
	const canUseMotion = canUseDeviceSteering && "DeviceMotionEvent" in window;
	const OrientationEvent = canUseOrientation
		? (window.DeviceOrientationEvent as PermissionedOrientationEvent)
		: undefined;
	const MotionEvent = canUseMotion
		? (window.DeviceMotionEvent as PermissionedMotionEvent)
		: undefined;

	let baselineBeta: number | null = null;
	let baselineGamma: number | null = null;
	let baselineMotionX: number | null = null;
	let baselineMotionY: number | null = null;
	let orientationActive = false;
	let orientationListening = false;
	let motionListening = false;
	let permissionRequested = false;

	const onPointerMove = (event: PointerEvent) => {
		target.x = (event.clientX / window.innerWidth) * 2 - 1;
		target.y = (event.clientY / window.innerHeight) * 2 - 1;
	};

	const onOrientation = (event: DeviceOrientationEvent) => {
		if (event.beta == null || event.gamma == null) return;

		orientationActive = true;
		baselineBeta ??= event.beta;
		baselineGamma ??= event.gamma;

		target.x = clamp((event.gamma - baselineGamma) / tiltXDivisor, -1, 1);
		target.y = clamp((event.beta - baselineBeta) / tiltYDivisor, -1, 1);
	};

	const onMotion = (event: DeviceMotionEvent) => {
		if (orientationActive) return;

		const acceleration = event.accelerationIncludingGravity;
		if (acceleration?.x == null || acceleration.y == null) return;

		baselineMotionX ??= acceleration.x;
		baselineMotionY ??= acceleration.y;

		target.x = clamp((acceleration.x - baselineMotionX) / 5, -1, 1);
		target.y = clamp((acceleration.y - baselineMotionY) / 7, -1, 1);
	};

	const addOrientationListener = () => {
		if (!canUseOrientation || orientationListening) return;
		window.addEventListener("deviceorientation", onOrientation, {
			passive: true,
		});
		orientationListening = true;
	};

	const addMotionListener = () => {
		if (!canUseMotion || motionListening) return;
		window.addEventListener("devicemotion", onMotion, { passive: true });
		motionListening = true;
	};

	const requestOrientation = () => {
		if ((!OrientationEvent && !MotionEvent) || permissionRequested) return;
		permissionRequested = true;

		if (orientationPermissionGranted) {
			addOrientationListener();
		}

		if (motionPermissionGranted) {
			addMotionListener();
		}

		const requests: Promise<PermissionState>[] = [];

		if (
			OrientationEvent &&
			!orientationPermissionGranted &&
			typeof OrientationEvent.requestPermission === "function"
		) {
			requests.push(
				requestSharedOrientationPermission(OrientationEvent)
					.then((permission) => {
						if (permission === "granted") addOrientationListener();
						return permission;
					})
					.catch((error: unknown) => {
						permissionRequested = false;
						throw error;
					}),
			);
		} else if (OrientationEvent) {
			addOrientationListener();
		}

		if (
			MotionEvent &&
			!motionPermissionGranted &&
			typeof MotionEvent.requestPermission === "function"
		) {
			requests.push(
				requestSharedMotionPermission(MotionEvent)
					.then((permission) => {
						if (permission === "granted") addMotionListener();
						return permission;
					})
					.catch((error: unknown) => {
						permissionRequested = false;
						throw error;
					}),
			);
		} else if (MotionEvent) {
			addMotionListener();
		}

		if (requests.length > 0) {
			void Promise.allSettled(requests).then((results) => {
				if (results.every((result) => result.status === "rejected")) {
					permissionRequested = false;
				}
			});
			return;
		}
	};

	const onSteeringActivation = () => {
		requestOrientation();
	};

	const resetOrientationBaseline = () => {
		orientationActive = false;
		baselineBeta = null;
		baselineGamma = null;
		baselineMotionX = null;
		baselineMotionY = null;
	};

	window.addEventListener("pointermove", onPointerMove, { passive: true });

	if (canUseDeviceSteering) {
		if (
			orientationPermissionGranted ||
			typeof OrientationEvent?.requestPermission !== "function"
		) {
			addOrientationListener();
		}

		if (
			motionPermissionGranted ||
			typeof MotionEvent?.requestPermission !== "function"
		) {
			addMotionListener();
		}

		window.addEventListener("pointerdown", onSteeringActivation, {
			capture: true,
			passive: true,
		});
		window.addEventListener("touchend", onSteeringActivation, {
			capture: true,
			passive: true,
		});
		window.addEventListener("click", onSteeringActivation, {
			capture: true,
			passive: true,
		});
		window.addEventListener("orientationchange", resetOrientationBaseline);
	}

	return () => {
		window.removeEventListener("pointermove", onPointerMove);
		window.removeEventListener("pointerdown", onSteeringActivation, true);
		window.removeEventListener("touchend", onSteeringActivation, true);
		window.removeEventListener("click", onSteeringActivation, true);
		window.removeEventListener("orientationchange", resetOrientationBaseline);

		if (orientationListening) {
			window.removeEventListener("deviceorientation", onOrientation);
		}

		if (motionListening) {
			window.removeEventListener("devicemotion", onMotion);
		}
	};
}
