import { CardPlano } from "@/components/planos/CardPlano";
import { PLANOS } from "@/constants/planos";

export function PlanosResumo() {
  return (
    <section className="secao secao--escura" aria-labelledby="planos-home">
      <div className="container">
        <h2 id="planos-home" className="titulo-secao">
          Nossos <span className="destaque">planos</span>
        </h2>
        <div className="grade grade--3">
          {PLANOS.map((p) => (
            <CardPlano key={p.id} plano={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
