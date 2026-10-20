"use client";

import { useMemo, useState } from "react";
import { CardFifa } from "@/components/atletas/CardFifa";
import { RevelarGrupo, RevelarItem } from "@/components/ui/Revelar";
import type { PerfilAtleta } from "@/constants/atletas-perfil";
import { FILTROS_VAZIOS, type Filtros } from "@/constants/filtros-atletas";
import { useTextos } from "@/i18n/cliente";
import type { Dicionario } from "@/i18n/dicionarios";
import { preencher } from "@/i18n/formatar";
import { traduzirCategoria, traduzirValor } from "@/i18n/valores";
import { MODALIDADES } from "@/validations/atleta.schema";

/**
 * Busca de atletas (para técnicos e olheiros): nome, esporte, posição, categoria e clube.
 * Esporte lista todas as modalidades do cadastro; os demais filtros, só os valores existentes.
 * Os valores (na URL e na comparação) ficam em português; só o texto mostrado é traduzido.
 * Os filtros ficam na URL (?posicao=...&categoria=...), então a busca pode ser compartilhada.
 * A página lê a URL no servidor e entrega os filtros iniciais: a lista já vem renderizada
 * (sem useSearchParams, que deixaria a lista só no navegador e empurraria o rodapé ao carregar).
 */
type Campo = keyof Filtros;

const unicos = (lista: PerfilAtleta[], campo: "posicao" | "categoria" | "clube") =>
  [...new Set(lista.map((a) => a[campo]))].sort((a, b) => a.localeCompare(b, "pt-BR"));

const normalizar = (t: string) => t.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

/** Texto exibido de cada opção, por filtro. */
const EXIBIR: Record<Exclude<Campo, "q">, (t: Dicionario, valor: string) => string> = {
  esporte: (t, v) => traduzirValor(t, "modalidades", v),
  posicao: (t, v) => traduzirValor(t, "posicoes", v),
  categoria: traduzirCategoria,
  clube: (_t, v) => v,
};

export function FiltroAtletas({ atletas, inicial }: { atletas: PerfilAtleta[]; inicial: Filtros }) {
  const { t } = useTextos();
  const [filtros, setFiltros] = useState<Filtros>(inicial);

  const opcoes = useMemo(
    () => ({
      esporte: [...MODALIDADES],
      posicao: unicos(atletas, "posicao"),
      categoria: unicos(atletas, "categoria"),
      clube: unicos(atletas, "clube"),
    }),
    [atletas],
  );

  const filtrados = atletas.filter(
    (a) =>
      (!filtros.q || normalizar(a.nome).includes(normalizar(filtros.q))) &&
      (!filtros.esporte || a.esporte === filtros.esporte) &&
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
      <form className="busca-atletas" role="search" aria-label={t.atletas.busca} onSubmit={(e) => e.preventDefault()}>
        <label className="busca-atletas__campo busca-atletas__campo--nome">
          <span>{t.atletas.nome}</span>
          <input type="search" placeholder={t.atletas.buscarNome} value={filtros.q} onChange={(e) => aplicar({ ...filtros, q: e.target.value })} />
        </label>
        {(["esporte", "posicao", "categoria", "clube"] as const).map((f) => (
          <label key={f} className="busca-atletas__campo">
            <span>{t.atletas[f]}</span>
            <select value={filtros[f]} onChange={(e) => aplicar({ ...filtros, [f]: e.target.value })}>
              <option value="">{t.atletas.todas}</option>
              {opcoes[f].map((o) => (
                <option key={o} value={o}>
                  {EXIBIR[f](t, o)}
                </option>
              ))}
            </select>
          </label>
        ))}
        {ativos && (
          <button type="button" className="btn btn--contorno btn--sm busca-atletas__limpar" onClick={() => aplicar(FILTROS_VAZIOS)}>
            {t.atletas.limpar}
          </button>
        )}
      </form>

      <p className="busca-atletas__total" aria-live="polite">
        {filtrados.length === 1 ? t.atletas.umEncontrado : preencher(t.atletas.variosEncontrados, { n: filtrados.length })}
      </p>

      {filtrados.length === 0 ? (
        <p className="vazio">{t.atletas.vazio}</p>
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
