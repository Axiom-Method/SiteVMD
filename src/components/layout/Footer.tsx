import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Icone } from "@/components/ui/Icone";
import { linkWhatsApp, NAV_PUBLICA, SITE } from "@/constants/site";

const MENSAGEM_CONTATO = "Olá! Vim pelo site da VMD e gostaria de mais informações.";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grade">
        <div className="footer__marca">
          <p className="logo__marca">{SITE.nome}</p>
          <p className="footer__texto">
            Assessoria especializada no fortalecimento da imagem, posicionamento e valorização de atletas.
          </p>
          <ButtonLink href="/cadastro" className="btn--sm">
            Quero ser VMD
          </ButtonLink>
        </div>

        <nav aria-labelledby="rodape-navegacao">
          <p id="rodape-navegacao" className="footer__titulo">
            Navegação
          </p>
          <ul className="footer__links">
            {NAV_PUBLICA.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.rotulo}</Link>
              </li>
            ))}
            <li>
              <Link href="/cadastro">Cadastro</Link>
            </li>
          </ul>
        </nav>

        <div>
          <p className="footer__titulo">Contato</p>
          <ul className="footer__links">
            <li>
              <a href={linkWhatsApp(MENSAGEM_CONTATO)} target="_blank" rel="noopener noreferrer" className="footer__contato">
                <Icone nome="conversa" />
                WhatsApp
              </a>
            </li>
            {SITE.instagram && (
              <li>
                <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="footer__contato">
                  <Icone nome="imagem" />
                  Instagram
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="container footer__copy">
        <p>
          © {new Date().getFullYear()} {SITE.nome} {SITE.descricao}. Todos os direitos reservados.
        </p>
        <Link href="/privacidade" className="footer__legal">
          Política de Privacidade
        </Link>
      </div>
    </footer>
  );
}
