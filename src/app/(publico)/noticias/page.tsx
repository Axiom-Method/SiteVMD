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
import { Revelar } from "@/components/ui/Revelar";
import { NOTICIAS, VIDEO_SEMANA, VIDEOS_DESTAQUE } from "@/constants/noticias";
import { linkWhatsApp } from "@/constants/site";
import { alternativas } from "@/i18n/config";
import { LinkIdioma } from "@/i18n/cliente";
import { formatarDataIdioma, preencher } from "@/i18n/formatar";
import { obterTextos } from "@/i18n/servidor";

export const metadata: Metadata = {
  title: "Notícias",
  description: "Gols, lances e melhores momentos dos atletas VMD, além das últimas notícias da assessoria.",
  alternates: { canonical: "/noticias" },
};

const MENSAGEM_CONTATO = "Olá! Vim pelo site da VMD e quero saber mais sobre a assessoria.";

export default function NoticiasPage() {
  // TODO: trocar pelos services (video.service / noticia.service), apenas itens PUBLICADOS.
  const destaque = VIDEO_SEMANA;

  return (
    <>
      <Holofote />
      <section className="secao" aria-labelledby="gols-destaques">
        <PalavraFundo>Destaques</PalavraFundo>
        <FundoEsportivo tipo="pista" />
        <div className="container">
          <Revelar>
            <p className="eyebrow">Gols e destaques</p>
            <h1 id="gols-destaques" className="titulo-secao">
              Os melhores momentos dos <span className="destaque">nossos atletas.</span>
            </h1>
            <p className="subtitulo">Gols, lances e jogadas que mostram o talento de quem a VMD representa.</p>
          </Revelar>

          <Revelar atraso={0.12}>
            <article className="destaque-semana">
              <Link
                href={`/atletas/${destaque.atletaSlug}`}
                className="destaque-semana__midia"
                tabIndex={-1}
                aria-label={`Assistir: ${destaque.titulo}`}
              >
                <MidiaThumb imagem={destaque.thumb} play duracao={destaque.duracao} grande />
              </Link>
              <div className="destaque-semana__info holofote inclina inclina--suave">
                <span className="selo">Destaque da semana</span>
                <h2 className="destaque-semana__titulo">{destaque.titulo}</h2>
                <p className="destaque-semana__meta">
                  {destaque.atleta} · {destaque.competicao} ·{" "}
                  <time dateTime={destaque.data}>{formatarData(destaque.data)}</time>
                </p>
                <ButtonLink href={`/atletas/${destaque.atletaSlug}`} className="btn--sm btn--seta">
                  Assistir agora
                  <Icone nome="seta" className="btn__seta" />
                </ButtonLink>
              </div>
            </article>
          </Revelar>

          <GaleriaDestaques videos={VIDEOS_DESTAQUE} />
        </div>
      </section>

      <section className="secao secao--escura" aria-labelledby="ultimas-noticias">
        <PalavraFundo lado="direita">Notícias</PalavraFundo>
        <FundoEsportivo tipo="raias" />
        <div className="container">
          <Revelar>
            <p className="eyebrow">Notícias</p>
            <h2 id="ultimas-noticias" className="titulo-secao">
              Últimas <span className="destaque">notícias</span>
            </h2>
            <p className="subtitulo">Conquistas, parcerias e bastidores da assessoria.</p>
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
            <p className="eyebrow">Próximo passo</p>
            <h2 id="cta-noticias" className="titulo-secao">
              Seu talento merece <span className="destaque">ser visto.</span>
            </h2>
          </Revelar>
          <Revelar className="acoes cta-final__acoes" atraso={0.15}>
            <ButtonLink href={linkWhatsApp(MENSAGEM_CONTATO)} className="btn--seta btn--brilho">
              Fale com a VMD
              <Icone nome="seta" className="btn__seta" />
            </ButtonLink>
            <ButtonLink href="/atletas" variant="contorno">
              Conhecer os atletas
            </ButtonLink>
          </Revelar>
        </div>
      </section>
    </>
  );
}
