# atom-vibecode-creator

Agente de frontend da **Atom6 Studio**. Ajuda designers a criar projetos front do zero — guiando por perguntas até o escopo ficar claro — e gera o código no padrão da casa: **Next.js + React + JavaScript + Tailwind v4**, mobile-first, com SEO/performance, acessibilidade e componentes reutilizáveis.

## Estrutura

```
atom-front-creator/
├── README.md
└── .claude/
    ├── CLAUDE.md                   ← ativa a persona nesta pasta (aponta pro agente)
    ├── agents/
    │   └── atom-vibecode-creator.md   ← definição do agente (fonte de verdade)
    ├── docs/                       ← material de apoio do projeto (ver abaixo)
    │   └── README.md               ← instruções pro designer
    └── skills/
        ├── nextjs-base/            ← projetos COM SEO: criação, estrutura, App Router
        ├── vite-base/              ← projetos SEM SEO: SPA, React Router, auth, dados
        ├── tailwind-v4/            ← estilização: tema, tokens, tipografia fluida
        ├── ui-components/          ← ícones (Phosphor), Select customizado, espaçamentos
        └── seo-metadata/           ← passe final de SEO (só Next, só depois da POC)
```

Cada skill tem `SKILL.md` (a regra) e, quando aplicável, `templates/` (arquivos prontos
pra copiar — Prettier, `globals.css`, 404, auth, camada de dados, `Select.jsx`).

## `.claude/docs/` — material de apoio

Pasta onde o **designer** solta o que ajuda a entender o projeto: entrevista com o
cliente, briefing, export do Figma em PDF/PNG, manual de marca, textos, regras de
negócio. O agente **lê essa pasta antes de fazer qualquer pergunta** — cada arquivo ali
é uma pergunta que ele não faz de novo.

Regras rápidas (as completas estão em [`.claude/docs/README.md`](.claude/docs/README.md)):

- Formatos que ele lê direto: `.md`, `.txt`, `.pdf`, `.png`, `.jpg`, `.csv`, `.json`
- `.docx`/`.pptx`/`.fig`/`.psd` e link do Figma → exporte como **PDF ou PNG**
- Áudio de reunião → mande a **transcrição**
- Prefixe com `_old-` o que está desatualizado (o agente ignora)
- **Nada de senha, token ou dado pessoal real** — a POC roda com dado mockado

## Disponibilidade

As definições vivem aqui, mas estão linkadas globalmente em `~/.claude/`,
então agente e skills ficam disponíveis em **qualquer projeto** da máquina.

Para recriar os links (se necessário):

```bash
ln -sf  "$PWD/.claude/agents/atom-vibecode-creator.md" ~/.claude/agents/atom-vibecode-creator.md
mkdir -p ~/.claude/skills
for skill in nextjs-base vite-base tailwind-v4 ui-components seo-metadata; do
  ln -sfn "$PWD/.claude/skills/$skill" ~/.claude/skills/$skill
done
```

Confira o que está linkado com `ls -la ~/.claude/skills/`. Skill que existe aqui mas não
aparece lá só funciona **dentro desta pasta** — em outro projeto o agente não a encontra.

> `.claude/docs/` **não** é linkado: material de apoio é por projeto, não global.

## Como usar

Em qualquer projeto, peça:

> "Use o agente atom-vibecode-creator para criar uma landing page da [X]"

## Como editar

Edite os arquivos em `.claude/agents/` ou `.claude/skills/`. Por serem symlinks,
a mudança vale globalmente na hora — não precisa copiar nada.
