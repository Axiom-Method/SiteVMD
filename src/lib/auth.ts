import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { cache } from "react";
import { COOKIE_SESSAO } from "@/lib/auth-cookie";
import { bancoConfigurado, db } from "@/lib/db";

/**
 * Sessão do painel admin.
 * - O cookie leva um token aleatório de 32 bytes; o banco guarda só o SHA-256 dele
 *   (quem ler o banco não consegue se passar por ninguém).
 * - httpOnly (JavaScript da página não lê), SameSite=Lax, Secure e prefixo __Host- em produção.
 * - Expira em 8 horas; sair apaga a sessão no banco.
 * A validação de verdade é sempre no servidor (layout do admin e cada ação); o middleware
 * só manda para o login quem nem tem o cookie.
 */
const PRODUCAO = process.env.NODE_ENV === "production";
const DURACAO_MS = 8 * 60 * 60 * 1000;

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export async function criarSessao(adminId: string): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const expiraEm = new Date(Date.now() + DURACAO_MS);
  await db.sessao.create({ data: { tokenHash: hashToken(token), adminId, expiraEm } });
  (await cookies()).set(COOKIE_SESSAO, token, {
    httpOnly: true,
    secure: PRODUCAO,
    sameSite: "lax",
    path: "/",
    expires: expiraEm,
  });
}

export type AdminLogado = { id: string; nome: string; email: string };

/** Admin da requisição atual, ou null. Uma consulta por requisição (cache). */
export const obterAdmin = cache(async (): Promise<AdminLogado | null> => {
  if (!bancoConfigurado) return null;
  const token = (await cookies()).get(COOKIE_SESSAO)?.value;
  if (!token) return null;
  const sessao = await db.sessao.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { admin: { select: { id: true, nome: true, email: true, ativo: true } } },
  });
  if (!sessao || sessao.expiraEm < new Date() || !sessao.admin.ativo) return null;
  const { id, nome, email } = sessao.admin;
  return { id, nome, email };
});

export async function encerrarSessao(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(COOKIE_SESSAO)?.value;
  if (token && bancoConfigurado) await db.sessao.deleteMany({ where: { tokenHash: hashToken(token) } });
  jar.delete(COOKIE_SESSAO);
}
