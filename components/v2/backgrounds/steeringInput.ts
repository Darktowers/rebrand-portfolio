"use client";

type SteeringTarget = {
	x: number;
	y: number;
};

type PermissionedOrientationEvent = typeof DeviceOrientationEvent & {
	requestPermission?: () => Promise<PermissionState>;
};

type Options = {
	enableOrientation?: boolean;
	tiltXDivisor?: number;
	tiltYDivisor?: number;
};

let orientationPermissionGranted = false;
let orientationPermissionRequest: Promise<PermissionState> | null = null;

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

export function createSteeringInput(
	target: SteeringTarget,
	{
		enableOrientation = true,
		tiltXDivisor = 24,
		tiltYDivisor = 34,
	}: Options = {},
) {
	const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
	const canUseOrientation =
		enableOrientation && coarsePointer && "DeviceOrientationEvent" in window;
	const OrientationEvent = canUseOrientation
		? (window.DeviceOrientationEvent as PermissionedOrientationEvent)
		: undefined;

	let baselineBeta: number | null = null;
	let baselineGamma: number | null = null;
	let orientationListening = false;
	let permissionRequested = false;

	const onPointerMove = (event: PointerEvent) => {
		target.x = (event.clientX / window.innerWidth) * 2 - 1;
		target.y = (event.clientY / window.innerHeight) * 2 - 1;
	};

	const onOrientation = (event: DeviceOrientationEvent) => {
		if (event.beta == null || event.gamma == null) return;

		baselineBeta ??= event.beta;
		baselineGamma ??= event.gamma;

		target.x = clamp((event.gamma - baselineGamma) / tiltXDivisor, -1, 1);
		target.y = clamp((event.beta - baselineBeta) / tiltYDivisor, -1, 1);
	};

	const addOrientationListener = () => {
		if (!canUseOrientation || orientationListening) return;
		window.addEventListener("deviceorientation", onOrientation, {
			passive: true,
		});
		orientationListening = true;
	};

	const requestOrientation = () => {
		if (!OrientationEvent || permissionRequested) return;
		permissionRequested = true;

		if (orientationPermissionGranted) {
			addOrientationListener();
			return;
		}

		if (typeof OrientationEvent.requestPermission === "function") {
			void requestSharedOrientationPermission(OrientationEvent)
				.then((permission) => {
					if (permission === "granted") addOrientationListener();
				})
				.catch(() => {
					permissionRequested = false;
				});
			return;
		}

		addOrientationListener();
	};

	const resetOrientationBaseline = () => {
		baselineBeta = null;
		baselineGamma = null;
	};

	window.addEventListener("pointermove", onPointerMove, { passive: true });

	if (canUseOrientation) {
		if (
			orientationPermissionGranted ||
			typeof OrientationEvent?.requestPermission !== "function"
		) {
			addOrientationListener();
		}

		window.addEventListener("pointerdown", requestOrientation, {
			passive: true,
		});
		window.addEventListener("touchstart", requestOrientation, {
			passive: true,
		});
		window.addEventListener("orientationchange", resetOrientationBaseline);
	}

	return () => {
		window.removeEventListener("pointermove", onPointerMove);
		window.removeEventListener("pointerdown", requestOrientation);
		window.removeEventListener("touchstart", requestOrientation);
		window.removeEventListener("orientationchange", resetOrientationBaseline);

		if (orientationListening) {
			window.removeEventListener("deviceorientation", onOrientation);
		}
	};
}
