import type { NextConfig } from "next";
import { securityHeaders } from "./src/security/headers";

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // não anuncia a tecnologia do servidor
  async headers() {
    return [{ source: "/:path*", headers: [...securityHeaders] }];
  },
};

export default config;
