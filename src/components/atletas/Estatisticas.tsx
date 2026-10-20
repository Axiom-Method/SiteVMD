"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import type { Estatistica } from "@/constants/atletas-perfil";
import { useTextos } from "@/i18n/cliente";
import { formatarNumero } from "@/i18n/formatar";
import { rotuloEstatistica } from "@/i18n/valores";

/**
 * Número que conta do zero até o valor quando entra na tela.
 * O HTML do servidor já traz o valor final (funciona sem JavaScript e para buscadores).
 */
function Contador({ valor }: { valor: number }) {
  const { idioma } = useTextos();
  const ref = useRef<HTMLSpanElement>(null);
  const visivel = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduzir = useReducedMotion();

  // Zera antes de aparecer, para a contagem partir do zero
  useEffect(() => {
    if (!reduzir && ref.current) ref.current.textContent = "0";
  }, [reduzir]);

  useEffect(() => {
    const el = ref.current;
    if (!visivel || reduzir || !el) return;
    const controle = animate(0, valor, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => (el.textContent = formatarNumero(Math.round(v), idioma)),
    });
    return () => controle.stop();
  }, [visivel, reduzir, valor, idioma]);

  return <span ref={ref}>{formatarNumero(valor, idioma)}</span>;
}

export function NumerosTemporada({ estatisticas }: { estatisticas: readonly Estatistica[] }) {
  const { idioma, t } = useTextos();
  if (estatisticas.length === 0) return <p className="vazio">{t.perfil.numerosVazio}</p>;
  return (
    <dl className="numeros">
      {estatisticas.map((e) => (
        <div key={e.rotulo} className="numero holofote">
          <dt>{rotuloEstatistica(t, idioma, e)}</dt>
          <dd>
            <Contador valor={e.valor} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
