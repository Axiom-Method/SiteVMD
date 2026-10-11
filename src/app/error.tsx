"use client";

import { ButtonLink } from "@/components/ui/Button";

// Nunca exibe error.message ao visitante: pode conter detalhes internos.
export default function ErroGlobal({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="container secao centro">
      <p className="eyebrow">Algo deu errado</p>
      <h1 className="titulo-secao">Tivemos um <span className="destaque">problema</span></h1>
      <p className="subtitulo">Tente novamente em instantes.</p>
      <div className="acoes" style={{ justifyContent: "center" }}>
        <button type="button" className="btn btn--primario" onClick={reset}>Tentar novamente</button>
        <ButtonLink href="/" variant="contorno">Ir para a Home</ButtonLink>
      </div>
    </main>
  );
}
