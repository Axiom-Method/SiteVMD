import type { Metadata } from "next";
import { FiltroAtletas } from "@/components/atletas/FiltroAtletas";
import { FundoEsportivo } from "@/components/home/FundoEsportivo";
import { Holofote } from "@/components/ui/Holofote";
import { Revelar } from "@/components/ui/Revelar";
import { listarPerfis } from "@/constants/atletas-perfil";
import { FILTROS_VAZIOS, type Filtros } from "@/constants/filtros-atletas";

export const metadata: Metadata = {
  title: "Atletas",
  description: "Conheça os atletas representados pela VMD. Busque por posição, categoria e clube.",
  alternates: { canonical: "/atletas" },
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AtletasPage({ searchParams }: Props) {
  // TODO: trocar por atletaService.listarPublicados() (só status PUBLICADO), com filtros validados no servidor
  const atletas = listarPerfis();
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
          <p className="eyebrow">Para técnicos e olheiros</p>
          <h1 id="atletas-titulo" className="titulo-secao">
            Nossos <span className="destaque">atletas</span>
          </h1>
          <p className="subtitulo">
            Encontre atletas por posição, categoria e clube. O contato é sempre intermediado pela VMD.
          </p>
        </Revelar>
        <FiltroAtletas atletas={atletas} inicial={inicial} />
      </div>
    </section>
  );
}
