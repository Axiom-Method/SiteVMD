/**
 * Dados iniciais: os números padrão de cada esporte (e das posições que têm os seus)
 * e os números dos atletas de exemplo. Roda com `npm run db:seed`.
 * Só cria o que ainda não existe: rodar de novo não duplica nem apaga o que o admin alterou.
 */
import { PrismaClient } from "@prisma/client";
import { listarPerfis } from "../src/constants/atletas-perfil";

const db = new PrismaClient();

type Rotulo = [pt: string, en: string, es: string, it: string];

const R = {
  jogos: ["Jogos", "Matches", "Partidos", "Partite"],
  gols: ["Gols", "Goals", "Goles", "Gol"],
  assistencias: ["Assistências", "Assists", "Asistencias", "Assist"],
  minutos: ["Minutos", "Minutes", "Minutos", "Minuti"],
  desarmes: ["Desarmes", "Tackles", "Entradas", "Contrasti vinti"],
  defesas: ["Defesas", "Saves", "Paradas", "Parate"],
  semSofrer: ["Jogos sem sofrer gol", "Clean sheets", "Porterías a cero", "Porta inviolata"],
  pontos: ["Pontos", "Points", "Puntos", "Punti"],
  aces: ["Aces", "Aces", "Aces", "Ace"],
  bloqueios: ["Bloqueios", "Blocks", "Bloqueos", "Muri"],
  rebotes: ["Rebotes", "Rebounds", "Rebotes", "Rimbalzi"],
} satisfies Record<string, Rotulo>;

/** [esporte, posição (null = padrão do esporte), campos na ordem de exibição] */
const PADROES: [string, string | null, Rotulo[]][] = [
  ["Futebol", null, [R.jogos, R.gols, R.assistencias, R.minutos]],
  ["Futebol", "Goleiro", [R.jogos, R.semSofrer, R.defesas, R.minutos]],
  ["Futebol", "Zagueiro", [R.jogos, R.gols, R.desarmes, R.minutos]],
  ["Futebol", "Volante", [R.jogos, R.gols, R.desarmes, R.minutos]],
  ["Futsal", null, [R.jogos, R.gols, R.assistencias]],
  ["Futsal", "Goleiro", [R.jogos, R.defesas, R.semSofrer]],
  ["Vôlei", null, [R.jogos, R.pontos, R.aces, R.bloqueios]],
  ["Basquete", null, [R.jogos, R.pontos, R.rebotes, R.assistencias]],
  ["Handebol", null, [R.jogos, R.gols, R.assistencias]],
  ["Handebol", "Goleiro", [R.jogos, R.defesas]],
];

async function main() {
  for (const [esporte, posicao, campos] of PADROES) {
    const existentes = await db.campoEstatistica.count({ where: { esporte, posicao } });
    if (existentes > 0) continue;
    await db.campoEstatistica.createMany({
      data: campos.map(([rotulo, rotuloEn, rotuloEs, rotuloIt], ordem) => ({ esporte, posicao, rotulo, rotuloEn, rotuloEs, rotuloIt, ordem })),
    });
    console.log(`campos: ${esporte}${posicao ? ` / ${posicao}` : ""} (${campos.length})`);
  }

  // Números dos atletas de exemplo, ligados aos campos pelo rótulo
  for (const atleta of listarPerfis()) {
    const temValores = await db.estatisticaAtleta.count({ where: { atletaSlug: atleta.slug } });
    if (temValores > 0) continue;
    const daPosicao = await db.campoEstatistica.findMany({ where: { esporte: atleta.esporte, posicao: atleta.posicao } });
    const campos = daPosicao.length ? daPosicao : await db.campoEstatistica.findMany({ where: { esporte: atleta.esporte, posicao: null } });
    const porRotulo = new Map(campos.map((c) => [c.rotulo, c.id]));
    const data = atleta.estatisticas.flatMap((e) => {
      const campoId = porRotulo.get(e.rotulo);
      return campoId ? [{ atletaSlug: atleta.slug, temporada: atleta.temporada, campoId, valor: e.valor }] : [];
    });
    if (data.length) await db.estatisticaAtleta.createMany({ data });
    console.log(`números: ${atleta.slug} (${data.length})`);
  }
}

main()
  .catch((erro) => {
    console.error(erro);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
