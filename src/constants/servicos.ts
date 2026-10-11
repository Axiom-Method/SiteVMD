/**
 * Serviços oferecidos pela VMD, agrupados por área.
 * Não há preço fixo: o valor é definido em orçamento, conforme modalidade, cliente e serviço.
 */
export type GrupoServicos = {
  titulo: string;
  itens: readonly string[];
};

/** Quem a VMD atende: o serviço não se limita a atletas. */
export const PUBLICO_SERVICOS = [
  "Atletas",
  "Técnicos",
  "Profissionais do esporte",
  "Clubes e equipes",
  "Organizações esportivas",
] as const;

export const SERVICOS: readonly GrupoServicos[] = [
  {
    titulo: "Artes e conteúdo",
    itens: [
      "Artes e materiais para partidas e competições",
      "Artes para patrocinadores e campanhas",
      "Produção de vídeos",
      "Media day",
    ],
  },
  {
    titulo: "Divulgação e imprensa",
    itens: [
      "Conteúdos para divulgação de atletas e equipes",
      "Conteúdo para matérias e notícias esportivas",
      "Materiais de divulgação e comunicação para clubes, equipes e organizações esportivas",
      "Posicionamento digital",
    ],
  },
  {
    titulo: "Imagem e carreira",
    itens: [
      "Currículos e materiais de apresentação para atletas, técnicos e profissionais do esporte",
      "Identidade visual exclusiva",
      "Media kit profissional",
      "Preparação para entrevistas",
    ],
  },
] as const;
