-- CreateTable
CREATE TABLE "Atleta" (
    "slug" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "clube" TEXT NOT NULL,
    "esporte" TEXT,
    "posicao" TEXT,
    "categoria" TEXT,
    "numero" INTEGER,
    "alturaCm" INTEGER,
    "pesoKg" INTEGER,
    "pe" TEXT,
    "nacionalidade" TEXT,
    "pais" TEXT,
    "bio" TEXT,
    "foto" TEXT,
    "publicado" BOOLEAN NOT NULL DEFAULT true,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Atleta_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "Imagem" (
    "id" TEXT NOT NULL,
    "atletaSlug" TEXT,
    "tipo" TEXT NOT NULL DEFAULT 'image/webp',
    "dados" BYTEA NOT NULL,
    "largura" INTEGER NOT NULL,
    "altura" INTEGER NOT NULL,
    "tamanho" INTEGER NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Imagem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Atleta_ordem_idx" ON "Atleta"("ordem");

-- CreateIndex
CREATE INDEX "Imagem_atletaSlug_idx" ON "Imagem"("atletaSlug");

-- AddForeignKey
ALTER TABLE "Imagem" ADD CONSTRAINT "Imagem_atletaSlug_fkey" FOREIGN KEY ("atletaSlug") REFERENCES "Atleta"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

