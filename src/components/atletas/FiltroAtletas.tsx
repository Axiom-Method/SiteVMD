"use client";

import { useMemo, useState } from "react";
import { CardFifa } from "@/components/atletas/CardFifa";
import { RevelarGrupo, RevelarItem } from "@/components/ui/Revelar";
import type { PerfilAtleta } from "@/constants/atletas-perfil";
import { FILTROS_VAZIOS, type Filtros } from "@/constants/filtros-atletas";

/**
 * Busca de atletas (para técnicos e olheiros): nome, posição, categoria e clube.
 * Os filtros ficam na URL (?posicao=...&categoria=...), então a busca pode ser compartilhada.
 * A página lê a URL no servidor e entrega os filtros iniciais: a lista já vem renderizada
 * (sem useSearchParams, que deixaria a lista só no navegador e empurraria o rodapé ao carregar).
 */
type Campo = keyof Filtros;

const unicos = (lista: PerfilAtleta[], campo: "posicao" | "categoria" | "clube") =>
  [...new Set(lista.map((a) => a[campo]))].sort((a, b) => a.localeCompare(b, "pt-BR"));

const normalizar = (t: string) => t.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

const ROTULOS: Record<Exclude<Campo, "q">, string> = { posicao: "Posição", categoria: "Categoria", clube: "Clube" };

export function FiltroAtletas({ atletas, inicial }: { atletas: PerfilAtleta[]; inicial: Filtros }) {
  const [filtros, setFiltros] = useState<Filtros>(inicial);

  const opcoes = useMemo(
    () => ({ posicao: unicos(atletas, "posicao"), categoria: unicos(atletas, "categoria"), clube: unicos(atletas, "clube") }),
    [atletas],
  );

  const filtrados = atletas.filter(
    (a) =>
      (!filtros.q || normalizar(a.nome).includes(normalizar(filtros.q))) &&
      (!filtros.posicao || a.posicao === filtros.posicao) &&
      (!filtros.categoria || a.categoria === filtros.categoria) &&
      (!filtros.clube || a.clube === filtros.clube),
  );

  function aplicar(novos: Filtros) {
    setFiltros(novos);
    // Atualiza a URL sem recarregar nem rolar a página
    const qs = new URLSearchParams(Object.entries(novos).filter(([, v]) => v)).toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }

  const ativos = Object.values(filtros).some(Boolean);

  return (
    <>
      <form className="busca-atletas" role="search" aria-label="Buscar atletas" onSubmit={(e) => e.preventDefault()}>
        <label className="busca-atletas__campo busca-atletas__campo--nome">
          <span>Nome</span>
          <input type="search" placeholder="Buscar pelo nome" value={filtros.q} onChange={(e) => aplicar({ ...filtros, q: e.target.value })} />
        </label>
        {(["posicao", "categoria", "clube"] as const).map((f) => (
          <label key={f} className="busca-atletas__campo">
            <span>{ROTULOS[f]}</span>
            <select value={filtros[f]} onChange={(e) => aplicar({ ...filtros, [f]: e.target.value })}>
              <option value="">Todas</option>
              {opcoes[f].map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>
        ))}
        {ativos && (
          <button type="button" className="btn btn--contorno btn--sm busca-atletas__limpar" onClick={() => aplicar(FILTROS_VAZIOS)}>
            Limpar filtros
          </button>
        )}
      </form>

      <p className="busca-atletas__total" aria-live="polite">
        {filtrados.length === 1 ? "1 atleta encontrado" : `${filtrados.length} atletas encontrados`}
      </p>

      {filtrados.length === 0 ? (
        <p className="vazio">Nenhum atleta com esses filtros. Tente outra combinação.</p>
      ) : (
        // key: refaz a entrada em cascata quando o resultado muda
        <RevelarGrupo as="ul" key={filtrados.map((a) => a.slug).join()} className="grade-cards">
          {filtrados.map((a) => (
            <RevelarItem as="li" key={a.slug}>
              <CardFifa atleta={a} mini />
            </RevelarItem>
          ))}
        </RevelarGrupo>
      )}
    </>
  );
}
