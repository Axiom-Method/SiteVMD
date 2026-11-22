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

/** Número opcional: vazio = não informado (null). */
const inteiroOpcional = (min: number, max: number, nome: string) =>
  z
    .union([z.literal(""), z.coerce.number({ invalid_type_error: `${nome}: use só números.` }).int(`${nome}: use números inteiros.`).min(min, `${nome}: mínimo ${min}.`).max(max, `${nome}: máximo ${max}.`)])
    .optional()
    .transform((v) => (v === "" || v === undefined ? null : v));

/** Dados do atleta editados no painel. Campo em branco = "não compartilhado" no perfil público. */
export const dadosAtletaSchema = z.object({
  slug: z.string().trim().min(1).max(120),
  nome: z.string().trim().min(1, "Informe o nome.").max(80, "Use no máximo 80 caracteres no nome."),
  clube: z.string().trim().min(1, "Informe o clube.").max(80, "Use no máximo 80 caracteres no clube."),
  esporte: z
    .union([z.literal(""), z.enum(MODALIDADES)], { errorMap: () => ({ message: "Escolha um esporte da lista." }) })
    .optional()
    .transform((v) => v || null),
  posicao: textoOpcional(60),
  categoria: textoOpcional(40),
  numero: inteiroOpcional(0, 999, "Camisa"),
  alturaCm: inteiroOpcional(100, 250, "Altura (cm)"),
  pesoKg: inteiroOpcional(30, 200, "Peso (kg)"),
  pe: z
    .union([z.literal(""), z.enum(["Direito", "Esquerdo", "Ambidestro"])], { errorMap: () => ({ message: "Escolha o pé dominante da lista." }) })
    .optional()
    .transform((v) => v || null),
  nacionalidade: textoOpcional(40),
  pais: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^([A-Z]{3})?$/, "País: use a sigla de 3 letras (ex.: BRA).")
    .optional()
    .transform((v) => v || null),
  bio: textoOpcional(600),
  publicado: z.preprocess((v) => v === "on" || v === "true", z.boolean()),
});

export const novoAtletaSchema = z.object({
  nome: z.string().trim().min(1, "Informe o nome.").max(80, "Use no máximo 80 caracteres no nome."),
  clube: z.string().trim().min(1, "Informe o clube.").max(80, "Use no máximo 80 caracteres no clube."),
});
