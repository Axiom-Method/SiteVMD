import { ButtonLink } from "@/components/ui/Button";
import { Icone } from "@/components/ui/Icone";
import { linkWhatsApp, NAV_PUBLICA, SITE } from "@/constants/site";
import { LinkIdioma } from "@/i18n/cliente";
import { obterTextos } from "@/i18n/servidor";

export async function Footer() {
  const { t } = await obterTextos();

  return (
    <footer className="footer">
      <div className="container footer__grade">
        <div className="footer__marca">
          <p className="logo__marca">{SITE.nome}</p>
          <p className="footer__texto">{t.rodape.texto}</p>
          <ButtonLink href="/cadastro" className="btn--sm">
            {t.nav.cta}
          </ButtonLink>
        </div>

        <nav aria-labelledby="rodape-navegacao">
          <p id="rodape-navegacao" className="footer__titulo">
            {t.rodape.navegacao}
          </p>
          <ul className="footer__links">
            {NAV_PUBLICA.map((item) => (
              <li key={item.href}>
                <LinkIdioma href={item.href}>{t.nav[item.chave]}</LinkIdioma>
              </li>
            ))}
            <li>
              <LinkIdioma href="/cadastro">{t.nav.cadastro}</LinkIdioma>
            </li>
          </ul>
        </nav>

        <div>
          <p className="footer__titulo">{t.rodape.contato}</p>
          <ul className="footer__links">
            <li>
              <a href={linkWhatsApp(t.rodape.mensagemWhats)} target="_blank" rel="noopener noreferrer" className="footer__contato">
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
          © {new Date().getFullYear()} {SITE.nome} {t.meta.descricaoMarca}. {t.rodape.direitos}
        </p>
        <LinkIdioma href="/privacidade" className="footer__legal">
          {t.rodape.privacidade}
        </LinkIdioma>
      </div>
    </footer>
  );
}
