"use client";

import { useMemo, useState } from "react";
import { CardVideo } from "@/components/noticias/CardVideo";
import { ROTULO_TIPO, type TipoDestaque, type VideoDestaque } from "@/constants/noticias";

const POR_PAGINA = 6;
const TIPOS = Object.keys(ROTULO_TIPO) as TipoDestaque[];

/** Grade de vídeos com filtro por tipo, atleta e competição, e "Carregar mais". */
export function GaleriaDestaques({ videos }: { videos: readonly VideoDestaque[] }) {
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
        <div className="filtros__grupo" role="group" aria-label="Filtrar por tipo">
          <button type="button" className="pilula" aria-pressed={tipo === ""} onClick={() => filtrar(setTipo)("")}>
            Todos
          </button>
          {TIPOS.map((t) => (
            <button key={t} type="button" className="pilula" aria-pressed={tipo === t} onClick={() => filtrar(setTipo)(t)}>
              {t === "gol" ? "Gols" : t === "lance" ? "Lances" : ROTULO_TIPO[t]}
            </button>
          ))}
        </div>
        <div className="filtros__grupo">
          <label className="pilula pilula--select">
            <span className="sr-only">Filtrar por atleta</span>
            <select value={atleta} onChange={(e) => filtrar(setAtleta)(e.target.value)}>
              <option value="">Atleta</option>
              {atletas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </label>
          <label className="pilula pilula--select">
            <span className="sr-only">Filtrar por competição</span>
            <select value={competicao} onChange={(e) => filtrar(setCompeticao)(e.target.value)}>
              <option value="">Competição</option>
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
        <p className="vazio">Nenhum vídeo encontrado com esses filtros.</p>
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
            Carregar mais
          </button>
        </div>
      )}
    </>
  );
}
