"use client";

import { useState } from "react";

/**
 * Letreiro em movimento contínuo com o vocabulário da VMD.
 * As palavras são decorativas (aria-hidden): o mesmo conteúdo está nas seções.
 * Movimento contínuo precisa de controle de pausa (WCAG 2.2.2): botão no fim da faixa.
 * Também pausa no hover e fica parado com "reduzir movimento".
 * A lista é renderizada duas vezes e o trilho anda 50%: o loop não tem emenda.
 */
const PALAVRAS = [
  "Imagem",
  "Posicionamento",
  "Valorização",
  "Media day",
  "Produção de vídeos",
  "Identidade visual",
  "Media kit",
  "Gestão de carreira",
] as const;

function Sequencia() {
  return (
    <>
      {PALAVRAS.map((p, i) => (
        <span key={p} className={i % 2 ? "letreiro__item letreiro__item--vazado" : "letreiro__item"}>
          {p}
          <span className="letreiro__sep" />
        </span>
      ))}
    </>
  );
}

export function FaixaLetreiro() {
  const [pausado, setPausado] = useState(false);

  return (
    <div className={pausado ? "letreiro letreiro--pausado" : "letreiro"}>
      {/* A faixa (inclinada) fica parada; só o trilho de texto anda dentro dela */}
      <div className="letreiro__faixa">
        <div className="letreiro__trilho" aria-hidden="true">
          <Sequencia />
          <Sequencia />
        </div>
        <button
          type="button"
          className="letreiro__pausa"
          aria-pressed={pausado}
          aria-label={pausado ? "Retomar animação do letreiro" : "Pausar animação do letreiro"}
          onClick={() => setPausado((p) => !p)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {pausado ? <path d="M8 5.5v13l10.5-6.5z" /> : <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />}
          </svg>
        </button>
      </div>
    </div>
  );
}
