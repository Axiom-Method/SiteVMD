import type { Metadata } from "next";
import type { CampoEstatistica } from "@prisma/client";
import { listarPerfis } from "@/constants/atletas-perfil";
import { db } from "@/lib/db";
import { ancoraEsporte } from "@/lib/utils";
import { MODALIDADES } from "@/validations/atleta.schema";
import { atualizarCampo, criarCampo, excluirCampo } from "../acoes";
import { Aviso } from "../Aviso";
import { BotaoExcluir } from "./BotaoExcluir";

export const metadata: Metadata = { title: "Números por esporte" };

type Campo = CampoEstatistica & { _count: { valores: number } };
type Props = { searchParams: Promise<{ ok?: string; erro?: string }> };

/** Linha de um número: edita rótulos/ordem no lugar ou remove. */
function LinhaCampo({ campo }: { campo: Campo }) {
  const prefixo = `c-${campo.id}`;
  return (
    <li className="admin-campo">
      <form action={atualizarCampo} className="admin-campo__form">
        <input type="hidden" name="id" value={campo.id} />
        <input type="hidden" name="esporte" value={campo.esporte} />
        <input type="hidden" name="posicao" value={campo.posicao ?? ""} />
        <div className="campo campo--ordem">
          <label htmlFor={`${prefixo}-ordem`}>Ordem</label>
          <input id={`${prefixo}-ordem`} name="ordem" type="number" min={0} max={999} defaultValue={campo.ordem} />
        </div>
        <div className="campo">
          <label htmlFor={`${prefixo}-pt`}>Português</label>
          <input id={`${prefixo}-pt`} name="rotulo" required maxLength={40} defaultValue={campo.rotulo} />
        </div>
        <div className="campo">
          <label htmlFor={`${prefixo}-en`}>Inglês</label>
          <input id={`${prefixo}-en`} name="rotuloEn" maxLength={40} defaultValue={campo.rotuloEn ?? ""} />
        </div>
        <div className="campo">
          <label htmlFor={`${prefixo}-es`}>Espanhol</label>
          <input id={`${prefixo}-es`} name="rotuloEs" maxLength={40} defaultValue={campo.rotuloEs ?? ""} />
        </div>
        <div className="campo">
          <label htmlFor={`${prefixo}-it`}>Italiano</label>
          <input id={`${prefixo}-it`} name="rotuloIt" maxLength={40} defaultValue={campo.rotuloIt ?? ""} />
        </div>
        <button type="submit" className="btn btn--contorno btn--sm">
          Salvar
        </button>
      </form>
      <form action={excluirCampo}>
        <input type="hidden" name="id" value={campo.id} />
        <BotaoExcluir rotulo={campo.rotulo} valores={campo._count.valores} />
      </form>
    </li>
  );
}

export default async function AdminNumeros({ searchParams }: Props) {
  const busca = await searchParams;
  const campos = await db.campoEstatistica.findMany({
    orderBy: [{ esporte: "asc" }, { posicao: "asc" }, { ordem: "asc" }, { criadoEm: "asc" }],
    include: { _count: { select: { valores: true } } },
  });
  const atletas = listarPerfis();

  return (
    <>
      <h1 className="admin__titulo">Números por esporte</h1>
      <p className="admin__texto">
        Escolha quais números aparecem no perfil de cada atleta. Cada esporte tem os seus números padrão; uma posição
        pode ter números próprios (ex.: Goleiro), que substituem os padrão para os atletas daquela posição. Sem tradução,
        o rótulo aparece em português nos outros idiomas.
      </p>
      <Aviso ok={busca.ok} erro={busca.erro} />

      <nav className="admin-indice" aria-label="Esportes">
        {MODALIDADES.map((m) => (
          <a key={m} href={`#${ancoraEsporte(m)}`}>
            {m}
          </a>
        ))}
      </nav>

      {MODALIDADES.map((esporte) => {
        const doEsporte = campos.filter((c) => c.esporte === esporte);
        const padrao = doEsporte.filter((c) => c.posicao === null);
        // Posições com números próprios + posições dos atletas desse esporte (para sugerir no formulário)
        const posicoes = [...new Set(doEsporte.flatMap((c) => (c.posicao ? [c.posicao] : [])))].sort((a, b) => a.localeCompare(b, "pt-BR"));
        const sugestoes = [...new Set([...posicoes, ...atletas.filter((a) => a.esporte === esporte).map((a) => a.posicao)])].sort();
        const listaId = `posicoes-${ancoraEsporte(esporte)}`;

        return (
          <section key={esporte} id={ancoraEsporte(esporte)} className="admin-esporte" aria-labelledby={`t-${ancoraEsporte(esporte)}`}>
            <h2 id={`t-${ancoraEsporte(esporte)}`} className="admin__subtitulo">
              {esporte}
            </h2>

            <h3 className="admin-esporte__grupo">Padrão de {esporte}</h3>
            {padrao.length === 0 ? (
              <p className="vazio">Nenhum número padrão ainda.</p>
            ) : (
              <ul className="admin-campos">
                {padrao.map((c) => (
                  <LinhaCampo key={c.id} campo={c} />
                ))}
              </ul>
            )}

            {posicoes.map((posicao) => (
              <div key={posicao}>
                <h3 className="admin-esporte__grupo">Só {posicao}</h3>
                <ul className="admin-campos">
                  {doEsporte
                    .filter((c) => c.posicao === posicao)
                    .map((c) => (
                      <LinhaCampo key={c.id} campo={c} />
                    ))}
                </ul>
              </div>
            ))}

            <details className="admin-novo">
              <summary>Adicionar número em {esporte}</summary>
              <form action={criarCampo} className="admin-campo__form">
                <input type="hidden" name="esporte" value={esporte} />
                <div className="campo">
                  <label htmlFor={`${listaId}-pos`}>Posição</label>
                  <input id={`${listaId}-pos`} name="posicao" list={listaId} maxLength={60} placeholder="Vazio = todas" />
                  <datalist id={listaId}>
                    {sugestoes.map((p) => (
                      <option key={p} value={p} />
                    ))}
                  </datalist>
                </div>
                <div className="campo campo--ordem">
                  <label htmlFor={`${listaId}-ordem`}>Ordem</label>
                  <input id={`${listaId}-ordem`} name="ordem" type="number" min={0} max={999} defaultValue={padrao.length} />
                </div>
                <div className="campo">
                  <label htmlFor={`${listaId}-pt`}>Português</label>
                  <input id={`${listaId}-pt`} name="rotulo" required maxLength={40} placeholder="Ex.: Gols" />
                </div>
                <div className="campo">
                  <label htmlFor={`${listaId}-en`}>Inglês</label>
                  <input id={`${listaId}-en`} name="rotuloEn" maxLength={40} placeholder="Goals" />
                </div>
                <div className="campo">
                  <label htmlFor={`${listaId}-es`}>Espanhol</label>
                  <input id={`${listaId}-es`} name="rotuloEs" maxLength={40} placeholder="Goles" />
                </div>
                <div className="campo">
                  <label htmlFor={`${listaId}-it`}>Italiano</label>
                  <input id={`${listaId}-it`} name="rotuloIt" maxLength={40} placeholder="Gol" />
                </div>
                <button type="submit" className="btn btn--primario btn--sm">
                  Adicionar
                </button>
              </form>
              <p className="campo__dica">
                Ao criar o primeiro número de uma posição, os atletas dessa posição passam a mostrar só os números dela.
              </p>
            </details>
          </section>
        );
      })}
    </>
  );
}
