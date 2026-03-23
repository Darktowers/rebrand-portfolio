"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import experienceData from "../../data/experience.json";

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
	const [expandedCompany, setExpandedCompany] = useState<string>("zoe");

	const companies = experienceData as Company[];

	return (
		<section id="experience" className="relative z-10 py-24 px-4">
			<div className="max-w-3xl mx-auto">
				{/* Section header */}
				<motion.div
					className="mb-12 text-center"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
				>
					<p className="font-mono text-sm mb-2" style={{ color: "var(--accent)" }}>
						02.
					</p>
					<h2 className="text-3xl md:text-4xl font-bold" style={{ color: "var(--fg)" }}>
						{t("experience.title")}
					</h2>
					<div className="w-12 h-0.5 mx-auto mt-3" style={{ background: "var(--accent)" }} />
				</motion.div>

				{/* Timeline */}
				<div className="relative">
					{/* Vertical line */}
					<div
						className="absolute left-4 top-0 bottom-0 w-px"
						style={{ background: "var(--border)" }}
						aria-hidden="true"
					/>

					<div className="space-y-2">
						{companies.map((company, idx) => {
							const isExpanded = expandedCompany === company.id;

							return (
								<motion.div
									key={company.id}
									className="relative pl-12"
									initial={{ opacity: 0, x: -20 }}
									whileInView={{ opacity: 1, x: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.4, delay: idx * 0.06 }}
								>
									{/* Dot */}
									<div className="absolute left-2.5 top-4 flex items-center justify-center">
										{company.current ? (
											<span className="relative flex h-4 w-4">
												<span
													className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
													style={{ background: "var(--accent)" }}
												/>
												<span
													className="relative inline-flex rounded-full h-4 w-4"
													style={{ background: "var(--accent)" }}
												/>
											</span>
										) : (
											<span
												className="h-3 w-3 rounded-full"
												style={{ background: "var(--fg-muted)", border: "2px solid var(--bg)" }}
											/>
										)}
									</div>

									{/* Company card */}
									<button
										className="w-full text-left glass rounded-xl p-4 mb-2 cursor-pointer hover:border-[var(--accent)] transition-colors"
										onClick={() =>
											setExpandedCompany(isExpanded ? "" : company.id)
										}
										type="button"
										aria-expanded={isExpanded}
									>
										<div className="flex items-start justify-between gap-2">
											<div>
												<div className="flex items-center gap-2 flex-wrap">
													<span
														className="font-semibold text-base"
														style={{ color: "var(--fg)" }}
													>
														{company.company}
													</span>
													{company.current && (
														<span
															className="text-xs px-2 py-0.5 rounded-full font-mono font-bold"
															style={{
																background: "var(--accent-glow)",
																color: "var(--accent)",
																border: "1px solid var(--accent)",
															}}
														>
															{t("experience.current")}
														</span>
													)}
												</div>
												<p className="text-xs mt-0.5" style={{ color: "var(--fg-muted)" }}>
													{company.location}
												</p>
											</div>
											<motion.span
												animate={{ rotate: isExpanded ? 180 : 0 }}
												transition={{ duration: 0.2 }}
												className="text-sm mt-1 shrink-0"
												style={{ color: "var(--fg-muted)" }}
												data-no-transition
											>
												▾
											</motion.span>
										</div>
									</button>

									{/* Roles accordion */}
									<AnimatePresence>
										{isExpanded && (
											<motion.div
												key={`${company.id}-roles`}
												initial={{ height: 0, opacity: 0 }}
												animate={{ height: "auto", opacity: 1 }}
												exit={{ height: 0, opacity: 0 }}
												transition={{ duration: 0.3, ease: "easeInOut" }}
												style={{ overflow: "hidden" }}
												data-no-transition
											>
												<div className="space-y-4 pb-4">
													{company.roles.map((role, ri) => {
														const titleKey = `exp.${company.id}.${role.id.split("-").pop()}.title`;
														return (
															<motion.div
																key={role.id}
																className="glass rounded-lg p-4"
																initial={{ opacity: 0, y: 8 }}
																animate={{ opacity: 1, y: 0 }}
																transition={{ delay: ri * 0.06 }}
															>
																<p
																	className="font-semibold text-sm mb-1"
																	style={{ color: "var(--fg)" }}
																>
																	{t(titleKey)}
																</p>
																<p
																	className="text-xs font-mono mb-3"
																	style={{ color: "var(--accent)" }}
																>
																	{formatDate(role.start, t("experience.present"))} —{" "}
																	{formatDate(role.end, t("experience.present"))}
																</p>
																<ul className="space-y-1.5">
																	{role.bulletKeys.map((bKey) => (
																		<li
																			key={bKey}
																			className="text-sm flex gap-2"
																			style={{ color: "var(--fg-muted)" }}
																		>
																			<span
																				className="mt-1.5 shrink-0 w-1 h-1 rounded-full"
																				style={{ background: "var(--accent)" }}
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
								</motion.div>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}
