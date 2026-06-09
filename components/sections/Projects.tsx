"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import projectsData from "../../data/projects.json";
import Dot from "../v2/Dot";
import GlowButton from "../v2/GlowButton";
import GlowCard from "../v2/GlowCard";
import PageHeader from "../v2/PageHeader";

interface Project {
	id: string;
	nameKey: string;
	descriptionKey: string;
	stack: string[];
	image: string;
	url: string | null;
	featured: boolean;
}

function StackChips({ stack }: { stack: string[] }) {
	return (
		<div className="flex flex-wrap gap-1.5">
			{stack.map((tech) => (
				<span
					key={tech}
					className="font-mono text-[11px] px-2 py-0.5 rounded-[6px]"
					style={{
						color: "var(--fg-muted)",
						border: "1px solid var(--border)",
						background: "var(--surface)",
					}}
				>
					{tech}
				</span>
			))}
		</div>
	);
}

function ProjectImage({
	src,
	alt,
	heightClass = "h-44",
}: {
	src: string;
	alt: string;
	heightClass?: string;
}) {
	const [errored, setErrored] = useState(false);
	if (errored) {
		return (
			<div
				className={`w-full ${heightClass} flex items-center justify-center font-mono text-xs rounded-t-[14px]`}
				style={{ background: "var(--bg-secondary)", color: "var(--fg-muted)" }}
			>
				{alt}
			</div>
		);
	}
	return (
		<div
			className={`relative w-full ${heightClass} overflow-hidden rounded-t-[14px]`}
		>
			<Image
				src={src}
				alt={alt}
				fill
				className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
				onError={() => setErrored(true)}
				sizes="(max-width: 768px) 100vw, 33vw"
			/>
		</div>
	);
}

export default function Projects() {
	const { t } = useLanguage();
	const reduce = useReducedMotion();
	const [hovered, setHovered] = useState<string | null>(null);

	const projects = projectsData as Project[];
	const featured = projects.find((p) => p.featured);
	const rest = projects.filter((p) => !p.featured);

	return (
		<section id="projects" className="relative z-10 px-5 py-24 md:py-32">
			<div className="max-w-6xl mx-auto">
				<PageHeader index="02" eyebrow="WORK" title={t("projects.title")} />

				{/* Featured project, full-width signal-border card */}
				{featured && (
					<motion.div
						className="mb-12"
						initial={{ opacity: 0, y: 28 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-80px" }}
						transition={{ duration: reduce ? 0 : 0.55, ease: "easeOut" }}
					>
						<div className="v2-signal-border">
							<div
								className="group glass relative overflow-hidden rounded-[14px]"
								style={{ background: "var(--card-bg)" }}
							>
								<div className="flex flex-col md:flex-row">
									{/* Image side */}
									<div className="relative md:w-2/5 shrink-0 overflow-hidden">
										<div className="relative h-56 md:h-full md:min-h-[260px] overflow-hidden">
											<Image
												src={featured.image}
												alt={t(featured.nameKey)}
												fill
												className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
												sizes="(max-width: 768px) 100vw, 400px"
											/>
										</div>
									</div>
									{/* Content side */}
									<div className="p-6 md:p-8 flex flex-col justify-center">
										<span className="v2-chip v2-chip-live self-start mb-4">
											<Dot />
											{t("projects.featured")}
										</span>
										<h3
											className="text-2xl font-bold mb-2"
											style={{ color: "var(--fg)" }}
										>
											{t(featured.nameKey)}
										</h3>
										<p
											className="text-sm mb-5 leading-relaxed"
											style={{ color: "var(--fg-muted)" }}
										>
											{t(featured.descriptionKey)}
										</p>
										<div className="mb-6">
											<StackChips stack={featured.stack} />
										</div>
										{featured.url && (
											<GlowButton href={featured.url} variant="solid">
												{t("projects.view")}
												<span aria-hidden="true">{">"}</span>
											</GlowButton>
										)}
									</div>
								</div>
							</div>
						</div>
					</motion.div>
				)}

				{/* Regular projects grid, blur-hover effect themed to palette */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
					{rest.map((project, index) => {
						const dimmed = hovered !== null && hovered !== project.id;
						return (
							<motion.div
								key={project.id}
								initial={{ opacity: 0, y: 22 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, margin: "-60px" }}
								transition={{
									duration: reduce ? 0 : 0.45,
									ease: "easeOut",
									delay: reduce ? 0 : index * 0.06,
								}}
								animate={
									reduce
										? undefined
										: {
												filter: dimmed ? "blur(2px)" : "blur(0px)",
												scale: dimmed ? 0.985 : 1,
												opacity: dimmed ? 0.6 : 1,
											}
								}
								onHoverStart={() => setHovered(project.id)}
								onHoverEnd={() => setHovered(null)}
								data-no-transition
							>
								<GlowCard className="h-full overflow-hidden">
									<div className="flex h-full flex-col">
										<ProjectImage
											src={project.image}
											alt={t(project.nameKey)}
										/>
										<div className="p-5 flex flex-col flex-1">
											<h3
												className="font-bold text-base mb-1"
												style={{ color: "var(--fg)" }}
											>
												{t(project.nameKey)}
											</h3>
											<p
												className="text-sm mb-4 leading-relaxed"
												style={{ color: "var(--fg-muted)" }}
											>
												{t(project.descriptionKey)}
											</p>
											<div className="mb-4">
												<StackChips stack={project.stack} />
											</div>
											{project.url && (
												<div className="mt-auto">
													<GlowButton href={project.url} variant="ghost">
														{t("projects.view")}
														<span aria-hidden="true">{">"}</span>
													</GlowButton>
												</div>
											)}
										</div>
									</div>
								</GlowCard>
							</motion.div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
