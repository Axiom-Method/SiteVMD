import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="container secao centro">
      <p className="eyebrow">Erro 404</p>
      <h1 className="titulo-secao">Página não <span className="destaque">encontrada</span></h1>
      <p className="subtitulo">O endereço que você acessou não existe ou foi removido.</p>
      <div className="acoes" style={{ justifyContent: "center" }}>
        <ButtonLink href="/">Voltar para a Home</ButtonLink>
      </div>
    </main>
  );
}
