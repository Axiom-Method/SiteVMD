import Link from "next/link";
import type { AtletaResumo } from "@/constants/atletas-destaque";
import { iniciais } from "@/lib/utils";

/** Card público: só nome, posição, categoria e clube. Nunca contato ou documentos. */
export function CardAtleta({ atleta }: { atleta: AtletaResumo }) {
  return (
    <article className="atleta">
      <div className="atleta__avatar" aria-hidden="true">
        {iniciais(atleta.nome)}
      </div>
      <h3 className="atleta__nome">{atleta.nome}</h3>
      <p className="atleta__meta">
        {atleta.posicao} · {atleta.categoria}
      </p>
      <p className="atleta__clube">{atleta.clube}</p>
      <Link href={`/atletas/${atleta.slug}`} className="atleta__link">
        Ver perfil <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
