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
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { useTextos } from "@/i18n/cliente";

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

/** Palavra gigante do pôster: cada letra sobe da base, em sequência. */
const PALAVRA = ["V", "M", "D"];

/**
 * Pôster em duas cópias com o mesmo layout: a de trás mostra só a palavra (o atleta passa na frente),
 * a da frente mostra só os textos (ficam por cima do atleta, como nas referências).
 */
function Poster({ frente = false }: { frente?: boolean }) {
  const { t } = useTextos();
  return (
    <div className={frente ? "hero__poster hero__poster--frente" : "hero__poster"}>
      <span className="hero__poster-sobre">
        {t.hero.posterSobre} <span className="hero__poster-selo">{t.hero.posterSelo}</span>
      </span>
      <span className="hero__marca">
        {PALAVRA.map((letra, i) => (
          <span key={i} style={{ "--i": i } as CSSProperties}>
            {letra}
          </span>
        ))}
      </span>
      <span className="hero__poster-sob">{t.hero.posterSob}</span>
    </div>
  );
}

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
  const { t } = useTextos();
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
      {/* De trás para frente: pôster (palavra gigante fatiada), contraluz, atleta, faíscas e rastros */}
      <CamadaParallax {...camada} profundidade={-6} rolagem={180}>
        <Poster />
      </CamadaParallax>
      <CamadaParallax {...camada} profundidade={12} rolagem={60}>
        <span className="hero__luz" />
        <div className="hero__atleta-caixa">
          <Image className="hero__atleta" src="/images/hero-atleta.webp" alt="" width={1237} height={1271} priority sizes="(max-width: 820px) 100vw, 68vw" />
        </div>
      </CamadaParallax>
      {/* Rastros de velocidade em diagonal, na frente do atleta (como as faixas da pista nos pôsteres) */}
      <div className="hero__rastros">
        <span />
        <span />
        <span />
      </div>
      {/* Textos do pôster na frente do atleta (mesmo movimento da palavra, que fica atrás) */}
      <CamadaParallax {...camada} profundidade={-6} rolagem={180}>
        <Poster frente />
      </CamadaParallax>
      <span className="hero__vertical">{t.hero.vertical}</span>
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
