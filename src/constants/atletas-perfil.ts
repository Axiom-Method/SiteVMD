/**
 * MOCK temporário do perfil completo de cada atleta.
 * Substituir por atleta.service.ts (somente atletas com status PUBLICADO).
 *
 * Exposição mínima (LGPD): há atletas menores de idade, então o perfil público não traz
 * data de nascimento, documentos, endereço nem contato. O contato é sempre intermediado pela VMD.
 */
import { ATLETAS_DESTAQUE, type AtletaResumo } from "@/constants/atletas-destaque";
import { VIDEO_SEMANA, VIDEOS_DESTAQUE, type VideoDestaque } from "@/constants/noticias";

export type Estatistica = { rotulo: string; valor: number };

export type PerfilAtleta = AtletaResumo & {
  numero: number;
  alturaCm: number;
  pesoKg: number;
  pe: "Direito" | "Esquerdo" | "Ambidestro";
  nacionalidade: string;
  /** Sigla de 3 letras exibida no card. */
  pais: string;
  bio: string;
  temporada: string;
  estatisticas: readonly Estatistica[];
  conquistas: readonly string[];
  videos: readonly VideoDestaque[];
};

const videosDe = (slug: string) =>
  [VIDEO_SEMANA, ...VIDEOS_DESTAQUE].filter((v) => v.atletaSlug === slug);

type Extra = Omit<PerfilAtleta, keyof AtletaResumo | "videos">;

const EXTRAS: Record<string, Extra> = {
  "atleta-exemplo-1": {
    numero: 9, alturaCm: 181, pesoKg: 76, pe: "Direito", nacionalidade: "Brasileira", pais: "BRA",
    bio: "Centroavante de área, forte no jogo aéreo e na finalização de primeira. Artilheiro da equipe na última temporada.",
    temporada: "2026",
    estatisticas: [
      { rotulo: "Jogos", valor: 28 },
      { rotulo: "Gols", valor: 21 },
      { rotulo: "Assistências", valor: 7 },
      { rotulo: "Minutos", valor: 2214 },
    ],
    conquistas: ["Artilheiro da Copa Exemplo Sub-17", "Seleção do campeonato estadual"],
  },
  "atleta-exemplo-2": {
    numero: 10, alturaCm: 174, pesoKg: 68, pe: "Esquerdo", nacionalidade: "Brasileira", pais: "BRA",
    bio: "Meia criativo, organiza o jogo e chega na área com qualidade. Ótima leitura de passe entre linhas.",
    temporada: "2026",
    estatisticas: [
      { rotulo: "Jogos", valor: 31 },
      { rotulo: "Gols", valor: 9 },
      { rotulo: "Assistências", valor: 14 },
      { rotulo: "Minutos", valor: 2580 },
    ],
    conquistas: ["Campeão do Torneio Exemplo", "Melhor assistente da temporada"],
  },
  "atleta-exemplo-3": {
    numero: 4, alturaCm: 188, pesoKg: 81, pe: "Direito", nacionalidade: "Brasileira", pais: "BRA",
    bio: "Zagueiro de imposição física, vence pelo alto e sai jogando com segurança.",
    temporada: "2026",
    estatisticas: [
      { rotulo: "Jogos", valor: 26 },
      { rotulo: "Gols", valor: 3 },
      { rotulo: "Desarmes", valor: 64 },
      { rotulo: "Minutos", valor: 2290 },
    ],
    conquistas: ["Capitão da equipe Sub-15"],
  },
  "atleta-exemplo-4": {
    numero: 1, alturaCm: 190, pesoKg: 84, pe: "Direito", nacionalidade: "Brasileira", pais: "BRA",
    bio: "Goleiro de reflexos rápidos e boa saída de bola com os pés. Comunicação forte com a linha defensiva.",
    temporada: "2026",
    estatisticas: [
      { rotulo: "Jogos", valor: 30 },
      { rotulo: "Jogos sem sofrer gol", valor: 12 },
      { rotulo: "Defesas", valor: 97 },
      { rotulo: "Minutos", valor: 2700 },
    ],
    conquistas: ["Goleiro menos vazado do estadual"],
  },
  "atleta-exemplo-5": {
    numero: 6, alturaCm: 172, pesoKg: 66, pe: "Esquerdo", nacionalidade: "Brasileira", pais: "BRA",
    bio: "Lateral ofensivo, muito veloz no apoio e com bom cruzamento.",
    temporada: "2026",
    estatisticas: [
      { rotulo: "Jogos", valor: 24 },
      { rotulo: "Gols", valor: 2 },
      { rotulo: "Assistências", valor: 8 },
      { rotulo: "Minutos", valor: 1980 },
    ],
    conquistas: [],
  },
  "atleta-exemplo-6": {
    numero: 5, alturaCm: 179, pesoKg: 74, pe: "Ambidestro", nacionalidade: "Brasileira", pais: "BRA",
    bio: "Volante de marcação, protege a defesa e acelera a transição com passes verticais.",
    temporada: "2026",
    estatisticas: [
      { rotulo: "Jogos", valor: 29 },
      { rotulo: "Gols", valor: 4 },
      { rotulo: "Desarmes", valor: 71 },
      { rotulo: "Minutos", valor: 2475 },
    ],
    conquistas: ["Seleção do Torneio Exemplo"],
  },
};

export function buscarPerfil(slug: string): PerfilAtleta | undefined {
  const resumo = ATLETAS_DESTAQUE.find((a) => a.slug === slug);
  const extra = EXTRAS[slug];
  if (!resumo || !extra) return undefined;
  return { ...resumo, ...extra, videos: videosDe(slug) };
}

export function listarPerfis(): PerfilAtleta[] {
  return ATLETAS_DESTAQUE.map((a) => buscarPerfil(a.slug)).filter((p): p is PerfilAtleta => !!p);
}

export function slugsDosPerfis(): string[] {
  return ATLETAS_DESTAQUE.map((a) => a.slug).filter((s) => s in EXTRAS);
}
