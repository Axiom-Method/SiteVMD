/**
 * MOCK temporário, só para a Home não ficar vazia.
 * Substituir por atleta.service.ts (somente atletas com status PUBLICADO).
 * O card público expõe apenas dados não sensíveis.
 */
import type { MODALIDADES } from "@/validations/atleta.schema";

export type AtletaResumo = {
  slug: string;
  nome: string;
  /** Esporte (mesma lista do cadastro). */
  esporte: (typeof MODALIDADES)[number];
  posicao: string;
  categoria: string;
  clube: string;
  /** Foto do próprio atleta, usada como fundo do card. Ex.: /images/atletas/<slug>.webp */
  foto?: string;
};

// TODO: trocar pela foto real de cada atleta em public/images/atletas/<slug>.webp
const FOTO_PROVISORIA = "/images/hero-atleta.webp";

export const ATLETAS_DESTAQUE: readonly AtletaResumo[] = [
  { slug: "atleta-exemplo-1", nome: "Atleta Exemplo 1", esporte: "Futebol", posicao: "Atacante", categoria: "Sub-17", clube: "Clube Exemplo", foto: FOTO_PROVISORIA },
  { slug: "atleta-exemplo-2", nome: "Atleta Exemplo 2", esporte: "Futebol", posicao: "Meio-campo", categoria: "Sub-20", clube: "Clube Exemplo", foto: FOTO_PROVISORIA },
  { slug: "atleta-exemplo-3", nome: "Atleta Exemplo 3", esporte: "Futebol", posicao: "Zagueiro", categoria: "Sub-15", clube: "Clube Exemplo", foto: FOTO_PROVISORIA },
  { slug: "atleta-exemplo-4", nome: "Atleta Exemplo 4", esporte: "Futebol", posicao: "Goleiro", categoria: "Profissional", clube: "Clube Exemplo", foto: FOTO_PROVISORIA },
  { slug: "atleta-exemplo-5", nome: "Atleta Exemplo 5", esporte: "Futebol", posicao: "Lateral", categoria: "Sub-17", clube: "Clube Exemplo", foto: FOTO_PROVISORIA },
  { slug: "atleta-exemplo-6", nome: "Atleta Exemplo 6", esporte: "Futebol", posicao: "Volante", categoria: "Sub-20", clube: "Clube Exemplo", foto: FOTO_PROVISORIA },
];
