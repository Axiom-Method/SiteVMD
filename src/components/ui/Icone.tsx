/**
 * Ícones de traço (24×24), no mesmo desenho das setas do carrossel.
 * Decorativos por padrão (aria-hidden): o texto ao lado é quem dá o significado.
 */
const CAMINHOS = {
  check: <path d="M20 6 9 17l-5-5" />,
  seta: <path d="M5 12h14M13 6l6 6-6 6" />,
  conversa: <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.8-.9L3 21l1.9-5.2A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5Z" />,
  alvo: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  escudo: (
    <>
      <path d="M12 21.5s8-3.8 8-9.8V5.2L12 2.5 4 5.2v6.5c0 6 8 9.8 8 9.8Z" />
      <path d="m9 11.5 2 2 4-4" />
    </>
  ),
  video: (
    <>
      <rect x="2.5" y="6" width="13" height="12" rx="2" />
      <path d="m21.5 8-6 4 6 4Z" />
    </>
  ),
  perfil: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10.5" r="2" />
      <path d="M14.5 9.5h3.5M14.5 13.5h3.5M5.8 16.5c.6-1.5 1.8-2.3 3.2-2.3s2.6.8 3.2 2.3" />
    </>
  ),
  pincel: (
    <>
      <path d="m14.6 3.4 6 6-8.8 8.8-6-6Z" />
      <path d="M5.8 12.2 3 21l8.8-2.8" />
      <circle cx="9.5" cy="14.5" r="1.4" />
    </>
  ),
  calendario: (
    <>
      <rect x="3" y="4.5" width="18" height="16.5" rx="2" />
      <path d="M16 2.5v4M8 2.5v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 17.5h.01M12 17.5h.01" />
    </>
  ),
  evolucao: <path d="M22 7 13.5 15.5l-5-5L2 17M16 7h6v6" />,
  imagem: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-5-5L5 21" />
    </>
  ),
  megafone: <path d="M3 10.5v3a1 1 0 0 0 1 1h2.5L12 19V5L6.5 9.5H4a1 1 0 0 0-1 1ZM16 8.8a4 4 0 0 1 0 6.4M19 5.8a8 8 0 0 1 0 12.4" />,
  maleta: (
    <>
      <rect x="2.5" y="7" width="19" height="13.5" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M2.5 13h19" />
    </>
  ),
  busca: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20.5 20.5-4.5-4.5" />
    </>
  ),
} as const;

export type NomeIcone = keyof typeof CAMINHOS;

export function Icone({ nome, className }: { nome: NomeIcone; className?: string }) {
  return (
    <svg
      className={className ? `icone ${className}` : "icone"}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {CAMINHOS[nome]}
    </svg>
  );
}
