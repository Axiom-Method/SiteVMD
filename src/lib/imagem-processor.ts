import sharp, { type Metadata } from "sharp";

/**
 * Prepara uma imagem enviada para o site:
 * - aceita só JPEG, PNG, WebP e AVIF, conferindo o conteúdo real (não a extensão nem o tipo que o navegador diz);
 * - endireita pela orientação da câmera e reduz para no máximo 1600 × 2000 px;
 * - grava em WebP sem metadados (EXIF, GPS, modelo da câmera...), o que importa para a LGPD.
 */

export const TAMANHO_MAXIMO_ENVIO = 8 * 1024 * 1024;
const FORMATOS = new Set(["jpeg", "png", "webp", "avif"]);
/** Evita "bombas" de descompressão: imagem pequena em bytes que vira gigante em pixels */
const PIXELS_MAXIMOS = 60_000_000;

export type ImagemProcessada = { dados: Buffer; largura: number; altura: number; tipo: "image/webp" };

export class ImagemInvalida extends Error {}

export async function processarImagem(entrada: Buffer): Promise<ImagemProcessada> {
  if (entrada.length === 0) throw new ImagemInvalida("O arquivo está vazio.");
  if (entrada.length > TAMANHO_MAXIMO_ENVIO) throw new ImagemInvalida("A imagem passa de 8 MB.");

  let meta: Metadata;
  try {
    meta = await sharp(entrada, { limitInputPixels: PIXELS_MAXIMOS }).metadata();
  } catch {
    throw new ImagemInvalida("Não foi possível ler a imagem. Envie JPG, PNG ou WebP.");
  }
  if (!meta.format || !FORMATOS.has(meta.format)) throw new ImagemInvalida("Formato não aceito. Envie JPG, PNG ou WebP.");

  const { data, info } = await sharp(entrada, { limitInputPixels: PIXELS_MAXIMOS })
    .rotate()
    .resize({ width: 1600, height: 2000, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer({ resolveWithObject: true });

  return { dados: data, largura: info.width, altura: info.height, tipo: "image/webp" };
}
