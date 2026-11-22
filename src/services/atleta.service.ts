import type { Atleta } from "@prisma/client";
import { ATLETAS_DESTAQUE, type AtletaResumo } from "@/constants/atletas-destaque";
import { bancoConfigurado, db } from "@/lib/db";
import { MODALIDADES } from "@/validations/atleta.schema";

/**
 * Atletas do site. Com banco, valem os dados editados no painel (tabela Atleta);
 * sem banco, ou com a tabela ainda vazia (antes do `npm run db:seed`), a lista de src/constants.
 * Se o banco falhar, o site público continua no ar com essa mesma lista.
 */

export type DadosAtleta = AtletaResumo & {
  numero?: number;
  alturaCm?: number;
  pesoKg?: number;
  pe?: "Direito" | "Esquerdo" | "Ambidestro";
  nacionalidade?: string;
  /** Sigla de 3 letras exibida no card. */
  pais?: string;
  bio?: string;
  publicado: boolean;
};

const PES = ["Direito", "Esquerdo", "Ambidestro"] as const;
const ehEsporte = (v: string | null): v is (typeof MODALIDADES)[number] => !!v && (MODALIDADES as readonly string[]).includes(v);
const ehPe = (v: string | null): v is (typeof PES)[number] => !!v && (PES as readonly string[]).includes(v);

/** Linha do banco → formato usado pelas páginas (null vira ausente). */
function doBanco(a: Atleta): DadosAtleta {
  return {
    slug: a.slug,
    nome: a.nome,
    clube: a.clube,
    esporte: ehEsporte(a.esporte) ? a.esporte : undefined,
    posicao: a.posicao ?? undefined,
    categoria: a.categoria ?? undefined,
    foto: a.foto ?? undefined,
    numero: a.numero ?? undefined,
    alturaCm: a.alturaCm ?? undefined,
    pesoKg: a.pesoKg ?? undefined,
    pe: ehPe(a.pe) ? a.pe : undefined,
    nacionalidade: a.nacionalidade ?? undefined,
    pais: a.pais ?? undefined,
    bio: a.bio ?? undefined,
    publicado: a.publicado,
  };
}

const daLista = (): DadosAtleta[] => ATLETAS_DESTAQUE.map((a) => ({ ...a, publicado: true }));

/** Todos os atletas, na ordem do painel. `incluirOcultos` só no painel admin. */
export async function listarAtletas({ incluirOcultos = false } = {}): Promise<DadosAtleta[]> {
  if (!bancoConfigurado) return daLista();
  try {
    const linhas = await db.atleta.findMany({
      where: incluirOcultos ? undefined : { publicado: true },
      orderBy: [{ ordem: "asc" }, { nome: "asc" }],
    });
    if (linhas.length === 0 && (await db.atleta.count()) === 0) return daLista();
    return linhas.map(doBanco);
  } catch (erro) {
    console.error("[atletas] falha ao ler o banco; usando a lista de src/constants", erro);
    return daLista();
  }
}

export async function buscarAtleta(slug: string, { incluirOcultos = false } = {}): Promise<DadosAtleta | undefined> {
  const todos = await listarAtletas({ incluirOcultos });
  return todos.find((a) => a.slug === slug);
}
