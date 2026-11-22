import { bancoConfigurado, db } from "@/lib/db";

/**
 * Entrega uma imagem enviada pelo painel (tabela Imagem), já em WebP e sem metadados.
 * O conteúdo de um id nunca muda (trocar a foto cria outro id), então o cache é longo e imutável.
 * Só leitura: o envio e a exclusão são ações do painel, com sessão de admin.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!bancoConfigurado || !/^[a-z0-9]{20,32}$/.test(id)) return new Response(null, { status: 404 });

  const imagem = await db.imagem.findUnique({ where: { id }, select: { dados: true, tipo: true } });
  if (!imagem) return new Response(null, { status: 404 });

  return new Response(new Uint8Array(imagem.dados), {
    headers: {
      "Content-Type": imagem.tipo,
      "Content-Length": String(imagem.dados.length),
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Disposition": "inline",
    },
  });
}
