import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buscarPerfil } from "@/constants/atletas-perfil";
import { db } from "@/lib/db";
import { ancoraEsporte } from "@/lib/utils";
import { camposDoAtleta } from "@/services/estatistica.service";
import { salvarNumeros } from "../../acoes";
import { Aviso } from "../../Aviso";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ temporada?: string; ok?: string; erro?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const atleta = buscarPerfil((await params).id);
  return { title: atleta ? `Números de ${atleta.nome}` : "Atleta" };
}

/** O `id` da rota é o slug do atleta (os atletas ainda estão em src/constants). */
export default async function AdminNumerosAtleta({ params, searchParams }: Props) {
  const { id } = await params;
  const busca = await searchParams;
  const atleta = buscarPerfil(id);
  if (!atleta) notFound();

  const campos = await camposDoAtleta(atleta.esporte, atleta.posicao);
  const daPosicao = campos.some((c) => c.posicao !== null);

  const temporadas = (
    await db.estatisticaAtleta.findMany({ where: { atletaSlug: atleta.slug }, distinct: ["temporada"], select: { temporada: true }, orderBy: { temporada: "desc" } })
  ).map((t) => t.temporada);
  const pedida = typeof busca.temporada === "string" && /^\d{4}(\/\d{2,4})?$/.test(busca.temporada) ? busca.temporada : undefined;
  const temporada = pedida ?? temporadas[0] ?? atleta.temporada;

  const valores = await db.estatisticaAtleta.findMany({ where: { atletaSlug: atleta.slug, temporada } });
  const valorDe = new Map(valores.map((v) => [v.campoId, v.valor]));

  return (
    <>
      <p className="admin__voltar">
        <Link href="/admin/atletas">← Atletas</Link>
      </p>
      <h1 className="admin__titulo">{atleta.nome}</h1>
      <p className="admin__texto">
        {atleta.esporte} · {atleta.posicao} · {atleta.categoria} · {atleta.clube} ·{" "}
        <Link href={`/atletas/${atleta.slug}`} target="_blank">
          ver perfil público
        </Link>
      </p>

      <Aviso ok={busca.ok} erro={busca.erro} />

      {/* Trocar de temporada (GET: só recarrega a página com os valores daquela temporada) */}
      <form className="admin-linha" method="get">
        <div className="campo">
          <label htmlFor="temporada-ver">Temporada</label>
          <input id="temporada-ver" name="temporada" list="temporadas" defaultValue={temporada} placeholder="2026" pattern="\d{4}(/\d{2,4})?" />
          <datalist id="temporadas">
            {temporadas.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
        </div>
        <button type="submit" className="btn btn--contorno btn--sm">
          Abrir temporada
        </button>
      </form>

      {campos.length === 0 ? (
        <p className="admin-aviso">
          {atleta.esporte} ainda não tem números cadastrados.{" "}
          <Link href={`/admin/numeros#${ancoraEsporte(atleta.esporte)}`}>Cadastrar os números de {atleta.esporte}</Link>.
        </p>
      ) : (
        <form action={salvarNumeros} className="admin-form">
          <input type="hidden" name="slug" value={atleta.slug} />
          <input type="hidden" name="temporada" value={temporada} />
          <p className="admin__texto">
            {daPosicao ? (
              <>
                Números próprios de <strong>{atleta.posicao}</strong> no {atleta.esporte}.
              </>
            ) : (
              <>
                Números padrão de <strong>{atleta.esporte}</strong> (a posição {atleta.posicao} não tem números próprios).
              </>
            )}{" "}
            <Link href={`/admin/numeros#${ancoraEsporte(atleta.esporte)}`}>Mudar quais números aparecem</Link>
          </p>
          <fieldset>
            <legend>Temporada {temporada}</legend>
            <div className="admin-grade">
              {campos.map((c) => (
                <div key={c.id} className="campo">
                  <label htmlFor={`campo-${c.id}`}>{c.rotulo}</label>
                  <input
                    id={`campo-${c.id}`}
                    name={`campo:${c.id}`}
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={1}
                    defaultValue={valorDe.get(c.id) ?? ""}
                  />
                </div>
              ))}
            </div>
            <p className="campo__dica">Deixe em branco o que não quiser mostrar no perfil.</p>
          </fieldset>
          <button type="submit" className="btn btn--primario">
            Salvar números
          </button>
        </form>
      )}
    </>
  );
}
