import type { CampoEstatistica } from "@prisma/client";
import type { Estatistica, PerfilAtleta } from "@/constants/atletas-perfil";
import { bancoConfigurado, db } from "@/lib/db";

/**
 * Números dos atletas.
 * Quais números aparecem depende do esporte e da posição: se a posição tem campos próprios
 * (ex.: Futebol / Goleiro), valem eles; senão, os campos padrão do esporte.
 * Sem banco configurado (ou se ele falhar), o site mostra os números de exemplo de src/constants.
 */

const ORDEM = [{ ordem: "asc" as const }, { criadoEm: "asc" as const }];

export async function camposDoAtleta(esporte: string, posicao: string): Promise<CampoEstatistica[]> {
  const daPosicao = await db.campoEstatistica.findMany({ where: { esporte, posicao }, orderBy: ORDEM });
  if (daPosicao.length > 0) return daPosicao;
  return db.campoEstatistica.findMany({ where: { esporte, posicao: null }, orderBy: ORDEM });
}

export type NumerosAtleta = { temporada: string; estatisticas: Estatistica[] };

/** Números da temporada mais recente do atleta, já na ordem e com as traduções dos rótulos. */
export async function numerosDoAtleta(atleta: PerfilAtleta): Promise<NumerosAtleta> {
  const exemplo = { temporada: atleta.temporada, estatisticas: [...atleta.estatisticas] };
  if (!bancoConfigurado) return exemplo;

  try {
    const campos = await camposDoAtleta(atleta.esporte, atleta.posicao);
    if (campos.length === 0) return { temporada: atleta.temporada, estatisticas: [] };
    const ids = campos.map((c) => c.id);

    const ultima = await db.estatisticaAtleta.findFirst({
      where: { atletaSlug: atleta.slug, campoId: { in: ids } },
      orderBy: { temporada: "desc" },
      select: { temporada: true },
    });
    if (!ultima) return { temporada: atleta.temporada, estatisticas: [] };

    const valores = await db.estatisticaAtleta.findMany({
      where: { atletaSlug: atleta.slug, temporada: ultima.temporada, campoId: { in: ids } },
    });
    const porCampo = new Map(valores.map((v) => [v.campoId, v.valor]));

    const estatisticas = campos.flatMap((c): Estatistica[] => {
      const valor = porCampo.get(c.id);
      if (valor === undefined) return [];
      return [{ rotulo: c.rotulo, valor, traducoes: { en: c.rotuloEn ?? undefined, es: c.rotuloEs ?? undefined, it: c.rotuloIt ?? undefined } }];
    });
    return { temporada: ultima.temporada, estatisticas };
  } catch (erro) {
    // Banco fora do ar não derruba o perfil público: mostra os números de exemplo
    console.error("[estatisticas] falha ao ler o banco; usando os números de exemplo", erro);
    return exemplo;
  }
}
