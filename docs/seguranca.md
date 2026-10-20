# Segurança

## Painel admin

- **Acesso**: `/admin/*` e `/api/admin/*`. O middleware barra quem não tem o cookie de sessão
  (redireciona para `/login` ou responde 401). A validação de verdade é no servidor: o layout do admin e
  **cada server action** conferem a sessão no banco (`src/lib/auth.ts`). Uma ação nunca confia só na página.
- **Senhas**: scrypt (N=2^15, r=8, p=1, sal de 16 bytes), comparação em tempo constante (`src/lib/senha.ts`).
  A senha só é digitada no `npm run admin:criar`; não fica em arquivo, variável de ambiente ou log.
- **Sessão**: token aleatório de 32 bytes no cookie; o banco guarda só o SHA-256 dele. Cookie `httpOnly`,
  `SameSite=Lax`, `Secure` e prefixo `__Host-` em produção. Expira em 8 horas. "Sair" apaga a sessão no banco.
  Redefinir a senha derruba todas as sessões do admin.
- **Força bruta**: 5 senhas erradas seguidas bloqueiam a conta por 15 minutos. A mensagem de erro é sempre a
  mesma e, sem conta, a senha é conferida contra um hash falso: nem o texto nem o tempo de resposta revelam se o
  e-mail existe.
- **CSRF**: as server actions do Next só aceitam chamadas da própria origem; o cookie é `SameSite=Lax`.
- **Redirecionamento**: depois do login só volta para caminhos `/admin/...` (sem open redirect).
- **Auditoria**: login, falhas, bloqueios e toda alteração ficam em `LogAuditoria` com admin, alvo, detalhes e IP.
  Os últimos registros aparecem no início do painel.
- **Buscadores**: `/admin` e `/login` têm `noindex` e estão no `robots.txt`.

## Pendências

- Rate limit por IP no `/login` e nas rotas `/api` (hoje o bloqueio é por conta).
- Gestão de admins pelo painel (hoje é pelo script `admin:criar`) e papéis/permissões.
- Segundo fator (TOTP) para o login.
