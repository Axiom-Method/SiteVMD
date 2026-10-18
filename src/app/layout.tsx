import type { Metadata, Viewport } from "next";
import { Anton, Manrope, Oxanium } from "next/font/google";
import { connection } from "next/server";
import type { ReactNode } from "react";
import "./globals.css";

// Fontes do Brandbook, hospedadas localmente pelo Next (sem requisição a terceiros).
const oxanium = Oxanium({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-oxanium", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], weight: ["300", "400", "700", "800"], variable: "--font-manrope", display: "swap" });
// Condensada de pôster: só nas palavras gigantes decorativas (Hero e fundo das seções)
const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton", display: "swap" });

const DESCRICAO =
  "Assessoria especializada no fortalecimento da imagem, posicionamento e valorização de atletas. Conectamos atletas a técnicos e olheiros.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL ?? "http://localhost:3000"),
  title: { default: "VMD | Assessoria & Marketing Esportivo", template: "%s | VMD" },
  description: DESCRICAO,
  applicationName: "VMD",
  robots: { index: true, follow: true },
  // Prévia ao compartilhar (WhatsApp, Instagram, LinkedIn...). A imagem vem de opengraph-image.tsx
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "VMD Assessoria & Marketing Esportivo",
    title: "VMD | Assessoria & Marketing Esportivo",
    description: DESCRICAO,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#181818", colorScheme: "dark" };

export default async function RootLayout({ children }: { children: ReactNode }) {
  // Renderização dinâmica: necessária para o Next aplicar o nonce da CSP aos scripts.
  await connection();

  return (
    <html lang="pt-BR" className={`${oxanium.variable} ${manrope.variable} ${anton.variable}`}>
      <body>{children}</body>
    </html>
  );
}
