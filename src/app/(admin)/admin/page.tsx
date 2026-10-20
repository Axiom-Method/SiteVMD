import Link from "next/link";
import { listarPerfis } from "@/constants/atletas-perfil";
import { obterAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

const ACOES: Record<string, string> = {
  login: "Entrou no painel",
  "login.falhou": "Tentativa de login falhou",
  "login.bloqueado": "Conta bloqueada por tentativas",
  "atleta.numeros": "Alterou números do atleta",
  "campo.criado": "Criou um número",
  "campo.alterado": "Alterou um número",
  "campo.excluido": "Removeu um número",
  "admin.senha_definida": "Senha de admin definida",
};

const dataHora = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo" });

export default async function PainelInicio() {
  const admin = await obterAdmin();
  const [campos, logs] = await Promise.all([
    db.campoEstatistica.count(),
    db.logAuditoria.findMany({ orderBy: { criadoEm: "desc" }, take: 8, include: { admin: { select: { nome: true } } } }),
  ]);

  return (
    <>
      <h1 className="admin__titulo">Olá, {admin?.nome}</h1>
      <div className="admin-cards">
        <Link href="/admin/atletas" className="admin-card">
          <strong>{listarPerfis().length}</strong>
          <span>Atletas</span>
          <small>Editar os números de cada atleta</small>
        </Link>
        <Link href="/admin/numeros" className="admin-card">
          <strong>{campos}</strong>
          <span>Números cadastrados</span>
          <small>Escolher o que cada esporte e posição mostra</small>
        </Link>
      </div>

      <h2 className="admin__subtitulo">Atividade recente</h2>
      {logs.length === 0 ? (
        <p className="vazio">Nada por aqui ainda.</p>
      ) : (
        <table className="admin-tabela">
          <thead>
            <tr>
              <th scope="col">Quando</th>
              <th scope="col">Quem</th>
              <th scope="col">O quê</th>
              <th scope="col">Onde</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id}>
                <td>{dataHora.format(l.criadoEm)}</td>
                <td>{l.admin?.nome ?? "—"}</td>
                <td>{ACOES[l.acao] ?? l.acao}</td>
                <td>{l.alvo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
