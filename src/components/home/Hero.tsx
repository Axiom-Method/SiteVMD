import type { CSSProperties } from "react";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";

/** Linhas do título: quebras intencionais. */
const LINHAS = [
  { texto: "Transformamos" },
  // Espaço inseguro: em telas estreitas a quebra cai em "presença / digital em", sem "em" órfão.
  { texto: "presença digital em" },
  { texto: "posicionamento", destaque: true },
  { texto: "profissional", destaque: true },
];

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-titulo">
      {/* Arte, de trás para frente: marca VMD, estilhaços desfocados, atleta, luz laranja e a fratura à frente dele */}
      <div className="hero__arte" aria-hidden="true">
        <span className="hero__marca">VMD</span>
        <Image className="hero__vidro hero__vidro--fundo" src="/images/hero-vidro-fundo.webp" alt="" width={1000} height={563} sizes="100vw" />
        <Image className="hero__atleta" src="/images/hero-atleta.webp" alt="" width={1237} height={1271} priority sizes="(max-width: 820px) 115vw, 68vw" />
        <span className="hero__luz" />
        <Image className="hero__vidro hero__vidro--frente" src="/images/hero-vidro.webp" alt="" width={1672} height={941} priority sizes="(max-width: 820px) 170vw, 90vw" />
      </div>

      <div className="hero__conteudo container">
        <p className="eyebrow">Assessoria &amp; Marketing Esportivo</p>
        <h1 id="hero-titulo" className="hero__titulo">
          {LINHAS.map((l, i) => (
            <span
              key={l.texto}
              className={l.destaque ? "hero__linha destaque" : "hero__linha"}
              style={{ "--i": i } as CSSProperties}
            >
              {l.texto}{" "}
            </span>
          ))}
        </h1>
        <p className="lead">
          Assessoria especializada no fortalecimento da imagem, posicionamento e valorização de atletas.
        </p>
        <div className="acoes">
          <ButtonLink href="/cadastro" className="btn--seta">
            Quero ser VMD
            <svg className="btn__seta" viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
              <path d="M3 10h13M11 4.5 16.5 10 11 15.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </ButtonLink>
          <ButtonLink href="/atletas" variant="contorno">
            Conhecer os atletas
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
