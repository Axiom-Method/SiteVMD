import { Trofeu3DLazy } from "@/components/home/Trofeu3DLazy";
import { ButtonLink } from "@/components/ui/Button";
import { Icone } from "@/components/ui/Icone";
import { Revelar } from "@/components/ui/Revelar";
import { linkWhatsApp } from "@/constants/site";

const MENSAGEM_CONTATO = "Olá! Vim pelo site da VMD e quero saber como fortalecer minha imagem como atleta.";

export function CtaFinal() {
  return (
    <section className="cta-final" aria-labelledby="cta-final">
      <div className="container centro">
        {/* Troféu 3D (WebGL): substitui o troféu em traço que ficava ao fundo */}
        <Trofeu3DLazy />
        <Revelar>
          <p className="eyebrow">Próximo passo</p>
          <h2 id="cta-final" className="titulo-secao">
            Seu desempenho dentro de campo merece uma <span className="destaque">presença forte fora dele.</span>
          </h2>
        </Revelar>
        <Revelar className="acoes cta-final__acoes" atraso={0.15}>
          <ButtonLink href="/cadastro" className="btn--seta btn--brilho">
            Cadastre-se agora
            <Icone nome="seta" className="btn__seta" />
          </ButtonLink>
          <ButtonLink href={linkWhatsApp(MENSAGEM_CONTATO)} variant="contorno">
            Falar no WhatsApp
          </ButtonLink>
        </Revelar>
      </div>
    </section>
  );
}
