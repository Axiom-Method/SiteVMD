/**
 * Cabeçalhos de segurança do site.
 * - Os estáticos vão no next.config.ts.
 * - A CSP (com nonce por requisição) é montada no src/middleware.ts.
 */

export const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
] as const;

export function buildCsp(nonce: string, isDev: boolean): string {
  const diretivas = [
    "default-src 'self'",
    // 'strict-dynamic' + nonce: só roda script que o próprio Next marcou.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    // O Next injeta estilos inline; as fontes são hospedadas localmente (next/font).
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self'",
    // Só os players de vídeo permitidos (ver security/video-url.ts).
    "frame-src https://www.youtube-nocookie.com https://player.vimeo.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ];
  return diretivas.join("; ");
}
