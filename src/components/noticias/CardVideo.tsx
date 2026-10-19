"use client";

import { MidiaThumb } from "@/components/noticias/MidiaThumb";
import type { VideoDestaque } from "@/constants/noticias";
import { LinkIdioma, useTextos } from "@/i18n/cliente";
import { formatarDataIdioma } from "@/i18n/formatar";

/** Card de vídeo. Leva ao perfil do atleta, onde fica a galeria de vídeos protegida. */
export function CardVideo({ video }: { video: VideoDestaque }) {
  const { idioma, t } = useTextos();
  return (
    <article className="video">
      <LinkIdioma href={`/atletas/${video.atletaSlug}`} className="video__link">
        <MidiaThumb imagem={video.thumb} play duracao={video.duracao} />
        <p className="video__meta">
          <span className="video__tipo">{t.videos.tipos[video.tipo]}</span>
          <time dateTime={video.data}>{formatarDataIdioma(video.data, idioma)}</time>
        </p>
        <h3 className="video__titulo">{video.titulo}</h3>
        <p className="video__atleta">{video.atleta}</p>
      </LinkIdioma>
    </article>
  );
}
