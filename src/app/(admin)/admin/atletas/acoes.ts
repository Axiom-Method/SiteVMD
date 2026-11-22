"use server";

import { redirect } from "next/navigation";
import { ATLETAS_DESTAQUE } from "@/constants/atletas-destaque";
import { obterAdmin, type AdminLogado } from "@/lib/auth";
import { db } from "@/lib/db";
import { ImagemInvalida, processarImagem } from "@/lib/imagem-processor";
import { registrarAuditoria } from "@/services/auditoria.service";
import { dadosAtletaSchema, novoAtletaSchema } from "@/validations/atleta-admin.schema";

/**
 * Ações do painel para os dados e as fotos dos atletas.
 * Cada uma confere a sessão de novo no servidor (a página estar protegida não basta).
 * Formulários comuns devolvem o resultado pela URL (?ok= / ?erro=); o envio de imagens,
 * que é feito arquivo por arquivo pelo navegador, devolve um objeto.
 */

async function exigirAdmin(): Promise<AdminLogado> {
  const admin = await obterAdmin();
  if (!admin) redirect("/login");
  return admin;
}

const comAviso = (caminho: string, tipo: "ok" | "erro", texto: string) => `${caminho}?${tipo}=${encodeURIComponent(texto)}`;
const urlImagem = (id: string) => `/api/imagens/${id}`;

/**
 * Antes do `npm run db:seed` os atletas só existem em src/constants: o primeiro salvamento
 * cria a linha no banco com o que já havia (nome, clube, foto).
 */
async function garantirNoBanco(slug: string): Promise<boolean> {
  if (await db.atleta.findUnique({ where: { slug }, select: { slug: true } })) return true;
  const i = ATLETAS_DESTAQUE.findIndex((a) => a.slug === slug);
  if (i < 0) return false;
  const a = ATLETAS_DESTAQUE[i];
  await db.atleta.create({ data: { slug, nome: a.nome, clube: a.clube, foto: a.foto ?? null, ordem: i } });
  return true;
}

