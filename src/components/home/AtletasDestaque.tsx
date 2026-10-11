import { CardAtleta } from "@/components/atletas/CardAtleta";
import { ButtonLink } from "@/components/ui/Button";
import type { AtletaResumo } from "@/constants/atletas-destaque";

export function AtletasDestaque({ atletas }: { atletas: readonly AtletaResumo[] }) {
  return (
    <section className="secao secao--escura" aria-labelledby="atletas-destaque">
      <div className="container">
        <h2 id="atletas-destaque" className="titulo-secao">
          Resultados e <span className="destaque">atletas</span>
        </h2>
        <p className="subtitulo">Perfis aprovados e publicados pela equipe VMD.</p>

        {atletas.length === 0 ? (
          <p className="vazio">Em breve, novos atletas em destaque.</p>
        ) : (
          <div className="grade grade--4">
            {atletas.map((a) => (
              <CardAtleta key={a.slug} atleta={a} />
            ))}
          </div>
        )}

        <div className="centro">
          <ButtonLink href="/atletas" variant="contorno">
            Ver todos os atletas
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
