import { PrismaClient } from "@prisma/client";

/**
 * Cliente do banco (um só por processo; no dev o hot reload reaproveitaria conexões sem isso).
 * Sem DATABASE_URL o site continua no ar com os dados de exemplo (src/constants) e o painel
 * admin mostra o aviso de configuração: útil para quem roda o projeto sem o .env.
 */
export const bancoConfigurado = Boolean(process.env.DATABASE_URL);

const global_ = globalThis as unknown as { prisma?: PrismaClient };

export const db = global_.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") global_.prisma = db;
