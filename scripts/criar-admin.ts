/**
 * Cria (ou redefine a senha de) um admin do painel. Uso: `npm run admin:criar`
 * Pergunta e-mail, nome e senha no terminal; a senha não aparece enquanto é digitada
 * e nunca fica salva em arquivo, histórico do terminal ou no banco (só o hash).
 */
import { PrismaClient } from "@prisma/client";
import { createInterface } from "node:readline/promises";
import { gerarHashSenha } from "../src/lib/senha";
import { loginSchema, senhaNovaSchema } from "../src/validations/login.schema";

const db = new PrismaClient();

/** Lê uma linha sem mostrar o que é digitado (troca cada tecla por nada). */
function lerOculto(pergunta: string): Promise<string> {
  return new Promise((resolve) => {
    const entrada = process.stdin;
    process.stdout.write(pergunta);
    let valor = "";
    entrada.setRawMode?.(true);
    entrada.resume();
    entrada.setEncoding("utf8");
    const aoDigitar = (tecla: string) => {
      for (const c of tecla) {
        if (c === "\r" || c === "\n") {
          entrada.setRawMode?.(false);
          entrada.pause();
          entrada.off("data", aoDigitar);
          process.stdout.write("\n");
          return resolve(valor);
        }
        if (c === "\u0003") process.exit(130); // Ctrl+C
        if (c === "\u007f" || c === "\b") valor = valor.slice(0, -1);
        else valor += c;
      }
    };
    entrada.on("data", aoDigitar);
  });
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("Defina DATABASE_URL no .env antes de criar o admin.");
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const email = loginSchema.shape.email.parse(await rl.question("E-mail: "));
  const nome = (await rl.question("Nome: ")).trim() || email;
  rl.close();

  const senha = await lerOculto("Senha (mín. 10 caracteres): ");
  const confirmacao = await lerOculto("Repita a senha: ");
  if (senha !== confirmacao) throw new Error("As senhas não conferem.");
  const senhaHash = await gerarHashSenha(senhaNovaSchema.parse(senha));

  const admin = await db.admin.upsert({
    where: { email },
    create: { email, nome, senhaHash },
    update: { nome, senhaHash, tentativasFalhas: 0, bloqueadoAte: null, ativo: true },
  });
  // Senha nova derruba as sessões antigas
  await db.sessao.deleteMany({ where: { adminId: admin.id } });
  await db.logAuditoria.create({ data: { adminId: admin.id, acao: "admin.senha_definida", alvo: email, detalhes: { via: "script" } } });
  console.log(`Admin pronto: ${email}. Entre em /login.`);
}

main()
  .catch((erro) => {
    console.error(erro instanceof Error ? erro.message : erro);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
