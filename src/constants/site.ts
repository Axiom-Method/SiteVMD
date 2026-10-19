export const SITE = {
  nome: "VMD",
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
// `chave` aponta para o texto em t.nav (i18n/dicionarios).
export const NAV_PUBLICA = [
  { href: "/", chave: "home" },
  { href: "/atletas", chave: "atletas" },
  { href: "/#servicos", chave: "servicos" },
  { href: "/noticias", chave: "noticias" },
] as const;