function slugDe(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

// ----- Dados -----

export async function criarAtleta(form: FormData): Promise<void> {
  const admin = await exigirAdmin();
  const dados = novoAtletaSchema.safeParse({ nome: form.get("nome"), clube: form.get("clube") });
  if (!dados.success) redirect(comAviso("/admin/atletas", "erro", dados.error.issues[0]?.message ?? "Confira os dados."));

  // Slug pelo nome; se já existir (no banco ou na lista inicial), acrescenta o clube e depois um número
  const base = slugDe(dados.data.nome) || "atleta";
  const ocupado = async (s: string) => ATLETAS_DESTAQUE.some((a) => a.slug === s) || !!(await db.atleta.findUnique({ where: { slug: s }, select: { slug: true } }));
  let slug = base;
  if (await ocupado(slug)) slug = `${base}-${slugDe(dados.data.clube)}`.slice(0, 80);
  for (let n = 2; await ocupado(slug); n++) slug = `${base}-${n}`;

  const ordem = (await db.atleta.aggregate({ _max: { ordem: true } }))._max.ordem ?? ATLETAS_DESTAQUE.length;
  // Começa oculto: só aparece no site depois que o admin conferir os dados e marcar "publicado"
  await db.atleta.create({ data: { slug, nome: dados.data.nome, clube: dados.data.clube, ordem: ordem + 1, publicado: false } });
  await registrarAuditoria(admin.id, "atleta.criado", slug, dados.data);
  redirect(comAviso(`/admin/atletas/${slug}`, "ok", "Atleta criado. Preencha os dados, envie a foto e marque como publicado."));
}

export async function salvarDadosAtleta(form: FormData): Promise<void> {
  const admin = await exigirAdmin();
  const entrada = Object.fromEntries(
    ["slug", "nome", "clube", "esporte", "posicao", "categoria", "numero", "alturaCm", "pesoKg", "pe", "nacionalidade", "pais", "bio", "publicado"].map((c) => [
      c,
      form.get(c) ?? undefined,
    ]),
  );
  const slug = String(entrada.slug ?? "");
  const voltar = `/admin/atletas/${encodeURIComponent(slug)}`;
  const dados = dadosAtletaSchema.safeParse(entrada);
  if (!dados.success) redirect(comAviso(voltar, "erro", dados.error.issues[0]?.message ?? "Confira os dados."));
  if (!(await garantirNoBanco(slug))) redirect(comAviso("/admin/atletas", "erro", "Atleta não encontrado."));

  const { slug: _s, ...campos } = dados.data;
  await db.atleta.update({ where: { slug }, data: campos });
  await registrarAuditoria(admin.id, "atleta.dados", slug, campos);
  redirect(comAviso(voltar, "ok", "Dados salvos."));
}

// ----- Imagens -----

export type ResultadoEnvio = { ok: true; id: string } | { ok: false; erro: string };

/** Recebe uma imagem (o navegador já reduziu o tamanho), converte e guarda. A primeira vira a foto do card. */
export async function enviarImagem(form: FormData): Promise<ResultadoEnvio> {
  const admin = await exigirAdmin();
  const slug = String(form.get("slug") ?? "");
  const arquivo = form.get("imagem");
  if (!(arquivo instanceof File)) return { ok: false, erro: "Nenhum arquivo recebido." };
  if (!(await garantirNoBanco(slug))) return { ok: false, erro: "Atleta não encontrado." };

  let processada;
  try {
    processada = await processarImagem(Buffer.from(await arquivo.arrayBuffer()));
  } catch (erro) {
    if (erro instanceof ImagemInvalida) return { ok: false, erro: `${arquivo.name}: ${erro.message}` };
    throw erro;
  }

  const imagem = await db.imagem.create({
    data: { atletaSlug: slug, tipo: processada.tipo, dados: new Uint8Array(processada.dados), largura: processada.largura, altura: processada.altura, tamanho: processada.dados.length },
    select: { id: true },
  });
  const atleta = await db.atleta.findUnique({ where: { slug }, select: { foto: true } });
  const temFotoEnviada = atleta?.foto?.startsWith("/api/imagens/");
  if (!temFotoEnviada) await db.atleta.update({ where: { slug }, data: { foto: urlImagem(imagem.id) } });

  await registrarAuditoria(admin.id, "atleta.imagem.enviada", slug, { imagemId: imagem.id, bytes: processada.dados.length, nomeOriginal: arquivo.name.slice(0, 120) });
  return { ok: true, id: imagem.id };
}

export async function usarComoFoto(form: FormData): Promise<void> {
  const admin = await exigirAdmin();
  const slug = String(form.get("slug") ?? "");
  const id = String(form.get("id") ?? "");
  const voltar = `/admin/atletas/${encodeURIComponent(slug)}`;
  const imagem = await db.imagem.findFirst({ where: { id, atletaSlug: slug }, select: { id: true } });
  if (!imagem) redirect(comAviso(voltar, "erro", "Imagem não encontrada."));

  await db.atleta.update({ where: { slug }, data: { foto: urlImagem(id) } });
  await registrarAuditoria(admin.id, "atleta.foto", slug, { imagemId: id });
  redirect(comAviso(voltar, "ok", "Foto do card trocada."));
}

export async function excluirImagem(form: FormData): Promise<void> {
  const admin = await exigirAdmin();
  const slug = String(form.get("slug") ?? "");
  const id = String(form.get("id") ?? "");
  const voltar = `/admin/atletas/${encodeURIComponent(slug)}`;
  const imagem = await db.imagem.findFirst({ where: { id, atletaSlug: slug }, select: { id: true } });
  if (!imagem) redirect(comAviso(voltar, "erro", "Imagem não encontrada."));

  await db.imagem.delete({ where: { id } });
  // Se era a foto do card, volta para a foto inicial do atleta (se houver) ou fica sem foto
  const atleta = await db.atleta.findUnique({ where: { slug }, select: { foto: true } });
  if (atleta?.foto === urlImagem(id)) {
    const inicial = ATLETAS_DESTAQUE.find((a) => a.slug === slug)?.foto ?? null;
    await db.atleta.update({ where: { slug }, data: { foto: inicial } });
  }
  await registrarAuditoria(admin.id, "atleta.imagem.excluida", slug, { imagemId: id });
  redirect(comAviso(voltar, "ok", "Imagem excluída."));
}
