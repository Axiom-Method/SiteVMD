import type { Metadata } from "next";
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
import { alternativas } from "@/i18n/config";
import { LinkIdioma } from "@/i18n/cliente";
import { formatarNumero, preencher } from "@/i18n/formatar";
import { obterTextos } from "@/i18n/servidor";
import { siglaPosicao, traduzirCategoria, traduzirValor } from "@/i18n/valores";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const atleta = buscarPerfil(slug);
  const { idioma, t } = await obterTextos();
  if (!atleta) return { title: t.perfil.naoEncontrado };
  return {
    title: atleta.nome,
    description: preencher(t.perfil.metaDescricao, {
      nome: atleta.nome,
      posicao: traduzirValor(t, "posicoes", atleta.posicao).toLowerCase(),
      categoria: traduzirCategoria(t, atleta.categoria),
      clube: atleta.clube,
    }),
    alternates: alternativas(idioma, `/atletas/${atleta.slug}`),
    openGraph: { type: "profile", title: `${atleta.nome} | VMD` },
  };
}

export default async function PerfilAtletaPage({ params }: Props) {
  const { slug } = await params;
  // TODO: trocar por atletaService.buscarPublicado(slug) (só status PUBLICADO)
  const atleta = buscarPerfil(slug);
  if (!atleta) notFound();
  const { idioma, t } = await obterTextos();

  const posicao = traduzirValor(t, "posicoes", atleta.posicao);
  const categoria = traduzirCategoria(t, atleta.categoria);
  const altura = formatarNumero(atleta.alturaCm / 100, idioma, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const ficha = [
    { rotulo: t.perfil.ficha.posicao, valor: posicao },
    { rotulo: t.perfil.ficha.categoria, valor: categoria },
    { rotulo: t.perfil.ficha.camisa, valor: String(atleta.numero) },
    { rotulo: t.perfil.ficha.altura, valor: `${altura} m` },
    { rotulo: t.perfil.ficha.peso, valor: `${atleta.pesoKg} kg` },
    { rotulo: t.perfil.ficha.pe, valor: traduzirValor(t, "pe", atleta.pe) },
    { rotulo: t.perfil.ficha.nacionalidade, valor: traduzirValor(t, "nacionalidades", atleta.nacionalidade) },
    { rotulo: t.perfil.ficha.clube, valor: atleta.clube },
  ];
  const mensagem = preencher(t.perfil.mensagem, { nome: atleta.nome, posicao, categoria });

  return (
    <>
      <DadosEstruturados
        dados={{
          "@type": "Person",
          name: atleta.nome,
          description: atleta.bio,
          jobTitle: `${atleta.posicao} (${atleta.categoria})`,
          height: { "@type": "QuantitativeValue", value: atleta.alturaCm, unitCode: "CMT" },
          nationality: atleta.nacionalidade,
          memberOf: { "@type": "SportsTeam", name: atleta.clube, sport: atleta.esporte },
        }}
      />
      <Holofote />

      {/* Card + ficha */}
      <section className="secao perfil" aria-labelledby="perfil-nome">
        <FundoEsportivo tipo="campo" />
        <div className="container">
          <LinkIdioma href="/atletas" className="perfil__voltar">
            <span aria-hidden="true">←</span> {t.perfil.voltar}
          </LinkIdioma>
          <div className="perfil__grade">
            <CardFifa atleta={atleta} />

            <Revelar className="perfil__info" atraso={0.2}>
              <p className="eyebrow">
                {posicao} · {categoria}
              </p>
              <h1 id="perfil-nome" className="perfil__nome">
                {atleta.nome}
              </h1>
              <p className="perfil__clube">
                <span className="perfil__sigla">{siglaPosicao(t, atleta.posicao)}</span>
                {atleta.clube} · {preencher(t.perfil.camisa, { n: atleta.numero })}
              </p>
              <p className="perfil__bio">{atleta.bio}</p>

              <dl className="ficha">
                {ficha.map((f) => (
                  <div key={f.rotulo} className="ficha__item">
                    <dt>{f.rotulo}</dt>
                    <dd>{f.valor}</dd>
                  </div>
                ))}
              </dl>

              {atleta.conquistas.length > 0 && (
                <ul className="conquistas" aria-label={t.perfil.conquistas}>
                  {atleta.conquistas.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              )}

              <div className="acoes">
                <ButtonLink href={linkWhatsApp(mensagem)} className="btn--seta btn--brilho">
                  {t.perfil.interesse}
                  <Icone nome="seta" className="btn__seta" />
                </ButtonLink>
                <ButtonLink href="#videos" variant="contorno">
                  {t.perfil.verVideos}
                </ButtonLink>
              </div>
              <p className="perfil__aviso">{t.perfil.aviso}</p>
            </Revelar>
          </div>
        </div>
      </section>

      {/* Números da temporada (sem notas/atributos: o site não compara atletas por nota) */}
      <section className="secao secao--escura" aria-labelledby="numeros">
        <FundoEsportivo tipo="pista" />
        <div className="container">
          <Revelar>
            <p className="eyebrow">{preencher(t.perfil.temporada, { ano: atleta.temporada })}</p>
            <h2 id="numeros" className="titulo-secao titulo-secao--pequeno">
              <Destaque a={t.perfil.numerosA} b={t.perfil.numerosB} />
            </h2>
          </Revelar>
          <NumerosTemporada estatisticas={atleta.estatisticas} />
        </div>
      </section>

      {/* Vídeos */}
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
    </>
  );
}
