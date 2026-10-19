import { FundoEsportivo } from "@/components/home/FundoEsportivo";
import { ButtonLink } from "@/components/ui/Button";
import { Icone } from "@/components/ui/Icone";
import { Revelar } from "@/components/ui/Revelar";
import { PalavraFundo } from "@/components/ui/PalavraFundo";
import { Destaque } from "@/components/ui/Destaque";
import { obterTextos } from "@/i18n/servidor";

export async function TecnicosOlheiros() {
  const { t } = await obterTextos();
  return (
    <section className="secao" aria-labelledby="tecnicos">
      <PalavraFundo lado="direita">{t.tecnicos.fundo}</PalavraFundo>
      <FundoEsportivo tipo="rastro" />
      <Revelar className="container caixa">
        <div>
          <p className="eyebrow">{t.tecnicos.eyebrow}</p>
          <h2 id="tecnicos" className="titulo-secao titulo-secao--pequeno">
            <Destaque a={t.tecnicos.tituloA} b={t.tecnicos.tituloB} />
          </h2>
          <p>{t.tecnicos.texto}</p>
        </div>
        <ButtonLink href="/atletas" className="btn--seta">
          {t.tecnicos.cta}
          <Icone nome="busca" className="btn__seta" />
        </ButtonLink>
      </Revelar>
    </section>
  );
}
