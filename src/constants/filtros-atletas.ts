/**
 * Filtros da busca de atletas (/atletas). Fica fora do componente client para a página
 * (servidor) poder montar os filtros iniciais a partir da URL.
 */
export type Filtros = { q: string; posicao: string; categoria: string; clube: string };

export const FILTROS_VAZIOS: Filtros = { q: "", posicao: "", categoria: "", clube: "" };
