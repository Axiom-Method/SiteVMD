import type { MetadataRoute } from "next";

const BASE = process.env.APP_URL ?? "http://localhost:3000";

/** Área administrativa e API fora dos buscadores. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/login"] },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
