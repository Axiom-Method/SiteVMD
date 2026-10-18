import { FundoEsportivo } from "@/components/home/FundoEsportivo";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ButtonLink } from "@/components/ui/Button";
import { MovimentoProvider } from "@/components/ui/Revelar";

// Fica fora do layout público: por isso inclui header e rodapé aqui, para o visitante não ficar sem saída.
export default function NotFound() {
  return (
    <MovimentoProvider>
      <Header />
      <main id="conteudo">
        <section className="secao secao--status" aria-labelledby="titulo-404">
          <FundoEsportivo tipo="campo" />
          <div className="container centro">
            <p className="eyebrow">Erro 404</p>
            <h1 id="titulo-404" className="titulo-secao">
              Página não <span className="destaque">encontrada</span>
            </h1>
            <p className="subtitulo">O endereço que você acessou não existe ou foi removido.</p>
            <div className="acoes cta-final__acoes">
              <ButtonLink href="/">Voltar para a Home</ButtonLink>
              <ButtonLink href="/atletas" variant="contorno">
                Ver atletas
              </ButtonLink>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </MovimentoProvider>
  );
}
