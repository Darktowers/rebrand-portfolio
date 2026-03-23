import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import AsciiBackground from "../components/ui/AsciiBackground";
import { LanguageProvider } from "../context/LanguageContext";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Cristian Arrieta — React Developer",
	description:
		"React Developer & JavaScript Engineer with 8+ years of experience building fast, scalable web applications.",
	keywords: ["React", "Next.js", "TypeScript", "Frontend Developer", "JavaScript"],
	authors: [{ name: "Cristian Andres Arrieta Gutierrez" }],
	openGraph: {
		title: "Cristian Arrieta — React Developer",
		description: "React Developer & JavaScript Engineer based in Bogotá, Colombia.",
		type: "website",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={`${geistSans.variable} ${geistMono.variable}`}
		>
			<body>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<LanguageProvider>
						<AsciiBackground />
						<Navbar />
						<main className="relative z-10">
							{children}
						</main>
						<Footer />
					</LanguageProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
