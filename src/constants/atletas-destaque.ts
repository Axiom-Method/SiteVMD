/**
 * Atletas agenciados exibidos no site (nome, clube e foto vêm da pasta "MÍDIA ATLETAS" do Drive).
 * Substituir por atleta.service.ts (somente atletas com status PUBLICADO).
 * O card público expõe apenas dados não sensíveis.
 *
 * Esporte, posição e categoria ainda não foram informados: ficam vazios (o site esconde o que falta)
 * até serem preenchidos aqui ou pelo painel. Não inventar esses dados.
 */
import type { MODALIDADES } from "@/validations/atleta.schema";

export type AtletaResumo = {
  slug: string;
  nome: string;
  clube: string;
  /** Esporte (mesma lista do cadastro). */
  esporte?: (typeof MODALIDADES)[number];
  posicao?: string;
  categoria?: string;
  /** Foto do próprio atleta, recortada na proporção do card (800×1140): /images/atletas/<slug>.webp */
  foto?: string;
};

const atleta = (slug: string, nome: string, clube: string): AtletaResumo => ({
  slug, nome, clube, foto: `/images/atletas/${slug}.webp`,
});

export const ATLETAS_DESTAQUE: readonly AtletaResumo[] = [
  atleta("anna-julia", "Anna Júlia", "Stein Cascavel"),
  atleta("bernardo", "Bernardo", "AGSL"),
  atleta("choco", "Choco", "Podpah"),
  atleta("coutinho", "Coutinho", "ATLEC"),
  atleta("dani-cunha", "Dani Cunha", "Stein Cascavel"),
  atleta("davi-major", "Davi Major", "DR7 Team"),
  atleta("drika", "Drika", "EC Taboão"),
  atleta("fernando-nassar", "Fernando Nassar", "Magnus"),
  atleta("giovanna-karine", "Giovanna Karine", "Stein Cascavel"),
  atleta("guilherme-alves", "Guilherme Alves", "Capim"),
  atleta("jeffinho", "Jeffinho", "Furia"),
  atleta("joao-urmann", "João Urmann", "ADCP"),
  atleta("juninho", "Juninho", "Podpah"),
  atleta("leo-luiz", "Léo Luiz", "Campo Mourão"),
  atleta("luizinho", "Luizinho", "ACF"),
  atleta("pedro-vinicius", "Pedro Vinícius", "Magnus"),
  atleta("renan", "Renan", "Sumqayit FK"),
  atleta("renato-osorio", "Renato Osório", "Pato Futsal"),
  atleta("ronald", "Ronald", "Marreco"),
  atleta("ruan-silvestre", "Ruan Silvestre", "Furia"),
  atleta("susan-gomes", "Susan Gomes", "Leoas da Serra"),
  atleta("thalles-lima", "Thalles Lima", "LSCF"),
  atleta("vanessa", "Vanessa", "Stein Cascavel"),
  atleta("victor-bolt", "Victor Bolt", "Desimpain"),
  atleta("vini", "Vini", "Podpah"),
  atleta("william-bolt", "William Bolt", "ACBF"),
];
