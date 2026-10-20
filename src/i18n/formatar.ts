import { LOCALE_INTL, type Idioma } from "@/i18n/config";

/**
 * Preenche os marcadores {nome} de um texto do dicionário.
 * Os textos ficam como string (e não função) para o dicionário poder ir do servidor ao navegador.
 */
export function preencher(texto: string, valores: Record<string, string | number>): string {
  return texto.replace(/\{(\w+)\}/g, (marca, chave: string) => (chave in valores ? String(valores[chave]) : marca));
}

/** Data ISO (aaaa-mm-dd) no formato do idioma, sem depender do fuso do servidor. */
export function formatarDataIdioma(iso: string, idioma: Idioma): string {
  const [ano, mes, dia] = iso.slice(0, 10).split("-").map(Number);
  return new Intl.DateTimeFormat(LOCALE_INTL[idioma], { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(ano, mes - 1, dia)),
  );
}

export function formatarNumero(valor: number, idioma: Idioma, opcoes?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(LOCALE_INTL[idioma], opcoes).format(valor);
}
