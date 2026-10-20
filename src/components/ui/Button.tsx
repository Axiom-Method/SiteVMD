import type { ReactNode } from "react";
import { LinkIdioma } from "@/i18n/cliente";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primario" | "contorno";
  className?: string;
};

/**
 * Link com aparência de botão. Links externos abrem com noopener/noreferrer;
 * os internos mantêm o idioma atual (/cadastro → /en/cadastro).
 */
export function ButtonLink({ href, children, variant = "primario", className = "" }: Props) {
  const classes = `btn btn--${variant} ${className}`.trim();
  if (/^https?:\/\//i.test(href)) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <LinkIdioma href={href} className={classes}>
      {children}
    </LinkIdioma>
  );
}
