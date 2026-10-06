"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Detecta SINAIS de captura de tela (não a captura em si).
 * Cobre: PrintScreen, Win+Shift+S, Cmd+Shift+3/4/5, impressão (Ctrl/Cmd+P),
 * evento beforeprint, aba oculta e janela sem foco.
 * Não cobre: print do celular, foto da tela, ferramentas externas.
 */

const TEMPO_OCULTO_MS = 2000;

type Opcoes = {
  /** Ocultar quando a janela perde o foco (pega o recorte do Windows). */
  ocultarAoPerderFoco?: boolean;
};

export function useDeteccaoCaptura({ ocultarAoPerderFoco = true }: Opcoes = {}) {
  const [oculto, setOculto] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ocultarTemporariamente = useCallback(() => {
    setOculto(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      // Só reexibe se a janela estiver visível e com foco.
      if (document.visibilityState === "visible" && document.hasFocus()) {
        setOculto(false);
      }
    }, TEMPO_OCULTO_MS);
  }, []);

  useEffect(() => {
    const limparAreaDeTransferencia = () => {
      // O PrintScreen copia a imagem para a área de transferência.
      // Pode falhar sem permissão; por isso é só uma tentativa.
      navigator.clipboard?.writeText("").catch(() => {});
    };

    const aoPressionar = (e: KeyboardEvent) => {
      const tecla = e.key.toLowerCase();

      const printScreen = e.key === "PrintScreen";
      const recorteWindows = e.metaKey && e.shiftKey && tecla === "s";
      const capturaMac = e.metaKey && e.shiftKey && ["3", "4", "5"].includes(tecla);
      const imprimir = (e.ctrlKey || e.metaKey) && tecla === "p";

      if (printScreen || recorteWindows || capturaMac || imprimir) {
        ocultarTemporariamente();
        if (printScreen) limparAreaDeTransferencia();
        if (imprimir) e.preventDefault();
      }
    };

    const aoSoltar = (e: KeyboardEvent) => {
      // Alguns navegadores só disparam keyup para PrintScreen.
      if (e.key === "PrintScreen") {
        ocultarTemporariamente();
        limparAreaDeTransferencia();
      }
    };

    const aoMudarVisibilidade = () => {
      if (document.visibilityState === "hidden") setOculto(true);
      else ocultarTemporariamente();
    };

    const aoPerderFoco = () => {
      if (ocultarAoPerderFoco) setOculto(true);
    };

    const aoVoltarFoco = () => ocultarTemporariamente();
    const aoImprimir = () => setOculto(true);

    window.addEventListener("keydown", aoPressionar);
    window.addEventListener("keyup", aoSoltar);
    window.addEventListener("blur", aoPerderFoco);
    window.addEventListener("focus", aoVoltarFoco);
    window.addEventListener("beforeprint", aoImprimir);
    document.addEventListener("visibilitychange", aoMudarVisibilidade);

    return () => {
      window.removeEventListener("keydown", aoPressionar);
      window.removeEventListener("keyup", aoSoltar);
      window.removeEventListener("blur", aoPerderFoco);
      window.removeEventListener("focus", aoVoltarFoco);
      window.removeEventListener("beforeprint", aoImprimir);
      document.removeEventListener("visibilitychange", aoMudarVisibilidade);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [ocultarAoPerderFoco, ocultarTemporariamente]);

  return oculto;
}
