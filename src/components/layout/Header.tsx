"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ProgressoRolagem } from "@/components/layout/ProgressoRolagem";
import { SeletorIdioma } from "@/components/layout/SeletorIdioma";
import { ButtonLink } from "@/components/ui/Button";
import { NAV_PUBLICA, SITE } from "@/constants/site";
import { separarIdioma } from "@/i18n/config";
import { LinkIdioma, useTextos } from "@/i18n/cliente";
import { preencher } from "@/i18n/formatar";

export function Header() {
  const { t } = useTextos();
  const pathname = usePathname();
  // Caminho sem o prefixo de idioma, para marcar o item ativo do menu
  const { caminho } = separarIdioma(pathname);
  const [aberto, setAberto] = useState(false);

  // Fecha o menu ao trocar de página.
  useEffect(() => setAberto(false), [pathname]);

  return (
    <header className="header">
      <div className="container header__barra">
        <LinkIdioma href="/" className="logo" aria-label={preencher(t.nav.paginaInicial, { nome: SITE.nome })}>
          <span className="logo__marca">{SITE.nome}</span>
          <span className="logo__sub">{t.meta.descricaoMarca}</span>
        </LinkIdioma>

        <button
          type="button"
          className="header__toggle"
          aria-expanded={aberto}
          aria-controls="menu-principal"
          onClick={() => setAberto((v) => !v)}
        >
          <span className="sr-only">{aberto ? t.nav.fecharMenu : t.nav.abrirMenu}</span>
          <span aria-hidden="true">{aberto ? "✕" : "☰"}</span>
        </button>

        <nav id="menu-principal" className={`nav ${aberto ? "nav--aberto" : ""}`} aria-label={t.nav.principal}>
          <ul>
            {NAV_PUBLICA.map((item) => {
              const ativo = item.href === "/" ? caminho === "/" : caminho.startsWith(item.href);
              return (
                <li key={item.href}>
                  <LinkIdioma href={item.href} aria-current={ativo ? "page" : undefined}>
                    {t.nav[item.chave]}
                  </LinkIdioma>
                </li>
              );
            })}
          </ul>
          <ButtonLink href="/cadastro" className="btn--sm header__cta">
            {t.nav.cta}
          </ButtonLink>
        </nav>

        <SeletorIdioma />
      </div>
      <ProgressoRolagem />
    </header>
  );
}
