import type { Estatistica } from "@/constants/atletas-perfil";
import type { Idioma } from "@/i18n/config";
import type { Dicionario } from "@/i18n/dicionarios";
import { preencher } from "@/i18n/formatar";

/**
 * Tradução na exibição dos valores que vêm dos dados (sempre gravados em português).
 * Os filtros continuam comparando o valor original; só o texto mostrado muda.
 */
type Lista = "posicoes" | "siglas" | "modalidades" | "pe" | "nacionalidades" | "estatisticas";

// Valor ausente (atleta ainda sem posição, categoria...) vira texto vazio: quem exibe decide esconder.
export function traduzirValor(t: Dicionario, lista: Lista, valor?: string): string {
  if (!valor) return "";
  return t.valores[lista][valor] ?? valor;
}

/** "Sub-17" → "U-17" / "Under 17"...; "Profissional" → "Professional"... */
export function traduzirCategoria(t: Dicionario, categoria?: string): string {
  if (!categoria) return "";
  const sub = /^Sub-(\d+)$/.exec(categoria);
  if (sub) return preencher(t.valores.sub, { n: sub[1] });
  return t.valores.categorias[categoria] ?? categoria;
}

/** Sigla da posição no card; sem tradução, usa as três primeiras letras. */
export function siglaPosicao(t: Dicionario, posicao?: string): string {
  if (!posicao) return "";
  return t.valores.siglas[posicao] ?? posicao.slice(0, 3).toUpperCase();
}

/** "Ala · Sub-17", só com o que o atleta tiver; vazio se ainda não tiver posição nem categoria. */
export function funcaoAtleta(t: Dicionario, posicao?: string, categoria?: string): string {
  return [traduzirValor(t, "posicoes", posicao), traduzirCategoria(t, categoria)].filter(Boolean).join(" · ");
}

/** Tira "{posicao}, {categoria}" de um texto quando o atleta ainda não tem esses dados. */
export function semFuncao(texto: string, funcao: string): string {
  if (funcao) return texto;
  return texto.replace(" ({posicao}, {categoria})", "").replace("{posicao}, {categoria}, ", "");
}

/** Rótulo de um número do perfil: tradução cadastrada no admin → dicionário → português. */
export function rotuloEstatistica(t: Dicionario, idioma: Idioma, e: Estatistica): string {
  return (idioma !== "pt" && e.traducoes?.[idioma]) || traduzirValor(t, "estatisticas", e.rotulo);
}
