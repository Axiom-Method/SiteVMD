import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primario" | "contorno";
  className?: string;
};

/** Link com aparência de botão. Links externos abrem com noopener/noreferrer. */
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
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
