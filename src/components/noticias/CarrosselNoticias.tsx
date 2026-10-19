"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CardNoticia } from "@/components/noticias/CardNoticia";
import type { NoticiaResumo } from "@/constants/noticias";
import { useTextos } from "@/i18n/cliente";

const INTERVALO = 6000;

/**
 * Linha do tempo de notícias: a mais recente à esquerda, as mais antigas à direita.
 * A cada 6 s o trilho anda um card para a esquerda (rumo às mais antigas); no fim, volta ao início.
 * Pausa com o mouse em cima, com foco dentro, com a aba oculta, pelo botão ou com "reduzir movimento".
 */
export function CarrosselNoticias({ noticias }: { noticias: readonly NoticiaResumo[] }) {
  const { t } = useTextos();
  const trilhoRef = useRef<HTMLUListElement>(null);
  const [inicio, setInicio] = useState(true);
  const [fim, setFim] = useState(false);
  const [pausado, setPausado] = useState(false); // pelo botão
  const [suspenso, setSuspenso] = useState(false); // hover/foco
  const [semMovimento, setSemMovimento] = useState(false);
  // Muda a cada navegação manual para reiniciar a contagem dos 8 s
  const [reinicio, setReinicio] = useState(0);

  const ordenadas = [...noticias].sort((a, b) => b.data.localeCompare(a.data));

  const atualizarBordas = useCallback(() => {
    const t = trilhoRef.current;
    if (!t) return;
    setInicio(t.scrollLeft <= 2);
    setFim(t.scrollLeft + t.clientWidth >= t.scrollWidth - 2);
  }, []);

  const passo = useCallback(() => {
    const t = trilhoRef.current;
    const [a, b] = t ? (Array.from(t.children) as HTMLElement[]) : [];
    return a && b ? b.offsetLeft - a.offsetLeft : (t?.clientWidth ?? 0);
  }, []);

  const rolar = useCallback(
    (direcao: 1 | -1) => {
      const t = trilhoRef.current;
      if (!t) return;
      t.scrollBy({ left: direcao * passo(), behavior: semMovimento ? "auto" : "smooth" });
    },
    [passo, semMovimento],
  );

  useEffect(() => {
    const t = trilhoRef.current;
    if (!t) return;
    atualizarBordas();
    t.addEventListener("scroll", atualizarBordas, { passive: true });
    window.addEventListener("resize", atualizarBordas);
    return () => {
      t.removeEventListener("scroll", atualizarBordas);
      window.removeEventListener("resize", atualizarBordas);
    };
  }, [atualizarBordas]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setSemMovimento(mq.matches);
    const aoMudar = (e: MediaQueryListEvent) => setSemMovimento(e.matches);
    mq.addEventListener("change", aoMudar);
    return () => mq.removeEventListener("change", aoMudar);
  }, []);

  const automatico = !pausado && !suspenso && !semMovimento && !(inicio && fim);

  useEffect(() => {
    if (!automatico) return;
    const id = setInterval(() => {
      const t = trilhoRef.current;
      if (!t || document.hidden) return;
      // Chegou à mais antiga: volta para a mais recente
      if (t.scrollLeft + t.clientWidth >= t.scrollWidth - 2) t.scrollTo({ left: 0, behavior: "smooth" });
      else rolar(1);
    }, INTERVALO);
    return () => clearInterval(id);
  }, [automatico, rolar, reinicio]);

  function navegar(direcao: 1 | -1) {
    rolar(direcao);
    setReinicio((n) => n + 1);
  }

  return (
    <div
      className="carrossel-noticias"
      role="region"
      aria-roledescription="carrossel"
      aria-label={t.noticias.carrossel}
      onMouseEnter={() => setSuspenso(true)}
      onMouseLeave={() => setSuspenso(false)}
      onFocus={() => setSuspenso(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setSuspenso(false);
      }}
    >
      <div className="carrossel-noticias__controles">
        {!semMovimento && !(inicio && fim) && (
          <button
            type="button"
            className="carrossel-noticias__botao"
            onClick={() => setPausado((p) => !p)}
            aria-label={pausado ? t.noticias.retomar : t.noticias.pausar}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              {pausado ? <path className="cheio" d="M8 5.5v13l10.5-6.5z" /> : <path d="M9 6v12M15 6v12" />}
            </svg>
          </button>
        )}
        <button
          type="button"
          className="carrossel-noticias__botao"
          onClick={() => navegar(-1)}
          disabled={inicio}
          aria-label={t.noticias.recentes}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <button
          type="button"
          className="carrossel-noticias__botao"
          onClick={() => navegar(1)}
          disabled={fim}
          aria-label={t.noticias.antigas}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <ul ref={trilhoRef} className="carrossel-noticias__trilho" aria-live={automatico ? "off" : "polite"}>
        {ordenadas.map((n) => (
          <li key={n.slug} className="carrossel-noticias__item">
            <CardNoticia noticia={n} />
          </li>
        ))}
      </ul>
    </div>
  );
}
