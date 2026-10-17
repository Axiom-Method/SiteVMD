import { FundoEsportivo } from "@/components/home/FundoEsportivo";
import { ButtonLink } from "@/components/ui/Button";
import { Icone } from "@/components/ui/Icone";
import { Revelar } from "@/components/ui/Revelar";

export function TecnicosOlheiros() {
  return (
    <section className="secao" aria-labelledby="tecnicos">
      <FundoEsportivo tipo="rastro" />
      <Revelar className="container caixa">
        <div>
          <p className="eyebrow">Busca de talentos</p>
          <h2 id="tecnicos" className="titulo-secao titulo-secao--pequeno">
            É técnico ou <span className="destaque">olheiro?</span>
          </h2>
          <p>
            Encontre atletas por posição, categoria e clube. O contato com o atleta é feito por meio da VMD, que
            intermedia a conversa e protege os dados de cada perfil.
          </p>
        </div>
        <ButtonLink href="/atletas" className="btn--seta">
          Buscar atletas
          <Icone nome="busca" className="btn__seta" />
        </ButtonLink>
      </Revelar>
    </section>
  );
}
