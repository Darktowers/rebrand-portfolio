"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import LanguageToggle from "../../components/ui/LanguageToggle";
import BackgroundStage from "../../components/v2/backgrounds/BackgroundStage";
import DecodeText from "../../components/v2/DecodeText";
import HudOverlay from "../../components/v2/HudOverlay";
import GlowButton from "../../components/v2/GlowButton";
import GlowCard from "../../components/v2/GlowCard";
import ThemeToggleV2 from "../../components/v2/ThemeToggleV2";

const PROJECTS = [
	{
		name: "ZOE Financial",
		blurb: "Platform connecting people with vetted financial advisors.",
		stack: ["Next.js", "TypeScript", "Turborepo", "AWS Lambda"],
		image: "/my-work/images/zoefin.png",
		url: "https://my.zoefin.com/",
		featured: true,
	},
	{
		name: "Fauni",
		blurb: "React Native marketplace app for pet care services.",
		stack: ["React Native", "Expo", "Laravel"],
		image: "/my-work/images/fauni.png",
		url: null,
	},
	{
		name: "Coca-Cola en tu hogar",
		blurb: "Direct-to-consumer storefront for Coca-Cola Colombia.",
		stack: ["Angular", "GraphQL", "Node.js"],
		image: "/my-work/images/cocacola.png",
		url: "https://www.entuhogar.coca-cola.com.co/",
	},
	{
		name: "Practilonch",
		blurb: "Meal-prep ordering and subscription platform.",
		stack: ["Angular", "GraphQL", "AWS Lambda"],
		image: "/my-work/images/practilonch.png",
		url: "https://www.practilonch.com",
	},
];

const CAPABILITIES = [
	{ label: "runtime", items: ["React", "Next.js", "React Native"] },
	{ label: "language", items: ["TypeScript", "JavaScript ES2023"] },
	{ label: "backend", items: ["Node.js", "GraphQL", "AWS Lambda"] },
	{ label: "focus", items: ["Performance", "DX", "Design systems"] },
];

