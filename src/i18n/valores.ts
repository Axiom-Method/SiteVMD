import type { Estatistica } from "@/constants/atletas-perfil";
import type { Idioma } from "@/i18n/config";
import type { Dicionario } from "@/i18n/dicionarios";
import { preencher } from "@/i18n/formatar";

/**
 * Tradução na exibição dos valores que vêm dos dados (sempre gravados em português).
 * Os filtros continuam comparando o valor original; só o texto mostrado muda.
 */
type Lista = "posicoes" | "siglas" | "modalidades" | "pe" | "nacionalidades" | "estatisticas";

export function traduzirValor(t: Dicionario, lista: Lista, valor: string): string {
  return t.valores[lista][valor] ?? valor;
}

/** "Sub-17" → "U-17" / "Under 17"...; "Profissional" → "Professional"... */
export function traduzirCategoria(t: Dicionario, categoria: string): string {
  const sub = /^Sub-(\d+)$/.exec(categoria);
  if (sub) return preencher(t.valores.sub, { n: sub[1] });
  return t.valores.categorias[categoria] ?? categoria;
}

/** Sigla da posição no card; sem tradução, usa as três primeiras letras. */
export function siglaPosicao(t: Dicionario, posicao: string): string {
  return t.valores.siglas[posicao] ?? posicao.slice(0, 3).toUpperCase();
}

/** Rótulo de um número do perfil: tradução cadastrada no admin → dicionário → português. */
export function rotuloEstatistica(t: Dicionario, idioma: Idioma, e: Estatistica): string {
  return (idioma !== "pt" && e.traducoes?.[idioma]) || traduzirValor(t, "estatisticas", e.rotulo);
}
