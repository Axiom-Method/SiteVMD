import type { Metadata } from "next";
import { AtletasDestaque } from "@/components/home/AtletasDestaque";
import { ComoFunciona } from "@/components/home/ComoFunciona";
import { CtaFinal } from "@/components/home/CtaFinal";
import { Diferenciais } from "@/components/home/Diferenciais";
import { Hero } from "@/components/home/Hero";
import { QuemSomos } from "@/components/home/QuemSomos";
import { Servicos } from "@/components/home/Servicos";
import { TecnicosOlheiros } from "@/components/home/TecnicosOlheiros";
import { ATLETAS_DESTAQUE } from "@/constants/atletas-destaque";

export const metadata: Metadata = {
  title: "VMD | Assessoria & Marketing Esportivo",
  description:
    "Assessoria especializada no fortalecimento da imagem, posicionamento e valorização de atletas. Conectamos atletas a técnicos e olheiros.",
};

export default function Home() {
  // TODO: trocar por atletaService.listarDestaques() (apenas status PUBLICADO).
  const atletas = ATLETAS_DESTAQUE;

  return (
    <>
      <Hero />
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
