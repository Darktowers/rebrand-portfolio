"use client";

import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import experienceData from "../../data/experience.json";
import GlowCard from "../v2/GlowCard";
import PageHeader from "../v2/PageHeader";

function formatDate(dateStr: string | null, presentLabel: string): string {
	if (!dateStr) return presentLabel;
	const [year, month] = dateStr.split("-");
	const date = new Date(Number(year), Number(month) - 1);
	return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

interface Role {
	id: string;
	start: string;
	end: string | null;
	bulletKeys: string[];
}

interface Company {
	id: string;
	company: string;
	companyUrl: string | null;
	location: string;
	current: boolean;
	roles: Role[];
}

export default function Experience() {
	const { t } = useLanguage();
	const reduce = useReducedMotion();
	const [expandedCompany, setExpandedCompany] = useState<string>("zoe");

	const companies = experienceData as Company[];

	return (
		<section
			id="experience"
			className="relative z-10 mx-auto max-w-6xl px-5 py-24"
		>
			<PageHeader index="01" eyebrow="HISTORY" title={t("experience.title")} />

			{/* Timeline */}
			<div className="relative">
				{/* Vertical line */}
				<div
					className="absolute top-0 bottom-0 left-4 w-px"
					style={{ background: "var(--border)" }}
					aria-hidden="true"
				/>

				<div className="space-y-3">
					{companies.map((company, ci) => {
						const isExpanded = expandedCompany === company.id;

						return (
							<motion.div
								key={company.id}
								className="relative pl-12"
								initial={reduce ? false : { opacity: 0, y: 22 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, margin: "-60px" }}
								transition={{
									duration: 0.45,
									ease: "easeOut",
									delay: reduce ? 0 : Math.min(ci * 0.06, 0.3),
								}}
							>
								{/* Timeline node */}
								<div className="absolute top-5 left-2.5 flex items-center justify-center">
									{company.current ? (
										<span className="relative flex h-4 w-4">
											{!reduce && (
												<span
													className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
													style={{ background: "var(--accent)" }}
												/>
											)}
											<span
												className="relative inline-flex h-4 w-4 rounded-full"
												style={{
													background: "var(--accent)",
													boxShadow: "0 0 12px var(--accent-glow)",
												}}
											/>
										</span>
									) : (
										<span
											className="h-3 w-3 rounded-full"
											style={{
												background: "var(--fg-muted)",
												border: "2px solid var(--bg)",
											}}
										/>
									)}
								</div>

								{/* Company card (signal-border highlight only for current) */}
								<div className={company.current ? "v2-signal-border" : ""}>
									<GlowCard className="overflow-hidden">
										<button
											className="focus-ring w-full cursor-pointer p-4 text-left"
											onClick={() =>
												setExpandedCompany(isExpanded ? "" : company.id)
											}
											type="button"
											aria-expanded={isExpanded}
										>
											<div className="flex items-start justify-between gap-3">
												<div className="min-w-0">
													<div className="flex flex-wrap items-center gap-2">
														<span
															className="text-base font-semibold"
															style={{ color: "var(--fg)" }}
														>
															{company.company}
														</span>
														{company.current && (
															<span className="v2-chip v2-chip-live">
																<span className="v2-chip-dot" />
																{t("experience.current")}
															</span>
														)}
													</div>
													<p
														className="mt-1 font-mono text-xs"
														style={{ color: "var(--fg-muted)" }}
													>
														{company.location}
													</p>
												</div>
												<motion.span
													animate={{ rotate: isExpanded ? 180 : 0 }}
													transition={{
														type: "spring",
														stiffness: 420,
														damping: 30,
													}}
													className="mt-1 shrink-0"
													style={{ color: "var(--accent)" }}
													data-no-transition
													aria-hidden="true"
												>
													<FontAwesomeIcon
														icon={faChevronDown}
														className="h-3.5 w-3.5"
													/>
												</motion.span>
											</div>
										</button>

										{/* Roles accordion */}
										<AnimatePresence initial={false}>
											{isExpanded && (
												<motion.div
													key={`${company.id}-roles`}
													initial={{ height: 0, opacity: 0 }}
													animate={{ height: "auto", opacity: 1 }}
													exit={{ height: 0, opacity: 0 }}
													transition={{
														type: "spring",
														stiffness: 420,
														damping: 36,
														mass: 0.8,
													}}
													style={{ overflow: "hidden" }}
													data-no-transition
												>
													<div className="space-y-3 px-4 pb-4">
														{company.roles.map((role, ri) => {
															const titleKey = `exp.${company.id}.${role.id.split("-").pop()}.title`;
															return (
																<motion.div
																	key={role.id}
																	className="glass rounded-[10px] p-4"
																	style={{ border: "1px solid var(--border)" }}
																	initial={
																		reduce ? false : { opacity: 0, y: 10 }
																	}
																	animate={{ opacity: 1, y: 0 }}
																	transition={{
																		type: "spring",
																		stiffness: 360,
																		damping: 30,
																		delay: reduce ? 0 : ri * 0.04,
																	}}
																>
																	<p
																		className="mb-2 text-sm font-semibold"
																		style={{ color: "var(--fg)" }}
																	>
																		{t(titleKey)}
																	</p>
																	<span className="v2-chip mb-3">
																		{formatDate(
																			role.start,
																			t("experience.present"),
																		)}{" "}
																		-{" "}
																		{formatDate(
																			role.end,
																			t("experience.present"),
																		)}
																	</span>
																	<ul className="mt-3 space-y-1.5">
																		{role.bulletKeys.map((bKey) => (
																			<li
																				key={bKey}
																				className="flex gap-2 text-sm leading-relaxed"
																				style={{ color: "var(--fg-muted)" }}
																			>
																				<span
																					className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
																					style={{
																						background: "var(--accent)",
																						boxShadow:
																							"0 0 6px var(--accent-glow)",
																					}}
																					aria-hidden="true"
																				/>
																				{t(bKey)}
																			</li>
																		))}
																	</ul>
																</motion.div>
															);
														})}
													</div>
												</motion.div>
											)}
										</AnimatePresence>
									</GlowCard>
								</div>
							</motion.div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
