import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-fraunces",
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Patagonia al Día — Noticias de la Región de Aysén",
  description:
    "Noticias, radio online y actualidad de la Región de Aysén, Chile. Regional, policial, política, deportes, economía y cultura.",
  openGraph: {
    title: "Patagonia al Día — Noticias de la Región de Aysén",
    description: "Noticias, radio online y actualidad de la Región de Aysén, Chile.",
    images: ["/brand/social-banner.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-CL">
      <body
        className={`${fraunces.variable} ${plexSans.variable} ${plexMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
