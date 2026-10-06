"use client";

import type { ReactNode } from "react";
import { useDeteccaoCaptura } from "@/hooks/useDeteccaoCaptura";

type Props = {
  children: ReactNode;
  /** Texto exibido enquanto o conteúdo está oculto. */
  mensagem?: string;
};

/**
 * Envolve o perfil do atleta. Ao detectar sinais de captura, oculta o
 * conteúdo e mostra um aviso. Dissuasão, não garantia de segurança:
 * combine com marca d'água no servidor e exposição mínima de dados.
 */
export function ConteudoProtegido({
  children,
  mensagem = "Conteúdo protegido. Volte à janela para continuar.",
}: Props) {
  const oculto = useDeteccaoCaptura();

  return (
    <div
      className="conteudo-protegido"
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      {/* O conteúdo continua montado (vídeos não reiniciam), só fica invisível. */}
      <div
        aria-hidden={oculto}
        style={{
          visibility: oculto ? "hidden" : "visible",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
      >
        {children}
      </div>

      {oculto && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2147483647,
            display: "grid",
            placeItems: "center",
            padding: "1.5rem",
            background: "#000",
            color: "#fff",
            textAlign: "center",
            fontSize: "1.125rem",
          }}
        >
          {mensagem}
        </div>
      )}

      {/* Impressão: nada do perfil sai no papel ou no "Salvar como PDF". */}
      <style>{`
        @media print {
          .conteudo-protegido { display: none !important; }
        }
      `}</style>
    </div>
  );
}
