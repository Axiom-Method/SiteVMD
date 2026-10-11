/**
 * MOCK temporário, só para a Home não ficar vazia.
 * Substituir por atleta.service.ts (somente atletas com status PUBLICADO).
 * O card público expõe apenas dados não sensíveis.
 */
export type AtletaResumo = {
  slug: string;
  nome: string;
  posicao: string;
  categoria: string;
  clube: string;
};

export const ATLETAS_DESTAQUE: readonly AtletaResumo[] = [
  { slug: "atleta-exemplo-1", nome: "Atleta Exemplo 1", posicao: "Atacante", categoria: "Sub-17", clube: "Clube Exemplo" },
  { slug: "atleta-exemplo-2", nome: "Atleta Exemplo 2", posicao: "Meio-campo", categoria: "Sub-20", clube: "Clube Exemplo" },
  { slug: "atleta-exemplo-3", nome: "Atleta Exemplo 3", posicao: "Zagueiro", categoria: "Sub-15", clube: "Clube Exemplo" },
  { slug: "atleta-exemplo-4", nome: "Atleta Exemplo 4", posicao: "Goleiro", categoria: "Profissional", clube: "Clube Exemplo" },
];
