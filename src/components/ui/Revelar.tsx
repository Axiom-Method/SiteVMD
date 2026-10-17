"use client";

import { domAnimation, LazyMotion, m, MotionConfig, type Variants } from "motion/react";
import type { ReactNode } from "react";

/**
 * Animações de entrada ao rolar (Motion, antigo Framer Motion).
 * - Anima uma vez só, quando o elemento entra na tela.
 * - Respeita "reduzir movimento": o MotionConfig desliga os deslocamentos e mantém só o fade.
 * - Só anima opacity/transform; não use em elementos cujo CSS tem `transition: transform`
 *   (o hover deles deve usar a propriedade `translate`, como em .passo).
 * - Precisa estar dentro do <MovimentoProvider> (hoje no layout público). Fora dele o `m`
 *   não anima e o conteúdo ficaria preso em opacity 0.
 */

const EASE_PREMIUM = [0.16, 1, 0.3, 1] as const;
const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const;

const item: Variants = {
  oculto: { opacity: 0, y: 28 },
  visivel: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_PREMIUM } },
};

// Versão avulsa: o atraso chega via `custom` (a transição da variant prevalece sobre a prop `transition`).
const itemAvulso: Variants = {
  oculto: item.oculto,
  visivel: (atraso: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_PREMIUM, delay: atraso },
  }),
};

const grupo: Variants = {
  oculto: {},
  visivel: { transition: { staggerChildren: 0.09 } },
};

type Tag = "div" | "li" | "ul" | "ol" | "p" | "h2";

type Props = {
  children: ReactNode;
  className?: string;
  /** Elemento HTML renderizado (mantém a semântica: ul/ol/li etc.). */
  as?: Tag;
  /** Atraso em segundos (só para o Revelar avulso). */
  atraso?: number;
};

/** Aplica a preferência de movimento do sistema a todas as animações abaixo dele. */
export function MovimentoProvider({ children }: { children: ReactNode }) {
  return (
    // LazyMotion + `m`: carrega só o pacote de animações DOM (bem menor que o `motion` completo).
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}

/** Bloco que sobe e aparece ao entrar na tela. */
export function Revelar({ children, className, as = "div", atraso = 0 }: Props) {
  const Comp = m[as];
  return (
    <Comp
      className={className}
      variants={itemAvulso}
      custom={atraso}
      initial="oculto"
      whileInView="visivel"
      viewport={VIEWPORT}
    >
      {children}
    </Comp>
  );
}

/** Contêiner que revela os filhos <RevelarItem> em sequência (efeito cascata). */
export function RevelarGrupo({ children, className, as = "div" }: Omit<Props, "atraso">) {
  const Comp = m[as];
  return (
    <Comp className={className} variants={grupo} initial="oculto" whileInView="visivel" viewport={VIEWPORT}>
      {children}
    </Comp>
  );
}

/** Item de um <RevelarGrupo>: herda o gatilho do grupo. */
export function RevelarItem({ children, className, as = "div" }: Omit<Props, "atraso">) {
  const Comp = m[as];
  return (
    <Comp className={className} variants={item}>
      {children}
    </Comp>
  );
}
