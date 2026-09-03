# atom6

Agente de frontend da **Atom6 Studio** para Claude Code. Conduz a descoberta com o designer e monta o front no padrão da casa.

Instalação e uso estão no [README do repositório](../../README.md).

## O que vem aqui

**Comandos** — só disparam quando digitados. Nada liga sozinho.

- `/atom6:novo-projeto` — a persona, o fluxo de descoberta, a decisão de stack e as regras de geração. Cria `.claude/docs/` na entrada e o `CLAUDE.md` do projeto na saída.
- `/atom6:seo` — passe final de metadados, só em Next e só depois da POC aprovada.

**Skills** — carregam sozinhas quando a tarefa pede, dentro de projeto no padrão Atom6.

| Skill | Manda em |
|---|---|
| `nextjs-base` | Projetos com SEO: criação, estrutura com `src/`, config, Server vs Client Component, App Router |
| `vite-base` | Projetos sem SEO: SPA, React Router v7, AuthContext + ProtectedRoute, Axios + TanStack Query + Zustand |
| `tailwind-v4` | `globals.css`, tokens de cor, tipografia com `clamp()`, proibição de valor arbitrário |
| `ui-components` | Phosphor, o `Select` customizado obrigatório, escala de padding/altura/gap |
| `seo-metadata` | Metadados, Open Graph, canonical, `sitemap.js`, `robots.js` |

Cada skill tem `SKILL.md` (a regra) e `templates/` (arquivos prontos pra copiar).

## Onde mexer

- Mudou **como o agente conversa** (abertura, perguntas, ordem da descoberta) → `commands/novo-projeto.md`
- Mudou **o que o agente escreve** (estrutura, classes, componentes) → a `SKILL.md` correspondente
- Mudou **um arquivo padrão** (`globals.css`, `Select.jsx`, `ProtectedRoute.jsx`) → `skills/*/templates/`
- Mudou **o guia de `.claude/docs/`** que o designer lê → Anexo A no fim de `commands/novo-projeto.md`

Suba a `version` no `.claude-plugin/plugin.json` a cada mudança que a equipe precisa receber.