export default function V2Page() {
	const reduce = useReducedMotion();
	const rise = reduce
		? {}
		: {
				initial: { opacity: 0, y: 24 },
				whileInView: { opacity: 1, y: 0 },
				viewport: { once: true, amount: 0.3 },
				transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
			};

	return (
		<>
			<BackgroundStage />
			<HudOverlay />
			<div className="v2-hud-grid" aria-hidden="true" />
			<div className="v2-scrim" aria-hidden="true" />

			{/* ── Top bar ── */}
			<header className="relative z-30 mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
				<span className="font-mono text-lg font-bold tracking-wider">
					<span className="text-glow" style={{ color: "var(--accent)" }}>
						darktower
					</span>
					<span style={{ color: "var(--fg-muted)" }}>dev</span>
				</span>
				<div className="flex items-center gap-3">
					<a
						href="/cv.pdf"
						download
						className="focus-ring hidden rounded-[10px] px-3 py-1.5 font-mono text-xs font-semibold sm:inline-flex"
						style={{
							border: "1px solid var(--accent)",
							color: "var(--accent)",
						}}
					>
						./cv.pdf
					</a>
					<LanguageToggle />
					<ThemeToggleV2 />
				</div>
			</header>

			<main className="relative z-10">
				{/* ── Hero ── */}
				<section className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-6xl flex-col justify-center px-5 pb-16">
					<motion.span
						className="v2-chip mb-6 w-fit"
						initial={reduce ? false : { opacity: 0, y: 12 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						<span className="v2-chip-dot" />
						available for work
					</motion.span>

					<h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
						<DecodeText text="Cristian Arrieta" duration={900} />
					</h1>

					<motion.p
						className="mt-3 font-mono text-lg md:text-2xl"
						style={{ color: "var(--accent)" }}
						initial={reduce ? false : { opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.4, duration: 0.6 }}
					>
						React Developer · JavaScript Engineer
					</motion.p>

					<motion.p
						className="mt-6 max-w-xl text-base leading-relaxed md:text-lg"
						style={{ color: "var(--fg-muted)" }}
						initial={reduce ? false : { opacity: 0, y: 12 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.55, duration: 0.6 }}
					>
						I build fast, scalable web apps. 8+ years shipping production React
						across fintech, retail, and mobile.
					</motion.p>

					<motion.div
						className="mt-9 flex flex-wrap items-center gap-4"
						initial={reduce ? false : { opacity: 0, y: 12 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.7, duration: 0.6 }}
					>
						<GlowButton href="#work">view work</GlowButton>
						<GlowButton href="mailto:darktowerdev@gmail.com" variant="ghost">
							get in touch
						</GlowButton>
					</motion.div>
				</section>

				{/* ── Selected work ── */}
				<section
					id="work"
					className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24"
				>
					<motion.h2
						className="mb-10 text-3xl font-bold tracking-tight md:text-4xl"
						{...rise}
					>
						Selected work
					</motion.h2>

					{/* featured (signal border) */}
					<motion.a
						href={PROJECTS[0].url ?? "#"}
						target="_blank"
						rel="noopener noreferrer"
						className="v2-signal-border focus-ring group block overflow-hidden"
						style={{ background: "var(--card-bg)" }}
						{...rise}
					>
						<div className="grid gap-0 md:grid-cols-2">
							<div className="relative aspect-[16/10] overflow-hidden md:aspect-auto">
								<Image
									src={PROJECTS[0].image}
									alt={PROJECTS[0].name}
									fill
									sizes="(max-width: 768px) 100vw, 50vw"
									className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
								/>
							</div>
							<div className="flex flex-col justify-center gap-4 p-8">
								<span className="v2-chip w-fit">
									<span className="v2-chip-dot" />
									featured
								</span>
								<h3 className="text-2xl font-bold">{PROJECTS[0].name}</h3>
								<p style={{ color: "var(--fg-muted)" }}>{PROJECTS[0].blurb}</p>
								<div className="flex flex-wrap gap-2">
									{PROJECTS[0].stack.map((s) => (
										<span
											key={s}
											className="rounded-[6px] px-2 py-1 font-mono text-[11px]"
											style={{
												border: "1px solid var(--border)",
												color: "var(--fg-muted)",
											}}
										>
											{s}
										</span>
									))}
								</div>
							</div>
						</div>
					</motion.a>

					{/* grid */}
					<div className="mt-6 grid gap-6 md:grid-cols-3">
						{PROJECTS.slice(1).map((p, i) => (
							<motion.div
								key={p.name}
								{...(reduce
									? {}
									: {
											initial: { opacity: 0, y: 24 },
											whileInView: { opacity: 1, y: 0 },
											viewport: { once: true, amount: 0.3 },
											transition: {
												duration: 0.6,
												delay: i * 0.08,
												ease: [0.16, 1, 0.3, 1] as const,
											},
										})}
							>
								<GlowCard className="h-full overflow-hidden">
									<a
										href={p.url ?? "#"}
										target={p.url ? "_blank" : undefined}
										rel={p.url ? "noopener noreferrer" : undefined}
										className="focus-ring group block"
									>
										<div className="relative aspect-[16/10] overflow-hidden rounded-t-[14px]">
											<Image
												src={p.image}
												alt={p.name}
												fill
												sizes="(max-width: 768px) 100vw, 33vw"
												className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
											/>
										</div>
										<div className="flex flex-col gap-2 p-5">
											<h3 className="font-bold">{p.name}</h3>
											<p
												className="text-sm leading-relaxed"
												style={{ color: "var(--fg-muted)" }}
											>
												{p.blurb}
											</p>
											<div className="mt-1 flex flex-wrap gap-1.5">
												{p.stack.map((s) => (
													<span
														key={s}
														className="rounded-[6px] px-1.5 py-0.5 font-mono text-[10px]"
														style={{
															border: "1px solid var(--border)",
															color: "var(--fg-muted)",
														}}
													>
														{s}
													</span>
												))}
											</div>
										</div>
									</a>
								</GlowCard>
							</motion.div>
						))}
					</div>
				</section>

				{/* ── Capabilities (HUD spec, not equal cards) ── */}
				<section className="mx-auto max-w-6xl px-5 py-24">
					<motion.h2
						className="mb-10 text-3xl font-bold tracking-tight md:text-4xl"
						{...rise}
					>
						Stack
					</motion.h2>
					<div
						className="grid gap-px overflow-hidden rounded-[14px]"
						style={{ background: "var(--border)" }}
					>
						{CAPABILITIES.map((row) => (
							<motion.div
								key={row.label}
								className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-[160px_1fr]"
								style={{ background: "var(--bg-secondary)" }}
								{...rise}
							>
								<span
									className="font-mono text-sm uppercase tracking-[0.16em]"
									style={{ color: "var(--accent)" }}
								>
									{row.label}
								</span>
								<div className="flex flex-wrap gap-2">
									{row.items.map((it) => (
										<span
											key={it}
											className="rounded-[6px] px-2.5 py-1 font-mono text-xs"
											style={{
												border: "1px solid var(--border-strong)",
												color: "var(--fg)",
											}}
										>
											{it}
										</span>
									))}
								</div>
							</motion.div>
						))}
					</div>
				</section>

				{/* ── Footer ── */}
				<footer
					className="relative z-10 border-t py-10"
					style={{ borderColor: "var(--border)" }}
				>
					<div
						className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 font-mono text-sm sm:flex-row"
						style={{ color: "var(--fg-muted)" }}
					>
						<span>
							<span style={{ color: "var(--accent)" }}>darktower</span>dev
						</span>
						<span>built with Next.js, Three.js and Motion</span>
						<div className="flex gap-5">
							<a
								className="focus-ring hover:text-[var(--accent)]"
								href="https://github.com/Darktowers"
								target="_blank"
								rel="noopener noreferrer"
							>
								github
							</a>
							<a
								className="focus-ring hover:text-[var(--accent)]"
								href="https://www.linkedin.com/in/cristian-andres-arrieta-gutierrez-74a496b5"
								target="_blank"
								rel="noopener noreferrer"
							>
								linkedin
							</a>
							<a
								className="focus-ring hover:text-[var(--accent)]"
								href="mailto:darktowerdev@gmail.com"
							>
								email
							</a>
						</div>
					</div>
				</footer>
			</main>
		</>
	);
}
