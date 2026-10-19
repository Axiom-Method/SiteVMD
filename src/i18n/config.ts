/**
 * Idiomas do site público.
 * O português fica sem prefixo (/atletas); os demais ganham o prefixo na URL (/en/atletas).
 * O src/middleware.ts tira o prefixo, reescreve para a rota real e avisa o idioma no cabeçalho x-idioma.
 * O painel admin fica só em português.
 */
export const IDIOMAS = ["pt", "en", "es", "it"] as const;
export type Idioma = (typeof IDIOMAS)[number];

export const IDIOMA_PADRAO: Idioma = "pt";

/** Cabeçalho interno (requisição) com o idioma resolvido pelo middleware. */
export const CABECALHO_IDIOMA = "x-idioma";
/** Cookie com o idioma escolhido no seletor: a próxima visita sem prefixo volta para ele. */
export const COOKIE_IDIOMA = "idioma";

/** Valor de <html lang> e do hreflang. */
export const LANG_HTML: Record<Idioma, string> = { pt: "pt-BR", en: "en", es: "es", it: "it" };
/** Locale do Intl (datas e números). */
export const LOCALE_INTL: Record<Idioma, string> = { pt: "pt-BR", en: "en-GB", es: "es-ES", it: "it-IT" };
export const LOCALE_OG: Record<Idioma, string> = { pt: "pt_BR", en: "en_US", es: "es_ES", it: "it_IT" };

/** Nome de cada idioma escrito nele mesmo (como aparece no seletor). */
export const NOME_IDIOMA: Record<Idioma, string> = { pt: "Português", en: "English", es: "Español", it: "Italiano" };

export function ehIdioma(valor: unknown): valor is Idioma {
  return typeof valor === "string" && (IDIOMAS as readonly string[]).includes(valor);
}

/** Separa o prefixo de idioma do caminho: "/en/atletas" → { idioma: "en", caminho: "/atletas" }. */
export function separarIdioma(pathname: string): { idioma: Idioma; caminho: string } {
  const [, primeiro, ...resto] = pathname.split("/");
  if (ehIdioma(primeiro) && primeiro !== IDIOMA_PADRAO) {
    return { idioma: primeiro, caminho: `/${resto.join("/")}` };
  }
  return { idioma: IDIOMA_PADRAO, caminho: pathname || "/" };
}

/**
 * Caminho interno no idioma: localizar("en", "/atletas") → "/en/atletas".
 * Links externos, âncoras (#) e o português ficam como estão.
 */
export function localizar(idioma: Idioma, href: string): string {
  if (idioma === IDIOMA_PADRAO || !href.startsWith("/") || href.startsWith("//")) return href;
  return href === "/" ? `/${idioma}` : href.startsWith("/#") ? `/${idioma}${href.slice(1)}` : `/${idioma}${href}`;
}

/**
 * Alternativas de idioma de uma página (hreflang) para o metadata do Next.
 * `caminho` é o caminho sem prefixo, ex.: "/atletas".
 */
export function alternativas(idioma: Idioma, caminho: string) {
  const languages: Record<string, string> = Object.fromEntries(IDIOMAS.map((i) => [LANG_HTML[i], localizar(i, caminho)]));
  languages["x-default"] = caminho;
  return { canonical: localizar(idioma, caminho), languages };
}
