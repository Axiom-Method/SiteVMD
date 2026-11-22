import type { NextConfig } from "next";
import { securityHeaders } from "./src/security/headers";

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // não anuncia a tecnologia do servidor
  // Envio de fotos no painel: o navegador já reduz cada foto antes (~1 MB), mas o padrão do Next é 1 MB.
  // O servidor ainda recusa arquivos acima de 8 MB (lib/imagem-processor.ts).
  experimental: { serverActions: { bodySizeLimit: "10mb" } },
  async headers() {
    return [{ source: "/:path*", headers: [...securityHeaders] }];
  },
};

export default config;
