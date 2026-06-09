"use client";

import { createContext, use, useMemo, useState } from "react";

export type BgVersion = "blackhole" | "flow" | "iso";

const BackgroundCtx = createContext<{
	version: BgVersion;
	setVersion: (v: BgVersion) => void;
}>({ version: "blackhole", setVersion: () => {} });

export function BackgroundProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [version, setVersion] = useState<BgVersion>("blackhole");
	const value = useMemo(() => ({ version, setVersion }), [version]);

	return (
		<BackgroundCtx.Provider value={value}>{children}</BackgroundCtx.Provider>
	);
}

export function useBackground() {
	return use(BackgroundCtx);
}
