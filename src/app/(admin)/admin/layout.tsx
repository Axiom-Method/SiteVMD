import { notFound } from "next/navigation";

// SEGURO POR PADRÃO: toda a área /admin responde 404 até a autenticação
// (sessão + papel validados no servidor) ser implementada aqui.
export default function AdminLayout(): never {
  notFound();
}
