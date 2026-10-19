import type { Idioma } from "@/i18n/config";
import { en } from "@/i18n/dicionarios/en";
import { es } from "@/i18n/dicionarios/es";
import { it } from "@/i18n/dicionarios/it";
import { pt, type Dicionario } from "@/i18n/dicionarios/pt";

export type { Dicionario } from "@/i18n/dicionarios/pt";

const DICIONARIOS: Record<Idioma, Dicionario> = { pt, en, es, it };

export function dicionarioDe(idioma: Idioma): Dicionario {
  return DICIONARIOS[idioma];
}
