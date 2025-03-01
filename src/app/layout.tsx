import { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

import { Merriweather, Merriweather_Sans } from "next/font/google";
import {SessionProvider} from "next-auth/react";
import {CartProvider} from "@/providers/CartProvider";
import {Toaster} from "@/components/ui/toaster";

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
            lang="es"
            className={`${merriweather.variable} ${merriweatherSans.variable}`}
        >
        <head>
            <title>Conchi Gimeno</title>
        </head>
        <body className="font-sans bg-secondary text-foreground">
            <CartProvider>
                <SessionProvider>
                    <Header />
                    <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-300px)]">{children}</main>
                    <Footer />
                </SessionProvider>
            </CartProvider>
            <Toaster />
        </body>
        </html>
    );
}