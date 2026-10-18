export const SITE = {
  nome: "VMD",
  descricao: "Assessoria & Marketing Esportivo",
  // Deixe vazio para não renderizar o link no rodapé.
  instagram: "",
  // WhatsApp comercial: só dígitos, com DDI (55) + DDD.
  whatsapp: "5521984579102",
} as const;

/** Link do WhatsApp comercial com uma mensagem já preenchida. */
export function linkWhatsApp(mensagem: string): string {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

// O login é só da administração: não aparece na navegação pública.
export const NAV_PUBLICA = [
  { href: "/", rotulo: "Home" },
  { href: "/atletas", rotulo: "Atletas" },
  { href: "/#servicos", rotulo: "Serviços" },
  { href: "/noticias", rotulo: "Notícias" },
] as const;
