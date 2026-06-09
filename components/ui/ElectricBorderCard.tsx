"use client";

import { type ReactNode, useId } from "react";

interface ElectricBorderCardProps {
	children: ReactNode;
	className?: string;
	color?: string;
	rounded?: string;
}

export default function ElectricBorderCard({
	children,
	className = "",
	color = "#00d4ff",
	rounded = "rounded-xl",
}: ElectricBorderCardProps) {
	const uid = useId().replace(/:/g, "");
	const filterId = `electric-${uid}`;

	return (
		<div className={`relative ${className}`}>
			<svg
				className="absolute w-0 h-0 overflow-hidden"
				aria-hidden="true"
				focusable="false"
			>
				<defs>
					<filter
						id={filterId}
						colorInterpolationFilters="sRGB"
						x="-30%"
						y="-30%"
						width="160%"
						height="160%"
					>
						<feTurbulence
							type="turbulence"
							baseFrequency="0.02"
							numOctaves="6"
							result="noise1"
							seed="2"
						/>
						<feOffset in="noise1" dx="0" dy="0" result="offsetNoise1">
							<animate
								attributeName="dy"
								values="500; 0"
								dur="7s"
								repeatCount="indefinite"
								calcMode="linear"
							/>
						</feOffset>
						<feTurbulence
							type="turbulence"
							baseFrequency="0.02"
							numOctaves="6"
							result="noise2"
							seed="5"
						/>
						<feOffset in="noise2" dx="0" dy="0" result="offsetNoise2">
							<animate
								attributeName="dy"
								values="0; -500"
								dur="7s"
								repeatCount="indefinite"
								calcMode="linear"
							/>
						</feOffset>
						<feMerge result="mergedNoise">
							<feMergeNode in="offsetNoise1" />
							<feMergeNode in="offsetNoise2" />
						</feMerge>
						<feDisplacementMap
							in="SourceGraphic"
							in2="mergedNoise"
							scale="12"
							xChannelSelector="R"
							yChannelSelector="G"
						/>
					</filter>
				</defs>
			</svg>

			<div
				className={`absolute -inset-1 ${rounded} pointer-events-none z-20`}
				style={{
					border: `1.5px solid ${color}`,
					boxShadow: `0 0 12px ${color}55`,
				}}
				aria-hidden="true"
			/>

			<div
				className={`absolute -inset-2 ${rounded} pointer-events-none z-30`}
				style={{
					border: `2px solid ${color}`,
					filter: `url(#${filterId})`,
					boxShadow: `0 0 16px ${color}88, 0 0 32px ${color}44`,
					transform: "translateZ(0)",
				}}
				aria-hidden="true"
			/>

			<div className="relative z-10">{children}</div>
		</div>
	);
}
