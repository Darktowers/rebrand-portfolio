import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { ThemeProvider } from "next-themes";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import { LanguageProvider } from "../context/LanguageContext";
import {
	getMetadataForLang,
	LANGUAGE_COOKIE_NAME,
	parseLang,
} from "../context/translation";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

async function getServerLang() {
	const cookieStore = await cookies();
	return parseLang(cookieStore.get(LANGUAGE_COOKIE_NAME)?.value);
}

export async function generateMetadata(): Promise<Metadata> {
	const lang = await getServerLang();
	const languageMetadata = getMetadataForLang(lang);

	return {
		title: languageMetadata.title,
		description: languageMetadata.description,
		keywords: [
			"React",
			"Next.js",
			"TypeScript",
			"Frontend Developer",
			"JavaScript",
		],
		authors: [{ name: "Cristian Andres Arrieta Gutierrez" }],
		openGraph: {
			title: languageMetadata.title,
			description: languageMetadata.openGraphDescription,
			type: "website",
		},
	};
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const initialLang = await getServerLang();

	return (
		<html
			lang={initialLang}
			suppressHydrationWarning
			className={`${geistSans.variable} ${geistMono.variable}`}
		>
			<body>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<LanguageProvider initialLang={initialLang}>
						<Navbar />
						<main className="relative z-10">{children}</main>
						<Footer />
					</LanguageProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
