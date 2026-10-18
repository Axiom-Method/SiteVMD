"use client";

import { m, useScroll, useSpring } from "motion/react";

/** Fio laranja na base do header que enche conforme a página rola. Decorativo. */
export function ProgressoRolagem() {
  const { scrollYProgress } = useScroll();
  const escala = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return <m.span className="progresso-rolagem" style={{ scaleX: escala }} aria-hidden="true" />;
}
