-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "tentativasFalhas" INTEGER NOT NULL DEFAULT 0,
    "bloqueadoAte" TIMESTAMP(3),
    "ultimoLogin" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sessao" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "criadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiraEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sessao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampoEstatistica" (
    "id" TEXT NOT NULL,
    "esporte" TEXT NOT NULL,
    "posicao" TEXT,
    "rotulo" TEXT NOT NULL,
    "rotuloEn" TEXT,
    "rotuloEs" TEXT,
    "rotuloIt" TEXT,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CampoEstatistica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EstatisticaAtleta" (
    "id" TEXT NOT NULL,
    "atletaSlug" TEXT NOT NULL,
    "temporada" TEXT NOT NULL,
    "campoId" TEXT NOT NULL,
    "valor" INTEGER NOT NULL,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EstatisticaAtleta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogAuditoria" (
    "id" TEXT NOT NULL,
    "adminId" TEXT,
    "acao" TEXT NOT NULL,
    "alvo" TEXT NOT NULL,
    "detalhes" JSONB,
    "ip" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LogAuditoria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Sessao_tokenHash_key" ON "Sessao"("tokenHash");

-- CreateIndex
CREATE INDEX "Sessao_adminId_idx" ON "Sessao"("adminId");

-- CreateIndex
CREATE INDEX "CampoEstatistica_esporte_posicao_idx" ON "CampoEstatistica"("esporte", "posicao");

-- CreateIndex
CREATE INDEX "EstatisticaAtleta_atletaSlug_idx" ON "EstatisticaAtleta"("atletaSlug");

-- CreateIndex
CREATE UNIQUE INDEX "EstatisticaAtleta_atletaSlug_temporada_campoId_key" ON "EstatisticaAtleta"("atletaSlug", "temporada", "campoId");

-- CreateIndex
CREATE INDEX "LogAuditoria_criadoEm_idx" ON "LogAuditoria"("criadoEm");

-- AddForeignKey
ALTER TABLE "Sessao" ADD CONSTRAINT "Sessao_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstatisticaAtleta" ADD CONSTRAINT "EstatisticaAtleta_campoId_fkey" FOREIGN KEY ("campoId") REFERENCES "CampoEstatistica"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogAuditoria" ADD CONSTRAINT "LogAuditoria_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
