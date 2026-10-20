import type { Metadata } from "next";
import { FiltroAtletas } from "@/components/atletas/FiltroAtletas";
import { FundoEsportivo } from "@/components/home/FundoEsportivo";
import { Holofote } from "@/components/ui/Holofote";
import { Destaque } from "@/components/ui/Destaque";
import { Revelar } from "@/components/ui/Revelar";
import { listarPerfis } from "@/constants/atletas-perfil";
import { FILTROS_VAZIOS, type Filtros } from "@/constants/filtros-atletas";
import { alternativas } from "@/i18n/config";
import { obterTextos } from "@/i18n/servidor";

export async function generateMetadata(): Promise<Metadata> {
  const { idioma, t } = await obterTextos();
  return { title: t.atletas.metaTitulo, description: t.atletas.metaDescricao, alternates: alternativas(idioma, "/atletas") };
}

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AtletasPage({ searchParams }: Props) {
  // TODO: trocar por atletaService.listarPublicados() (só status PUBLICADO), com filtros validados no servidor
  const atletas = listarPerfis();
  const { t } = await obterTextos();
  const params = await searchParams;
  // Filtros iniciais vindos da URL: só texto curto; valores fora das opções simplesmente não casam
  const inicial: Filtros = { ...FILTROS_VAZIOS };
  for (const campo of Object.keys(FILTROS_VAZIOS) as (keyof Filtros)[]) {
    const v = params[campo];
    if (typeof v === "string") inicial[campo] = v.slice(0, 60);
  }

  return (
    <section className="secao" aria-labelledby="atletas-titulo">
      <Holofote />
      <FundoEsportivo tipo="pista" />
      <div className="container">
        <Revelar>
          <p className="eyebrow">{t.atletas.eyebrow}</p>
          <h1 id="atletas-titulo" className="titulo-secao">
            <Destaque a={t.atletas.tituloA} b={t.atletas.tituloB} />
          </h1>
          <p className="subtitulo">{t.atletas.subtitulo}</p>
        </Revelar>
        <FiltroAtletas atletas={atletas} inicial={inicial} />
      </div>
    </section>
  );
}
