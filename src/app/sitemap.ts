import type { MetadataRoute } from "next";
import { slugsDosPerfis } from "@/constants/atletas-perfil";
import { NOTICIAS } from "@/constants/noticias";

const BASE = process.env.APP_URL ?? "http://localhost:3000";

// TODO: quando houver banco, listar só atletas e notícias PUBLICADOS (services).
export default function sitemap(): MetadataRoute.Sitemap {
  const fixas = ["", "/atletas", "/noticias", "/cadastro", "/privacidade"].map((rota) => ({
    url: `${BASE}${rota}`,
    changeFrequency: "weekly" as const,
    priority: rota === "" ? 1 : 0.7,
  }));
  const atletas = slugsDosPerfis().map((slug) => ({
    url: `${BASE}/atletas/${slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));
  const noticias = NOTICIAS.map((n) => ({
    url: `${BASE}/noticias/${n.slug}`,
    lastModified: n.data,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));
  return [...fixas, ...atletas, ...noticias];
}
