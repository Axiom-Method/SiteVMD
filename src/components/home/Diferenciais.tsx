import { FundoEsportivo } from "@/components/home/FundoEsportivo";
import { Icone, type NomeIcone } from "@/components/ui/Icone";
import { Revelar, RevelarGrupo, RevelarItem } from "@/components/ui/Revelar";
import { PalavraFundo } from "@/components/ui/PalavraFundo";
import { Destaque } from "@/components/ui/Destaque";
import { obterTextos } from "@/i18n/servidor";

/** Ícones na ordem dos textos em t.diferenciais.itens. */
const ICONES: readonly NomeIcone[] = ["conversa", "alvo", "escudo", "video", "perfil", "pincel", "calendario", "evolucao"];

export async function Diferenciais() {
  const { t } = await obterTextos();
  return (
    <section className="secao secao--escura" aria-labelledby="diferenciais">
      <PalavraFundo>{t.diferenciais.fundo}</PalavraFundo>
      <FundoEsportivo tipo="quadra" />
      <div className="container">
        <Revelar>
          <p className="eyebrow">{t.diferenciais.eyebrow}</p>
          <h2 id="diferenciais" className="titulo-secao">
            <Destaque a={t.diferenciais.tituloA} b={t.diferenciais.tituloB} />
          </h2>
        </Revelar>
        <RevelarGrupo as="ul" className="diferenciais">
          {t.diferenciais.itens.map((texto, i) => (
            <RevelarItem as="li" key={texto} className="diferencial holofote inclina">
              <span className="icone-caixa">
                <Icone nome={ICONES[i]} />
              </span>
              {texto}
            </RevelarItem>
          ))}
        </RevelarGrupo>
      </div>
    </section>
  );
}
