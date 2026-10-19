"use client";

import { useMemo, useState } from "react";
import { CardVideo } from "@/components/noticias/CardVideo";
import { TIPOS_DESTAQUE, type TipoDestaque, type VideoDestaque } from "@/constants/noticias";
import { useTextos } from "@/i18n/cliente";

const POR_PAGINA = 6;

/** Grade de vídeos com filtro por tipo, atleta e competição, e "Carregar mais". */
export function GaleriaDestaques({ videos }: { videos: readonly VideoDestaque[] }) {
  const { t } = useTextos();
  const [tipo, setTipo] = useState<TipoDestaque | "">("");
  const [atleta, setAtleta] = useState("");
  const [competicao, setCompeticao] = useState("");
  const [visiveis, setVisiveis] = useState(POR_PAGINA);

  const atletas = useMemo(() => [...new Set(videos.map((v) => v.atleta))].sort(), [videos]);
  const competicoes = useMemo(() => [...new Set(videos.map((v) => v.competicao))].sort(), [videos]);

  const filtrados = videos.filter(
    (v) => (!tipo || v.tipo === tipo) && (!atleta || v.atleta === atleta) && (!competicao || v.competicao === competicao),
  );

  // Todo filtro novo volta para a primeira página.
  function filtrar<T>(set: (v: T) => void) {
    return (v: T) => {
      set(v);
      setVisiveis(POR_PAGINA);
    };
  }

  return (
    <>
      <div className="filtros">
        <div className="filtros__grupo" role="group" aria-label={t.videos.filtrarPorTipo}>
          <button type="button" className="pilula" aria-pressed={tipo === ""} onClick={() => filtrar(setTipo)("")}>
            {t.videos.todos}
          </button>
          {TIPOS_DESTAQUE.map((tp) => (
            <button key={tp} type="button" className="pilula" aria-pressed={tipo === tp} onClick={() => filtrar(setTipo)(tp)}>
              {t.videos.tiposPlural[tp]}
            </button>
          ))}
        </div>
        <div className="filtros__grupo">
          <label className="pilula pilula--select">
            <span className="sr-only">{t.videos.filtrarAtleta}</span>
            <select value={atleta} onChange={(e) => filtrar(setAtleta)(e.target.value)}>
              <option value="">{t.videos.atleta}</option>
              {atletas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </label>
          <label className="pilula pilula--select">
            <span className="sr-only">{t.videos.filtrarCompeticao}</span>
            <select value={competicao} onChange={(e) => filtrar(setCompeticao)(e.target.value)}>
              <option value="">{t.videos.competicao}</option>
              {competicoes.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {filtrados.length === 0 ? (
        <p className="vazio">{t.videos.nenhum}</p>
      ) : (
        <div className="grade grade--3 grade--videos" aria-live="polite">
          {filtrados.slice(0, visiveis).map((v) => (
            <CardVideo key={v.id} video={v} />
          ))}
        </div>
      )}

      {visiveis < filtrados.length && (
        <div className="centro">
          <button type="button" className="btn btn--contorno btn--sm" onClick={() => setVisiveis((n) => n + POR_PAGINA)}>
            {t.videos.carregarMais}
          </button>
        </div>
      )}
    </>
  );
}
