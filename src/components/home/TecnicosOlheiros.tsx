import { ButtonLink } from "@/components/ui/Button";

export function TecnicosOlheiros() {
  return (
    <section className="secao" aria-labelledby="tecnicos">
      <div className="container caixa">
        <div>
          <h2 id="tecnicos" className="titulo-secao titulo-secao--pequeno">
            É técnico ou <span className="destaque">olheiro?</span>
          </h2>
          <p>
            Encontre atletas por posição, categoria e clube. O contato com o atleta é feito por meio da VMD, que
            intermedia a conversa e protege os dados de cada perfil.
          </p>
        </div>
        <ButtonLink href="/atletas">Buscar atletas</ButtonLink>
      </div>
    </section>
  );
}
