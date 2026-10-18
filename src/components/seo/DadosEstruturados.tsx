/**
 * Dados estruturados (JSON-LD, schema.org) para os buscadores entenderem a página.
 * É um bloco de dados, não um script executável: a CSP não se aplica a ele.
 * O "<" é escapado para que nenhum texto dos dados consiga fechar a tag <script>.
 */
export function DadosEstruturados({ dados }: { dados: Record<string, unknown> }) {
  const json = JSON.stringify({ "@context": "https://schema.org", ...dados }).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
