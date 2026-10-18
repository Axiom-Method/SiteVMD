import type { Metadata } from "next";
import { FormCadastro } from "@/components/cadastro/FormCadastro";
import { FundoEsportivo } from "@/components/home/FundoEsportivo";
import { Icone, type NomeIcone } from "@/components/ui/Icone";
import { Revelar } from "@/components/ui/Revelar";

export const metadata: Metadata = {
  title: "Cadastro de atleta",
  description: "Quero ser VMD: cadastre o atleta e receba um orçamento personalizado de assessoria e marketing esportivo.",
  alternates: { canonical: "/cadastro" },
};

const PASSOS: readonly { icone: NomeIcone; titulo: string; texto: string }[] = [
  { icone: "perfil", titulo: "Preencha o cadastro", texto: "Leva cerca de 2 minutos." },
  { icone: "conversa", titulo: "Envie pelo WhatsApp", texto: "Seus dados chegam direto na equipe VMD." },
  { icone: "alvo", titulo: "Receba o orçamento", texto: "Uma proposta sob medida para o seu momento." },
];

export default function CadastroPage() {
  return (
    <section className="secao" aria-labelledby="cadastro-titulo">
      <FundoEsportivo tipo="campo" />
      <div className="container cadastro">
        <Revelar className="cadastro__intro">
          <p className="eyebrow">Quero ser VMD</p>
          <h1 id="cadastro-titulo" className="titulo-secao">
            Cadastre o <span className="destaque">atleta</span>
          </h1>
          <p className="subtitulo">
            Conte quem é o atleta e o que ele procura. A partir daqui, a VMD monta um orçamento sob medida.
          </p>
          <ol className="cadastro__passos">
            {PASSOS.map((p) => (
              <li key={p.titulo}>
                <span className="icone-caixa">
                  <Icone nome={p.icone} />
                </span>
                <span>
                  <strong>{p.titulo}</strong>
                  <span>{p.texto}</span>
                </span>
              </li>
            ))}
          </ol>
        </Revelar>
        <Revelar atraso={0.12}>
          <FormCadastro />
        </Revelar>
      </div>
    </section>
  );
}
