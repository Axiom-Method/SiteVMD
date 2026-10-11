import { FundoEsportivo } from "@/components/home/FundoEsportivo";
import { ButtonLink } from "@/components/ui/Button";
import { PUBLICO_SERVICOS, SERVICOS } from "@/constants/servicos";
import { linkWhatsApp } from "@/constants/site";

const MENSAGEM_ORCAMENTO = "Olá! Vim pelo site da VMD e gostaria de solicitar um orçamento.";

/** Serviços sem preço fixo: o valor sai de um orçamento sob medida (via WhatsApp). */
export function Servicos() {
  return (
    <section id="servicos" className="secao secao--escura" aria-labelledby="servicos-titulo">
      <FundoEsportivo tipo="area" />
      <div className="container servicos">
        <div className="servicos__intro">
          <h2 id="servicos-titulo" className="titulo-secao">
            Nossos <span className="destaque">serviços</span>
          </h2>
          <p className="subtitulo">
            Muito além de artes: comunicação completa para quem vive o esporte.
          </p>
          <ul className="servicos__publico" aria-label="Para quem trabalhamos">
            {PUBLICO_SERVICOS.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p className="servicos__preco">
            Sem preço fixo: o valor é definido conforme a sua necessidade.
          </p>
          <ButtonLink href={linkWhatsApp(MENSAGEM_ORCAMENTO)} className="servicos__cta">
            Solicitar orçamento
          </ButtonLink>
        </div>

        <div className="servicos__grupos">
          {SERVICOS.map((grupo) => (
            <div key={grupo.titulo} className="servicos__grupo">
              <h3 className="servicos__titulo">{grupo.titulo}</h3>
              <ul className="lista-check servicos__lista">
                {grupo.itens.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
