/**
 * URLs de player de vídeo: só YouTube (domínio sem cookies) e Vimeo, os mesmos liberados
 * em frame-src na CSP (security/headers.ts).
 * A URL é montada a partir de provedor + ID validado, nunca de uma URL vinda do cadastro:
 * assim não há como embutir um domínio ou parâmetro arbitrário no iframe.
 */
export type ProvedorVideo = "youtube" | "vimeo";

const FORMATO_ID: Record<ProvedorVideo, RegExp> = {
  youtube: /^[A-Za-z0-9_-]{11}$/,
  vimeo: /^\d{6,12}$/,
};

export function idDeVideoValido(provedor: ProvedorVideo, id: string): boolean {
  return FORMATO_ID[provedor]?.test(id) ?? false;
}

/** URL do player para o iframe, ou null se o ID não for válido. */
export function urlDoPlayer(provedor: ProvedorVideo, id: string, autoplay = true): string | null {
  if (!idDeVideoValido(provedor, id)) return null;
  const play = autoplay ? "1" : "0";
  if (provedor === "youtube") {
    return `https://www.youtube-nocookie.com/embed/${id}?autoplay=${play}&rel=0&modestbranding=1&playsinline=1`;
  }
  return `https://player.vimeo.com/video/${id}?autoplay=${play}&dnt=1&title=0&byline=0`;
}
