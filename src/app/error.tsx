"use client";

import { ButtonLink } from "@/components/ui/Button";
import { Destaque } from "@/components/ui/Destaque";
import { useTextos } from "@/i18n/cliente";

// Nunca exibe error.message ao visitante: pode conter detalhes internos.
export default function ErroGlobal({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useTextos();
  return (
    <main id="conteudo">
      <section className="secao secao--status" aria-labelledby="titulo-erro">
        <div className="container centro">
          <p className="eyebrow">{t.erro.eyebrow}</p>
          <h1 id="titulo-erro" className="titulo-secao">
            <Destaque a={t.erro.tituloA} b={t.erro.tituloB} />
          </h1>
          <p className="subtitulo">{t.erro.texto}</p>
          <div className="acoes cta-final__acoes">
            <button type="button" className="btn btn--primario" onClick={reset}>
              {t.erro.tentar}
            </button>
            <ButtonLink href="/" variant="contorno">
              {t.erro.home}
            </ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
