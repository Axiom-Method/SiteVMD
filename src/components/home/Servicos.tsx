import { FundoEsportivo } from "@/components/home/FundoEsportivo";
import { ButtonLink } from "@/components/ui/Button";
import { Icone } from "@/components/ui/Icone";
import { Revelar, RevelarGrupo, RevelarItem } from "@/components/ui/Revelar";
import { PUBLICO_SERVICOS, SERVICOS } from "@/constants/servicos";
import { linkWhatsApp } from "@/constants/site";

const MENSAGEM_ORCAMENTO = "Olá! Vim pelo site da VMD e gostaria de solicitar um orçamento.";

/** Serviços sem preço fixo: o valor sai de um orçamento sob medida (via WhatsApp). */
export function Servicos() {
  return (
    <section id="servicos" className="secao secao--escura" aria-labelledby="servicos-titulo">
      <FundoEsportivo tipo="area" />
      <div className="container servicos">
        {/* Fica fixa ao lado dos cards no desktop: o CTA continua à vista enquanto a lista rola */}
        <Revelar className="servicos__intro">
          <p className="eyebrow">O que fazemos</p>
          <h2 id="servicos-titulo" className="titulo-secao">
            Nossos <span className="destaque">serviços</span>
          </h2>
          <p className="subtitulo">Muito além de artes: comunicação completa para quem vive o esporte.</p>
          <ul className="servicos__publico" aria-label="Para quem trabalhamos">
            {PUBLICO_SERVICOS.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p className="servicos__preco">Sem preço fixo: o valor é definido conforme a sua necessidade.</p>
          <ButtonLink href={linkWhatsApp(MENSAGEM_ORCAMENTO)} className="servicos__cta btn--seta">
            Solicitar orçamento
            <Icone nome="seta" className="btn__seta" />
          </ButtonLink>
        </Revelar>

        <RevelarGrupo className="servicos__grupos">
          {SERVICOS.map((grupo) => (
            <RevelarItem key={grupo.titulo} className="servico holofote">
              <div className="servico__topo">
                <span className="icone-caixa">
                  <Icone nome={grupo.icone} />
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
