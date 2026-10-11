import { ButtonLink } from "@/components/ui/Button";
import type { Plano } from "@/constants/planos";
import { formatarPreco } from "@/lib/utils";

export function CardPlano({ plano }: { plano: Plano }) {
  return (
    <article className={`plano ${plano.destaque ? "plano--destaque" : ""}`} id={plano.id}>
      {plano.destaque && <span className="plano__selo">Mais escolhido</span>}
      <h3 className="plano__nome">{plano.nome}</h3>
      <p className="plano__preco">
        {formatarPreco(plano.precoMensal)}
        <span>/mês</span>
      </p>
      {plano.heranca && <p className="plano__heranca">{plano.heranca}</p>}
      <ul className="plano__itens">
        {plano.itens.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {/* O parâmetro ?plano= será validado no servidor (lista fechada de IDs). */}
      <ButtonLink href={`/cadastro?plano=${plano.id}`} variant={plano.destaque ? "primario" : "contorno"}>
        Quero este plano
      </ButtonLink>
    </article>
  );
}
