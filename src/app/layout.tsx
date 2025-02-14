import { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// 1. Import the built-in Google font modules
import { Merriweather, Merriweather_Sans } from "next/font/google";
import {SessionProvider} from "next-auth/react";
import {CartProvider} from "@/providers/CartProvider";

// 2. Configure your fonts & weights
const merriweather = Merriweather({
    subsets: ["latin"],
    weight: ["300", "400", "700"],
    variable: "--font-merriweather",
    display: "swap",
});

const merriweatherSans = Merriweather_Sans({
    subsets: ["latin"],
    weight: ["300", "400", "700"],
    variable: "--font-merriweather-sans",
    display: "swap",
});

// 3. Optionally define your metadata (using Next.js 13+ app router)
export const metadata: Metadata = {
    title: "Conchi Gimeno",
    description: "Tienda Online oficial de Conchi Gimeno",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            // 4. Attach the custom font variables to <html> (so Tailwind can see them)
            className={`${merriweather.variable} ${merriweatherSans.variable}`}
        >
        {/* 5. No <head> link tags needed—Next.js handles it internally */}
        <head>
            <title>Conchi Gimeno</title>
        </head>
        <body className="font-sans bg-secondary text-foreground">
            <CartProvider>
                <SessionProvider>
                    <Header />
                    <main className="container mx-auto px-4 py-8">{children}</main>
                    <Footer />
                </SessionProvider>
            </CartProvider>
        </body>
        </html>
    );
}