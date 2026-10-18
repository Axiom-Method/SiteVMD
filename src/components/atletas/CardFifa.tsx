import Image from "next/image";
import { SIGLA_POSICAO, type PerfilAtleta } from "@/constants/atletas-perfil";
import { iniciais } from "@/lib/utils";

/**
 * Card do atleta no estilo dos cards de jogo de futebol, nas cores da VMD.
 * Animações: entra girando (CSS), inclina em 3D e recebe o brilho que segue o mouse
 * (.inclina e .holofote, controlados por ui/Holofote.tsx) e um reflexo passa de tempos em tempos.
 * O conteúdo é decorativo para leitores de tela: os mesmos dados estão na ficha ao lado.
 */
export function CardFifa({ atleta }: { atleta: PerfilAtleta }) {
  const sigla = SIGLA_POSICAO[atleta.posicao] ?? atleta.posicao.slice(0, 3).toUpperCase();
  const sobrenome = atleta.nome.split(" ").slice(-2).join(" ");

  return (
    <div className="card-fifa-cena" aria-hidden="true">
      <div className="card-fifa-gira">
        <div className="card-fifa inclina holofote">
          <div className="card-fifa__face">
            <div className="card-fifa__topo">
              <span className="card-fifa__geral">{atleta.geral}</span>
              <span className="card-fifa__posicao">{sigla}</span>
              <span className="card-fifa__divisor" />
              <span className="card-fifa__pais">{atleta.pais}</span>
              <span className="card-fifa__clube">{iniciais(atleta.clube)}</span>
            </div>

            {atleta.foto ? (
              <Image className="card-fifa__foto" src={atleta.foto} alt="" width={1237} height={1271} sizes="300px" priority />
            ) : (
              <span className="card-fifa__iniciais">{iniciais(atleta.nome)}</span>
            )}

            <p className="card-fifa__nome">{sobrenome}</p>

            <dl className="card-fifa__atributos">
              {atleta.atributos.map((a) => (
                <div key={a.sigla}>
                  <dt>{a.sigla}</dt>
                  <dd>{a.valor}</dd>
                </div>
              ))}
            </dl>

            <span className="card-fifa__marca">VMD</span>
            <span className="card-fifa__reflexo" />
          </div>
        </div>
      </div>
    </div>
  );
}
