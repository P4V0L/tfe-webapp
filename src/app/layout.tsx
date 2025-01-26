import type { Metadata } from "next";
import "./globals.css";
import {Header} from "@/components/layout/Header";
import {Footer} from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
            href="https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&family=Merriweather+Sans:wght@300;400;700&display=swap"
            rel="stylesheet"
        />
          <title>Conchi Gimeno</title>
      </head>
      <body className="font-sans bg-secondary text-foreground">
        <Header />
        <main className="container mx-auto px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
