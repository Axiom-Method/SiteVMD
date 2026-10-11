import { FundoEsportivo } from "@/components/home/FundoEsportivo";

const DIFERENCIAIS = [
  "Atendimento próximo e humanizado",
  "Estratégias personalizadas",
  "Gestão de imagem esportiva",
  "Produção de conteúdo profissional",
  "Organização de perfil",
  "Desenvolvimento de identidade visual",
  "Planejamento estratégico de conteúdo",
  "Equipe comprometida com a evolução do atleta",
] as const;

export function Diferenciais() {
  return (
    <section className="secao secao--escura" aria-labelledby="diferenciais">
      <FundoEsportivo tipo="quadra" />
      <div className="container">
        <h2 id="diferenciais" className="titulo-secao">
          Diferenciais <span className="destaque">VMD</span>
        </h2>
        <ul className="lista-check">
          {DIFERENCIAIS.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
