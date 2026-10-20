import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

/**
 * Hash de senha com scrypt (nativo do Node, sem dependência).
 * Formato gravado: "scrypt$N$r$p$sal$hash" (sal e hash em base64url), para poder subir o custo no futuro.
 */
const N = 2 ** 15;
const R = 8;
const P = 1;
const TAMANHO = 64;
// Memória necessária para N=2^15, r=8: 128 * N * r = 32 MB (o padrão do Node é 32 MB, fica no limite)
const MAXMEM = 64 * 1024 * 1024;

function derivar(senha: string, sal: Buffer, n: number, r: number, p: number): Promise<Buffer> {
  return new Promise((resolve, reject) =>
    scrypt(senha.normalize("NFKC"), sal, TAMANHO, { N: n, r, p, maxmem: MAXMEM }, (erro, chave) => (erro ? reject(erro) : resolve(chave))),
  );
}

export async function gerarHashSenha(senha: string): Promise<string> {
  const sal = randomBytes(16);
  const hash = await derivar(senha, sal, N, R, P);
  return ["scrypt", N, R, P, sal.toString("base64url"), hash.toString("base64url")].join("$");
}

export async function conferirSenha(senha: string, gravado: string): Promise<boolean> {
  const [tipo, n, r, p, sal, hash] = gravado.split("$");
  if (tipo !== "scrypt" || !sal || !hash) return false;
  const esperado = Buffer.from(hash, "base64url");
  const calculado = await derivar(senha, Buffer.from(sal, "base64url"), Number(n), Number(r), Number(p));
  return calculado.length === esperado.length && timingSafeEqual(calculado, esperado);
}

/** Hash de uma senha qualquer: usado quando o e-mail não existe, para o tempo de resposta não denunciar isso. */
export const HASH_FALSO = "scrypt$32768$8$1$AAAAAAAAAAAAAAAAAAAAAA$" + "A".repeat(86);
