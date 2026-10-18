import { ImageResponse } from "next/og";

/** Imagem de prévia do site ao compartilhar o link (WhatsApp, Instagram, LinkedIn...). */
export const alt = "VMD | Assessoria & Marketing Esportivo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function ImagemCompartilhamento() {
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
          ASSESSORIA & MARKETING ESPORTIVO
        </div>
        <div style={{ fontSize: 190, fontWeight: 800, fontStyle: "italic", lineHeight: 1, marginTop: 24 }}>VMD</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 54, fontWeight: 700, lineHeight: 1.1, marginTop: 28 }}>
          <span>Transformamos presença digital em</span>
          <span style={{ color: "#e8550f" }}>posicionamento profissional.</span>
        </div>
      </div>
    ),
    size,
  );
}
