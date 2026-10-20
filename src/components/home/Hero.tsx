import type { CSSProperties } from "react";
import { HeroArte } from "@/components/home/HeroArte";
import { ButtonLink } from "@/components/ui/Button";
import { Icone } from "@/components/ui/Icone";
import { obterTextos } from "@/i18n/servidor";

export async function Hero() {
  const { t } = await obterTextos();
  // Linhas do título: quebras intencionais; as duas últimas ficam em destaque (laranja)
  const linhas = t.hero.linhas.map((texto, i, todas) => ({ texto, destaque: i >= todas.length - 2 }));

  return (
    <section className="hero" aria-labelledby="hero-titulo">
      <HeroArte />

      <div className="hero__conteudo container">
        <p className="eyebrow">{t.hero.eyebrow}</p>
        <h1 id="hero-titulo" className="hero__titulo">
          {/* Cada linha sobe de dentro de uma máscara, em sequência (--i) */}
          {linhas.map((l, i) => (
            <span key={l.texto} className={l.destaque ? "hero__linha destaque" : "hero__linha"}>
              <span className="hero__linha-texto" style={{ "--i": i } as CSSProperties}>
                {l.texto}
              </span>{" "}
            </span>
          ))}
        </h1>
        <p className="lead">{t.hero.lead}</p>
        <div className="acoes">
          <ButtonLink href="/cadastro" className="btn--seta btn--brilho">
            {t.hero.cta}
            <Icone nome="seta" className="btn__seta" />
          </ButtonLink>
          <ButtonLink href="/atletas" variant="contorno">
            {t.hero.conhecerAtletas}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
