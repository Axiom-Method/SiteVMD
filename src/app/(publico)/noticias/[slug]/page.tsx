import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FundoEsportivo } from "@/components/home/FundoEsportivo";
import { CardNoticia } from "@/components/noticias/CardNoticia";
import { MidiaThumb } from "@/components/noticias/MidiaThumb";
import { DadosEstruturados } from "@/components/seo/DadosEstruturados";
import { Icone } from "@/components/ui/Icone";
import { Revelar } from "@/components/ui/Revelar";
import { buscarNoticia, NOTICIAS } from "@/constants/noticias";
import { formatarData } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

/** Enquanto as notícias não têm texto cadastrado (mock), mostra um aviso no lugar do corpo. */
const CORPO_PROVISORIO = [
  "Este é um texto provisório. O conteúdo completo da notícia será publicado pela equipe VMD pelo painel administrativo.",
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const noticia = buscarNoticia(slug);
  if (!noticia) return { title: "Notícia não encontrada" };
  return {
    title: noticia.titulo,
    description: (noticia.corpo?.[0] ?? noticia.titulo).slice(0, 160),
    alternates: { canonical: `/noticias/${noticia.slug}` },
    // O openGraph da página substitui o do layout: repete a imagem de prévia do site
    openGraph: { type: "article", publishedTime: noticia.data, title: noticia.titulo, images: ["/opengraph-image"] },
  };
}

export default async function NoticiaPage({ params }: Props) {
  const { slug } = await params;
  // TODO: trocar por noticiaService.buscarPublicada(slug) (só status PUBLICADO)
  const noticia = buscarNoticia(slug);
  if (!noticia) notFound();

  const outras = NOTICIAS.filter((n) => n.slug !== noticia.slug).slice(0, 3);
  const url = `${process.env.APP_URL ?? "http://localhost:3000"}/noticias/${noticia.slug}`;
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
          <Link href="/noticias" className="perfil__voltar">
            <span aria-hidden="true">←</span> Todas as notícias
          </Link>
          <Revelar>
            <time className="eyebrow" dateTime={noticia.data}>
              {formatarData(noticia.data)}
            </time>
            <h1 id="noticia-titulo" className="noticia-pagina__titulo">
              {noticia.titulo}
            </h1>
          </Revelar>
          <Revelar atraso={0.1}>
            <MidiaThumb imagem={noticia.imagem} rotulo="Foto · Imagem da notícia" grande />
          </Revelar>
          <div className="noticia-pagina__corpo">
            {(noticia.corpo ?? CORPO_PROVISORIO).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <a href={compartilhar} target="_blank" rel="noopener noreferrer" className="btn btn--contorno btn--sm noticia-pagina__compartilhar">
            <Icone nome="conversa" />
            Compartilhar no WhatsApp
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
