import type { Metadata } from "next";
import { AtletasDestaque } from "@/components/home/AtletasDestaque";
import { ComoFunciona } from "@/components/home/ComoFunciona";
import { CtaFinal } from "@/components/home/CtaFinal";
import { Diferenciais } from "@/components/home/Diferenciais";
import { FaixaLetreiro } from "@/components/home/FaixaLetreiro";
import { Hero } from "@/components/home/Hero";
import { QuemSomos } from "@/components/home/QuemSomos";
import { Servicos } from "@/components/home/Servicos";
import { TecnicosOlheiros } from "@/components/home/TecnicosOlheiros";
import { DadosEstruturados } from "@/components/seo/DadosEstruturados";
import { Holofote } from "@/components/ui/Holofote";
import { ATLETAS_DESTAQUE } from "@/constants/atletas-destaque";
import { SITE } from "@/constants/site";

export const metadata: Metadata = {
  // absolute: sem o sufixo "| VMD" do template (o título já começa com a marca)
  title: { absolute: "VMD | Assessoria & Marketing Esportivo" },
  alternates: { canonical: "/" },
  description:
    "Assessoria especializada no fortalecimento da imagem, posicionamento e valorização de atletas. Conectamos atletas a técnicos e olheiros.",
};

export default function Home() {
  // TODO: trocar por atletaService.listarDestaques() (apenas status PUBLICADO).
  const atletas = ATLETAS_DESTAQUE;

  return (
    <>
      <DadosEstruturados
        dados={{
          "@type": "Organization",
          name: "VMD Assessoria & Marketing Esportivo",
          url: process.env.APP_URL ?? "http://localhost:3000",
          description: "Assessoria especializada no fortalecimento da imagem, posicionamento e valorização de atletas.",
          contactPoint: { "@type": "ContactPoint", telephone: `+${SITE.whatsapp}`, contactType: "customer service", availableLanguage: "Portuguese" },
        }}
      />
      <Holofote />
      <Hero />
      <FaixaLetreiro />
      <QuemSomos />
      <AtletasDestaque atletas={atletas} />
      <ComoFunciona />
      <Servicos />
      <TecnicosOlheiros />
      <Diferenciais />
      <CtaFinal />
    </>
  );
}
