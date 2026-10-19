import type { MetadataRoute } from "next";
import { slugsDosPerfis } from "@/constants/atletas-perfil";
import { NOTICIAS } from "@/constants/noticias";
import { IDIOMAS, LANG_HTML, localizar } from "@/i18n/config";

const BASE = process.env.APP_URL ?? "http://localhost:3000";

/** Uma entrada por idioma, cada uma listando as outras versões (hreflang) para os buscadores. */
function emTodosIdiomas(caminho: string, extra: Omit<MetadataRoute.Sitemap[number], "url" | "alternates">) {
  const languages = Object.fromEntries(IDIOMAS.map((i) => [LANG_HTML[i], `${BASE}${localizar(i, caminho)}`]));
  return IDIOMAS.map((i) => ({ url: `${BASE}${localizar(i, caminho)}`, alternates: { languages }, ...extra }));
}

// TODO: quando houver banco, listar só atletas e notícias PUBLICADOS (services).
export default function sitemap(): MetadataRoute.Sitemap {
  const fixas = ["/", "/atletas", "/noticias", "/cadastro", "/privacidade"].flatMap((rota) =>
    emTodosIdiomas(rota, { changeFrequency: "weekly", priority: rota === "/" ? 1 : 0.7 }),
  );
  const atletas = slugsDosPerfis().flatMap((slug) => emTodosIdiomas(`/atletas/${slug}`, { changeFrequency: "weekly", priority: 0.8 }));
  const noticias = NOTICIAS.flatMap((n) =>
    emTodosIdiomas(`/noticias/${n.slug}`, { lastModified: n.data, changeFrequency: "monthly", priority: 0.5 }),
  );
  return [...fixas, ...atletas, ...noticias];
}
