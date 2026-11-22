import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buscarPerfil } from "@/constants/atletas-perfil";
import { db } from "@/lib/db";
import { ancoraEsporte } from "@/lib/utils";
import { camposDoAtleta } from "@/services/estatistica.service";
import { salvarNumeros } from "../../acoes";
import { Aviso } from "../../Aviso";
import { excluirImagem, usarComoFoto } from "../acoes";
import { ConfirmarExclusao } from "@/components/admin/ConfirmarExclusao";
import { EnvioImagens } from "@/components/admin/atletas/EnvioImagens";
import { FormEditarAtleta } from "@/components/admin/atletas/FormEditarAtleta";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ temporada?: string; ok?: string; erro?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const atleta = await buscarPerfil((await params).id, { incluirOcultos: true });
  return { title: atleta ? atleta.nome : "Atleta" };
}

/** O `id` da rota é o slug do atleta. A página tem três partes: dados, fotos e números. */
export default async function AdminAtleta({ params, searchParams }: Props) {
  const { id } = await params;
  const busca = await searchParams;
  const atleta = await buscarPerfil(id, { incluirOcultos: true });
  if (!atleta) notFound();

  const campos = await camposDoAtleta(atleta.esporte, atleta.posicao);
  const daPosicao = campos.some((c) => c.posicao !== null);

  const temporadas = (
    await db.estatisticaAtleta.findMany({ where: { atletaSlug: atleta.slug }, distinct: ["temporada"], select: { temporada: true }, orderBy: { temporada: "desc" } })
  ).map((t) => t.temporada);
  const pedida = typeof busca.temporada === "string" && /^\d{4}(\/\d{2,4})?$/.test(busca.temporada) ? busca.temporada : undefined;
  const temporada = pedida ?? temporadas[0] ?? atleta.temporada;

  const valores = await db.estatisticaAtleta.findMany({ where: { atletaSlug: atleta.slug, temporada } });
  const valorDe = new Map(valores.map((v) => [v.campoId, v.valor]));
  // Só os dados de exibição; os bytes da imagem ficam no banco e vêm por /api/imagens/<id>
  const imagens = await db.imagem.findMany({
    where: { atletaSlug: atleta.slug },
    select: { id: true, largura: true, altura: true, tamanho: true },
    orderBy: { criadoEm: "desc" },
  });
  const fotoInicial = atleta.foto && !atleta.foto.startsWith("/api/imagens/") ? atleta.foto : undefined;

  return (
    <>
      <p className="admin__voltar">
        <Link href="/admin/atletas">← Atletas</Link>
      </p>
      <h1 className="admin__titulo">{atleta.nome}</h1>
      <p className="admin__texto">
        {[atleta.esporte, atleta.posicao, atleta.categoria, atleta.clube].filter(Boolean).join(" · ")}
        {!atleta.publicado && " · oculto no site"} ·{" "}
        <Link href={`/atletas/${atleta.slug}`} target="_blank">
          ver perfil público
        </Link>
      </p>

      <Aviso ok={busca.ok} erro={busca.erro} />

      <nav className="admin-indice" aria-label="Partes da página">
        <a href="#dados">Dados</a>
        <a href="#fotos">Fotos</a>
        <a href="#numeros">Números</a>
      </nav>

      <section id="dados" className="admin-secao" aria-label="Dados">
        <FormEditarAtleta atleta={atleta} />
      </section>

      <section id="fotos" className="admin-secao" aria-labelledby="fotos-titulo">
        <h2 id="fotos-titulo" className="admin__subtitulo">Fotos</h2>
        <p className="admin__texto">
          A foto marcada como <strong>card</strong> aparece no carrossel da home, na lista de atletas e no perfil. A primeira foto
          enviada vira a do card; depois é só escolher outra.
        </p>
        <EnvioImagens slug={atleta.slug} />
        <ul className="admin-fotos">
          {fotoInicial && (
            <li className="admin-foto admin-foto--card">
              {/* eslint-disable-next-line @next/next/no-img-element -- miniatura do painel, sem otimização */}
              <img src={fotoInicial} alt="" loading="lazy" />
              <span className="admin-foto__info">Foto inicial · card</span>
            </li>
          )}
          {imagens.map((img) => {
            const url = `/api/imagens/${img.id}`;
            const eCard = atleta.foto === url;
            return (
              <li key={img.id} className={eCard ? "admin-foto admin-foto--card" : "admin-foto"}>
                {/* eslint-disable-next-line @next/next/no-img-element -- miniatura do painel, sem otimização */}
                <img src={url} alt="" loading="lazy" />
                <span className="admin-foto__info">
                  {img.largura}×{img.altura} · {Math.round(img.tamanho / 1024)} KB{eCard && " · card"}
                </span>
                <div className="admin-foto__acoes">
                  {!eCard && (
                    <form action={usarComoFoto}>
                      <input type="hidden" name="slug" value={atleta.slug} />
                      <input type="hidden" name="id" value={img.id} />
                      <button type="submit" className="btn btn--contorno btn--sm">
                        Usar no card
                      </button>
                    </form>
                  )}
                  <form action={excluirImagem}>
                    <input type="hidden" name="slug" value={atleta.slug} />
                    <input type="hidden" name="id" value={img.id} />
                    <ConfirmarExclusao mensagem="Excluir esta foto? Não dá para desfazer." />
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
        {!fotoInicial && imagens.length === 0 && <p className="vazio">Nenhuma foto ainda.</p>}
      </section>

      <h2 id="numeros" className="admin__subtitulo">Números</h2>

      {/* Trocar de temporada (GET: só recarrega a página com os valores daquela temporada) */}
      <form className="admin-linha" method="get">
        <div className="campo">
          <label htmlFor="temporada-ver">Temporada</label>
          <input id="temporada-ver" name="temporada" list="temporadas" defaultValue={temporada} placeholder="2026" pattern="\d{4}(/\d{2,4})?" />
          <datalist id="temporadas">
            {temporadas.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
        </div>
        <button type="submit" className="btn btn--contorno btn--sm">
          Abrir temporada
        </button>
      </form>

      {!atleta.esporte ? (
        <p className="admin-aviso">Informe o esporte deste atleta para cadastrar os números dele.</p>
      ) : campos.length === 0 ? (
        <p className="admin-aviso">
          {atleta.esporte} ainda não tem números cadastrados.{" "}
          <Link href={`/admin/numeros#${ancoraEsporte(atleta.esporte)}`}>Cadastrar os números de {atleta.esporte}</Link>.
        </p>
      ) : (
        <form action={salvarNumeros} className="admin-form">
          <input type="hidden" name="slug" value={atleta.slug} />
          <input type="hidden" name="temporada" value={temporada} />
          <p className="admin__texto">
            {daPosicao ? (
              <>
                Números próprios de <strong>{atleta.posicao}</strong> no {atleta.esporte}.
              </>
            ) : (
              <>
                Números padrão de <strong>{atleta.esporte}</strong> (a posição {atleta.posicao} não tem números próprios).
              </>
            )}{" "}
            <Link href={`/admin/numeros#${ancoraEsporte(atleta.esporte)}`}>Mudar quais números aparecem</Link>
          </p>
          <fieldset>
            <legend>Temporada {temporada}</legend>
            <div className="admin-grade">
              {campos.map((c) => (
                <div key={c.id} className="campo">
                  <label htmlFor={`campo-${c.id}`}>{c.rotulo}</label>
                  <input
                    id={`campo-${c.id}`}
                    name={`campo:${c.id}`}
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={1}
                    defaultValue={valorDe.get(c.id) ?? ""}
                  />
                </div>
              ))}
            </div>
            <p className="campo__dica">Deixe em branco o que não quiser mostrar no perfil.</p>
          </fieldset>
          <button type="submit" className="btn btn--primario">
            Salvar números
          </button>
        </form>
      )}
    </>
  );
}
