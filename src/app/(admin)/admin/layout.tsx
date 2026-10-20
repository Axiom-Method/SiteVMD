import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { obterAdmin } from "@/lib/auth";
import { bancoConfigurado } from "@/lib/db";
import { sair } from "../login/acoes";

export const metadata: Metadata = { title: { default: "Painel", template: "%s | Painel VMD" }, robots: { index: false, follow: false } };

const MENU = [
  { href: "/admin", rotulo: "Início" },
  { href: "/admin/atletas", rotulo: "Atletas" },
  { href: "/admin/numeros", rotulo: "Números por esporte" },
];

/**
 * SEGURO POR PADRÃO: toda página dentro de /admin passa por aqui, e sem sessão válida
 * (conferida no banco, no servidor) vai para o login. O painel é só em português.
 */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  if (!bancoConfigurado) redirect("/login");
  const admin = await obterAdmin();
  if (!admin) redirect("/login");

  return (
    <div className="admin">
      <header className="admin__topo">
        <div className="container admin__barra">
          <Link href="/admin" className="logo">
            <span className="logo__marca">VMD</span>
            <span className="logo__sub">Painel da equipe</span>
          </Link>
          <nav aria-label="Painel" className="admin__menu">
            {MENU.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.rotulo}
              </Link>
            ))}
          </nav>
          <div className="admin__usuario">
            <span>{admin.nome}</span>
            <form action={sair}>
              <button type="submit" className="btn btn--contorno btn--sm">
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>
      <main id="conteudo" className="container admin__conteudo">
        {children}
      </main>
    </div>
  );
}
