"use client";

import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import LanguageToggle from "../ui/LanguageToggle";
import ThemeToggle from "../ui/ThemeToggle";

const NAV_ITEMS = [
	{ key: "nav.home", href: "/" },
	{ key: "nav.about", href: "/about" },
	{ key: "nav.experience", href: "/experience" },
	{ key: "nav.projects", href: "/projects" },
	{ key: "nav.contact", href: "/contact" },
];

export default function Navbar() {
	const { t } = useLanguage();
	const pathname = usePathname();
	const [scrolled, setScrolled] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	// Close mobile menu on route change
	useEffect(() => {
		setMobileOpen(false);
	}, [pathname]);

	function isActive(href: string) {
		if (href === "/") return pathname === "/";
		return pathname.startsWith(href);
	}

	return (
		<>
			<motion.header
				className="fixed top-0 left-0 right-0 z-50"
				initial={{ y: -80, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.5, ease: "easeOut" }}
			>
				<nav
					className={`mx-auto max-w-6xl px-4 h-16 flex items-center justify-between transition-all duration-300 ${
						scrolled ? "glass rounded-b-xl mx-2 mt-2" : "bg-transparent"
					}`}
				>
					{/* Logo */}
					<Link
						href="/"
						className="font-mono font-bold text-lg tracking-wider"
						style={{ color: "var(--accent)" }}
					>
						<span className="text-glow">DarkTower</span>
						<span style={{ color: "var(--fg-muted)" }}>_dev</span>
					</Link>

					{/* Desktop nav */}
					<div className="hidden md:flex items-center gap-1">
						{NAV_ITEMS.map((item) => {
							const active = isActive(item.href);
							return (
								<Link
									key={item.key}
									href={item.href}
									className="relative px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
									style={{
										color: active ? "var(--accent)" : "var(--fg-muted)",
									}}
								>
									{t(item.key)}
									{active && (
										<motion.span
											layoutId="nav-indicator"
											className="absolute inset-0 rounded-lg"
											style={{ background: "var(--accent-glow)" }}
											transition={{ type: "spring", stiffness: 400, damping: 35 }}
											data-no-transition
										/>
									)}
								</Link>
							);
						})}
					</div>

					{/* Controls */}
					<div className="flex items-center gap-2">
						<a
							href="/cv.pdf"
							download
							className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0"
							style={{ border: "1.5px solid var(--accent)", color: "var(--accent)" }}
						>
							<FontAwesomeIcon icon={faDownload} className="w-3 h-3" />
							CV
						</a>
						<LanguageToggle />
						<ThemeToggle />
						{/* Hamburger */}
						<button
							className="md:hidden flex flex-col gap-1.5 w-9 h-9 items-center justify-center cursor-pointer rounded-lg hover:bg-[var(--border)]"
							onClick={() => setMobileOpen((v) => !v)}
							aria-label="Toggle menu"
							aria-expanded={mobileOpen}
							type="button"
						>
							<motion.span
								className="w-5 h-0.5 block"
								style={{ background: "var(--fg)" }}
								animate={mobileOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
								data-no-transition
							/>
							<motion.span
								className="w-5 h-0.5 block"
								style={{ background: "var(--fg)" }}
								animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
								data-no-transition
							/>
							<motion.span
								className="w-5 h-0.5 block"
								style={{ background: "var(--fg)" }}
								animate={mobileOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
								data-no-transition
							/>
						</button>
					</div>
				</nav>
			</motion.header>

			{/* Mobile menu */}
			<AnimatePresence>
				{mobileOpen && (
					<motion.div
						className="fixed inset-0 z-40 md:hidden"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						{/* Backdrop */}
						<div
							className="absolute inset-0"
							style={{ background: "rgba(0,0,0,0.5)" }}
							onClick={() => setMobileOpen(false)}
						/>
						{/* Panel */}
						<motion.div
							className="absolute right-0 top-0 h-full w-64 glass flex flex-col gap-2 pt-20 pb-8 px-6"
							initial={{ x: "100%" }}
							animate={{ x: 0 }}
							exit={{ x: "100%" }}
							transition={{ type: "spring", stiffness: 400, damping: 40 }}
							data-no-transition
						>
							{NAV_ITEMS.map((item, i) => {
								const active = isActive(item.href);
								return (
									<motion.div
										key={item.key}
										initial={{ opacity: 0, x: 20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: i * 0.05 }}
									>
										<Link
											href={item.href}
											className="block py-3 text-base font-medium border-b"
											style={{
												borderColor: "var(--border)",
												color: active ? "var(--accent)" : "var(--fg)",
											}}
										>
											{t(item.key)}
										</Link>
									</motion.div>
								);
							})}
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
