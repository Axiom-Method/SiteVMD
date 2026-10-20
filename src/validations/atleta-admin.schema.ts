import { z } from "zod";
import { MODALIDADES } from "@/validations/atleta.schema";

/** Formulários do painel admin: campos de números por esporte/posição e os valores de cada atleta. */

const textoOpcional = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Use no máximo ${max} caracteres.`)
    .optional()
    .transform((v) => v || null);

export const campoEstatisticaSchema = z.object({
  esporte: z.enum(MODALIDADES, { errorMap: () => ({ message: "Escolha o esporte." }) }),
  /** Vazio = vale para todas as posições do esporte */
  posicao: textoOpcional(60),
  rotulo: z.string().trim().min(1, "Informe o nome do número.").max(40, "Use no máximo 40 caracteres."),
  rotuloEn: textoOpcional(40),
  rotuloEs: textoOpcional(40),
  rotuloIt: textoOpcional(40),
  ordem: z.coerce.number().int().min(0).max(999).default(0),
});

export const valoresAtletaSchema = z.object({
  slug: z.string().trim().min(1).max(120),
  temporada: z
    .string()
    .trim()
    .regex(/^\d{4}(\/\d{2,4})?$/, "Use o ano (2026) ou o período (2025/26)."),
  /** campoId → valor; campo em branco não é gravado (e apaga o valor anterior) */
  valores: z.record(z.string(), z.union([z.literal(""), z.coerce.number().int("Use números inteiros.").min(0, "Não use números negativos.").max(1_000_000)])),
});
