import { headers } from "next/headers";
import { cache } from "react";
import { CABECALHO_IDIOMA, ehIdioma, IDIOMA_PADRAO, type Idioma } from "@/i18n/config";
import { dicionarioDe } from "@/i18n/dicionarios";

/** Idioma da requisição atual (definido pelo src/middleware.ts a partir do prefixo da URL). */
export const obterIdioma = cache(async (): Promise<Idioma> => {
  const valor = (await headers()).get(CABECALHO_IDIOMA);
  return ehIdioma(valor) ? valor : IDIOMA_PADRAO;
});

/** Idioma e textos da requisição atual, para componentes de servidor e generateMetadata. */
export async function obterTextos() {
  const idioma = await obterIdioma();
  return { idioma, t: dicionarioDe(idioma) };
}
