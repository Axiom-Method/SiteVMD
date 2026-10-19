import type { Metadata, Viewport } from "next";
import { Anton, Manrope, Oxanium } from "next/font/google";
import { connection } from "next/server";
import type { ReactNode } from "react";
import { LANG_HTML, LOCALE_OG } from "@/i18n/config";
import { IdiomaProvider } from "@/i18n/cliente";
import { obterTextos } from "@/i18n/servidor";
import "./globals.css";

// Fontes do Brandbook, hospedadas localmente pelo Next (sem requisição a terceiros).
const oxanium = Oxanium({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-oxanium", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], weight: ["300", "400", "700", "800"], variable: "--font-manrope", display: "swap" });
// Condensada de pôster: só nas palavras gigantes decorativas (Hero e fundo das seções)
const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const { idioma, t } = await obterTextos();
  return {
    metadataBase: new URL(process.env.APP_URL ?? "http://localhost:3000"),
    title: { default: t.meta.titulo, template: "%s | VMD" },
    description: t.meta.descricao,
    applicationName: "VMD",
    robots: { index: true, follow: true },
    // Prévia ao compartilhar (WhatsApp, Instagram, LinkedIn...). A imagem vem de opengraph-image.tsx
    openGraph: {
      type: "website",
      locale: LOCALE_OG[idioma],
      siteName: t.meta.nomeSite,
      title: t.meta.titulo,
      description: t.meta.descricao,
    },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = { themeColor: "#181818", colorScheme: "dark" };

export default async function RootLayout({ children }: { children: ReactNode }) {
  // Renderização dinâmica: necessária para o Next aplicar o nonce da CSP aos scripts.
  await connection();
  const { idioma, t } = await obterTextos();

  return (
    <html lang={LANG_HTML[idioma]} className={`${oxanium.variable} ${manrope.variable} ${anton.variable}`}>
      <body>
        <IdiomaProvider idioma={idioma} t={t}>
          {children}
        </IdiomaProvider>
      </body>
    </html>
  );
}
