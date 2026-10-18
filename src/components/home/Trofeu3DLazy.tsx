"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// Three.js só é baixado quando o troféu está prestes a aparecer (fora do bundle inicial)
const Trofeu3D = dynamic(() => import("@/components/home/Trofeu3D"), { ssr: false });

function suportaWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Espaço do troféu 3D: monta a cena quando chega perto da tela e pausa quando sai.
 * Sem WebGL, o espaço simplesmente não aparece. Com "reduzir movimento", o troféu fica parado.
 */
export function Trofeu3DLazy() {
  const ref = useRef<HTMLDivElement>(null);
  const [montar, setMontar] = useState(false);
  const [ativo, setAtivo] = useState(false);
  const [pronto, setPronto] = useState(false);
  const [suporte, setSuporte] = useState(true);
  const reduzir = useReducedMotion();

  useEffect(() => {
    if (!suportaWebGL()) {
      setSuporte(false);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        setAtivo(e.isIntersecting);
        if (e.isIntersecting) setMontar(true);
      },
      { rootMargin: "300px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (!suporte) return null;

  return (
    <div ref={ref} className={pronto ? "trofeu-3d trofeu-3d--pronto" : "trofeu-3d"} aria-hidden="true">
      {montar && <Trofeu3D ativo={ativo} girar={!reduzir} aoPronto={() => setPronto(true)} />}
    </div>
  );
}
