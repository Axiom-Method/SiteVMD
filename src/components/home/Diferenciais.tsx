import { FundoEsportivo } from "@/components/home/FundoEsportivo";
import { Icone, type NomeIcone } from "@/components/ui/Icone";
import { Revelar, RevelarGrupo, RevelarItem } from "@/components/ui/Revelar";

const DIFERENCIAIS: readonly { icone: NomeIcone; texto: string }[] = [
  { icone: "conversa", texto: "Atendimento próximo e humanizado" },
  { icone: "alvo", texto: "Estratégias personalizadas" },
  { icone: "escudo", texto: "Gestão de imagem esportiva" },
  { icone: "video", texto: "Produção de conteúdo profissional" },
  { icone: "perfil", texto: "Organização de perfil" },
  { icone: "pincel", texto: "Desenvolvimento de identidade visual" },
  { icone: "calendario", texto: "Planejamento estratégico de conteúdo" },
  { icone: "evolucao", texto: "Equipe comprometida com a evolução do atleta" },
];

export function Diferenciais() {
  return (
    <section className="secao secao--escura" aria-labelledby="diferenciais">
      <FundoEsportivo tipo="quadra" />
      <div className="container">
        <Revelar>
          <p className="eyebrow">Por que a VMD</p>
          <h2 id="diferenciais" className="titulo-secao">
            Diferenciais <span className="destaque">VMD</span>
          </h2>
        </Revelar>
        <RevelarGrupo as="ul" className="diferenciais">
          {DIFERENCIAIS.map((d) => (
            <RevelarItem as="li" key={d.texto} className="diferencial holofote inclina">
              <span className="icone-caixa">
                <Icone nome={d.icone} />
              </span>
              {d.texto}
            </RevelarItem>
          ))}
        </RevelarGrupo>
      </div>
    </section>
  );
}
