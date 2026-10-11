export const SITE = {
  nome: "VMD",
  descricao: "Assessoria & Marketing Esportivo",
  // Deixe vazio para não renderizar o link no rodapé.
  instagram: "",
  // TODO: número do WhatsApp comercial, só dígitos com DDI + DDD (ex.: "5511999999999").
  // Vazio, o link abre o WhatsApp para o visitante escolher o contato.
  whatsapp: "",
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
