import { Trofeu3DLazy } from "@/components/home/Trofeu3DLazy";
import { ButtonLink } from "@/components/ui/Button";
import { Icone } from "@/components/ui/Icone";
import { Revelar } from "@/components/ui/Revelar";
import { Destaque } from "@/components/ui/Destaque";
import { linkWhatsApp } from "@/constants/site";
import { obterTextos } from "@/i18n/servidor";

export async function CtaFinal() {
  const { t } = await obterTextos();
  return (
    <section className="cta-final" aria-labelledby="cta-final">
      {/* Taça 3D (WebGL) ao fundo, atrás do texto */}
      <Trofeu3DLazy />
      <div className="container centro cta-final__conteudo">
        <Revelar>
          <p className="eyebrow">{t.ctaFinal.eyebrow}</p>
          <h2 id="cta-final" className="titulo-secao">
            <Destaque a={t.ctaFinal.tituloA} b={t.ctaFinal.tituloB} />
          </h2>
        </Revelar>
        <Revelar className="acoes cta-final__acoes" atraso={0.15}>
          <ButtonLink href="/cadastro" className="btn--seta btn--brilho">
            {t.ctaFinal.cadastro}
            <Icone nome="seta" className="btn__seta" />
          </ButtonLink>
          <ButtonLink href={linkWhatsApp(t.ctaFinal.mensagem)} variant="contorno">
            {t.ctaFinal.whatsapp}
          </ButtonLink>
        </Revelar>
      </div>
    </section>
  );
}
