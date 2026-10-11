import { FundoEsportivo } from "@/components/home/FundoEsportivo";
import { CarrosselAtletas } from "@/components/home/CarrosselAtletas";
import { ButtonLink } from "@/components/ui/Button";
import type { AtletaResumo } from "@/constants/atletas-destaque";

export function AtletasDestaque({ atletas }: { atletas: readonly AtletaResumo[] }) {
  return (
    <section className="secao secao--escura secao--carrossel" aria-labelledby="atletas-destaque">
      <FundoEsportivo tipo="pista" />
      <div className="container">
        <h2 id="atletas-destaque" className="titulo-secao">
          Resultados e <span className="destaque">atletas</span>
        </h2>
        <p className="subtitulo">Perfis aprovados e publicados pela equipe VMD.</p>

        {atletas.length === 0 ? (
          <p className="vazio">Em breve, novos atletas em destaque.</p>
        ) : (
          <CarrosselAtletas atletas={atletas} />
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
