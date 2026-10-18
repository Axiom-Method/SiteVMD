import { ImageResponse } from "next/og";
import { buscarPerfil, SIGLA_POSICAO } from "@/constants/atletas-perfil";

/** Prévia do perfil ao compartilhar: card do atleta com nota, posição e números. */
export const alt = "Perfil do atleta na VMD";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function ImagemAtleta({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const atleta = buscarPerfil(slug);
  const nome = atleta?.nome ?? "Atleta VMD";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 70,
          padding: "70px 90px",
          backgroundColor: "#141414",
          backgroundImage: "radial-gradient(circle at 20% 30%, rgba(232,85,15,.5), transparent 55%)",
          color: "#f2f0ef",
          fontFamily: "sans-serif",
        }}
      >
        {/* Mini card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: 300,
            height: 420,
            borderRadius: 28,
            border: "6px solid #e8550f",
            background: "linear-gradient(170deg, #2c2c2c, #0b0b0b)",
          }}
        >
          <div style={{ display: "flex", fontSize: 130, fontWeight: 800, color: "#ea8326", lineHeight: 1  }}>{atleta?.geral ?? "—"}</div>
          <div style={{ display: "flex", fontSize: 44, fontWeight: 700, marginTop: 10  }}>{atleta ? SIGLA_POSICAO[atleta.posicao] : ""}</div>
          <div style={{ display: "flex", fontSize: 26, color: "#bbb", marginTop: 30, letterSpacing: 6, fontStyle: "italic"  }}>VMD</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ display: "flex", fontSize: 28, color: "#ea8326", letterSpacing: 6  }}>
            {atleta ? `${atleta.posicao.toUpperCase()} · ${atleta.categoria.toUpperCase()}` : "ATLETA"}
          </div>
          <div style={{ display: "flex", fontSize: 78, fontWeight: 800, lineHeight: 1.05, marginTop: 16  }}>{nome.toUpperCase()}</div>
          <div style={{ display: "flex", fontSize: 32, color: "#ccc", marginTop: 14  }}>{atleta?.clube ?? ""}</div>
          {atleta && (
            <div style={{ display: "flex", gap: 46, marginTop: 44 }}>
              {atleta.estatisticas.slice(0, 3).map((e) => (
                <div key={e.rotulo} style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: 64, fontWeight: 800, color: "#e8550f", lineHeight: 1 }}>{e.valor}</span>
                  <span style={{ fontSize: 22, color: "#aaa", marginTop: 6 }}>{e.rotulo}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    ),
    size,
  );
}
