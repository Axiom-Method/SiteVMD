import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/constants/site";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Como a VMD trata os dados pessoais de atletas, responsáveis e visitantes, conforme a LGPD.",
  alternates: { canonical: "/privacidade" },
};

/*
 * MODELO de política, escrito a partir do funcionamento atual do site.
 * Antes de publicar: revisar com assessoria jurídica e preencher razão social, CNPJ e e-mail do encarregado.
 * Atualizar sempre que o site passar a guardar dados (banco, e-mail, pagamentos).
 */
const ATUALIZADO_EM = "17/10/2026";
const telefone = `+${SITE.whatsapp.slice(0, 2)} (${SITE.whatsapp.slice(2, 4)}) ${SITE.whatsapp.slice(4, 9)}-${SITE.whatsapp.slice(9)}`;

export default function PrivacidadePage() {
  return (
    <section className="secao" aria-labelledby="privacidade-titulo">
      <div className="container texto-legal">
        <p className="eyebrow">LGPD</p>
        <h1 id="privacidade-titulo" className="titulo-secao">
          Política de <span className="destaque">Privacidade</span>
        </h1>
        <p className="texto-legal__data">Última atualização: {ATUALIZADO_EM}</p>

        <p>
          Esta política explica como a VMD Assessoria &amp; Marketing Esportivo (&quot;VMD&quot;) trata os dados pessoais de
          atletas, responsáveis e visitantes deste site, de acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
        </p>

        <h2>1. Quais dados tratamos</h2>
        <ul>
          <li>
            <strong>Cadastro de atleta:</strong> nome, data de nascimento, cidade e estado, modalidade, posição, clube, altura,
            perfil no Instagram, link de vídeo e a mensagem que você escrever. Para menores de 18 anos, também o nome do
            responsável legal.
          </li>
          <li>
            <strong>Perfil público do atleta:</strong> somente com autorização, nome, posição, categoria, clube, dados físicos e
            esportivos, fotos e vídeos. Nunca publicamos data de nascimento, documentos, endereço ou contato.
          </li>
          <li>
            <strong>Navegação:</strong> o servidor registra dados técnicos mínimos (como endereço IP e data do acesso) para
            segurança e funcionamento do site.
          </li>
        </ul>

        <h2>2. Como o cadastro funciona</h2>
        <p>
          O formulário de cadastro não grava seus dados no site. Ao enviar, ele abre o seu WhatsApp com uma mensagem já
          preenchida para a VMD, e você decide se envia. A partir daí, a conversa segue as regras do WhatsApp (Meta).
        </p>

        <h2>3. Para que usamos os dados</h2>
        <ul>
          <li>Avaliar o perfil do atleta e preparar um orçamento personalizado;</li>
          <li>Prestar os serviços contratados de assessoria, comunicação e marketing esportivo;</li>
          <li>Publicar o perfil do atleta e intermediar o contato com técnicos e olheiros, quando autorizado.</li>
        </ul>

        <h2>4. Bases legais</h2>
        <p>
          Tratamos os dados com base no consentimento do titular, na execução de contrato e no legítimo interesse para a
          segurança do site. Dados de crianças e adolescentes são tratados no seu melhor interesse e com o consentimento
          específico de pelo menos um dos pais ou responsável legal (art. 14 da LGPD).
        </p>

        <h2>5. Compartilhamento</h2>
        <p>
          Não vendemos dados pessoais. O contato de técnicos e olheiros com o atleta é sempre intermediado pela VMD. Vídeos
          exibidos no site vêm do YouTube (modo de privacidade aprimorada) ou do Vimeo e só são carregados quando você clica
          para assistir.
        </p>

        <h2>6. Cookies</h2>
        <p>
          O site não usa cookies de publicidade nem de rastreamento. As fontes são servidas pelo próprio site, sem chamadas a
          terceiros.
        </p>

        <h2>7. Por quanto tempo guardamos</h2>
        <p>
          Pelo tempo necessário para as finalidades acima ou enquanto durar a relação com o atleta. Depois disso, os dados são
          eliminados, salvo quando a lei exigir a guarda.
        </p>

        <h2>8. Seus direitos</h2>
        <p>
          Você pode, a qualquer momento, pedir confirmação do tratamento, acesso, correção, anonimização ou eliminação dos
          dados, informações sobre compartilhamento e a revogação do consentimento, inclusive para retirar um perfil
          publicado.
        </p>

        <h2>9. Contato</h2>
        <p>
          Para exercer seus direitos ou tirar dúvidas sobre esta política, fale com a VMD pelo WhatsApp{" "}
          <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer">
            {telefone}
          </a>
          .
        </p>

        <p className="texto-legal__voltar">
          <Link href="/cadastro">Voltar para o cadastro</Link>
        </p>
      </div>
    </section>
  );
}
