import type { ReactNode } from "react";
import "./v2.css";

export default function V2Layout({ children }: { children: ReactNode }) {
	return <div className="v2-root">{children}</div>;
}
