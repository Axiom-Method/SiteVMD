import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CardFifa } from "@/components/atletas/CardFifa";
import { BarrasAtributos, NumerosTemporada } from "@/components/atletas/Estatisticas";
import { GaleriaVideos } from "@/components/atletas/GaleriaVideos";
import { FundoEsportivo } from "@/components/home/FundoEsportivo";
import { DadosEstruturados } from "@/components/seo/DadosEstruturados";
import { ButtonLink } from "@/components/ui/Button";
import { Holofote } from "@/components/ui/Holofote";
import { Icone } from "@/components/ui/Icone";
import { Revelar } from "@/components/ui/Revelar";
import { buscarPerfil, SIGLA_POSICAO } from "@/constants/atletas-perfil";
import { linkWhatsApp } from "@/constants/site";

type Props = { params: Promise<{ slug: string }> };

const formatoAltura = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const atleta = buscarPerfil(slug);
  if (!atleta) return { title: "Atleta não encontrado" };
  return {
    title: atleta.nome,
    description: `${atleta.nome}, ${atleta.posicao.toLowerCase()} ${atleta.categoria} do ${atleta.clube}. Perfil, números e vídeos.`,
    alternates: { canonical: `/atletas/${atleta.slug}` },
    openGraph: { type: "profile", title: `${atleta.nome} | VMD` },
  };
}

export default async function PerfilAtletaPage({ params }: Props) {
  const { slug } = await params;
  // TODO: trocar por atletaService.buscarPublicado(slug) (só status PUBLICADO)
  const atleta = buscarPerfil(slug);
  if (!atleta) notFound();

  const ficha = [
    { rotulo: "Posição", valor: atleta.posicao },
    { rotulo: "Categoria", valor: atleta.categoria },
    { rotulo: "Camisa", valor: String(atleta.numero) },
    { rotulo: "Altura", valor: `${formatoAltura.format(atleta.alturaCm / 100)} m` },
    { rotulo: "Peso", valor: `${atleta.pesoKg} kg` },
    { rotulo: "Pé dominante", valor: atleta.pe },
    { rotulo: "Nacionalidade", valor: atleta.nacionalidade },
    { rotulo: "Clube", valor: atleta.clube },
  ];
  const mensagem = `Olá! Sou técnico/olheiro e tenho interesse no atleta ${atleta.nome} (${atleta.posicao}, ${atleta.categoria}). Vi o perfil no site da VMD.`;

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
          memberOf: { "@type": "SportsTeam", name: atleta.clube, sport: "Futebol" },
        }}
      />
      <Holofote />

      {/* Card + ficha */}
      <section className="secao perfil" aria-labelledby="perfil-nome">
        <FundoEsportivo tipo="campo" />
        <div className="container">
          <Link href="/atletas" className="perfil__voltar">
            <span aria-hidden="true">←</span> Todos os atletas
          </Link>
          <div className="perfil__grade">
            <CardFifa atleta={atleta} />

            <Revelar className="perfil__info" atraso={0.2}>
              <p className="eyebrow">
                {atleta.posicao} · {atleta.categoria}
              </p>
              <h1 id="perfil-nome" className="perfil__nome">
                {atleta.nome}
              </h1>
              <p className="perfil__clube">
                <span className="perfil__sigla">{SIGLA_POSICAO[atleta.posicao]}</span>
                {atleta.clube} · Camisa {atleta.numero}
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
                <ul className="conquistas" aria-label="Conquistas">
                  {atleta.conquistas.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              )}

              <div className="acoes">
                <ButtonLink href={linkWhatsApp(mensagem)} className="btn--seta btn--brilho">
                  Tenho interesse
                  <Icone nome="seta" className="btn__seta" />
                </ButtonLink>
                <ButtonLink href="#videos" variant="contorno">
                  Ver vídeos
                </ButtonLink>
              </div>
              <p className="perfil__aviso">O contato é intermediado pela VMD, que protege os dados do atleta.</p>
            </Revelar>
          </div>
        </div>
      </section>

      {/* Números da temporada + atributos */}
      <section className="secao secao--escura" aria-labelledby="numeros">
        <FundoEsportivo tipo="pista" />
        <div className="container perfil__numeros">
          <div>
            <Revelar>
              <p className="eyebrow">Temporada {atleta.temporada}</p>
              <h2 id="numeros" className="titulo-secao titulo-secao--pequeno">
                Números do <span className="destaque">atleta</span>
              </h2>
            </Revelar>
            <NumerosTemporada estatisticas={atleta.estatisticas} />
          </div>
          <div>
            <Revelar>
              <p className="eyebrow">Avaliação técnica</p>
              <h2 className="titulo-secao titulo-secao--pequeno">
                Atributos <span className="destaque">{atleta.geral}</span>
              </h2>
            </Revelar>
            <BarrasAtributos atributos={atleta.atributos} />
          </div>
        </div>
      </section>

      {/* Vídeos */}
      <section id="videos" className="secao" aria-labelledby="videos-titulo">
        <FundoEsportivo tipo="raias" />
        <div className="container">
          <Revelar>
            <p className="eyebrow">Gols e lances</p>
            <h2 id="videos-titulo" className="titulo-secao">
              Vídeos do <span className="destaque">atleta</span>
            </h2>
          </Revelar>
          <GaleriaVideos videos={atleta.videos} />
        </div>
      </section>
    </>
  );
}
