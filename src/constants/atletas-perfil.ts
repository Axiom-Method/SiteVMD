/**
 * MOCK temporário do perfil completo de cada atleta.
 * Substituir por atleta.service.ts (somente atletas com status PUBLICADO).
 *
 * Exposição mínima (LGPD): há atletas menores de idade, então o perfil público não traz
 * data de nascimento, documentos, endereço nem contato. O contato é sempre intermediado pela VMD.
 */
import { ATLETAS_DESTAQUE, type AtletaResumo } from "@/constants/atletas-destaque";
import { VIDEO_SEMANA, VIDEOS_DESTAQUE, type VideoDestaque } from "@/constants/noticias";

export type Atributo = { sigla: string; nome: string; valor: number };
export type Estatistica = { rotulo: string; valor: number };

export type PerfilAtleta = AtletaResumo & {
  /** Nota geral do card (estilo FIFA), de 0 a 99. */
  geral: number;
  numero: number;
  alturaCm: number;
  pesoKg: number;
  pe: "Direito" | "Esquerdo" | "Ambidestro";
  nacionalidade: string;
  /** Sigla de 3 letras exibida no card. */
  pais: string;
  bio: string;
  /** Seis atributos do card. Goleiros usam atributos próprios. */
  atributos: readonly Atributo[];
  temporada: string;
  estatisticas: readonly Estatistica[];
  conquistas: readonly string[];
  videos: readonly VideoDestaque[];
};

/** Sigla da posição exibida no card. */
export const SIGLA_POSICAO: Record<string, string> = {
  Atacante: "ATA",
  "Meio-campo": "MEI",
  Zagueiro: "ZAG",
  Goleiro: "GOL",
  Lateral: "LAT",
  Volante: "VOL",
};

const linha = (rit: number, fin: number, pas: number, dri: number, def: number, fis: number): Atributo[] => [
  { sigla: "RIT", nome: "Ritmo", valor: rit },
  { sigla: "FIN", nome: "Finalização", valor: fin },
  { sigla: "PAS", nome: "Passe", valor: pas },
  { sigla: "DRI", nome: "Drible", valor: dri },
  { sigla: "DEF", nome: "Defesa", valor: def },
  { sigla: "FIS", nome: "Físico", valor: fis },
];

const goleiro = (elas: number, man: number, pon: number, ref: number, vel: number, pos: number): Atributo[] => [
  { sigla: "ELA", nome: "Elasticidade", valor: elas },
  { sigla: "MAN", nome: "Manejo", valor: man },
  { sigla: "PON", nome: "Reposição", valor: pon },
  { sigla: "REF", nome: "Reflexos", valor: ref },
  { sigla: "VEL", nome: "Velocidade", valor: vel },
  { sigla: "POS", nome: "Posicionamento", valor: pos },
];

const videosDe = (slug: string) =>
  [VIDEO_SEMANA, ...VIDEOS_DESTAQUE].filter((v) => v.atletaSlug === slug);

type Extra = Omit<PerfilAtleta, keyof AtletaResumo | "videos">;

const EXTRAS: Record<string, Extra> = {
  "atleta-exemplo-1": {
    geral: 84, numero: 9, alturaCm: 181, pesoKg: 76, pe: "Direito", nacionalidade: "Brasileira", pais: "BRA",
    bio: "Centroavante de área, forte no jogo aéreo e na finalização de primeira. Artilheiro da equipe na última temporada.",
    atributos: linha(86, 88, 74, 82, 41, 79),
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
    geral: 82, numero: 10, alturaCm: 174, pesoKg: 68, pe: "Esquerdo", nacionalidade: "Brasileira", pais: "BRA",
    bio: "Meia criativo, organiza o jogo e chega na área com qualidade. Ótima leitura de passe entre linhas.",
    atributos: linha(80, 77, 87, 85, 52, 66),
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
    geral: 79, numero: 4, alturaCm: 188, pesoKg: 81, pe: "Direito", nacionalidade: "Brasileira", pais: "BRA",
    bio: "Zagueiro de imposição física, vence pelo alto e sai jogando com segurança.",
    atributos: linha(70, 45, 68, 62, 84, 85),
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
    geral: 81, numero: 1, alturaCm: 190, pesoKg: 84, pe: "Direito", nacionalidade: "Brasileira", pais: "BRA",
    bio: "Goleiro de reflexos rápidos e boa saída de bola com os pés. Comunicação forte com a linha defensiva.",
    atributos: goleiro(83, 79, 76, 85, 58, 80),
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
    geral: 77, numero: 6, alturaCm: 172, pesoKg: 66, pe: "Esquerdo", nacionalidade: "Brasileira", pais: "BRA",
    bio: "Lateral ofensivo, muito veloz no apoio e com bom cruzamento.",
    atributos: linha(88, 58, 74, 76, 70, 68),
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
    geral: 78, numero: 5, alturaCm: 179, pesoKg: 74, pe: "Ambidestro", nacionalidade: "Brasileira", pais: "BRA",
    bio: "Volante de marcação, protege a defesa e acelera a transição com passes verticais.",
    atributos: linha(72, 60, 79, 70, 81, 80),
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

export function slugsDosPerfis(): string[] {
  return ATLETAS_DESTAQUE.map((a) => a.slug).filter((s) => s in EXTRAS);
}
