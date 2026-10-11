"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_PUBLICA, SITE } from "@/constants/site";

export function Header() {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);

  // Fecha o menu ao trocar de página.
  useEffect(() => setAberto(false), [pathname]);

  return (
    <header className="header">
      <div className="container header__barra">
        <Link href="/" className="logo" aria-label={`${SITE.nome} - página inicial`}>
          <span className="logo__marca">{SITE.nome}</span>
          <span className="logo__sub">{SITE.descricao}</span>
        </Link>

        <button
          type="button"
          className="header__toggle"
          aria-expanded={aberto}
          aria-controls="menu-principal"
          onClick={() => setAberto((v) => !v)}
        >
          <span className="sr-only">{aberto ? "Fechar menu" : "Abrir menu"}</span>
          <span aria-hidden="true">{aberto ? "✕" : "☰"}</span>
        </button>

        <nav id="menu-principal" className={`nav ${aberto ? "nav--aberto" : ""}`} aria-label="Principal">
          <ul>
            {NAV_PUBLICA.map((item) => {
              const ativo = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link href={item.href} aria-current={ativo ? "page" : undefined}>
                    {item.rotulo}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link href="/cadastro" className="btn btn--primario btn--sm">
            Cadastre-se
          </Link>
        </nav>
      </div>
    </header>
  );
}
