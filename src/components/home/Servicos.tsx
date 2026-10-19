import { FundoEsportivo } from "@/components/home/FundoEsportivo";
import { ButtonLink } from "@/components/ui/Button";
import { Icone } from "@/components/ui/Icone";
import { Revelar, RevelarGrupo, RevelarItem } from "@/components/ui/Revelar";
import { ICONES_SERVICOS } from "@/constants/servicos";
import { linkWhatsApp } from "@/constants/site";
import { PalavraFundo } from "@/components/ui/PalavraFundo";
import { Destaque } from "@/components/ui/Destaque";
import { obterTextos } from "@/i18n/servidor";

/** Serviços sem preço fixo: o valor sai de um orçamento sob medida (via WhatsApp). */
export async function Servicos() {
  const { t } = await obterTextos();
  return (
    <section id="servicos" className="secao secao--escura" aria-labelledby="servicos-titulo">
      <PalavraFundo>{t.servicos.fundo}</PalavraFundo>
      <FundoEsportivo tipo="area" />
      <div className="container servicos">
        {/* Fica fixa ao lado dos cards no desktop: o CTA continua à vista enquanto a lista rola */}
        <Revelar className="servicos__intro">
          <p className="eyebrow">{t.servicos.eyebrow}</p>
          <h2 id="servicos-titulo" className="titulo-secao">
            <Destaque a={t.servicos.tituloA} b={t.servicos.tituloB} />
          </h2>
          <p className="subtitulo">{t.servicos.subtitulo}</p>
          <ul className="servicos__publico" aria-label={t.servicos.publicoRotulo}>
            {t.servicos.publico.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p className="servicos__preco">{t.servicos.preco}</p>
          <ButtonLink href={linkWhatsApp(t.servicos.mensagem)} className="servicos__cta btn--seta">
            {t.servicos.cta}
            <Icone nome="seta" className="btn__seta" />
          </ButtonLink>
        </Revelar>

        <RevelarGrupo className="servicos__grupos">
          {t.servicos.grupos.map((grupo, i) => (
            <RevelarItem key={grupo.titulo} className="servico holofote inclina inclina--suave">
              <div className="servico__topo">
                <span className="icone-caixa">
                  <Icone nome={ICONES_SERVICOS[i]} />
                </span>
                <h3 className="servico__titulo">{grupo.titulo}</h3>
              </div>
              <ul className="lista-check servico__lista">
                {grupo.itens.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </RevelarItem>
          ))}
        </RevelarGrupo>
      </div>
    </section>
  );
}
