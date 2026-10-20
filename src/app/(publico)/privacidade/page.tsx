import type { Metadata } from "next";
import { Fragment } from "react";
import { Destaque } from "@/components/ui/Destaque";
import { SITE } from "@/constants/site";
import { alternativas } from "@/i18n/config";
import { LinkIdioma } from "@/i18n/cliente";
import { formatarDataIdioma, preencher } from "@/i18n/formatar";
import { obterTextos } from "@/i18n/servidor";

export async function generateMetadata(): Promise<Metadata> {
  const { idioma, t } = await obterTextos();
  return { title: t.privacidade.metaTitulo, description: t.privacidade.metaDescricao, alternates: alternativas(idioma, "/privacidade") };
}

/*
 * MODELO de política, escrito a partir do funcionamento atual do site.
 * Antes de publicar: revisar com assessoria jurídica e preencher razão social, CNPJ e e-mail do encarregado.
 * Atualizar sempre que o site passar a guardar dados (banco, e-mail, pagamentos).
 * O texto de cada idioma fica em t.privacidade (i18n/dicionarios); a versão em português é a que vale.
 */
const ATUALIZADO_EM = "2026-10-17";
const telefone = `+${SITE.whatsapp.slice(0, 2)} (${SITE.whatsapp.slice(2, 4)}) ${SITE.whatsapp.slice(4, 9)}-${SITE.whatsapp.slice(9)}`;

export default async function PrivacidadePage() {
  const { idioma, t } = await obterTextos();
  const p = t.privacidade;

  return (
    <section className="secao" aria-labelledby="privacidade-titulo">
      <div className="container texto-legal">
        <p className="eyebrow">{p.eyebrow}</p>
        <h1 id="privacidade-titulo" className="titulo-secao">
          <Destaque a={p.tituloA} b={p.tituloB} />
        </h1>
        <p className="texto-legal__data">{preencher(p.atualizado, { data: formatarDataIdioma(ATUALIZADO_EM, idioma) })}</p>
        {p.avisoTraducao && (
          <p>
            <em>{p.avisoTraducao}</em>
          </p>
        )}

        <p>{p.intro}</p>

        {p.secoes.map((secao) => (
          <Fragment key={secao.titulo}>
            <h2>{secao.titulo}</h2>
            {secao.paragrafos?.map((texto) => (
              <p key={texto}>{texto}</p>
            ))}
            {secao.itens && (
              <ul>
                {secao.itens.map((item) => (
                  <li key={item.texto}>
                    {item.rotulo && <strong>{item.rotulo}</strong>} {item.texto}
                  </li>
                ))}
              </ul>
            )}
          </Fragment>
        ))}

        <h2>{p.contatoTitulo}</h2>
        <p>
          {p.contatoTexto}{" "}
          <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer">
            {telefone}
          </a>
          .
        </p>

        <p className="texto-legal__voltar">
          <LinkIdioma href="/cadastro">{p.voltar}</LinkIdioma>
        </p>
      </div>
    </section>
  );
}
