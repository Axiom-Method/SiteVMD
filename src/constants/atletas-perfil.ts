/**
 * Perfil completo de cada atleta: dados do atleta (banco ou src/constants, ver atleta.service.ts)
 * + vídeos e números de exemplo.
 *
 * Exposição mínima (LGPD): há atletas menores de idade, então o perfil público não traz
 * data de nascimento, documentos, endereço nem contato. O contato é sempre intermediado pela VMD.
 * Campo sem valor aparece no perfil como "não compartilhado".
 */
import { VIDEO_SEMANA, VIDEOS_DESTAQUE, type VideoDestaque } from "@/constants/noticias";
import { buscarAtleta, listarAtletas, type DadosAtleta } from "@/services/atleta.service";

/** Um número do perfil. `traducoes` vem dos campos cadastrados no painel admin (sem ela, usa o dicionário). */
export type Estatistica = { rotulo: string; valor: number; traducoes?: Partial<Record<"en" | "es" | "it", string>> };

export type PerfilAtleta = DadosAtleta & {
  temporada: string;
  /** Números de exemplo (sem banco); com banco, vêm de estatistica.service.ts */
  estatisticas: readonly Estatistica[];
  conquistas: readonly string[];
  videos: readonly VideoDestaque[];
};

const videosDe = (slug: string) =>
  [VIDEO_SEMANA, ...VIDEOS_DESTAQUE].filter((v) => v.atletaSlug === slug);

const comExtras = (a: DadosAtleta): PerfilAtleta => ({
  ...a,
  temporada: String(new Date().getFullYear()),
  estatisticas: [],
  conquistas: [],
  videos: videosDe(a.slug),
});

export async function buscarPerfil(slug: string, opcoes?: { incluirOcultos?: boolean }): Promise<PerfilAtleta | undefined> {
  const atleta = await buscarAtleta(slug, opcoes);
  return atleta && comExtras(atleta);
}

export async function listarPerfis(opcoes?: { incluirOcultos?: boolean }): Promise<PerfilAtleta[]> {
  return (await listarAtletas(opcoes)).map(comExtras);
}

export async function slugsDosPerfis(): Promise<string[]> {
  return (await listarAtletas()).map((a) => a.slug);
}
