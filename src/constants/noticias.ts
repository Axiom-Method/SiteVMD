/**
 * MOCK temporário da página de notícias.
 * Substituir por video.service.ts e noticia.service.ts (somente itens com status PUBLICADO).
 */
/** Tipos de vídeo; o texto de cada um fica em t.videos.tipos (i18n/dicionarios). */
export const TIPOS_DESTAQUE = ["gol", "lance", "melhores-momentos"] as const;
export type TipoDestaque = (typeof TIPOS_DESTAQUE)[number];

export type VideoDestaque = {
  id: string;
  titulo: string;
  tipo: TipoDestaque;
  atleta: string;
  /** Slug do perfil do atleta, onde fica a galeria de vídeos. */
  atletaSlug: string;
  competicao: string;
  /** Data ISO (aaaa-mm-dd). */
  data: string;
  duracao: string;
  thumb?: string;
  /** Onde o vídeo está hospedado (só players permitidos na CSP; ver security/video-url.ts). */
  provedor?: "youtube" | "vimeo";
  /** ID do vídeo no provedor. Sem ID, o player mostra "vídeo em breve". */
  videoId?: string;
};

export type NoticiaResumo = {
  slug: string;
  titulo: string;
  data: string;
  imagem?: string;
  /** Parágrafos do texto. Sem corpo, a página mostra um texto provisório. */
  corpo?: readonly string[];
};

export function buscarNoticia(slug: string): NoticiaResumo | undefined {
  return NOTICIAS.find((n) => n.slug === slug);
}

export const VIDEO_SEMANA: VideoDestaque = {
  id: "destaque-semana",
  titulo: "Gol decisivo garante a vitória no último minuto",
  tipo: "gol",
  atleta: "Atleta Exemplo 1",
  atletaSlug: "atleta-exemplo-1",
  competicao: "Copa Exemplo Sub-17",
  data: "2026-10-12",
  duracao: "01:12",
};

const base = [
  { titulo: "Golaço de fora da área", tipo: "gol" },
  { titulo: "Finalização no ângulo", tipo: "lance" },
  { titulo: "Jogada individual e assistência", tipo: "gol" },
  { titulo: "Defesa decisiva nos acréscimos", tipo: "lance" },
  { titulo: "Melhores momentos da rodada", tipo: "melhores-momentos" },
  { titulo: "Gol de cabeça na final", tipo: "gol" },
] as const;

const competicoes = ["Copa Exemplo Sub-17", "Campeonato Estadual", "Torneio Exemplo"];

// 12 vídeos para o "Carregar mais" ter o que mostrar.
export const VIDEOS_DESTAQUE: readonly VideoDestaque[] = Array.from({ length: 12 }, (_, i) => {
  const b = base[i % base.length];
  const n = (i % 4) + 1;
  const seg = 20 + i * 4;
  return {
    id: `video-${i + 1}`,
    titulo: b.titulo,
    tipo: b.tipo,
    atleta: `Atleta Exemplo ${n}`,
    atletaSlug: `atleta-exemplo-${n}`,
    competicao: competicoes[i % competicoes.length],
    data: `2026-10-${String(10 - (i % 9)).padStart(2, "0")}`,
    duracao: `${String(Math.floor(seg / 60)).padStart(2, "0")}:${String(seg % 60).padStart(2, "0")}`,
  };
});

export const NOTICIAS: readonly NoticiaResumo[] = [
  { slug: "atleta-anunciado-em-novo-projeto", titulo: "Atleta é anunciado em novo projeto", data: "2026-10-14" },
  { slug: "vmd-fecha-parceria-com-patrocinador", titulo: "VMD fecha nova parceria com patrocinador", data: "2026-10-09" },
  { slug: "bastidores-da-sessao-de-fotos", titulo: "Bastidores da última sessão de fotos", data: "2026-10-02" },
  { slug: "atleta-convocado-para-selecao-estadual", titulo: "Atleta é convocado para a seleção estadual", data: "2026-09-26" },
  { slug: "vmd-participa-de-peneira-regional", titulo: "VMD acompanha atletas em peneira regional", data: "2026-09-18" },
  { slug: "novo-video-de-apresentacao", titulo: "Novo vídeo de apresentação chega às redes", data: "2026-09-10" },
  { slug: "atleta-renova-com-clube", titulo: "Atleta renova contrato com o clube", data: "2026-09-01" },
];
