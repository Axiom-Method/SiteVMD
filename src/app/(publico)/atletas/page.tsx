import type { Metadata } from "next";
import { CardAtleta } from "@/components/atletas/CardAtleta";
import { ATLETAS_DESTAQUE } from "@/constants/atletas-destaque";

export const metadata: Metadata = {
  title: "Atletas",
  description: "Conheça os atletas representados pela VMD.",
};

export default function AtletasPage() {
  // TODO: busca com filtros (posição, categoria, clube) validados com Zod no servidor,
  // listando apenas atletas com status PUBLICADO.
  return (
    <section className="secao">
      <div className="container">
        <h1 className="titulo-secao">
          Nossos <span className="destaque">atletas</span>
        </h1>
        <div className="grade grade--4">
          {ATLETAS_DESTAQUE.map((a) => (
            <CardAtleta key={a.slug} atleta={a} />
          ))}
        </div>
      </div>
    </section>
  );
}
