/**
 * Perfil completo de cada atleta (ficha, bio, conquistas).
 * Substituir por atleta.service.ts (somente atletas com status PUBLICADO).
 *
 * Exposição mínima (LGPD): há atletas menores de idade, então o perfil público não traz
 * data de nascimento, documentos, endereço nem contato. O contato é sempre intermediado pela VMD.
 *
 * Os campos da ficha são opcionais: o que ainda não foi informado simplesmente não aparece.
 * Preencher em EXTRAS (por slug) só com dados confirmados pelo atleta/VMD.
 */
import { ATLETAS_DESTAQUE, type AtletaResumo } from "@/constants/atletas-destaque";
import { VIDEO_SEMANA, VIDEOS_DESTAQUE, type VideoDestaque } from "@/constants/noticias";

/** Um número do perfil. `traducoes` vem dos campos cadastrados no painel admin (sem ela, usa o dicionário). */
export type Estatistica = { rotulo: string; valor: number; traducoes?: Partial<Record<"en" | "es" | "it", string>> };

export type PerfilAtleta = AtletaResumo & {
  numero?: number;
  alturaCm?: number;
  pesoKg?: number;
  pe?: "Direito" | "Esquerdo" | "Ambidestro";
  nacionalidade?: string;
  /** Sigla de 3 letras exibida no card. */
  pais?: string;
  bio?: string;
  temporada: string;
  estatisticas: readonly Estatistica[];
  conquistas: readonly string[];
  videos: readonly VideoDestaque[];
};

const videosDe = (slug: string) =>
  [VIDEO_SEMANA, ...VIDEOS_DESTAQUE].filter((v) => v.atletaSlug === slug);

type Extra = Partial<Omit<PerfilAtleta, keyof AtletaResumo | "videos">>;

/** Temporada mostrada quando o atleta ainda não tem números lançados no painel. */
const TEMPORADA_ATUAL = String(new Date().getFullYear());

const EXTRAS: Record<string, Extra> = {};

export function buscarPerfil(slug: string): PerfilAtleta | undefined {
  const resumo = ATLETAS_DESTAQUE.find((a) => a.slug === slug);
  if (!resumo) return undefined;
  const extra = EXTRAS[slug] ?? {};
  return {
    ...resumo,
    ...extra,
    temporada: extra.temporada ?? TEMPORADA_ATUAL,
    estatisticas: extra.estatisticas ?? [],
    conquistas: extra.conquistas ?? [],
    videos: videosDe(slug),
  };
}

export function listarPerfis(): PerfilAtleta[] {
  return ATLETAS_DESTAQUE.map((a) => buscarPerfil(a.slug)).filter((p): p is PerfilAtleta => !!p);
}

export function slugsDosPerfis(): string[] {
  return ATLETAS_DESTAQUE.map((a) => a.slug);
}
