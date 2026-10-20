import type { Metadata } from "next";
import { FormCadastro } from "@/components/cadastro/FormCadastro";
import { FundoEsportivo } from "@/components/home/FundoEsportivo";
import { Icone, type NomeIcone } from "@/components/ui/Icone";
import { Destaque } from "@/components/ui/Destaque";
import { Revelar } from "@/components/ui/Revelar";
import { alternativas } from "@/i18n/config";
import { obterTextos } from "@/i18n/servidor";

export async function generateMetadata(): Promise<Metadata> {
  const { idioma, t } = await obterTextos();
  return { title: t.cadastro.metaTitulo, description: t.cadastro.metaDescricao, alternates: alternativas(idioma, "/cadastro") };
}

/** Ícones dos passos, na ordem de t.cadastro.passos. */
const ICONES: readonly NomeIcone[] = ["perfil", "conversa", "alvo"];

export default async function CadastroPage() {
  const { t } = await obterTextos();
  return (
    <section className="secao" aria-labelledby="cadastro-titulo">
      <FundoEsportivo tipo="campo" />
      <div className="container cadastro">
        <Revelar className="cadastro__intro">
          <p className="eyebrow">{t.cadastro.eyebrow}</p>
          <h1 id="cadastro-titulo" className="titulo-secao">
            <Destaque a={t.cadastro.tituloA} b={t.cadastro.tituloB} />
          </h1>
          <p className="subtitulo">{t.cadastro.subtitulo}</p>
          <ol className="cadastro__passos">
            {t.cadastro.passos.map((p, i) => (
              <li key={p.titulo}>
                <span className="icone-caixa">
                  <Icone nome={ICONES[i]} />
                </span>
                <span>
                  <strong>{p.titulo}</strong>
                  <span>{p.texto}</span>
                </span>
              </li>
            ))}
          </ol>
        </Revelar>
        <Revelar atraso={0.12}>
          <FormCadastro />
        </Revelar>
      </div>
    </section>
  );
}
