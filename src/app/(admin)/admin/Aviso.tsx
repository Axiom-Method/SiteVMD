/** Aviso de resultado das ações do painel (vem na URL como ?ok= ou ?erro=). */
export function Aviso({ ok, erro }: { ok?: string | string[]; erro?: string | string[] }) {
  const texto = (v?: string | string[]) => (typeof v === "string" ? v.slice(0, 200) : undefined);
  if (texto(erro)) {
    return (
      <p className="admin-aviso admin-aviso--erro" role="alert">
        {texto(erro)}
      </p>
    );
  }
  if (texto(ok)) {
    return (
      <p className="admin-aviso admin-aviso--ok" role="status">
        {texto(ok)}
      </p>
    );
  }
  return null;
}
