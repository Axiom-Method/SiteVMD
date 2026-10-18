import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MovimentoProvider } from "@/components/ui/Revelar";

export default function PublicoLayout({ children }: { children: ReactNode }) {
  return (
    <MovimentoProvider>
      <a href="#conteudo" className="skip-link">
        Ir para o conteúdo
      </a>
      <Header />
      <main id="conteudo">{children}</main>
      <Footer />
    </MovimentoProvider>
  );
}
