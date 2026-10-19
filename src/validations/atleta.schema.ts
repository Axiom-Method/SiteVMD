import { z } from "zod";

/**
 * Cadastro público de atleta ("Quero ser VMD").
 * Hoje o envio é pelo WhatsApp da VMD (o site não guarda os dados); o mesmo schema
 * vale para a futura rota /api/cadastro quando houver banco.
 * Exposição mínima (LGPD): só o necessário para a VMD avaliar e fazer o orçamento.
 *
 * As mensagens de erro são códigos (ex.: "nomeObrigatorio"): o texto de cada idioma fica em
 * t.cadastro.erros (i18n/dicionarios). Adicionou um código aqui? Adicione o texto nos dicionários.
 */
export const MODALIDADES = ["Futebol", "Futsal", "Vôlei", "Basquete", "Handebol", "Outra"] as const;

export const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA",
  "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
] as const;

/** Idade completa em anos a partir de uma data ISO (aaaa-mm-dd). */
export function idadeEm(dataIso: string, hoje = new Date()): number {
  const [a, m, d] = dataIso.split("-").map(Number);
  let idade = hoje.getFullYear() - a;
  if (hoje.getMonth() + 1 < m || (hoje.getMonth() + 1 === m && hoje.getDate() < d)) idade--;
  return idade;
}

const textoOpcional = (max: number) =>
  z
    .string()
    .trim()
    .max(max, "textoLongo")
    .optional()
    .transform((v) => v || undefined);

export const cadastroAtletaSchema = z
  .object({
    nome: z.string().trim().min(3, "nomeObrigatorio").max(120, "nomeLongo"),
    dataNascimento: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "nascimentoObrigatorio")
      .refine((v) => {
        const idade = idadeEm(v);
        return idade >= 6 && idade <= 50;
      }, "nascimentoInvalido"),
    cidade: z.string().trim().min(2, "cidadeObrigatoria").max(80, "textoLongo"),
    uf: z.enum(UFS, { errorMap: () => ({ message: "estadoObrigatorio" }) }),
    modalidade: z.enum(MODALIDADES, { errorMap: () => ({ message: "modalidadeObrigatoria" }) }),
    posicao: textoOpcional(60),
    clube: textoOpcional(80),
    alturaCm: z
      .string()
      .trim()
      .optional()
      .transform((v) => (v ? Number(v) : undefined))
      .refine((v) => v === undefined || (Number.isInteger(v) && v >= 100 && v <= 230), "alturaInvalida"),
    instagram: z
      .string()
      .trim()
      .optional()
      .transform((v) => (v ? v.replace(/^@/, "") : undefined))
      .refine((v) => v === undefined || /^[A-Za-z0-9._]{1,30}$/.test(v), "instagramInvalido"),
    linkVideo: z
      .string()
      .trim()
      .optional()
      .transform((v) => v || undefined)
      .refine((v) => {
        if (!v) return true;
        try {
          return new URL(v).protocol === "https:";
        } catch {
          return false;
        }
      }, "videoInvalido"),
    mensagem: textoOpcional(600),
    responsavelNome: textoOpcional(120),
    autorizacaoResponsavel: z.boolean(),
    consentimento: z.literal(true, { errorMap: () => ({ message: "consentimentoObrigatorio" }) }),
  })
  .superRefine((d, ctx) => {
    // Menor de 18: exige responsável e a autorização dele
    if (idadeEm(d.dataNascimento) < 18) {
      if (!d.responsavelNome || d.responsavelNome.length < 3) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["responsavelNome"], message: "responsavelObrigatorio" });
      }
      if (!d.autorizacaoResponsavel) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["autorizacaoResponsavel"], message: "autorizacaoObrigatoria" });
      }
    }
  });

export type CadastroAtletaEntrada = z.input<typeof cadastroAtletaSchema>;
export type CadastroAtleta = z.output<typeof cadastroAtletaSchema>;
