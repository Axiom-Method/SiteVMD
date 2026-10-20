import { FundoEsportivo } from "@/components/home/FundoEsportivo";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ButtonLink } from "@/components/ui/Button";
import { Destaque } from "@/components/ui/Destaque";
import { MovimentoProvider } from "@/components/ui/Revelar";
import { obterTextos } from "@/i18n/servidor";

// Fica fora do layout público: por isso inclui header e rodapé aqui, para o visitante não ficar sem saída.
export default async function NotFound() {
  const { t } = await obterTextos();
  return (
    <MovimentoProvider>
      <Header />
      <main id="conteudo">
        <section className="secao secao--status" aria-labelledby="titulo-404">
          <FundoEsportivo tipo="campo" />
          <div className="container centro">
            <p className="eyebrow">{t.erro404.eyebrow}</p>
            <h1 id="titulo-404" className="titulo-secao">
              <Destaque a={t.erro404.tituloA} b={t.erro404.tituloB} />
            </h1>
            <p className="subtitulo">{t.erro404.texto}</p>
            <div className="acoes cta-final__acoes">
              <ButtonLink href="/">{t.erro404.home}</ButtonLink>
              <ButtonLink href="/atletas" variant="contorno">
                {t.erro404.atletas}
              </ButtonLink>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </MovimentoProvider>
  );
}
