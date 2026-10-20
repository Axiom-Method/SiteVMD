import { ImageResponse } from "next/og";
import { pt } from "@/i18n/dicionarios/pt";
import { obterTextos } from "@/i18n/servidor";

/** Imagem de prévia do site ao compartilhar o link (WhatsApp, Instagram, LinkedIn...), no idioma da página. */
export const alt = pt.meta.titulo;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function ImagemCompartilhamento() {
  const { t } = await obterTextos();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#181818",
          backgroundImage: "radial-gradient(circle at 85% 20%, rgba(232,85,15,.55), transparent 55%)",
          color: "#f2f0ef",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, color: "#ea8326", fontSize: 30, letterSpacing: 8 }}>
          <div style={{ width: 70, height: 4, background: "#e8550f" }} />
          {t.meta.descricaoMarca.toUpperCase()}
        </div>
        <div style={{ fontSize: 190, fontWeight: 800, fontStyle: "italic", lineHeight: 1, marginTop: 24 }}>VMD</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 54, fontWeight: 700, lineHeight: 1.1, marginTop: 28 }}>
          <span>{t.og.linhaA}</span>
          <span style={{ color: "#e8550f" }}>{t.og.linhaB}</span>
        </div>
      </div>
    ),
    size,
  );
}
