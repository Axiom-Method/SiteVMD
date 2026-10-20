import type { Metadata } from "next";
import Link from "next/link";
import { listarPerfis } from "@/constants/atletas-perfil";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Atletas" };

export default async function AdminAtletas() {
  // TODO: quando os atletas forem para o banco, listar daqui (com busca e status de publicação)
  const atletas = listarPerfis();
  const comNumeros = await db.estatisticaAtleta.groupBy({ by: ["atletaSlug"], _max: { temporada: true } });
  const ultimaTemporada = new Map(comNumeros.map((g) => [g.atletaSlug, g._max.temporada]));

  return (
    <>
      <h1 className="admin__titulo">Atletas</h1>
      <p className="admin__texto">
        Escolha um atleta para editar os números. Quais números aparecem depende do esporte e da posição (ver{" "}
        <Link href="/admin/numeros">Números por esporte</Link>).
      </p>
      <table className="admin-tabela">
        <thead>
          <tr>
            <th scope="col">Atleta</th>
            <th scope="col">Esporte</th>
            <th scope="col">Posição</th>
            <th scope="col">Categoria</th>
            <th scope="col">Números</th>
            <th scope="col">
              <span className="sr-only">Ações</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {atletas.map((a) => (
            <tr key={a.slug}>
              <td>{a.nome}</td>
              <td>{a.esporte}</td>
              <td>{a.posicao}</td>
              <td>{a.categoria}</td>
              <td>{ultimaTemporada.get(a.slug) ? `Temporada ${ultimaTemporada.get(a.slug)}` : "Sem números"}</td>
              <td>
                <Link href={`/admin/atletas/${a.slug}`} className="btn btn--contorno btn--sm">
                  Editar números
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
