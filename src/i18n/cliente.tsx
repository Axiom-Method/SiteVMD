"use client";

import Link from "next/link";
import { createContext, useContext, type ComponentProps, type ReactNode } from "react";
import { localizar, type Idioma } from "@/i18n/config";
import type { Dicionario } from "@/i18n/dicionarios";

type Contexto = { idioma: Idioma; t: Dicionario };

const IdiomaContexto = createContext<Contexto | null>(null);

/**
 * Entrega o idioma e o dicionário aos componentes de cliente.
 * Fica no layout raiz; recebe só o dicionário do idioma atual (não os quatro).
 */
export function IdiomaProvider({ idioma, t, children }: Contexto & { children: ReactNode }) {
  return <IdiomaContexto.Provider value={{ idioma, t }}>{children}</IdiomaContexto.Provider>;
}

/** Idioma e textos da página, para componentes de cliente. */
export function useTextos(): Contexto {
  const contexto = useContext(IdiomaContexto);
  if (!contexto) throw new Error("useTextos precisa estar dentro do <IdiomaProvider> (layout raiz).");
  return contexto;
}

/** next/link que mantém o idioma atual no endereço (/atletas → /en/atletas). */
export function LinkIdioma({ href, ...props }: Omit<ComponentProps<typeof Link>, "href"> & { href: string }) {
  const { idioma } = useTextos();
  return <Link href={localizar(idioma, href)} {...props} />;
}
