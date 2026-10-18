/**
 * Palavra gigante vazada atrás do conteúdo da seção (linguagem de pôster esportivo).
 * Decorativa: escondida dos leitores de tela. Desliza de leve com a rolagem (CSS, sem JS).
 */
export function PalavraFundo({ children, lado = "esquerda" }: { children: string; lado?: "esquerda" | "direita" }) {
  return (
    <span className={lado === "direita" ? "palavra-fundo palavra-fundo--direita" : "palavra-fundo"} aria-hidden="true">
      {children}
    </span>
  );
}
