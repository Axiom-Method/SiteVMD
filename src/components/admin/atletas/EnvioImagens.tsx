"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { enviarImagem } from "@/app/(admin)/admin/atletas/acoes";

/**
 * Envio de fotos do atleta. As fotos de câmera chegam a 18 MB: antes de enviar, o navegador
 * reduz cada uma para no máximo 2000 px (JPEG), o que também descarta os metadados.
 * O servidor confere o arquivo de novo e converte para WebP (lib/imagem-processor.ts).
 * Os arquivos vão um por vez, para cada envio ficar pequeno e o progresso aparecer na lista.
 */

const LADO_MAXIMO = 2000;
type Item = { nome: string; estado: "esperando" | "enviando" | "ok" | "erro"; erro?: string };

async function reduzir(arquivo: File): Promise<Blob> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(arquivo, { imageOrientation: "from-image" });
  } catch {
    throw new Error("o navegador não conseguiu abrir este arquivo (use JPG, PNG ou WebP; fotos HEIC do iPhone precisam ser convertidas).");
  }
  const escala = Math.min(1, LADO_MAXIMO / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * escala);
  canvas.height = Math.round(bitmap.height * escala);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((ok, falha) => canvas.toBlob((b) => (b ? ok(b) : falha(new Error("falha ao preparar a imagem."))), "image/jpeg", 0.88));
}

export function EnvioImagens({ slug }: { slug: string }) {
  const router = useRouter();
  const [itens, setItens] = useState<Item[]>([]);
  const [arrastando, setArrastando] = useState(false);
  const enviando = itens.some((i) => i.estado === "enviando" || i.estado === "esperando");

  async function enviar(arquivos: File[]) {
    const imagens = arquivos.filter((a) => a.type.startsWith("image/") || /\.(jpe?g|png|webp|avif|heic)$/i.test(a.name));
    if (imagens.length === 0) return;
    const lista: Item[] = imagens.map((a) => ({ nome: a.name, estado: "esperando" }));
    setItens(lista);
    const atualizar = (i: number, item: Partial<Item>) => setItens((atual) => atual.map((x, k) => (k === i ? { ...x, ...item } : x)));

    for (const [i, arquivo] of imagens.entries()) {
      atualizar(i, { estado: "enviando" });
      try {
        const blob = await reduzir(arquivo);
        const form = new FormData();
        form.set("slug", slug);
        form.set("imagem", new File([blob], arquivo.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" }));
        const r = await enviarImagem(form);
        atualizar(i, r.ok ? { estado: "ok" } : { estado: "erro", erro: r.erro });
      } catch (e) {
        atualizar(i, { estado: "erro", erro: e instanceof Error ? e.message : "falha no envio." });
      }
    }
    router.refresh();
  }

  return (
    <div className="envio-imagens">
      <label
        className={arrastando ? "envio-imagens__area envio-imagens__area--ativa" : "envio-imagens__area"}
        onDragOver={(e) => {
          e.preventDefault();
          setArrastando(true);
        }}
        onDragLeave={() => setArrastando(false)}
        onDrop={(e) => {
          e.preventDefault();
          setArrastando(false);
          if (!enviando) enviar([...e.dataTransfer.files]);
        }}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          disabled={enviando}
          className="sr-only"
          onChange={(e) => {
            enviar([...(e.target.files ?? [])]);
            e.target.value = "";
          }}
        />
        <strong>{enviando ? "Enviando..." : "Arraste as fotos aqui ou clique para escolher"}</strong>
        <span>JPG, PNG ou WebP. Pode mandar várias de uma vez; as fotos grandes são reduzidas antes do envio.</span>
      </label>

      {itens.length > 0 && (
        <ul className="envio-imagens__lista" aria-live="polite">
          {itens.map((item, i) => (
            <li key={`${i}-${item.nome}`} className={`envio-imagens__item envio-imagens__item--${item.estado}`}>
              <span>{item.nome}</span>
              <span>
                {item.estado === "esperando" && "na fila"}
                {item.estado === "enviando" && "enviando..."}
                {item.estado === "ok" && "enviada"}
                {item.estado === "erro" && `não enviada: ${item.erro}`}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
