/**
 * Nome do cookie de sessão do painel. Fica separado de lib/auth.ts porque o middleware
 * (que roda no Edge) importa daqui e não pode carregar o Prisma.
 * Em produção, o prefixo __Host- obriga Secure, Path=/ e nenhum Domain.
 */
export const COOKIE_SESSAO = process.env.NODE_ENV === "production" ? "__Host-vmd_sessao" : "vmd_sessao";
