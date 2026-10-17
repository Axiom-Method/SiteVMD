import type { Metadata } from "next";
import Link from "next/link";
import { FundoEsportivo } from "@/components/home/FundoEsportivo";
import { CarrosselNoticias } from "@/components/noticias/CarrosselNoticias";
import { GaleriaDestaques } from "@/components/noticias/GaleriaDestaques";
import { MidiaThumb } from "@/components/noticias/MidiaThumb";
import { ButtonLink } from "@/components/ui/Button";
import { NOTICIAS, VIDEO_SEMANA, VIDEOS_DESTAQUE } from "@/constants/noticias";
import { linkWhatsApp } from "@/constants/site";
import { formatarData } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Notícias",
  description: "Gols, lances e melhores momentos dos atletas VMD, além das últimas notícias da assessoria.",
};

export default function NoticiasPage() {
  // TODO: trocar pelos services (video.service / noticia.service), apenas itens PUBLICADOS.
  const destaque = VIDEO_SEMANA;

  return (
    <>
      <section className="secao" aria-labelledby="gols-destaques">
        <FundoEsportivo tipo="pista" />
        <div className="container">
          <p className="eyebrow">Gols e destaques</p>
          <h1 id="gols-destaques" className="titulo-secao">
            Os melhores momentos dos <span className="destaque">nossos atletas.</span>
          </h1>

          <article className="destaque-semana">
            <Link href={`/atletas/${destaque.atletaSlug}`} className="destaque-semana__midia"
              tabIndex={-1}
              aria-label={`Assistir: ${destaque.titulo}`}
            >
              <MidiaThumb imagem={destaque.thumb} play duracao={destaque.duracao} grande />
            </Link>
            <div className="destaque-semana__info">
              <span className="selo">Destaque da semana</span>
              <h2 className="destaque-semana__titulo">{destaque.titulo}</h2>
              <p className="destaque-semana__meta">
                {destaque.atleta} · {destaque.competicao} ·{" "}
                <time dateTime={destaque.data}>{formatarData(destaque.data)}</time>
              </p>
              <ButtonLink href={`/atletas/${destaque.atletaSlug}`} className="btn--sm">
                Assistir agora
              </ButtonLink>
            </div>
          </article>

          <GaleriaDestaques videos={VIDEOS_DESTAQUE} />
        </div>
      </section>

      <section className="secao secao--clara" aria-labelledby="ultimas-noticias">
        <div className="container">
          <p className="eyebrow">Notícias</p>
          <h2 id="ultimas-noticias" className="titulo-secao titulo-secao--pequeno">
            Últimas <span className="destaque">notícias.</span>
          </h2>
          {NOTICIAS.length === 0 ? (
            <p className="vazio">Em breve, novas notícias.</p>
          ) : (
            <CarrosselNoticias noticias={NOTICIAS} />
          )}
        </div>
      </section>

      <section className="cta-final" aria-labelledby="cta-noticias">
        <FundoEsportivo tipo="trofeu" />
        <div className="container centro">
          <h2 id="cta-noticias" className="titulo-secao">
            Seu talento merece <span className="destaque">ser visto.</span>
          </h2>
          <ButtonLink href={linkWhatsApp("Olá! Vim pelo site da VMD e quero saber mais sobre a assessoria.")}>
            Fale com a VMD
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
