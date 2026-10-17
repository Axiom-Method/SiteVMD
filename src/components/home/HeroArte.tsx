"use client";

import Image from "next/image";
import {
  m,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * Arte da Hero em camadas com profundidade:
 * - Rolagem: as camadas de trás descem mais devagar que as da frente (parallax).
 * - Mouse (só desktop): as camadas seguem o cursor, cada uma na sua intensidade.
 * Com "reduzir movimento" a arte fica parada. Tudo é decorativo (aria-hidden).
 */

/** Faíscas que sobem atrás do atleta: posições fixas (iguais no servidor e no cliente). */
const FAISCAS = Array.from({ length: 18 }, (_, i) => ({
  x: 40 + ((i * 37) % 55), // % da largura, concentradas do meio para a direita
  atraso: (i * 0.73) % 6,
  duracao: 5 + ((i * 1.3) % 4),
  tamanho: 2 + (i % 3),
}));

type Camada = { profundidade: number; rolagem: number; children: ReactNode };

function CamadaParallax({
  profundidade,
  rolagem,
  progresso,
  mx,
  my,
  parado,
  children,
}: Camada & { progresso: MotionValue<number>; mx: MotionValue<number>; my: MotionValue<number>; parado: boolean }) {
  const x = useTransform(mx, (v) => v * profundidade);
  const y = useTransform([progresso, my], ([p, v]: number[]) => p * rolagem + v * profundidade);
  return (
    <m.div className="hero__camada" style={parado ? undefined : { x, y }}>
      {children}
    </m.div>
  );
}

export function HeroArte() {
  const ref = useRef<HTMLDivElement>(null);
  const reduzir = useReducedMotion();

  const { scrollYProgress: progresso } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Posição do mouse normalizada (-1 a 1), suavizada por mola
  const alvoX = useMotionValue(0);
  const alvoY = useMotionValue(0);
  const mx = useSpring(alvoX, { stiffness: 60, damping: 18 });
  const my = useSpring(alvoY, { stiffness: 60, damping: 18 });

  useEffect(() => {
    const hero = ref.current?.parentElement;
    if (!hero || reduzir || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const mover = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      alvoX.set(((e.clientX - r.left) / r.width - 0.5) * 2);
      alvoY.set(((e.clientY - r.top) / r.height - 0.5) * 2);
    };
    const sair = () => {
      alvoX.set(0);
      alvoY.set(0);
    };
    hero.addEventListener("pointermove", mover);
    hero.addEventListener("pointerleave", sair);
    return () => {
      hero.removeEventListener("pointermove", mover);
      hero.removeEventListener("pointerleave", sair);
    };
  }, [alvoX, alvoY, reduzir]);

  const camada = { progresso, mx, my, parado: !!reduzir };

  return (
    <div ref={ref} className="hero__arte" aria-hidden="true">
      {/* De trás para frente: marca VMD, contraluz, atleta e faíscas */}
      <CamadaParallax {...camada} profundidade={-6} rolagem={180}>
        <span className="hero__marca">VMD</span>
      </CamadaParallax>
      <CamadaParallax {...camada} profundidade={12} rolagem={60}>
        <span className="hero__luz" />
        <div className="hero__atleta-caixa">
          <Image className="hero__atleta" src="/images/hero-atleta.webp" alt="" width={1237} height={1271} priority sizes="(max-width: 820px) 100vw, 68vw" />
        </div>
      </CamadaParallax>
      <div className="hero__faiscas">
        {FAISCAS.map((f, i) => (
          <span
            key={i}
            className="faisca"
            style={{ left: `${f.x}%`, width: f.tamanho, height: f.tamanho, animationDelay: `${f.atraso}s`, animationDuration: `${f.duracao}s` }}
          />
        ))}
      </div>
    </div>
  );
}
