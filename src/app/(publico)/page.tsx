import type { Metadata } from "next";
import { AtletasDestaque } from "@/components/home/AtletasDestaque";
import { ComoFunciona } from "@/components/home/ComoFunciona";
import { CtaFinal } from "@/components/home/CtaFinal";
import { Diferenciais } from "@/components/home/Diferenciais";
import { FaixaLetreiro } from "@/components/home/FaixaLetreiro";
import { HeroSlider } from "@/components/home/HeroSlider";
import { QuemSomos } from "@/components/home/QuemSomos";
import { Servicos } from "@/components/home/Servicos";
import { TecnicosOlheiros } from "@/components/home/TecnicosOlheiros";
import { DadosEstruturados } from "@/components/seo/DadosEstruturados";
import { Holofote } from "@/components/ui/Holofote";
import { ATLETAS_DESTAQUE } from "@/constants/atletas-destaque";
import { SITE } from "@/constants/site";
import { alternativas } from "@/i18n/config";
import { obterTextos } from "@/i18n/servidor";

export async function generateMetadata(): Promise<Metadata> {
  const { idioma, t } = await obterTextos();
  return {
    // absolute: sem o sufixo "| VMD" do template (o título já começa com a marca)
    title: { absolute: t.meta.titulo },
    alternates: alternativas(idioma, "/"),
    description: t.meta.descricao,
  };
}

export default async function Home() {
  const { t } = await obterTextos();
  // TODO: trocar por atletaService.listarDestaques() (apenas status PUBLICADO).
  const atletas = ATLETAS_DESTAQUE;

  return (
    <>
      <DadosEstruturados
        dados={{
          "@type": "Organization",
          name: t.meta.nomeSite,
          url: process.env.APP_URL ?? "http://localhost:3000",
          description: t.rodape.texto,
          contactPoint: { "@type": "ContactPoint", telephone: `+${SITE.whatsapp}`, contactType: "customer service", availableLanguage: ["Portuguese", "English", "Spanish", "Italian"] },
        }}
      />
      <Holofote />
      <HeroSlider />
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
