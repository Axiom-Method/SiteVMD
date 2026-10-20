export function formatarPreco(valor: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
}

/** Data ISO (aaaa-mm-dd) no formato dd/mm/aaaa, sem depender do fuso do servidor. */
export function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.slice(0, 10).split("-");
  return `${dia}/${mes}/${ano}`;
}

export function iniciais(nome: string): string {
  return nome
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

/** Âncora da seção de um esporte na página de números do admin: "Vôlei" → "volei". */
export function ancoraEsporte(esporte: string): string {
  return esporte.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}
