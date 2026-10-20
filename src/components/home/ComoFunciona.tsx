import { FundoEsportivo } from "@/components/home/FundoEsportivo";
import { Revelar, RevelarGrupo, RevelarItem } from "@/components/ui/Revelar";
import { PalavraFundo } from "@/components/ui/PalavraFundo";
import { Destaque } from "@/components/ui/Destaque";
import { obterTextos } from "@/i18n/servidor";

export async function ComoFunciona() {
  const { t } = await obterTextos();
  return (
    <section className="secao" aria-labelledby="como-funciona">
      <PalavraFundo lado="direita">{t.comoFunciona.fundo}</PalavraFundo>
      <FundoEsportivo tipo="raias" />
      <div className="container">
        <Revelar>
          <p className="eyebrow">{t.comoFunciona.eyebrow}</p>
          <h2 id="como-funciona" className="titulo-secao">
            <Destaque a={t.comoFunciona.tituloA} b={t.comoFunciona.tituloB} />
          </h2>
        </Revelar>
        <RevelarGrupo as="ol" className="passos">
          {t.comoFunciona.passos.map((p, i) => (
            <RevelarItem as="li" key={p.titulo} className="passo holofote inclina">
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
