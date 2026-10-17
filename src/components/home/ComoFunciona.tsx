import { FundoEsportivo } from "@/components/home/FundoEsportivo";
import { Revelar, RevelarGrupo, RevelarItem } from "@/components/ui/Revelar";

const PASSOS = [
  { titulo: "Cadastro", texto: "Preencha seus dados e envie as informações do atleta (com autorização do responsável, se menor de 18 anos)." },
  { titulo: "Orçamento personalizado", texto: "Conversamos sobre sua modalidade e suas necessidades e enviamos uma proposta sob medida." },
  { titulo: "Perfil publicado", texto: "Nossa equipe revisa e aprova o perfil. Depois disso, ele fica visível para técnicos e olheiros." },
] as const;

export function ComoFunciona() {
  return (
    <section className="secao" aria-labelledby="como-funciona">
      <FundoEsportivo tipo="raias" />
      <div className="container">
        <Revelar>
          <p className="eyebrow">Passo a passo</p>
          <h2 id="como-funciona" className="titulo-secao">
            Como <span className="destaque">funciona</span>
          </h2>
        </Revelar>
        <RevelarGrupo as="ol" className="passos">
          {PASSOS.map((p, i) => (
            <RevelarItem as="li" key={p.titulo} className="passo holofote">
              {/* Número + trilho até o próximo passo (o trilho some no último) */}
              <span className="passo__numero" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3>{p.titulo}</h3>
              <p>{p.texto}</p>
            </RevelarItem>
          ))}
        </RevelarGrupo>
      </div>
    </section>
  );
}
