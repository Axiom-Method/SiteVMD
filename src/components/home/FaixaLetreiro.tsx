/**
 * Letreiro em movimento contínuo com o vocabulário da VMD.
 * Decorativo (aria-hidden): o mesmo conteúdo está nas seções. Pausa no hover e
 * fica parado com "reduzir movimento".
 * A lista é renderizada duas vezes e o trilho anda 50%: o loop não tem emenda.
 */
const PALAVRAS = [
  "Imagem",
  "Posicionamento",
  "Valorização",
  "Media day",
  "Produção de vídeos",
  "Identidade visual",
  "Media kit",
  "Gestão de carreira",
] as const;

function Sequencia() {
  return (
    <>
      {PALAVRAS.map((p, i) => (
        <span key={p} className={i % 2 ? "letreiro__item letreiro__item--vazado" : "letreiro__item"}>
          {p}
          <span className="letreiro__sep" />
        </span>
      ))}
    </>
  );
}

export function FaixaLetreiro() {
  return (
    <div className="letreiro" aria-hidden="true">
      {/* A faixa (inclinada) fica parada; só o trilho de texto anda dentro dela */}
      <div className="letreiro__faixa">
        <div className="letreiro__trilho">
          <Sequencia />
          <Sequencia />
        </div>
      </div>
    </div>
  );
}
