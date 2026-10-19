import type { Metadata } from "next";
import { FundoEsportivo } from "@/components/home/FundoEsportivo";
import { CarrosselNoticias } from "@/components/noticias/CarrosselNoticias";
import { GaleriaDestaques } from "@/components/noticias/GaleriaDestaques";
import { MidiaThumb } from "@/components/noticias/MidiaThumb";
import { ButtonLink } from "@/components/ui/Button";
import { Destaque } from "@/components/ui/Destaque";
import { NOTICIAS, VIDEO_SEMANA, VIDEOS_DESTAQUE } from "@/constants/noticias";
import { linkWhatsApp } from "@/constants/site";
import { alternativas } from "@/i18n/config";
import { LinkIdioma } from "@/i18n/cliente";
import { formatarDataIdioma, preencher } from "@/i18n/formatar";
import { obterTextos } from "@/i18n/servidor";

export async function generateMetadata(): Promise<Metadata> {
  const { idioma, t } = await obterTextos();
  return { title: t.noticias.metaTitulo, description: t.noticias.metaDescricao, alternates: alternativas(idioma, "/noticias") };
}

export default async function NoticiasPage() {
  const { idioma, t } = await obterTextos();
  // TODO: trocar pelos services (video.service / noticia.service), apenas itens PUBLICADOS.
  const destaque = VIDEO_SEMANA;

  return (
    <>
      <section className="secao" aria-labelledby="gols-destaques">
        <FundoEsportivo tipo="pista" />
        <div className="container">
          <p className="eyebrow">{t.noticias.eyebrow}</p>
          <h1 id="gols-destaques" className="titulo-secao">
            <Destaque a={t.noticias.tituloA} b={t.noticias.tituloB} />
          </h1>

          <article className="destaque-semana">
            <LinkIdioma href={`/atletas/${destaque.atletaSlug}`} className="destaque-semana__midia"
              tabIndex={-1}
              aria-label={preencher(t.noticias.assistir, { titulo: destaque.titulo })}
            >
              <MidiaThumb imagem={destaque.thumb} play duracao={destaque.duracao} grande />
            </LinkIdioma>
            <div className="destaque-semana__info">
              <span className="selo">{t.noticias.destaqueSemana}</span>
              <h2 className="destaque-semana__titulo">{destaque.titulo}</h2>
              <p className="destaque-semana__meta">
                {destaque.atleta} · {destaque.competicao} ·{" "}
                <time dateTime={destaque.data}>{formatarDataIdioma(destaque.data, idioma)}</time>
              </p>
              <ButtonLink href={`/atletas/${destaque.atletaSlug}`} className="btn--sm">
                {t.noticias.assistirAgora}
              </ButtonLink>
            </div>
          </article>

          <GaleriaDestaques videos={VIDEOS_DESTAQUE} />
        </div>
      </section>

      <section className="secao secao--clara" aria-labelledby="ultimas-noticias">
        <div className="container">
          <p className="eyebrow">{t.noticias.ultimasEyebrow}</p>
          <h2 id="ultimas-noticias" className="titulo-secao titulo-secao--pequeno">
            <Destaque a={t.noticias.ultimasA} b={t.noticias.ultimasB} />
          </h2>
          {NOTICIAS.length === 0 ? (
            <p className="vazio">{t.noticias.vazio}</p>
          ) : (
            <CarrosselNoticias noticias={NOTICIAS} />
          )}
        </div>
      </section>

      <section className="cta-final" aria-labelledby="cta-noticias">
        <FundoEsportivo tipo="trofeu" />
        <div className="container centro">
          <h2 id="cta-noticias" className="titulo-secao">
            <Destaque a={t.noticias.ctaA} b={t.noticias.ctaB} />
          </h2>
          <ButtonLink href={linkWhatsApp(t.noticias.ctaMensagem)}>
            {t.noticias.ctaBotao}
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
