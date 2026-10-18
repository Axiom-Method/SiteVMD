"use client";

import { ButtonLink } from "@/components/ui/Button";

// Nunca exibe error.message ao visitante: pode conter detalhes internos.
export default function ErroGlobal({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="conteudo">
      <section className="secao secao--status" aria-labelledby="titulo-erro">
        <div className="container centro">
          <p className="eyebrow">Algo deu errado</p>
          <h1 id="titulo-erro" className="titulo-secao">
            Tivemos um <span className="destaque">problema</span>
          </h1>
          <p className="subtitulo">Tente novamente em instantes.</p>
          <div className="acoes cta-final__acoes">
            <button type="button" className="btn btn--primario" onClick={reset}>
              Tentar novamente
            </button>
            <ButtonLink href="/" variant="contorno">
              Ir para a Home
            </ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
