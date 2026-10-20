import { headers } from "next/headers";
import { db } from "@/lib/db";

/** IP do visitante (atrás de proxy/CDN vem no x-forwarded-for). */
async function ipDaRequisicao(): Promise<string | null> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || null;
}

/** Registra quem fez o quê no painel (login, alterações), com o IP da requisição. */
export async function registrarAuditoria(adminId: string | null, acao: string, alvo: string, detalhes?: object): Promise<void> {
  await db.logAuditoria.create({ data: { adminId, acao, alvo, detalhes: detalhes ?? undefined, ip: await ipDaRequisicao() } });
}
