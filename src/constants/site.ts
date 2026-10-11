export const SITE = {
  nome: "VMD",
  descricao: "Assessoria & Marketing Esportivo",
  // Deixe vazio para não renderizar o link no rodapé.
  instagram: "",
} as const;

// O login é só da administração: não aparece na navegação pública.
export const NAV_PUBLICA = [
  { href: "/", rotulo: "Home" },
  { href: "/atletas", rotulo: "Atletas" },
  { href: "/planos", rotulo: "Planos" },
  { href: "/noticias", rotulo: "Notícias" },
] as const;
