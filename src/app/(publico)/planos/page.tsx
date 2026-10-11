import type { Metadata } from "next";
import { CardPlano } from "@/components/planos/CardPlano";
import { PLANOS } from "@/constants/planos";

export const metadata: Metadata = {
  title: "Planos",
  description: "Conheça os planos VMD de assessoria e marketing esportivo para atletas.",
};

export default function PlanosPage() {
  return (
    <section className="secao">
      <div className="container">
        <h1 className="titulo-secao">
          Nossos <span className="destaque">planos</span>
        </h1>
        <p className="subtitulo">Escolha o plano ideal para o momento da sua carreira.</p>
        <div className="grade grade--3">
          {PLANOS.map((p) => (
            <CardPlano key={p.id} plano={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
