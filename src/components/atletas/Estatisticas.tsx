"use client";

import { animate, m, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import type { Atributo, Estatistica } from "@/constants/atletas-perfil";

const formato = new Intl.NumberFormat("pt-BR");

/**
 * Número que conta do zero até o valor quando entra na tela.
 * O HTML do servidor já traz o valor final (funciona sem JavaScript e para buscadores).
 */
function Contador({ valor }: { valor: number }) {
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
      onUpdate: (v) => (el.textContent = formato.format(Math.round(v))),
    });
    return () => controle.stop();
  }, [visivel, reduzir, valor]);

  return <span ref={ref}>{formato.format(valor)}</span>;
}

export function NumerosTemporada({ estatisticas }: { estatisticas: readonly Estatistica[] }) {
  return (
    <dl className="numeros">
      {estatisticas.map((e) => (
        <div key={e.rotulo} className="numero holofote">
          <dt>{e.rotulo}</dt>
          <dd>
            <Contador valor={e.valor} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Barras de atributos: preenchem da esquerda para a direita ao entrar na tela. */
export function BarrasAtributos({ atributos }: { atributos: readonly Atributo[] }) {
  return (
    <ul className="atributos">
      {atributos.map((a, i) => (
        <li key={a.sigla} className="atributo">
          <span className="atributo__nome">{a.nome}</span>
          <span className="atributo__trilho" aria-hidden="true">
            <m.span
              className="atributo__barra"
              style={{ width: `${a.valor}%` }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 1.1, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            />
          </span>
          <span className="atributo__valor">{a.valor}</span>
        </li>
      ))}
    </ul>
  );
}
