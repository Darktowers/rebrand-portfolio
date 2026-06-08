"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import projectsData from "../../data/projects.json";
import ElectricBorderCard from "../ui/ElectricBorderCard";
import SectionFrame, { revealItem } from "../ui/SectionFrame";

interface Project {
	id: string;
	nameKey: string;
	descriptionKey: string;
	stack: string[];
	image: string;
	url: string | null;
	featured: boolean;
}

function ProjectImage({ src, alt }: { src: string; alt: string }) {
	const [errored, setErrored] = useState(false);
	if (errored) {
		return (
			<div
				className="w-full h-44 flex items-center justify-center font-mono text-xs"
				style={{ background: "var(--bg-secondary)", color: "var(--fg-muted)" }}
			>
				{alt}
			</div>
		);
	}
	return (
		<div className="relative w-full h-44 overflow-hidden">
			<Image
				src={src}
				alt={alt}
				fill
				className="object-cover"
				onError={() => setErrored(true)}
				sizes="(max-width: 768px) 100vw, 33vw"
			/>
		</div>
	);
}

export default function Projects() {
	const { t } = useLanguage();

	const projects = projectsData as Project[];
	const featured = projects.find((p) => p.featured);
	const rest = projects.filter((p) => !p.featured);

	return (
		<SectionFrame
			id="projects"
			number="03"
			title={t("projects.title")}
			innerClassName="max-w-5xl"
		>
			{/* Featured project — horizontal card, centered */}
			{featured && (
				<motion.div className="mb-10 flex justify-center" variants={revealItem}>
					<div className="w-full max-w-2xl">
						<ElectricBorderCard className="rounded-xl" color="var(--accent)">
							<div className="glass rounded-xl overflow-hidden">
								<div className="flex flex-col md:flex-row">
									{/* Image side */}
									<div className="relative md:w-2/5 shrink-0">
										<div className="relative h-52 md:h-full min-h-[200px] overflow-hidden">
											<Image
												src={featured.image}
												alt={t(featured.nameKey)}
												fill
												className="object-cover"
												sizes="(max-width: 768px) 100vw, 320px"
											/>
											<span
												className="absolute top-3 left-3 text-xs font-mono font-bold px-2 py-1 rounded"
												style={{
													background: "var(--accent)",
													color: "var(--bg)",
												}}
											>
												{t("projects.featured")}
											</span>
										</div>
									</div>
									{/* Content side */}
									<div className="p-5 md:p-6 flex flex-col justify-center">
										<h3
											className="text-xl font-bold mb-2"
											style={{ color: "var(--fg)" }}
										>
											{t(featured.nameKey)}
										</h3>
										<p
											className="text-sm mb-4 leading-relaxed"
											style={{ color: "var(--fg-muted)" }}
										>
											{t(featured.descriptionKey)}
										</p>
										<div className="flex flex-wrap gap-2 mb-4">
											{featured.stack.map((tech) => (
												<span
													key={tech}
													className="text-xs px-2.5 py-1 rounded-full font-mono"
													style={{
														background: "var(--bg-secondary)",
														color: "var(--accent)",
														border: "1px solid var(--accent-glow)",
													}}
												>
													{tech}
												</span>
											))}
										</div>
										{featured.url && (
											<a
												href={featured.url}
												target="_blank"
												rel="noopener noreferrer"
												className="focus-ring inline-flex items-center gap-1 rounded-md text-sm font-medium hover:underline self-start"
												style={{ color: "var(--accent)" }}
											>
												{t("projects.view")} →
											</a>
										)}
									</div>
								</div>
							</div>
						</ElectricBorderCard>
					</div>
				</motion.div>
			)}

			{/* Regular projects grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
				{rest.map((project) => (
					<motion.div
						key={project.id}
						className="glass rounded-xl overflow-hidden"
						variants={revealItem}
						whileHover={{ y: -6, scale: 1.025 }}
						transition={{ type: "spring", stiffness: 360, damping: 28 }}
						data-no-transition
					>
						<ProjectImage src={project.image} alt={t(project.nameKey)} />
						<div className="p-4">
							<h3
								className="font-bold text-base mb-1"
								style={{ color: "var(--fg)" }}
							>
								{t(project.nameKey)}
							</h3>
							<p className="text-sm mb-3" style={{ color: "var(--fg-muted)" }}>
								{t(project.descriptionKey)}
							</p>
							<div className="flex flex-wrap gap-1.5 mb-3">
								{project.stack.map((tech) => (
									<span
										key={tech}
										className="text-xs px-2 py-0.5 rounded-full font-mono"
										style={{
											background: "var(--bg-secondary)",
											color: "var(--fg-muted)",
										}}
									>
										{tech}
									</span>
								))}
							</div>
							{project.url && (
								<a
									href={project.url}
									target="_blank"
									rel="noopener noreferrer"
									className="focus-ring rounded-md text-xs font-medium hover:underline"
									style={{ color: "var(--accent)" }}
								>
									{t("projects.view")} →
								</a>
							)}
						</div>
					</motion.div>
				))}
			</div>
		</SectionFrame>
	);
}
