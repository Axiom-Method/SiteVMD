"use client";

import { useActionState } from "react";
import { entrar, type EstadoLogin } from "./acoes";

export function FormLogin({ proximo }: { proximo?: string }) {
  const [estado, acao, enviando] = useActionState<EstadoLogin, FormData>(entrar, {});

  return (
    <form action={acao} className="admin-login__form" noValidate>
      {estado.erro && (
        <p className="admin-aviso admin-aviso--erro" role="alert">
          {estado.erro}
        </p>
      )}
      <input type="hidden" name="proximo" value={proximo ?? ""} />
      <div className="campo">
        <label htmlFor="email">E-mail</label>
        <input id="email" name="email" type="email" autoComplete="username" required defaultValue={estado.email} />
      </div>
      <div className="campo">
        <label htmlFor="senha">Senha</label>
        <input id="senha" name="senha" type="password" autoComplete="current-password" required />
      </div>
      <button type="submit" className="btn btn--primario" disabled={enviando}>
        {enviando ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
