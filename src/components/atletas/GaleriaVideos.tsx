"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MidiaThumb } from "@/components/noticias/MidiaThumb";
import { RevelarGrupo, RevelarItem } from "@/components/ui/Revelar";
import type { TipoDestaque, VideoDestaque } from "@/constants/noticias";
import { useTextos } from "@/i18n/cliente";
import { formatarDataIdioma, preencher } from "@/i18n/formatar";
import { urlDoPlayer } from "@/security/video-url";

/**
 * Vídeos do atleta: filtro por tipo e player em uma janela (<dialog>).
 * O iframe só é criado quando o visitante clica: até lá, nada do YouTube/Vimeo é carregado.
 */
export function GaleriaVideos({ videos }: { videos: readonly VideoDestaque[] }) {
  const { idioma, t } = useTextos();
  const [tipo, setTipo] = useState<TipoDestaque | "">("");
  const [aberto, setAberto] = useState<VideoDestaque | null>(null);
  const dialogo = useRef<HTMLDialogElement>(null);

  const tipos = useMemo(() => [...new Set(videos.map((v) => v.tipo))], [videos]);
  const filtrados = tipo ? videos.filter((v) => v.tipo === tipo) : videos;

  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    if (aberto && !d.open) d.showModal();
    if (!aberto && d.open) d.close();
  }, [aberto]);

  if (videos.length === 0) {
    return <p className="vazio">{t.videos.vazioAtleta}</p>;
  }

  const url = aberto?.provedor && aberto.videoId ? urlDoPlayer(aberto.provedor, aberto.videoId) : null;

  return (
    <>
      {tipos.length > 1 && (
        <div className="filtros__grupo" role="group" aria-label={t.videos.filtrarTipo}>
          <button type="button" className="pilula" aria-pressed={tipo === ""} onClick={() => setTipo("")}>
            {t.videos.todos}
          </button>
          {tipos.map((tp) => (
            <button key={tp} type="button" className="pilula" aria-pressed={tipo === tp} onClick={() => setTipo(tp)}>
              {t.videos.tipos[tp]}
            </button>
          ))}
        </div>
      )}

      {/* key: refaz a animação de entrada ao trocar o filtro */}
      <RevelarGrupo key={tipo} className="grade grade--3 grade--videos">
        {filtrados.map((v) => (
          <RevelarItem key={v.id}>
            <button type="button" className="video__link video__botao" onClick={() => setAberto(v)}>
              <MidiaThumb imagem={v.thumb} play duracao={v.duracao} />
              <span className="video__meta">
                <span className="video__tipo">{t.videos.tipos[v.tipo]}</span>
                <time dateTime={v.data}>{formatarDataIdioma(v.data, idioma)}</time>
              </span>
              <span className="video__titulo">{v.titulo}</span>
              <span className="video__atleta">{v.competicao}</span>
            </button>
          </RevelarItem>
        ))}
      </RevelarGrupo>

      <dialog
        ref={dialogo}
        className="player"
        aria-label={aberto ? preencher(t.videos.janela, { titulo: aberto.titulo }) : t.videos.video}
        onClose={() => setAberto(null)}
        // Clique fora do quadro (no fundo escurecido) fecha
        onClick={(e) => e.target === e.currentTarget && setAberto(null)}
      >
        {aberto && (
          <div className="player__conteudo">
            <div className="player__topo">
              <p className="player__titulo">{aberto.titulo}</p>
              <button type="button" className="player__fechar" onClick={() => setAberto(null)} aria-label={t.videos.fechar}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
            <div className="player__quadro">
              {url ? (
                <iframe
                  src={url}
                  title={aberto.titulo}
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              ) : (
                <p className="player__vazio">{t.videos.emBreve}</p>
              )}
            </div>
            <p className="player__meta">
              {t.videos.tipos[aberto.tipo]} · {aberto.competicao} · {formatarDataIdioma(aberto.data, idioma)}
            </p>
          </div>
        )}
      </dialog>
    </>
  );
}
