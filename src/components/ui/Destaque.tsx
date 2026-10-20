/**
 * Título em duas partes com a segunda em laranja: "Nossos <span>atletas</span>".
 * Sem espaço quando a primeira parte termina em apóstrofo (italiano: "dell'atleta").
 */
export function Destaque({ a, b }: { a: string; b: string }) {
  return (
    <>
      {a}
      {a.endsWith("'") ? "" : " "}
      <span className="destaque">{b}</span>
    </>
  );
}
