import { FundoEsportivo } from "@/components/home/FundoEsportivo";

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
        <h2 id="como-funciona" className="titulo-secao">
          Como <span className="destaque">funciona</span>
        </h2>
        <ol className="passos">
          {PASSOS.map((p, i) => (
            <li key={p.titulo} className="passo">
              <span className="passo__numero" aria-hidden="true">
                {i + 1}
              </span>
              <h3>{p.titulo}</h3>
              <p>{p.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
