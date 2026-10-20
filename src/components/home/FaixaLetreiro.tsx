"use client";

import { useTextos } from "@/i18n/cliente";

/**
 * Letreiro em movimento contínuo com o vocabulário da VMD.
 * As palavras são decorativas (aria-hidden): o mesmo conteúdo está nas seções.
 * Pausa no hover e fica parado com "reduzir movimento".
 * A lista é renderizada duas vezes e o trilho anda 50%: o loop não tem emenda.
 */
function Sequencia() {
  const { t } = useTextos();
  return (
    <>
      {t.letreiro.palavras.map((p, i) => (
        <span key={p} className={i % 2 ? "letreiro__item letreiro__item--vazado" : "letreiro__item"}>
          {p}
          <span className="letreiro__sep" />
        </span>
      ))}
    </>
  );
}

export function FaixaLetreiro() {
  return (
    <div className="letreiro">
      {/* A faixa (inclinada) fica parada; só o trilho de texto anda dentro dela */}
      <div className="letreiro__faixa">
        <div className="letreiro__trilho" aria-hidden="true">
          <Sequencia />
          <Sequencia />
        </div>
      </div>
    </div>
  );
}
