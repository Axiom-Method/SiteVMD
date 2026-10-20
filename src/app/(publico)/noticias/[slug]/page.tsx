import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FundoEsportivo } from "@/components/home/FundoEsportivo";
import { CardNoticia } from "@/components/noticias/CardNoticia";
import { MidiaThumb } from "@/components/noticias/MidiaThumb";
import { DadosEstruturados } from "@/components/seo/DadosEstruturados";
import { Icone } from "@/components/ui/Icone";
import { Revelar } from "@/components/ui/Revelar";
import { buscarNoticia, NOTICIAS } from "@/constants/noticias";
import { alternativas, localizar } from "@/i18n/config";
import { LinkIdioma } from "@/i18n/cliente";
import { formatarDataIdioma } from "@/i18n/formatar";
import { obterTextos } from "@/i18n/servidor";
import { Destaque } from "@/components/ui/Destaque";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const noticia = buscarNoticia(slug);
  const { idioma, t } = await obterTextos();
  if (!noticia) return { title: t.noticias.naoEncontrada };
  return {
    title: noticia.titulo,
    description: (noticia.corpo?.[0] ?? noticia.titulo).slice(0, 160),
    alternates: alternativas(idioma, `/noticias/${noticia.slug}`),
    // O openGraph da página substitui o do layout: repete a imagem de prévia do site
    openGraph: { type: "article", publishedTime: noticia.data, title: noticia.titulo, images: ["/opengraph-image"] },
  };
}

export default async function NoticiaPage({ params }: Props) {
  const { slug } = await params;
  // TODO: trocar por noticiaService.buscarPublicada(slug) (só status PUBLICADO)
  const noticia = buscarNoticia(slug);
  if (!noticia) notFound();
  const { idioma, t } = await obterTextos();

  const outras = NOTICIAS.filter((n) => n.slug !== noticia.slug).slice(0, 3);
  const url = `${process.env.APP_URL ?? "http://localhost:3000"}${localizar(idioma, `/noticias/${noticia.slug}`)}`;
  const compartilhar = `https://wa.me/?text=${encodeURIComponent(`${noticia.titulo} ${url}`)}`;

  return (
    <>
      <DadosEstruturados
        dados={{
          "@type": "NewsArticle",
          headline: noticia.titulo,
          datePublished: noticia.data,
          publisher: { "@type": "Organization", name: "VMD Assessoria & Marketing Esportivo" },
        }}
      />
      <article className="secao" aria-labelledby="noticia-titulo">
        <FundoEsportivo tipo="pista" />
        <div className="container noticia-pagina">
          <LinkIdioma href="/noticias" className="perfil__voltar">
            <span aria-hidden="true">←</span> {t.noticias.voltar}
          </LinkIdioma>
          <Revelar>
            <time className="eyebrow" dateTime={noticia.data}>
              {formatarDataIdioma(noticia.data, idioma)}
            </time>
            <h1 id="noticia-titulo" className="noticia-pagina__titulo">
              {noticia.titulo}
            </h1>
          </Revelar>
          <Revelar atraso={0.1}>
            <MidiaThumb imagem={noticia.imagem} rotulo={t.noticias.imagem} grande />
          </Revelar>
          <div className="noticia-pagina__corpo">
            {(noticia.corpo ?? [t.noticias.corpoProvisorio]).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <a href={compartilhar} target="_blank" rel="noopener noreferrer" className="btn btn--contorno btn--sm noticia-pagina__compartilhar">
            <Icone nome="conversa" />
            {t.noticias.compartilhar}
          </a>
        </div>
      </article>

      {outras.length > 0 && (
        <section className="secao secao--escura" aria-labelledby="outras-noticias">
          <div className="container">
            <Revelar>
              <p className="eyebrow">Continue lendo</p>
              <h2 id="outras-noticias" className="titulo-secao titulo-secao--pequeno">
                Outras <span className="destaque">notícias</span>
              </h2>
            </Revelar>
            <div className="grade grade--3">
              {outras.map((n) => (
                <CardNoticia key={n.slug} noticia={n} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
