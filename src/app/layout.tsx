import type { Metadata, Viewport } from "next";
import { Manrope, Oxanium } from "next/font/google";
import { connection } from "next/server";
import type { ReactNode } from "react";
import "./globals.css";

// Fontes do Brandbook, hospedadas localmente pelo Next (sem requisição a terceiros).
const oxanium = Oxanium({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-oxanium", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], weight: ["300", "400", "700", "800"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL ?? "http://localhost:3000"),
  title: { default: "VMD | Assessoria & Marketing Esportivo", template: "%s | VMD" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#181818", colorScheme: "dark" };

export default async function RootLayout({ children }: { children: ReactNode }) {
  // Renderização dinâmica: necessária para o Next aplicar o nonce da CSP aos scripts.
  await connection();

  return (
    <html lang="pt-BR" className={`${oxanium.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
