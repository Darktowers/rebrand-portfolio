"use client";

import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

function SunIcon() {
    const rays = [0, 45, 90, 135, 180, 225, 270, 315];
    return (
        <motion.svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            animate={{ rotate: 360 }}
            transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
            style={{ display: "block" }}
        >
            <circle cx="12" cy="12" r="4.5" fill="#f2199c" />
            {rays.map((deg) => (
                <line
                    key={deg}
                    x1="12"
                    y1="1.5"
                    x2="12"
                    y2="5"
                    stroke="#f2199c"
                    strokeWidth="2"
                    strokeLinecap="round"
                    style={{
                        transformOrigin: "12px 12px",
                        transform: `rotate(${deg}deg)`,
                    }}
                />
            ))}
        </motion.svg>
    );
}

function MoonIcon() {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            style={{ display: "block" }}
        >
            <path
                d="M20.354 15.354A9 9 0 0 1 8.646 3.646 9.003 9.003 0 0 0 12 21a9.003 9.003 0 0 0 8.354-5.646z"
                fill="#01f8c1"
            />
            {/* Tiny star accents */}
            <circle cx="19.5" cy="4.5" r="1" fill="#01f8c1" opacity="0.75" />
            <circle cx="17" cy="2" r="0.6" fill="#01f8c1" opacity="0.5" />
        </svg>
    );
}

export default function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);
    if (!mounted) return <div className="w-16 h-8" />;

    const isDark = resolvedTheme === "dark";
    const accent = isDark ? "#01f8c1" : "#f2199c";
    const accentGlow = isDark ? "rgba(1,248,193,0.35)" : "rgba(242,25,156,0.35)";
    const accentBorder = isDark ? "rgba(1,248,193,0.35)" : "rgba(242,25,156,0.35)";
    const accentBorderHover = isDark ? "rgba(1,248,193,0.7)" : "rgba(242,25,156,0.7)";
    const trackBg = isDark ? "#161b22" : "#fff0f8";
    const thumbBg = isDark ? "#0d1117" : "#ffffff";
    const scanColor = isDark ? "rgba(1,248,193,0.18)" : "rgba(242,25,156,0.18)";

    return (
        <motion.button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="relative w-16 h-8 rounded-full cursor-pointer shrink-0 overflow-hidden"
            style={{
                background: trackBg,
                border: `1px solid ${accentBorder}`,
            }}
            whileHover={{
                boxShadow: `0 0 16px 3px ${accentGlow}, 0 0 0 1px ${accentBorderHover}`,
                borderColor: accentBorderHover,
            }}
            whileTap={{ scale: 0.93 }}
            transition={{ duration: 0.15 }}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            type="button"
            data-no-transition
        >
            {/* Ambient scan line sweep */}
            <motion.div
                className="absolute top-0 bottom-0 w-8 rounded-full pointer-events-none"
                style={{
                    background: `linear-gradient(90deg, transparent, ${scanColor}, transparent)`,
                }}
                animate={{ x: ["-32px", "72px"] }}
                transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "linear",
                    repeatDelay: 1.8,
                }}
            />

            {/* Thumb */}
            <motion.div
                className="absolute top-1 w-6 h-6 rounded-full flex items-center justify-center"
                style={{
                    background: thumbBg,
                    boxShadow: `0 0 8px 2px ${accentGlow}, 0 1px 4px rgba(0,0,0,0.25)`,
                }}
                animate={{ left: isDark ? "4px" : "calc(100% - 28px)" }}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                data-no-transition
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isDark ? "moon" : "sun"}
                        initial={{ opacity: 0, scale: 0.35, rotate: isDark ? 40 : -40 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.35, rotate: isDark ? -40 : 40 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                    >
                        {isDark ? <MoonIcon /> : <SunIcon />}
                    </motion.div>
                </AnimatePresence>
            </motion.div>

            {/* Bottom accent line */}
            <div
                className="absolute bottom-0 left-4 right-4 h-px pointer-events-none"
                style={{
                    background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
                    opacity: 0.5,
                }}
            />
        </motion.button>
    );
}
