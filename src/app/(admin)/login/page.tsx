import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { obterAdmin } from "@/lib/auth";
import { bancoConfigurado } from "@/lib/db";
import { FormLogin } from "./FormLogin";

export const metadata: Metadata = { title: "Entrar no painel", robots: { index: false, follow: false } };

type Props = { searchParams: Promise<{ proximo?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  if (await obterAdmin()) redirect("/admin");
  const { proximo } = await searchParams;

  return (
    <main id="conteudo" className="admin-login">
      <div className="admin-login__caixa">
        <p className="logo__marca">VMD</p>
        <h1 className="admin-login__titulo">Painel da equipe</h1>
        {bancoConfigurado ? (
          <FormLogin proximo={typeof proximo === "string" ? proximo : undefined} />
        ) : (
          <p className="admin-aviso">
            O banco de dados ainda não foi configurado. Defina <code>DATABASE_URL</code> no arquivo <code>.env</code> e
            rode <code>npm run db:aplicar</code>.
          </p>
        )}
      </div>
    </main>
  );
}
