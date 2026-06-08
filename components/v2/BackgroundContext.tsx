"use client";

import { createContext, useContext, useState } from "react";

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
	return (
		<BackgroundCtx.Provider value={{ version, setVersion }}>
			{children}
		</BackgroundCtx.Provider>
	);
}

export function useBackground() {
	return useContext(BackgroundCtx);
}
