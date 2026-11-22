import type { Metadata } from "next";
import Link from "next/link";
import { listarPerfis } from "@/constants/atletas-perfil";
import { db } from "@/lib/db";
import { Aviso } from "../Aviso";
import { criarAtleta } from "./acoes";

export const metadata: Metadata = { title: "Atletas" };

type Props = { searchParams: Promise<{ ok?: string; erro?: string }> };

/** Campos do perfil público; os vazios aparecem no site como "não compartilhado". */
const CAMPOS = ["esporte", "posicao", "categoria", "numero", "alturaCm", "pesoKg", "pe", "nacionalidade"] as const;

export default async function AdminAtletas({ searchParams }: Props) {
  const busca = await searchParams;
  const atletas = await listarPerfis({ incluirOcultos: true });
  const comNumeros = await db.estatisticaAtleta.groupBy({ by: ["atletaSlug"], _max: { temporada: true } });
  const ultimaTemporada = new Map(comNumeros.map((g) => [g.atletaSlug, g._max.temporada]));

  return (
    <>
      <h1 className="admin__titulo">Atletas</h1>
      <p className="admin__texto">
        Escolha um atleta para editar os dados, enviar fotos e preencher os números. O que ficar em branco aparece no perfil público
        como “Não compartilhado”. Quais números aparecem depende do esporte e da posição (ver{" "}
        <Link href="/admin/numeros">Números por esporte</Link>).
      </p>

      <Aviso ok={busca.ok} erro={busca.erro} />

      <details className="admin-novo">
        <summary>Novo atleta</summary>
        <form action={criarAtleta} className="admin-linha">
          <div className="campo">
            <label htmlFor="novo-nome">Nome</label>
            <input id="novo-nome" name="nome" required maxLength={80} />
          </div>
          <div className="campo">
            <label htmlFor="novo-clube">Clube</label>
            <input id="novo-clube" name="clube" required maxLength={80} />
          </div>
          <button type="submit" className="btn btn--primario btn--sm">
            Criar
          </button>
        </form>
        <p className="campo__dica">O atleta novo começa oculto no site; publique depois de preencher os dados e enviar a foto.</p>
      </details>

      <table className="admin-tabela">
        <thead>
          <tr>
            <th scope="col">
              <span className="sr-only">Foto</span>
            </th>
            <th scope="col">Atleta</th>
            <th scope="col">Clube</th>
            <th scope="col">Dados</th>
            <th scope="col">Números</th>
            <th scope="col">Site</th>
            <th scope="col">
              <span className="sr-only">Ações</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {atletas.map((a) => {
            const preenchidos = CAMPOS.filter((c) => a[c] !== undefined).length;
            return (
              <tr key={a.slug}>
                <td>
                  {a.foto ? (
                    // eslint-disable-next-line @next/next/no-img-element -- miniatura do painel, sem otimização
                    <img className="admin-miniatura" src={a.foto} alt="" loading="lazy" />
                  ) : (
                    <span className="admin-miniatura admin-miniatura--vazia" aria-label="Sem foto" />
                  )}
                </td>
                <td>{a.nome}</td>
                <td>{a.clube}</td>
                <td>
                  {preenchidos}/{CAMPOS.length}
                </td>
                <td>{ultimaTemporada.get(a.slug) ? `Temporada ${ultimaTemporada.get(a.slug)}` : "Sem números"}</td>
                <td>{a.publicado ? "Publicado" : "Oculto"}</td>
                <td>
                  <Link href={`/admin/atletas/${a.slug}`} className="btn btn--contorno btn--sm">
                    Editar
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
