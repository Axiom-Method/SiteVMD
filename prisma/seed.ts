/**
 * Dados iniciais: os números padrão de cada esporte (e das posições que têm os seus)
 * e os atletas de src/constants. Roda com `npm run db:seed`.
 * Só cria o que ainda não existe: rodar de novo não duplica nem apaga o que o admin alterou.
 */
import { PrismaClient } from "@prisma/client";
import { ATLETAS_DESTAQUE } from "../src/constants/atletas-destaque";

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

  // Atletas: entram com nome, clube e foto; o resto o admin preenche no painel
  for (const [ordem, a] of ATLETAS_DESTAQUE.entries()) {
    const existe = await db.atleta.findUnique({ where: { slug: a.slug }, select: { slug: true } });
    if (existe) continue;
    await db.atleta.create({ data: { slug: a.slug, nome: a.nome, clube: a.clube, foto: a.foto ?? null, ordem } });
    console.log(`atleta: ${a.slug}`);
  }
}

main()
  .catch((erro) => {
    console.error(erro);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
