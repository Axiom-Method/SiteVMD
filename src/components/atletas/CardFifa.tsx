"use client";

import Image from "next/image";
import type { PerfilAtleta } from "@/constants/atletas-perfil";
import { LinkIdioma, useTextos } from "@/i18n/cliente";
import { preencher } from "@/i18n/formatar";
import { siglaPosicao, traduzirCategoria, traduzirValor } from "@/i18n/valores";
import { iniciais } from "@/lib/utils";

type Props = {
  atleta: PerfilAtleta;
  /**
   * Versão compacta e clicável para a listagem (leva ao perfil).
   * Sem `mini`, é o card grande do perfil: decorativo, com animação de entrada.
   */
  mini?: boolean;
};

/**
 * Card do atleta no estilo dos cards de jogo de futebol: face perolada, moldura dourada
 * com filete interno e faixa diagonal nas cores da VMD atrás da foto.
 * Animações: entra girando (CSS), inclina em 3D e recebe o brilho que segue o mouse
 * (.inclina e .holofote, controlados por ui/Holofote.tsx) e um reflexo passa de tempos em tempos.
 */
export function CardFifa({ atleta, mini = false }: Props) {
  const { t } = useTextos();
  const sigla = siglaPosicao(t, atleta.posicao);
  const sobrenome = atleta.nome.split(" ").slice(-2).join(" ");

  const face = (
    <div className="card-fifa__face">
      <span className="card-fifa__filete" />
      <div className="card-fifa__topo">
        <span className="card-fifa__posicao">{sigla}</span>
        <span className="card-fifa__divisor" />
        <span className="card-fifa__pais">{atleta.pais}</span>
        <span className="card-fifa__clube">{iniciais(atleta.clube)}</span>
      </div>

      {atleta.foto ? (
        <Image
          className="card-fifa__foto"
          src={atleta.foto}
          alt=""
          width={1237}
          height={1271}
          sizes={mini ? "240px" : "300px"}
          priority={!mini}
        />
      ) : (
        <span className="card-fifa__iniciais">{iniciais(atleta.nome)}</span>
      )}

      <p className="card-fifa__nome">{sobrenome}</p>

      <span className="card-fifa__marca">VMD</span>
      <span className="card-fifa__reflexo" />
    </div>
  );

  if (mini) {
    // O card inteiro é o link; o rótulo acessível resume o que o card mostra visualmente
    return (
      <LinkIdioma
        href={`/atletas/${atleta.slug}`}
        className="card-fifa-mini"
        aria-label={preencher(t.atletas.cardRotulo, {
          nome: atleta.nome,
          posicao: traduzirValor(t, "posicoes", atleta.posicao),
          categoria: traduzirCategoria(t, atleta.categoria),
          clube: atleta.clube,
        })}
      >
        <div className="card-fifa inclina holofote" aria-hidden="true">
          {face}
        </div>
      </LinkIdioma>
    );
  }

  return (
    <div className="card-fifa-cena" aria-hidden="true">
      <div className="card-fifa-gira">
        <div className="card-fifa inclina holofote">{face}</div>
      </div>
    </div>
  );
}
