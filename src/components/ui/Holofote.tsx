"use client";

import { useEffect } from "react";

/** Cards que ganham o brilho que segue o mouse (o desenho do brilho está no CSS: .holofote). */
const SELETOR = ".holofote";

/**
 * Um único listener delegado para a página toda: grava a posição do cursor
 * em --mx/--my no card sob o mouse. Só em dispositivos com mouse; com
 * "reduzir movimento" o brilho fica desligado.
 */
export function Holofote() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let quadro = 0;
    const mover = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest<HTMLElement>(SELETOR);
      if (!card) return;
      cancelAnimationFrame(quadro);
      quadro = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    };
    document.addEventListener("pointermove", mover, { passive: true });
    return () => {
      cancelAnimationFrame(quadro);
      document.removeEventListener("pointermove", mover);
    };
  }, []);

  return null;
}
