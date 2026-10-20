# VMD Site

Site da VMD Assessoria & Marketing Esportivo (Next.js). Veja `docs/` para arquitetura, segurança e LGPD.

## Rodar o projeto

```bash
npm install
npm run dev        # http://localhost:3000
```

Sem `.env`, o site abre com os dados de exemplo (`src/constants`) e o painel admin fica desligado.

## Painel admin (`/login`)

O painel guarda os dados num PostgreSQL. Para ligar:

1. Crie um banco PostgreSQL (ex.: [Neon](https://neon.tech) ou [Supabase](https://supabase.com), ambos têm plano grátis).
2. Copie `.env.example` para `.env` e cole a URL de conexão em `DATABASE_URL`. **Nunca commite o `.env`.**
3. Crie as tabelas e os dados iniciais:
   ```bash
   npm run db:aplicar   # aplica as migrações (prisma/migrations)
   npm run db:seed      # números padrão de cada esporte + números dos atletas de exemplo
   ```
4. Crie o primeiro admin (pergunta e-mail, nome e senha; a senha não aparece na tela):
   ```bash
   npm run admin:criar
   ```
   O mesmo comando redefine a senha de um admin que já existe.
5. Entre em `http://localhost:3000/login`.

No painel:

- **Números por esporte**: quais números aparecem no perfil (ex.: Futebol: Jogos, Gols, Assistências, Minutos).
  Uma posição pode ter números próprios, que substituem os do esporte (ex.: Goleiro: Jogos sem sofrer gol, Defesas).
  Cada rótulo pode ter tradução em inglês, espanhol e italiano.
- **Atletas**: os números de cada atleta, por temporada.

Mudou o `prisma/schema.prisma`? Gere uma migração com `npm run db:migrar -- --name descricao`.
