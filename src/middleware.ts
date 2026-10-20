import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_SESSAO } from "@/lib/auth-cookie";
import { CABECALHO_IDIOMA, COOKIE_IDIOMA, ehIdioma, IDIOMA_PADRAO, localizar, separarIdioma } from "@/i18n/config";
import { buildCsp } from "@/security/headers";

/** Rotas que não têm versão traduzida (admin, login, API e arquivos gerados na raiz). */
const SEM_IDIOMA = /^\/(admin|login|api|sitemap\.xml|robots\.txt|icon\.svg)(\/|$)/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const prefetch = request.headers.has("next-router-prefetch") || request.headers.get("purpose") === "prefetch";

  // ----- Painel admin: sem o cookie de sessão nem chega na página -----
  // (é só um filtro rápido; a sessão é validada de verdade no servidor, no layout e em cada ação)
  const temSessao = request.cookies.has(COOKIE_SESSAO);
  if (/^\/api\/admin(\/|$)/.test(pathname) && !temSessao) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }
  if (/^\/admin(\/|$)/.test(pathname) && !temSessao) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?proximo=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  // ----- Idioma -----
  // /pt/... não existe: o português fica sem prefixo
  if (pathname === "/pt" || pathname.startsWith("/pt/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  const { idioma, caminho } = separarIdioma(pathname);
  if (idioma !== IDIOMA_PADRAO && SEM_IDIOMA.test(caminho)) {
    return NextResponse.rewrite(new URL("/404-sem-idioma", request.url));
  }

  // Sem prefixo, mas o visitante escolheu outro idioma no seletor: leva para a versão dele.
  // Só em navegação de página (buscadores não guardam cookie, então sempre veem o português aqui).
  const preferido = request.cookies.get(COOKIE_IDIOMA)?.value;
  if (
    idioma === IDIOMA_PADRAO &&
    !prefetch &&
    request.method === "GET" &&
    request.headers.get("sec-fetch-dest") === "document" &&
    ehIdioma(preferido) &&
    preferido !== IDIOMA_PADRAO &&
    !SEM_IDIOMA.test(pathname)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = localizar(preferido, pathname);
    return NextResponse.redirect(url, 307);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(CABECALHO_IDIOMA, idioma);

  // ----- CSP com nonce (só nas páginas; prefetch não executa scripts) -----
  let csp: string | null = null;
  if (!prefetch) {
    const nonce = btoa(crypto.randomUUID());
    csp = buildCsp(nonce, process.env.NODE_ENV !== "production");
    requestHeaders.set("x-nonce", nonce);
    requestHeaders.set("Content-Security-Policy", csp);
  }

  // Com prefixo: reescreve para a rota real (/en/atletas → /atletas), mantendo a URL do visitante
  let response: NextResponse;
  if (idioma !== IDIOMA_PADRAO) {
    const url = request.nextUrl.clone();
    url.pathname = caminho;
    response = NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  } else {
    response = NextResponse.next({ request: { headers: requestHeaders } });
  }
  if (csp) response.headers.set("Content-Security-Policy", csp);
  return response;

  // TODO: rate limit por IP no /login e nas rotas /api.
}

export const config = {
  // Roda também no prefetch: sem ele, o prefetch de /en/... não seria reescrito.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/|malhas/|texturas/|fonts/|icons/).*)"],
};
