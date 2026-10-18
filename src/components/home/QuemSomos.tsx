import { FundoEsportivo } from "@/components/home/FundoEsportivo";
import { Icone, type NomeIcone } from "@/components/ui/Icone";
import { Revelar, RevelarGrupo, RevelarItem } from "@/components/ui/Revelar";
import { PalavraFundo } from "@/components/ui/PalavraFundo";

/** Os três pilares da proposta (os mesmos da Hero): ocupam a coluna sob o título. */
const PILARES: readonly { icone: NomeIcone; titulo: string; texto: string }[] = [
  { icone: "escudo", titulo: "Imagem", texto: "Uma presença sólida e profissional fora de campo." },
  { icone: "alvo", titulo: "Posicionamento", texto: "Estratégia para ser visto por quem importa." },
  { icone: "evolucao", titulo: "Valorização", texto: "Uma marca pessoal que cresce com a carreira." },
];

export function QuemSomos() {
  return (
    <section className="secao" aria-labelledby="quem-somos">
      <PalavraFundo lado="direita">Propósito</PalavraFundo>
      <FundoEsportivo tipo="campo" />
      <div className="container duas-colunas">
        <div className="quem-somos__lado">
          <Revelar>
            <p className="eyebrow">Sobre a VMD</p>
            <h2 id="quem-somos" className="titulo-secao">
              Quem <span className="destaque">somos?</span>
            </h2>
          </Revelar>
          <RevelarGrupo as="ul" className="pilares">
            {PILARES.map((p) => (
              <RevelarItem as="li" key={p.titulo} className="pilar holofote inclina">
                <span className="pilar__icone">
                  <Icone nome={p.icone} />
                </span>
                <span>
                  <strong className="pilar__titulo">{p.titulo}</strong>
                  <span className="pilar__texto">{p.texto}</span>
                </span>
              </RevelarItem>
            ))}
          </RevelarGrupo>
        </div>
        <Revelar className="texto-corrido" atraso={0.12}>
          <p className="texto-corrido__abertura">
            A VMD nasceu com o propósito de ajudar atletas a construírem uma presença digital forte, profissional e
            estratégica.
          </p>
          <p>
            Acreditamos que o desempenho dentro das quadras, campos e arenas precisa ser acompanhado por uma imagem
            sólida fora delas.
          </p>
          <p>
            Mais do que criar artes e vídeos, buscamos fortalecer marcas pessoais, gerar reconhecimento e acompanhar de
            perto a trajetória de cada atleta.
          </p>
          <blockquote className="citacao">
            Mais do que clientes, construímos parcerias duradouras com os atletas que representamos.
          </blockquote>
        </Revelar>
      </div>
    </section>
  );
}
