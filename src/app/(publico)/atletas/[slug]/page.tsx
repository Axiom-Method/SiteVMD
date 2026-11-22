import type { Metadata } from "next";
import Image from "next/image";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { CardFifa } from "@/components/atletas/CardFifa";
import { NumerosTemporada } from "@/components/atletas/Estatisticas";
import { GaleriaVideos } from "@/components/atletas/GaleriaVideos";
import { FundoEsportivo } from "@/components/home/FundoEsportivo";
import { DadosEstruturados } from "@/components/seo/DadosEstruturados";
import { ButtonLink } from "@/components/ui/Button";
import { Holofote } from "@/components/ui/Holofote";
import { Icone } from "@/components/ui/Icone";
import { Destaque } from "@/components/ui/Destaque";
import { Revelar } from "@/components/ui/Revelar";
import { buscarPerfil } from "@/constants/atletas-perfil";
import { linkWhatsApp } from "@/constants/site";
import { iniciais } from "@/lib/utils";
import { alternativas } from "@/i18n/config";
import { LinkIdioma } from "@/i18n/cliente";
import { formatarNumero, preencher } from "@/i18n/formatar";
import { obterTextos } from "@/i18n/servidor";
import { numerosDoAtleta } from "@/services/estatistica.service";
import { funcaoAtleta, semFuncao, traduzirCategoria, traduzirValor } from "@/i18n/valores";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const atleta = await buscarPerfil(slug);
  const { idioma, t } = await obterTextos();
  if (!atleta) return { title: t.perfil.naoEncontrado };
  return {
    title: atleta.nome,
    description: atleta.posicao
      ? preencher(t.perfil.metaDescricao, {
          nome: atleta.nome,
          posicao: traduzirValor(t, "posicoes", atleta.posicao).toLowerCase(),
          categoria: traduzirCategoria(t, atleta.categoria),
          clube: atleta.clube,
        })
      : `${atleta.nome} · ${atleta.clube}`,
    alternates: alternativas(idioma, `/atletas/${atleta.slug}`),
    openGraph: { type: "profile", title: `${atleta.nome} | VMD` },
  };
}

