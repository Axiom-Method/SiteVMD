import { FundoEsportivo } from "@/components/home/FundoEsportivo";
import { ButtonLink } from "@/components/ui/Button";

export function CtaFinal() {
  return (
    <section className="cta-final" aria-labelledby="cta-final">
      <FundoEsportivo tipo="trofeu" />
      <div className="container centro">
        <h2 id="cta-final" className="titulo-secao">
          Seu desempenho dentro de campo merece uma <span className="destaque">presença forte fora dele.</span>
        </h2>
        <ButtonLink href="/cadastro">Cadastre-se agora</ButtonLink>
      </div>
    </section>
  );
}
