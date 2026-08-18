# atom-vibecode-creator

Agente de frontend da **Atom6 Studio**. Ajuda designers a criar projetos front do zero — guiando por perguntas até o escopo ficar claro — e gera o código no padrão da casa: **React + JavaScript + Tailwind v4** (Next.js quando precisa de SEO, Vite quando não precisa), mobile-first, com performance, acessibilidade e componentes reutilizáveis.

Este repositório é o **template de partida**: você baixa uma cópia dele para cada projeto novo.

---

## Começando um projeto novo

### 1. Baixe o ZIP

Abra <https://github.com/atom6development/Vibecode-Creator> e clique no botão verde
**`Code`** → **`Download ZIP`**.

> Não precisa de Git, conta no GitHub nem terminal para isso. É download de arquivo normal.

### 2. Descompacte

Dê duplo clique no `Vibecode-Creator-main.zip` (na pasta de Downloads). Vai aparecer uma
pasta chamada `Vibecode-Creator-main`.

### 3. Renomeie a pasta com o nome do projeto

Clique na pasta, aperte `Enter` (Mac) ou `F2` (Windows) e troque o nome pelo do projeto:

```
Vibecode-Creator-main   →   padaria-do-ze
```

Use letras minúsculas e hífen no lugar de espaço (`padaria-do-ze`, `clinica-vida-site`,
`dashboard-vendas`). Esse nome vira o nome do projeto no código.

Depois **mova a pasta para onde você guarda seus projetos** — por exemplo
`~/Developer/` ou `~/Documentos/Projetos/`. Não deixe em Downloads.

### 4. Abra o projeto

**No VS Code:** menu `File` → `Open Folder…` → selecione a pasta que você renomeou.
Depois abra o Claude Code na barra lateral (ou `Cmd/Ctrl + Esc`).

**No terminal:** navegue até a pasta e rode `claude`.

```bash
cd ~/Developer/padaria-do-ze
claude
```

> **Importante:** abra a **pasta do projeto**, não a pasta de cima. O agente só liga a
> persona quando o `.claude/` está na raiz do que você abriu.

### 5. (Opcional, mas recomendado) Solte o material de apoio

Antes de conversar, jogue em `.claude/docs/` o que você já tem: briefing, entrevista com o
cliente, export do Figma em PDF, manual de marca, textos. **Cada arquivo ali é uma pergunta
que o agente não vai te fazer.** Detalhes na seção [`.claude/docs/`](#clauddocs--material-de-apoio)
abaixo.

Dá para soltar arquivo depois também — só avise no chat que chegou material novo.

### 6. Vibecode

Escreva **`oi`** no chat e dê Enter.

O agente se apresenta, diz o que entendeu do material que você deixou na pasta e começa a
te fazer as perguntas — tipo de projeto, objetivo, identidade visual, seções. No fim ele
resume o escopo, você confirma, e ele monta o front.

Não precisa saber o nome dele nem escrever prompt técnico. Conversa normal, em português.

### 7. Veja o resultado

Quando o agente terminar de montar, ele te diz o comando para rodar — normalmente:

```bash
npm install
npm run dev
```

Abra o endereço que aparecer no terminal (geralmente <http://localhost:3000> no Next ou
<http://localhost:5173> no Vite). A partir daí é ida e volta: você olha, pede ajuste no
chat, o agente aplica.

---

## O que já vem pronto na pasta

```
padaria-do-ze/                      ← a pasta que você renomeou
├── README.md
└── .claude/
    ├── CLAUDE.md                   ← ativa a persona nesta pasta
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

O código do site que o agente gerar nasce **ao lado** dessas pastas, na raiz do projeto.

---

## `.claude/docs/` — material de apoio

Pasta onde o **designer** solta o que ajuda a entender o projeto: entrevista com o
cliente, briefing, export do Figma em PDF/PNG, manual de marca, textos, regras de
negócio. O agente **lê essa pasta antes de fazer qualquer pergunta**.

Regras rápidas (as completas estão em [`.claude/docs/README.md`](.claude/docs/README.md)):

- Formatos que ele lê direto: `.md`, `.txt`, `.pdf`, `.png`, `.jpg`, `.csv`, `.json`
- `.docx`/`.pptx`/`.fig`/`.psd` e link do Figma → exporte como **PDF ou PNG**
- Áudio de reunião → mande a **transcrição**
- Prefixe com `_old-` o que está desatualizado (o agente ignora)
- **Nada de senha, token ou dado pessoal real** — a POC roda com dado mockado

---

## Perguntas frequentes

**Preciso baixar um ZIP novo pra cada projeto?**
Sim. Cada projeto é uma cópia independente — assim o material de apoio e o código de um
cliente não se misturam com o do outro.

**Já tinha um projeto antigo, o template mudou. E agora?**
Baixe o ZIP novo e substitua **só a pasta `.claude/skills/`** e o arquivo
`.claude/agents/atom-vibecode-creator.md` do projeto antigo. Não mexa em `.claude/docs/`
nem no código que já existe.

**O agente não se apresentou / respondeu como Claude normal.**
Você provavelmente abriu a pasta errada. Confira se o `.claude/` está na raiz da pasta
aberta no editor e reabra o chat.

**Quem cuida de domínio, deploy e analytics?**
O dev, depois. O que sai daqui é uma **POC com dados mockados** — o agente não configura
hospedagem nem ferramenta de métrica de propósito.

---

## Para devs: usar o agente em qualquer pasta

Quem trabalha em vários repositórios pode linkar as definições globalmente em `~/.claude/`,
e aí agente e skills ficam disponíveis fora deste template:

```bash
ln -sf  "$PWD/.claude/agents/atom-vibecode-creator.md" ~/.claude/agents/atom-vibecode-creator.md
mkdir -p ~/.claude/skills
for skill in nextjs-base vite-base tailwind-v4 ui-components seo-metadata; do
  ln -sfn "$PWD/.claude/skills/$skill" ~/.claude/skills/$skill
done
```

Confira com `ls -la ~/.claude/skills/`. Skill que existe aqui mas não aparece lá só
funciona **dentro desta pasta**.

> `.claude/docs/` **não** é linkado: material de apoio é por projeto, não global.

Com o link feito, em qualquer projeto você chama por nome:

> "Use o agente atom-vibecode-creator para criar uma landing page da [X]"

## Como editar o padrão da casa

Edite os arquivos em `.claude/agents/` ou `.claude/skills/` **deste repositório** e faça
commit — é a fonte de verdade que todo mundo baixa. Se você usa os symlinks acima, a
mudança já vale localmente na hora.
