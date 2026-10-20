"use server";

import { redirect } from "next/navigation";
import { buscarPerfil } from "@/constants/atletas-perfil";
import { obterAdmin, type AdminLogado } from "@/lib/auth";
import { db } from "@/lib/db";
import { ancoraEsporte } from "@/lib/utils";
import { registrarAuditoria } from "@/services/auditoria.service";
import { camposDoAtleta } from "@/services/estatistica.service";
import { campoEstatisticaSchema, valoresAtletaSchema } from "@/validations/atleta-admin.schema";

/**
 * Ações do painel. Cada uma confere a sessão de novo no servidor: a página estar protegida
 * não basta, porque uma ação pode ser chamada direto. O Next já recusa chamadas de outra origem.
 * O resultado volta pela URL (?ok= ou ?erro=), que a página mostra num aviso.
 * Não há cache a invalidar: o layout raiz deixa as páginas dinâmicas, o perfil já lê o banco a cada visita.
 */
async function exigirAdmin(): Promise<AdminLogado> {
  const admin = await obterAdmin();
  if (!admin) redirect("/login");
  return admin;
}

const comAviso = (caminho: string, tipo: "ok" | "erro", texto: string) => `${caminho}?${tipo}=${encodeURIComponent(texto)}`;

// ----- Números de um atleta -----

export async function salvarNumeros(form: FormData): Promise<void> {
  const admin = await exigirAdmin();
  const slug = String(form.get("slug") ?? "");
  const voltar = `/admin/atletas/${encodeURIComponent(slug)}`;

  const atleta = buscarPerfil(slug);
  if (!atleta) redirect(comAviso("/admin/atletas", "erro", "Atleta não encontrado."));

  const valores: Record<string, string> = {};
  for (const [chave, valor] of form.entries()) {
    if (chave.startsWith("campo:")) valores[chave.slice(6)] = String(valor).trim();
  }
  const dados = valoresAtletaSchema.safeParse({ slug, temporada: form.get("temporada"), valores });
  if (!dados.success) redirect(comAviso(voltar, "erro", dados.error.issues[0]?.message ?? "Confira os valores."));

  // Só aceita campos que realmente valem para o esporte/posição deste atleta
  const permitidos = new Set((await camposDoAtleta(atleta.esporte, atleta.posicao)).map((c) => c.id));
  const { temporada } = dados.data;
  const operacoes = Object.entries(dados.data.valores)
    .filter(([campoId]) => permitidos.has(campoId))
    .map(([campoId, valor]) => {
      const chave = { atletaSlug_temporada_campoId: { atletaSlug: slug, temporada, campoId } };
      return valor === ""
        ? db.estatisticaAtleta.deleteMany({ where: { atletaSlug: slug, temporada, campoId } })
        : db.estatisticaAtleta.upsert({ where: chave, create: { atletaSlug: slug, temporada, campoId, valor }, update: { valor } });
    });
  await db.$transaction(operacoes);

  await registrarAuditoria(admin.id, "atleta.numeros", slug, { temporada, valores: dados.data.valores });
  redirect(comAviso(voltar, "ok", `Números de ${temporada} salvos.`) + `&temporada=${encodeURIComponent(temporada)}`);
}

// ----- Campos (quais números cada esporte/posição mostra) -----

function lerCampo(form: FormData) {
  return campoEstatisticaSchema.safeParse({
    esporte: form.get("esporte"),
    posicao: form.get("posicao"),
    rotulo: form.get("rotulo"),
    rotuloEn: form.get("rotuloEn"),
    rotuloEs: form.get("rotuloEs"),
    rotuloIt: form.get("rotuloIt"),
    ordem: form.get("ordem") || 0,
  });
}

export async function criarCampo(form: FormData): Promise<void> {
  const admin = await exigirAdmin();
  const dados = lerCampo(form);
  if (!dados.success) redirect(comAviso("/admin/numeros", "erro", dados.error.issues[0]?.message ?? "Confira o formulário."));
  const campo = await db.campoEstatistica.create({ data: dados.data });
  await registrarAuditoria(admin.id, "campo.criado", campo.id, dados.data);
  redirect(comAviso("/admin/numeros", "ok", `"${campo.rotulo}" adicionado em ${campo.esporte}${campo.posicao ? ` / ${campo.posicao}` : ""}.`) + `#${ancoraEsporte(campo.esporte)}`);
}

export async function atualizarCampo(form: FormData): Promise<void> {
  const admin = await exigirAdmin();
  const id = String(form.get("id") ?? "");
  const dados = lerCampo(form);
  if (!dados.success) redirect(comAviso("/admin/numeros", "erro", dados.error.issues[0]?.message ?? "Confira o formulário."));
  const campo = await db.campoEstatistica.update({ where: { id }, data: dados.data });
  await registrarAuditoria(admin.id, "campo.alterado", id, dados.data);
  redirect(comAviso("/admin/numeros", "ok", `"${campo.rotulo}" atualizado.`) + `#${ancoraEsporte(campo.esporte)}`);
}

export async function excluirCampo(form: FormData): Promise<void> {
  const admin = await exigirAdmin();
  const id = String(form.get("id") ?? "");
  const campo = await db.campoEstatistica.findUnique({ where: { id }, include: { _count: { select: { valores: true } } } });
  if (!campo) redirect(comAviso("/admin/numeros", "erro", "Esse número já tinha sido removido."));
  // Os valores dos atletas nesse campo saem junto (onDelete: Cascade)
  await db.campoEstatistica.delete({ where: { id } });
  await registrarAuditoria(admin.id, "campo.excluido", id, { rotulo: campo.rotulo, esporte: campo.esporte, posicao: campo.posicao, valoresApagados: campo._count.valores });
  redirect(comAviso("/admin/numeros", "ok", `"${campo.rotulo}" removido.`) + `#${ancoraEsporte(campo.esporte)}`);
}
