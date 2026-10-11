/**
 * Conteúdo de vitrine dos planos (extraído do PDF comercial).
 * ATENÇÃO: o preço cobrado no checkout vem SEMPRE do banco de dados,
 * nunca daqui nem do front-end. Estes valores são só para exibição.
 */
export type PlanoId = "essencial" | "performance" | "elite-pro";

export type Plano = {
  id: PlanoId;
  nome: string;
  precoMensal: number; // em reais
  destaque?: boolean;
  heranca?: string;
  itens: readonly string[];
};

export const PLANOS: readonly Plano[] = [
  {
    id: "essencial",
    nome: "Plano Essencial",
    precoMensal: 180,
    itens: [
      "Artes de matchday",
      "Artes comemorativas",
      "Organização inicial do Instagram",
      "Planejamento básico de conteúdo",
      "Diagnóstico do perfil",
      "Área exclusiva do atleta (arquivos organizados)",
      "Suporte via WhatsApp",
    ],
  },
  {
    id: "performance",
    nome: "Plano Performance",
    precoMensal: 300,
    destaque: true,
    heranca: "Inclui tudo do plano Essencial +",
    itens: [
      "1 vídeo mensal",
      "Planejamento estratégico de conteúdo",
      "Calendário da temporada",
      "Artes para patrocinadores e campanhas",
      "Posicionamento digital",
      "Reunião estratégica",
      "Suporte de comunicação",
    ],
  },
  {
    id: "elite-pro",
    nome: "Plano Elite Pro",
    precoMensal: 500,
    heranca: "Inclui tudo do plano Performance +",
    itens: [
      "2 vídeos mensais",
      "Identidade visual exclusiva",
      "Media kit profissional",
      "Planejamento de imagem",
      "Preparação para entrevistas",
      "Media day",
      "Kit de boas-vindas VMD",
      "Relatório de evolução",
      "Acompanhamento personalizado",
    ],
  },
] as const;
