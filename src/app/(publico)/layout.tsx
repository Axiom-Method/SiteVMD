import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MovimentoProvider } from "@/components/ui/Revelar";
import { obterTextos } from "@/i18n/servidor";

export default async function PublicoLayout({ children }: { children: ReactNode }) {
  const { t } = await obterTextos();
  return (
    <MovimentoProvider>
      <a href="#conteudo" className="skip-link">
        {t.nav.pularConteudo}
      </a>
      <Header />
      <main id="conteudo">{children}</main>
      <Footer />
    </MovimentoProvider>
  );
}
