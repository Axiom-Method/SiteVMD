"use client";

import { MidiaThumb } from "@/components/noticias/MidiaThumb";
import type { NoticiaResumo } from "@/constants/noticias";
import { LinkIdioma, useTextos } from "@/i18n/cliente";
import { formatarDataIdioma } from "@/i18n/formatar";

export function CardNoticia({ noticia }: { noticia: NoticiaResumo }) {
  const { idioma, t } = useTextos();
  return (
    <article className="noticia">
      <LinkIdioma href={`/noticias/${noticia.slug}`} className="noticia__link">
        <MidiaThumb imagem={noticia.imagem} rotulo={t.noticias.imagem} />
        <time className="noticia__data" dateTime={noticia.data}>
          {formatarDataIdioma(noticia.data, idioma)}
        </time>
        <h3 className="noticia__titulo">{noticia.titulo}</h3>
        <span className="noticia__mais">
          {t.noticias.lerMais} <span aria-hidden="true">→</span>
        </span>
      </LinkIdioma>
    </article>
  );
}
