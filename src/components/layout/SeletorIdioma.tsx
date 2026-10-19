"use client";

import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { COOKIE_IDIOMA, IDIOMAS, LANG_HTML, localizar, NOME_IDIOMA, separarIdioma, type Idioma } from "@/i18n/config";
import { useTextos } from "@/i18n/cliente";
import { preencher } from "@/i18n/formatar";

/**
 * Seletor de idioma no cabeçalho: botão com a sigla atual e uma lista de links.
 * Os links são <a> comuns (não next/link): a troca recarrega a página para o layout raiz
 * renderizar de novo no idioma novo (lang do <html>, metadados e textos).
 * A escolha fica num cookie: a próxima visita sem prefixo volta para o idioma escolhido.
 */
export function SeletorIdioma() {
  const { idioma, t } = useTextos();
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);
  const listaId = useId();

  const { caminho } = separarIdioma(pathname);

  // Fecha ao clicar fora ou com Esc (devolvendo o foco ao botão)
  useEffect(() => {
    if (!aberto) return;
    const fora = (e: PointerEvent) => {
      if (!raiz.current?.contains(e.target as Node)) setAberto(false);
    };
    const tecla = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setAberto(false);
      raiz.current?.querySelector("button")?.focus();
    };
    document.addEventListener("pointerdown", fora);
    document.addEventListener("keydown", tecla);
    return () => {
      document.removeEventListener("pointerdown", fora);
      document.removeEventListener("keydown", tecla);
    };
  }, [aberto]);

  function escolher(novo: Idioma, e: MouseEvent<HTMLAnchorElement>) {
    document.cookie = `${COOKIE_IDIOMA}=${novo}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    // Mantém os filtros e a âncora da página atual (ex.: /atletas?posicao=Goleiro)
    e.preventDefault();
    window.location.assign(localizar(novo, caminho) + window.location.search + window.location.hash);
  }

  return (
    <div ref={raiz} className="idioma">
      <button
        type="button"
        className="idioma__botao"
        aria-expanded={aberto}
        aria-controls={listaId}
        aria-label={preencher(t.idioma.escolher, { idioma: NOME_IDIOMA[idioma] })}
        onClick={() => setAberto((v) => !v)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
        </svg>
        <span aria-hidden="true">{idioma.toUpperCase()}</span>
      </button>
      <ul id={listaId} className="idioma__lista" hidden={!aberto}>
        {IDIOMAS.map((i) => (
          <li key={i}>
            <a
              href={localizar(i, caminho)}
              hrefLang={LANG_HTML[i]}
              lang={LANG_HTML[i]}
              aria-current={i === idioma ? "true" : undefined}
              onClick={(e) => escolher(i, e)}
            >
              <span className="idioma__sigla" aria-hidden="true">
                {i.toUpperCase()}
              </span>
              {NOME_IDIOMA[i]}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
