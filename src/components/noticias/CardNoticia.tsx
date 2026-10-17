import Link from "next/link";
import { MidiaThumb } from "@/components/noticias/MidiaThumb";
import type { NoticiaResumo } from "@/constants/noticias";
import { formatarData } from "@/lib/utils";

export function CardNoticia({ noticia }: { noticia: NoticiaResumo }) {
  return (
    <article className="noticia">
      <Link href={`/noticias/${noticia.slug}`} className="noticia__link">
        <MidiaThumb imagem={noticia.imagem} rotulo="Foto · Imagem da notícia" />
        <time className="noticia__data" dateTime={noticia.data}>
          {formatarData(noticia.data)}
        </time>
        <h3 className="noticia__titulo">{noticia.titulo}</h3>
        <span className="noticia__mais">
          Ler mais <span aria-hidden="true">→</span>
        </span>
      </Link>
    </article>
  );
}
