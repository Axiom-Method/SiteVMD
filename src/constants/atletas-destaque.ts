/**
 * Atletas representados pela VMD (dados provisórios, até existir o atleta.service.ts).
 * Por enquanto só há nome, clube e foto; esporte, posição e categoria entram quando forem informados.
 * O card público expõe apenas dados não sensíveis.
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
  /** Foto do próprio atleta, usada como fundo do card: /images/atletas/<slug>.webp */
  foto?: string;
};

const atleta = (slug: string, nome: string, clube: string): AtletaResumo => ({
  slug,
  nome,
  clube,
  foto: `/images/atletas/${slug}.webp`,
});

// Fotos escolhidas da pasta "MÍDIA ATLETAS" no Drive da VMD.
// Ainda sem fotos (pasta vazia no Drive): Daniel Fúria, Gabrielzão, Giulie, Guilherme Jubanski,
// Gustavinho, Jaque Nunes, Jefferson Silva, Johnny, Juninho (ACBF), Lucas Selbach, Lucas Sena,
// Martinha, Murilo Gazizi, Ramiel, Thiago e Xitão.
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
