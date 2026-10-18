"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import type { AtletaResumo } from "@/constants/atletas-destaque";
import { iniciais } from "@/lib/utils";

/**
 * Carrossel infinito no estilo X: card ativo centralizado, com o anterior e o próximo
 * aparecendo na mesma medida dos dois lados.
 * O loop usa 3 cópias da lista; ao parar fora da cópia do meio, o scroll salta
 * (sem animação) para o card equivalente nela, então o salto é imperceptível.
 */
export function CarrosselAtletas({ atletas }: { atletas: readonly AtletaResumo[] }) {
  const trilhoRef = useRef<HTMLUListElement>(null);
  const total = atletas.length;
  const infinito = total > 1;
  const copias = infinito ? 3 : 1;

  /** Posição de scroll que centraliza o item de índice `i` no trilho. */
  const centroDe = useCallback((t: HTMLUListElement, i: number) => {
    const item = t.children[i] as HTMLElement | undefined;
    return item ? item.offsetLeft - (t.clientWidth - item.offsetWidth) / 2 : 0;
  }, []);

  /** Se o card centralizado está numa cópia de borda, salta para o mesmo card na cópia do meio. */
  const normalizar = useCallback(() => {
    const t = trilhoRef.current;
    if (!t || !infinito) return;
    const largura = centroDe(t, total) - centroDe(t, 0); // largura de uma cópia inteira
    const meioIni = centroDe(t, total) - largura / (2 * total);
    const meioFim = meioIni + largura;
    if (t.scrollLeft < meioIni) t.scrollLeft += largura;
    else if (t.scrollLeft >= meioFim) t.scrollLeft -= largura;
  }, [centroDe, infinito, total]);

  // Começa no primeiro atleta da cópia do meio (assim o último já aparece à esquerda)
  useLayoutEffect(() => {
    const t = trilhoRef.current;
    if (t) t.scrollLeft = centroDe(t, infinito ? total : 0);
  }, [centroDe, infinito, total]);

  useEffect(() => {
    const t = trilhoRef.current;
    if (!t || !infinito) return;
    let timer: ReturnType<typeof setTimeout>;
    // "scrollend" ainda não existe em todo navegador; o debounce cobre os demais
    const aoRolar = () => {
      clearTimeout(timer);
      timer = setTimeout(normalizar, 140);
    };
    t.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", normalizar);
    return () => {
      clearTimeout(timer);
      t.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", normalizar);
    };
  }, [infinito, normalizar]);

  function rolar(direcao: 1 | -1) {
    const t = trilhoRef.current;
    if (!t) return;
    // Avança exatamente um card (largura do card + gap); o snap alinha o resto
    const passo = centroDe(t, 1) - centroDe(t, 0) || t.clientWidth;
    t.scrollBy({ left: direcao * passo, behavior: "smooth" });
  }

  const itens = Array.from({ length: copias }, (_, c) =>
    atletas.map((a) => ({ atleta: a, copia: c, clone: infinito && c !== 1 })),
  ).flat();

  return (
    <div className="carrossel" role="region" aria-roledescription="carrossel" aria-label="Atletas em destaque">
      {infinito && (
        <button type="button" className="carrossel__seta carrossel__seta--esq" onClick={() => rolar(-1)} aria-label="Atleta anterior">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
      )}

      <ul ref={trilhoRef} className="carrossel__trilho">
        {itens.map(({ atleta: a, copia, clone }) => (
          // Cópias só existem para o loop: ficam fora da árvore de acessibilidade e do Tab
          <li key={`${copia}-${a.slug}`} className="carrossel__item" aria-hidden={clone || undefined}>
            <Link href={`/atletas/${a.slug}`} className="atleta-foto inclina inclina--suave" tabIndex={clone ? -1 : undefined}>
              {a.foto ? (
                <Image src={a.foto} alt="" fill sizes="(max-width: 640px) 84vw, 940px" className="atleta-foto__img" />
              ) : (
                <span className="atleta-foto__iniciais" aria-hidden="true">
                  {iniciais(a.nome)}
                </span>
              )}
              <span className="atleta-foto__info">
                <span className="atleta-foto__meta">
                  {a.posicao} · {a.categoria}
                </span>
                <span className="atleta-foto__nome">{a.nome}</span>
                <span className="atleta-foto__clube">{a.clube}</span>
                <span className="atleta-foto__link">
                  Ver perfil <span aria-hidden="true">→</span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {infinito && (
        <button type="button" className="carrossel__seta carrossel__seta--dir" onClick={() => rolar(1)} aria-label="Próximo atleta">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}
