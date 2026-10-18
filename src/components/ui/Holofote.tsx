"use client";

import { useEffect } from "react";

/**
 * Efeitos de mouse nos cards, com um único listener delegado para a página toda:
 * - .holofote: brilho que segue o cursor (grava --mx/--my; o desenho está no CSS).
 * - .inclina: o card inclina em 3D na direção do cursor (grava --ax/--ay/--ang, lidos pela
 *   propriedade CSS `rotate`, que não conflita com o `transform` da animação de entrada).
 *   .inclina--suave reduz o ângulo (cards grandes).
 * Só em dispositivos com mouse; com "reduzir movimento" fica tudo desligado.
 */
const ANGULO_MAX = 8;
const ANGULO_SUAVE = 4;

export function Holofote() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let quadro = 0;
    let inclinado: HTMLElement | null = null;

    const endireitar = () => {
      inclinado?.style.removeProperty("--ang");
      inclinado = null;
    };

    const mover = (e: PointerEvent) => {
      const alvo = e.target as Element | null;
      const brilho = alvo?.closest<HTMLElement>(".holofote") ?? null;
      const card = alvo?.closest<HTMLElement>(".inclina") ?? null;
      if (card !== inclinado) endireitar();
      if (!brilho && !card) return;

      cancelAnimationFrame(quadro);
      quadro = requestAnimationFrame(() => {
        if (brilho) {
          const r = brilho.getBoundingClientRect();
          brilho.style.setProperty("--mx", `${e.clientX - r.left}px`);
          brilho.style.setProperty("--my", `${e.clientY - r.top}px`);
        }
        if (card) {
          const r = card.getBoundingClientRect();
          // -0.5 a 0.5 a partir do centro do card
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          const max = card.classList.contains("inclina--suave") ? ANGULO_SUAVE : ANGULO_MAX;
          // Eixo perpendicular ao deslocamento: o lado sob o cursor afunda
          card.style.setProperty("--ax", (-py).toFixed(3));
          card.style.setProperty("--ay", px.toFixed(3));
          card.style.setProperty("--ang", `${(Math.hypot(px, py) * 2 * max).toFixed(2)}deg`);
          inclinado = card;
        }
      });
    };

    document.addEventListener("pointermove", mover, { passive: true });
    document.documentElement.addEventListener("pointerleave", endireitar);
    return () => {
      cancelAnimationFrame(quadro);
      document.removeEventListener("pointermove", mover);
      document.documentElement.removeEventListener("pointerleave", endireitar);
    };
  }, []);

  return null;
}
