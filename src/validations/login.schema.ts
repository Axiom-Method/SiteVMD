import { z } from "zod";

/** Login do painel admin. As mensagens são genéricas de propósito (não dizem se o e-mail existe). */
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Informe um e-mail válido.").max(160),
  senha: z.string().min(1, "Informe a senha.").max(200),
});

/** Senha nova de admin (script admin:criar). */
export const senhaNovaSchema = z.string().min(10, "Use pelo menos 10 caracteres.").max(200);
