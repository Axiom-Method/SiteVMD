import { FundoEsportivo } from "@/components/home/FundoEsportivo";
import { CarrosselAtletas } from "@/components/home/CarrosselAtletas";
import { ButtonLink } from "@/components/ui/Button";
import type { AtletaResumo } from "@/constants/atletas-destaque";
import { Revelar } from "@/components/ui/Revelar";
import { PalavraFundo } from "@/components/ui/PalavraFundo";
import { Destaque } from "@/components/ui/Destaque";
import { obterTextos } from "@/i18n/servidor";

export async function AtletasDestaque({ atletas }: { atletas: readonly AtletaResumo[] }) {
  const { t } = await obterTextos();
  return (
    <section className="secao secao--escura secao--carrossel" aria-labelledby="atletas-destaque">
      <PalavraFundo>{t.destaques.fundo}</PalavraFundo>
      <FundoEsportivo tipo="pista" />
      <div className="container">
        <Revelar>
          <p className="eyebrow">{t.destaques.eyebrow}</p>
          <h2 id="atletas-destaque" className="titulo-secao">
            <Destaque a={t.destaques.tituloA} b={t.destaques.tituloB} />
          </h2>
          <p className="subtitulo">{t.destaques.subtitulo}</p>
        </Revelar>

        {atletas.length === 0 ? (
          <p className="vazio">{t.destaques.vazio}</p>
        ) : (
          <CarrosselAtletas atletas={atletas} />
        )}

        <div className="centro">
          <ButtonLink href="/atletas" variant="contorno">
            {t.destaques.verTodos}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
