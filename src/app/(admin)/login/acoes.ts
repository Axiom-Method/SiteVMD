"use server";

import { redirect } from "next/navigation";
import { criarSessao, encerrarSessao } from "@/lib/auth";
import { bancoConfigurado, db } from "@/lib/db";
import { conferirSenha, HASH_FALSO } from "@/lib/senha";
import { registrarAuditoria } from "@/services/auditoria.service";
import { loginSchema } from "@/validations/login.schema";

export type EstadoLogin = { erro?: string; email?: string };

const MAX_TENTATIVAS = 5;
const BLOQUEIO_MS = 15 * 60 * 1000;
const ERRO_GENERICO = "E-mail ou senha incorretos.";

/** Só volta para páginas do próprio painel (evita redirecionar para outro site). */
function destinoSeguro(valor: FormDataEntryValue | null): string {
  const s = typeof valor === "string" ? valor : "";
  return /^\/admin(\/[\w\-/]*)?$/.test(s) ? s : "/admin";
}

export async function entrar(_anterior: EstadoLogin, form: FormData): Promise<EstadoLogin> {
  if (!bancoConfigurado) return { erro: "O banco de dados ainda não foi configurado (DATABASE_URL)." };

  const dados = loginSchema.safeParse({ email: form.get("email"), senha: form.get("senha") });
  if (!dados.success) return { erro: dados.error.issues[0]?.message ?? ERRO_GENERICO, email: String(form.get("email") ?? "") };
  const { email, senha } = dados.data;

  const admin = await db.admin.findUnique({ where: { email } });
  if (admin?.bloqueadoAte && admin.bloqueadoAte > new Date()) {
    return { erro: "Muitas tentativas erradas. Tente de novo em 15 minutos.", email };
  }

  // Sem conta, confere contra um hash falso: o tempo de resposta não revela se o e-mail existe
  const certa = await conferirSenha(senha, admin?.senhaHash ?? HASH_FALSO);

  if (!admin || !certa || !admin.ativo) {
    if (admin) {
      const tentativas = admin.tentativasFalhas + 1;
      const bloquear = tentativas >= MAX_TENTATIVAS;
      await db.admin.update({
        where: { id: admin.id },
        data: { tentativasFalhas: bloquear ? 0 : tentativas, bloqueadoAte: bloquear ? new Date(Date.now() + BLOQUEIO_MS) : null },
      });
      if (bloquear) await registrarAuditoria(admin.id, "login.bloqueado", email);
    }
    await registrarAuditoria(admin?.id ?? null, "login.falhou", email);
    return { erro: ERRO_GENERICO, email };
  }

  await db.admin.update({ where: { id: admin.id }, data: { tentativasFalhas: 0, bloqueadoAte: null, ultimoLogin: new Date() } });
  await criarSessao(admin.id);
  await registrarAuditoria(admin.id, "login", email);
  redirect(destinoSeguro(form.get("proximo")));
}

export async function sair(): Promise<void> {
  await encerrarSessao();
  redirect("/login");
}
