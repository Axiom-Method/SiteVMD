import Link from "next/link";
import { MidiaThumb } from "@/components/noticias/MidiaThumb";
import { ROTULO_TIPO, type VideoDestaque } from "@/constants/noticias";
import { formatarData } from "@/lib/utils";

/** Card de vídeo. Leva ao perfil do atleta, onde fica a galeria de vídeos protegida. */
export function CardVideo({ video }: { video: VideoDestaque }) {
  return (
    <article className="video">
      <Link href={`/atletas/${video.atletaSlug}`} className="video__link">
        <MidiaThumb imagem={video.thumb} play duracao={video.duracao} />
        <p className="video__meta">
          <span className="video__tipo">{ROTULO_TIPO[video.tipo]}</span>
          <time dateTime={video.data}>{formatarData(video.data)}</time>
        </p>
        <h3 className="video__titulo">{video.titulo}</h3>
        <p className="video__atleta">{video.atleta}</p>
      </Link>
    </article>
  );
}
