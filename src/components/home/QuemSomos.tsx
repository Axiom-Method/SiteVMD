import { FundoEsportivo } from "@/components/home/FundoEsportivo";
import { Icone, type NomeIcone } from "@/components/ui/Icone";
import { Revelar, RevelarGrupo, RevelarItem } from "@/components/ui/Revelar";
import { PalavraFundo } from "@/components/ui/PalavraFundo";
import { Destaque } from "@/components/ui/Destaque";
import { obterTextos } from "@/i18n/servidor";

/** Ícones dos três pilares (os mesmos da Hero), na ordem de t.quemSomos.pilares. */
const ICONES: readonly NomeIcone[] = ["escudo", "alvo", "evolucao"];

export async function QuemSomos() {
  const { t } = await obterTextos();
  return (
    <section className="secao" aria-labelledby="quem-somos">
      <PalavraFundo lado="direita">{t.quemSomos.fundo}</PalavraFundo>
      <FundoEsportivo tipo="campo" />
      <div className="container duas-colunas">
        <div className="quem-somos__lado">
          <Revelar>
            <p className="eyebrow">{t.quemSomos.eyebrow}</p>
            <h2 id="quem-somos" className="titulo-secao">
              <Destaque a={t.quemSomos.tituloA} b={t.quemSomos.tituloB} />
            </h2>
          </Revelar>
          <RevelarGrupo as="ul" className="pilares">
            {t.quemSomos.pilares.map((p, i) => (
              <RevelarItem as="li" key={p.titulo} className="pilar holofote inclina">
                <span className="pilar__icone">
                  <Icone nome={ICONES[i]} />
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
          <p className="texto-corrido__abertura">{t.quemSomos.abertura}</p>
          {t.quemSomos.paragrafos.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <blockquote className="citacao">{t.quemSomos.citacao}</blockquote>
        </Revelar>
      </div>
    </section>
  );
}
