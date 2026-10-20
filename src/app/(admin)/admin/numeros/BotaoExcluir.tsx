"use client";

/** Botão de excluir que pede confirmação antes de enviar o formulário. */
export function BotaoExcluir({ rotulo, valores }: { rotulo: string; valores: number }) {
  const aviso =
    valores > 0
      ? `Remover "${rotulo}"? Os ${valores} valor(es) já preenchidos nos atletas também serão apagados.`
      : `Remover "${rotulo}"?`;
  return (
    <button
      type="submit"
      className="btn btn--contorno btn--sm admin-perigo"
      onClick={(e) => {
        if (!window.confirm(aviso)) e.preventDefault();
      }}
    >
      Remover
    </button>
  );
}