export default async function PerfilAtletaPage({ params }: Props) {
  const { slug } = await params;
  // Só atletas publicados (atleta.service)
  const atleta = await buscarPerfil(slug);
  if (!atleta) notFound();
  const { idioma, t } = await obterTextos();
  // Números vêm do banco (editados no painel admin); sem banco, os de exemplo
  const numeros = await numerosDoAtleta(atleta);

  const posicao = traduzirValor(t, "posicoes", atleta.posicao);
  const categoria = traduzirCategoria(t, atleta.categoria);
  const altura = atleta.alturaCm
    ? `${formatarNumero(atleta.alturaCm / 100, idioma, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m`
    : "";
  const funcao = funcaoAtleta(t, atleta.posicao, atleta.categoria);
  // Linha de identificação acima do nome: posição e esporte (o número da camisa vai num selo ao lado)
  const meta = [posicao, traduzirValor(t, "modalidades", atleta.esporte)].filter(Boolean).join(" · ");
  // Especificações (faixa abaixo do topo). O clube entra aqui, sem destaque; o que faltar aparece como "não compartilhado"
  const specs = [
    { rotulo: t.perfil.ficha.altura, valor: altura },
    { rotulo: t.perfil.ficha.peso, valor: atleta.pesoKg ? `${atleta.pesoKg} kg` : "" },
    { rotulo: t.perfil.ficha.pe, valor: traduzirValor(t, "pe", atleta.pe) },
    { rotulo: t.perfil.ficha.nacionalidade, valor: traduzirValor(t, "nacionalidades", atleta.nacionalidade) },
    { rotulo: t.perfil.ficha.categoria, valor: categoria },
    { rotulo: t.perfil.ficha.clube, valor: atleta.clube },
  ];
  // Nome: primeiro nome mais leve, o resto em negrito. O tamanho acompanha a maior palavra (--letras),
  // para nenhuma palavra ser quebrada no meio; nomes longos quebram entre palavras, equilibrados.
  const [primeiroNome, ...resto] = atleta.nome.split(" ");
  const sobrenome = resto.join(" ");
  const letras = Math.max(...atleta.nome.split(" ").map((p) => p.length), 5);
  const mensagem = preencher(semFuncao(t.perfil.mensagem, funcao), { nome: atleta.nome, posicao, categoria });

  return (
    <>
      <DadosEstruturados
        dados={{
          "@type": "Person",
          name: atleta.nome,
          description: atleta.bio,
          jobTitle: funcao || undefined,
          height: atleta.alturaCm ? { "@type": "QuantitativeValue", value: atleta.alturaCm, unitCode: "CMT" } : undefined,
          nationality: atleta.nacionalidade,
          memberOf: { "@type": "SportsTeam", name: atleta.clube, sport: atleta.esporte },
        }}
      />
      <Holofote />

      {/* Topo: identificação, números e ações à esquerda; a foto do atleta à direita */}
      <section className="atleta" aria-labelledby="perfil-nome">
        <div className="container">
          <LinkIdioma href="/atletas" className="perfil__voltar">
            <span aria-hidden="true">←</span> {t.perfil.voltar}
          </LinkIdioma>

          <div className="atleta__grade">
            <Revelar className="atleta__texto">
              <p className="atleta__meta">
                {atleta.numero !== undefined && (
                  <span className="atleta__numero">
                    <span className="sr-only">{t.perfil.ficha.camisa} </span>
                    <span aria-hidden="true">#</span>
                    {atleta.numero}
                  </span>
                )}
                <span>{meta || t.perfil.atletaPadrao}</span>
              </p>
              <h1 id="perfil-nome" className="atleta__nome" style={{ "--letras": letras } as CSSProperties}>
                {sobrenome ? (
                  <>
                    <span className="atleta__primeiro">{primeiroNome}</span> <span className="atleta__sobrenome">{sobrenome}</span>
                  </>
                ) : (
                  <span className="atleta__sobrenome">{primeiroNome}</span>
                )}
              </h1>
              {atleta.bio && <p className="atleta__bio">{atleta.bio}</p>}

              {/* Números da temporada (sem notas/atributos: o site não compara atletas por nota) */}
              <div className="atleta__numeros" aria-labelledby="numeros">
                <h2 id="numeros" className="atleta__rotulo">
                  {preencher(t.perfil.temporada, { ano: numeros.temporada })}
                </h2>
                <NumerosTemporada estatisticas={numeros.estatisticas.slice(0, 4)} />
              </div>

              <div className="acoes">
                <ButtonLink href={linkWhatsApp(mensagem)} className="btn--seta">
                  {t.perfil.interesse}
                  <Icone nome="seta" className="btn__seta" />
                </ButtonLink>
                {atleta.videos.length > 0 && (
                  <ButtonLink href="#videos" variant="contorno">
                    {t.perfil.verVideos}
                  </ButtonLink>
                )}
              </div>
            </Revelar>

            <figure className="atleta__foto">
              {atleta.foto ? (
                <Image src={atleta.foto} alt={atleta.nome} fill priority sizes="(max-width: 900px) 92vw, 460px" className="atleta__img" />
              ) : (
                <span className="atleta__iniciais" aria-hidden="true">
                  {iniciais(atleta.nome)}
                </span>
              )}
            </figure>
          </div>
        </div>

        {/* Ficha técnica: bloco de destaque logo abaixo do topo, valores grandes e rótulos claros */}
        <section className="container atleta__ficha" aria-labelledby="ficha-titulo">
          <h2 id="ficha-titulo" className="atleta__rotulo">
            {t.perfil.fichaTitulo}
          </h2>
          <dl className="specs">
            {specs.map((d) => (
              <div key={d.rotulo} className={d.valor ? "spec" : "spec spec--vazio"}>
                <dt>{d.rotulo}</dt>
                <dd>{d.valor || t.perfil.naoCompartilhado}</dd>
              </div>
            ))}
          </dl>
        </section>
      </section>

      {atleta.conquistas.length > 0 && (
        <section className="secao" aria-labelledby="conquistas-titulo">
          <div className="container">
            <h2 id="conquistas-titulo" className="titulo-secao titulo-secao--pequeno">
              {t.perfil.conquistas}
            </h2>
            <ul className="conquistas">
              {atleta.conquistas.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Cartinha do atleta e o contato intermediado pela VMD */}
      <section className="atleta-contato" aria-labelledby="contato-titulo">
        <div className="container atleta-contato__grade">
          <CardFifa atleta={atleta} />
          <Revelar className="atleta-contato__texto">
            <h2 id="contato-titulo" className="titulo-secao titulo-secao--pequeno">
              {t.perfil.contatoTitulo}
            </h2>
            <p className="perfil__aviso">{t.perfil.aviso}</p>
            <div className="acoes">
              <ButtonLink href={linkWhatsApp(mensagem)} className="btn--seta">
                {t.perfil.interesse}
                <Icone nome="seta" className="btn__seta" />
              </ButtonLink>
            </div>
          </Revelar>
        </div>
      </section>

      {/* Vídeos */}
      {atleta.videos.length > 0 && (
      <section id="videos" className="secao" aria-labelledby="videos-titulo">
        <FundoEsportivo tipo="raias" />
        <div className="container">
          <Revelar>
            <p className="eyebrow">{t.perfil.videosEyebrow}</p>
            <h2 id="videos-titulo" className="titulo-secao">
              <Destaque a={t.perfil.videosA} b={t.perfil.videosB} />
            </h2>
          </Revelar>
          <GaleriaVideos videos={atleta.videos} />
        </div>
      </section>
      )}
    </>
  );
}
