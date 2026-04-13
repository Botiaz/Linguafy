# Linguafy

Aplicacao web para aprendizado de idiomas com foco em flashcards, repeticao espacada e acompanhamento de progresso.

O projeto usa Next.js (App Router), Supabase para autenticacao e banco de dados, e uma rota de API para traducao assistida por IA.

## Funcionalidades

- Cadastro e login com Supabase Auth
- Dashboard com metricas de estudo
- Area de treino com flashcards
- Painel administrativo para idiomas, categorias, palavras e usuarios
- Rota de traducao para adicionar palavras automaticamente ao vocabulario

## Stack Tecnica

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui + Radix UI
- Supabase (Auth + Postgres + RLS)
- Vercel AI SDK (rota de traducao)

## Requisitos

- Node.js 20+
- pnpm 9+
- Projeto Supabase configurado

## Como rodar localmente

1. Instale dependencias:

```bash
pnpm install
```

2. Crie o arquivo `.env.local` na raiz com as variaveis:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/dashboard
```

3. Configure o banco no Supabase (SQL Editor):

- Execute os scripts de schema e seed da pasta `scripts`.
- Ajuste campos/tabelas conforme o schema esperado no codigo (veja observacao em "Banco de dados").

4. Inicie o ambiente de desenvolvimento:

```bash
pnpm dev
```

5. Acesse:

- http://localhost:3000

## Scripts

```bash
pnpm dev      # ambiente de desenvolvimento
pnpm build    # build de producao
pnpm start    # inicia app apos build
pnpm lint     # lint do projeto
```

## Banco de dados

O projeto depende de tabelas como:

- profiles
- languages
- categories
- words
- user_vocabulary
- training_sessions

Observacao importante:

- Existem sinais de diferenca entre versoes de schema nos scripts SQL e no codigo (por exemplo, colunas em `words` e `languages`).
- Antes de usar em producao, valide e alinhe os scripts SQL com o schema realmente usado pela aplicacao.

## Rotas principais

- `/` landing page
- `/auth/login` login
- `/auth/sign-up` cadastro
- `/dashboard` area principal do usuario
- `/dashboard/treinar` treino com flashcards
- `/dashboard/tradutor` traducao e salvamento de palavras
- `/admin` painel administrativo (somente admin)
- `/api/translate` endpoint de traducao

## Controle de acesso

- Middleware protege rotas de dashboard e admin para usuarios autenticados.
- Layout do admin verifica `is_admin` no perfil do usuario.
- Politicas RLS do Supabase devem estar alinhadas com as regras de negocio.

## Estrutura resumida

```text
app/
  auth/
  dashboard/
  admin/
  api/
components/
  ui/
  dashboard/
  admin/
lib/
  supabase/
scripts/
```

## Proximos passos recomendados

- Criar migracoes versionadas (ex.: Supabase CLI) para evitar divergencia de schema
- Adicionar testes para fluxos criticos (auth, treino, traducao)
- Validar build/lint no CI antes de deploy

## Licenca

Defina a licenca que deseja usar para o projeto.
