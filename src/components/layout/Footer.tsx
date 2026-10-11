import Link from "next/link";
import { NAV_PUBLICA, SITE } from "@/constants/site";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grade">
        <div>
          <p className="logo__marca">{SITE.nome}</p>
          <p className="footer__texto">{SITE.descricao}</p>
        </div>

        <nav aria-label="Rodapé">
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

        {SITE.instagram && (
          <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="footer__social">
            Instagram
          </a>
        )}
      </div>
      <p className="container footer__copy">© {new Date().getFullYear()} {SITE.nome} {SITE.descricao}. Todos os direitos reservados.</p>
    </footer>
  );
}
