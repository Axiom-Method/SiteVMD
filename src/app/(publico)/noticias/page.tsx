import type { Metadata } from "next";
import { FundoEsportivo } from "@/components/home/FundoEsportivo";
import { Trofeu3DLazy } from "@/components/home/Trofeu3DLazy";
import { CarrosselNoticias } from "@/components/noticias/CarrosselNoticias";
import { GaleriaDestaques } from "@/components/noticias/GaleriaDestaques";
import { MidiaThumb } from "@/components/noticias/MidiaThumb";
import { ButtonLink } from "@/components/ui/Button";
import { Holofote } from "@/components/ui/Holofote";
import { Icone } from "@/components/ui/Icone";
import { PalavraFundo } from "@/components/ui/PalavraFundo";
import { Destaque } from "@/components/ui/Destaque";
import { Revelar } from "@/components/ui/Revelar";
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
      <Holofote />
      <section className="secao" aria-labelledby="gols-destaques">
        <PalavraFundo>{t.noticias.fundoDestaques}</PalavraFundo>
        <FundoEsportivo tipo="pista" />
        <div className="container">
          <Revelar>
            <p className="eyebrow">{t.noticias.eyebrow}</p>
            <h1 id="gols-destaques" className="titulo-secao">
              <Destaque a={t.noticias.tituloA} b={t.noticias.tituloB} />
            </h1>
            <p className="subtitulo">{t.noticias.subtitulo}</p>
          </Revelar>

          <Revelar atraso={0.12}>
            <article className="destaque-semana">
              <LinkIdioma
                href={`/atletas/${destaque.atletaSlug}`}
                className="destaque-semana__midia"
                tabIndex={-1}
                aria-label={preencher(t.noticias.assistir, { titulo: destaque.titulo })}
              >
                <MidiaThumb imagem={destaque.thumb} play duracao={destaque.duracao} grande />
              </LinkIdioma>
              <div className="destaque-semana__info holofote inclina inclina--suave">
                <span className="selo">{t.noticias.destaqueSemana}</span>
                <h2 className="destaque-semana__titulo">{destaque.titulo}</h2>
                <p className="destaque-semana__meta">
                  {destaque.atleta} · {destaque.competicao} ·{" "}
                  <time dateTime={destaque.data}>{formatarDataIdioma(destaque.data, idioma)}</time>
                </p>
                <ButtonLink href={`/atletas/${destaque.atletaSlug}`} className="btn--sm btn--seta">
                  {t.noticias.assistirAgora}
                  <Icone nome="seta" className="btn__seta" />
                </ButtonLink>
              </div>
            </article>
          </Revelar>

          <GaleriaDestaques videos={VIDEOS_DESTAQUE} />
        </div>
      </section>

      <section className="secao secao--escura" aria-labelledby="ultimas-noticias">
        <PalavraFundo lado="direita">{t.noticias.fundoNoticias}</PalavraFundo>
        <FundoEsportivo tipo="raias" />
        <div className="container">
          <Revelar>
            <p className="eyebrow">{t.noticias.ultimasEyebrow}</p>
            <h2 id="ultimas-noticias" className="titulo-secao">
              <Destaque a={t.noticias.ultimasA} b={t.noticias.ultimasB} />
            </h2>
            <p className="subtitulo">{t.noticias.ultimasSubtitulo}</p>
          </Revelar>
          {NOTICIAS.length === 0 ? (
            <p className="vazio">{t.noticias.vazio}</p>
          ) : (
            <CarrosselNoticias noticias={NOTICIAS} />
          )}
        </div>
      </section>

      {/* Mesmo bloco final da Home (taça 3D ao fundo), sem o botão de cadastro */}
      <section className="cta-final" aria-labelledby="cta-noticias">
        <Trofeu3DLazy />
        <div className="container centro cta-final__conteudo">
          <Revelar>
            <p className="eyebrow">{t.ctaFinal.eyebrow}</p>
            <h2 id="cta-noticias" className="titulo-secao">
              <Destaque a={t.noticias.ctaA} b={t.noticias.ctaB} />
            </h2>
          </Revelar>
          <Revelar className="acoes cta-final__acoes" atraso={0.15}>
            <ButtonLink href={linkWhatsApp(t.noticias.ctaMensagem)} className="btn--seta btn--brilho">
              {t.noticias.ctaBotao}
              <Icone nome="seta" className="btn__seta" />
            </ButtonLink>
            <ButtonLink href="/atletas" variant="contorno">
              {t.hero.conhecerAtletas}
            </ButtonLink>
          </Revelar>
        </div>
      </section>
    </>
  );
}
