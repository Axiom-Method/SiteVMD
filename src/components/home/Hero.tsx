import type { CSSProperties } from "react";
import { HeroArte } from "@/components/home/HeroArte";
import { ButtonLink } from "@/components/ui/Button";
import { Icone } from "@/components/ui/Icone";

/** Linhas do título: quebras intencionais. */
const LINHAS = [
  { texto: "Transformamos" },
  // Espaço inseguro: em telas estreitas a quebra cai em "presença / digital em", sem "em" órfão.
  { texto: "presença digital em" },
  { texto: "posicionamento", destaque: true },
  { texto: "profissional", destaque: true },
];

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-titulo">
      <HeroArte />

      <div className="hero__conteudo container">
        <p className="eyebrow">Assessoria &amp; Marketing Esportivo</p>
        <h1 id="hero-titulo" className="hero__titulo">
          {/* Cada linha sobe de dentro de uma máscara, em sequência (--i) */}
          {LINHAS.map((l, i) => (
            <span key={l.texto} className={l.destaque ? "hero__linha destaque" : "hero__linha"}>
              <span className="hero__linha-texto" style={{ "--i": i } as CSSProperties}>
                {l.texto}
              </span>{" "}
            </span>
          ))}
        </h1>
        <p className="lead">
          Assessoria especializada no fortalecimento da imagem, posicionamento e valorização de atletas.
        </p>
        <div className="acoes">
          <ButtonLink href="/cadastro" className="btn--seta btn--brilho">
            Quero ser VMD
            <Icone nome="seta" className="btn__seta" />
          </ButtonLink>
          <ButtonLink href="/atletas" variant="contorno">
            Conhecer os atletas
          </ButtonLink>
        </div>
      </div>

      <a href="#quem-somos" className="hero__rolar" aria-label="Rolar para a próxima seção">
        <span className="hero__rolar-mouse" aria-hidden="true" />
        <span aria-hidden="true">Role</span>
      </a>
    </section>
  );
}
