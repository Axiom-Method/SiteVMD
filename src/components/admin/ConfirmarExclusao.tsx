"use client";

/** Botão de excluir genérico do painel: pede confirmação antes de enviar o formulário em volta. */
export function ConfirmarExclusao({ mensagem, rotulo = "Excluir" }: { mensagem: string; rotulo?: string }) {
  return (
    <button
      type="submit"
      className="btn btn--contorno btn--sm admin-perigo"
      onClick={(e) => {
        if (!window.confirm(mensagem)) e.preventDefault();
      }}
    >
      {rotulo}
    </button>
  );
}
