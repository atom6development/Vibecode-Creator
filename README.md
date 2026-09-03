# atom6 — plugin de frontend da Atom6 Studio

Plugin do Claude Code que traz o **padrão de frontend da Atom6** pra sua máquina. O agente conduz a conversa com você — pergunta o que precisa saber, decide o stack, monta o front — e deixa o projeto documentado pra continuar no padrão depois.

Stack da casa: **React + JavaScript + Tailwind CSS v4**, com **Next.js** quando o projeto precisa aparecer no Google e **Vite + React Router** quando não precisa. Mobile-first, acessível e com componentes reutilizáveis.

---

## Instalando (uma vez só, na vida)

Abra um terminal e rode:

```bash
claude plugin marketplace add atom6development/Vibecode-Creator
claude plugin install atom6
```

Reinicie o Claude Code. Pronto — o padrão da casa está disponível em **qualquer pasta**, sem baixar ZIP nenhum.

Pra atualizar quando o padrão mudar:

```bash
claude plugin update atom6
```

---

## Começando um projeto

### 1. Crie uma pasta com o nome do projeto

Letras minúsculas e hífen no lugar de espaço: `padaria-do-ze`, `clinica-vida-site`, `dashboard-vendas`. Esse nome vira o nome do projeto no código. Coloque onde você guarda seus projetos — `~/Developer/`, por exemplo. Não deixe em Downloads.

### 2. Abra a pasta

**No VS Code:** `File` → `Open Folder…` → selecione a pasta. Depois abra o Claude Code na barra lateral (ou `Cmd/Ctrl + Esc`).

**No terminal:** `cd` até a pasta e rode `claude`.

### 3. Rode o comando

```
/atom6:novo-projeto
```

O agente se apresenta, cria a pasta `.claude/docs/` e começa a te fazer as perguntas — tipo de projeto, objetivo, identidade visual, seções. No fim ele resume o escopo, você confirma, e ele monta o front.

> **Só o comando liga o agente.** Escrever "oi" numa pasta qualquer não aciona nada — o Claude Code responde normal. Isso é de propósito: o padrão da casa só entra quando você chama.

### 4. (Recomendado) Solte o material de apoio

Depois que a pasta `.claude/docs/` existir, jogue lá o que você já tem: briefing, entrevista com o cliente, export do Figma em PDF, manual de marca, textos. **Cada arquivo ali é uma pergunta que o agente não vai te fazer.**

Dá pra soltar arquivo a qualquer momento — só avise no chat que chegou material novo. As regras completas estão no `README.md` que o agente cria dentro da pasta.

### 5. Veja o resultado

Quando terminar de montar, o agente te diz o comando pra rodar:

```bash
npm install
npm run dev
```

Abra o endereço que aparecer no terminal (`localhost:3000` no Next, `localhost:5173` no Vite). A partir daí é ida e volta: você olha, pede ajuste no chat, o agente aplica.

### 6. Voltando depois

O agente escreve um **`CLAUDE.md` na raiz do projeto** com o stack escolhido, a identidade visual, as seções e as regras do padrão. Quando você reabrir a pasta semanas depois, ele já sabe o que foi combinado — **sem precisar rodar o comando de novo**.

---

## Comandos

| Comando | Quando usar |
|---|---|
| `/atom6:novo-projeto` | Começar um projeto do zero. Conduz a descoberta e monta o front. |
| `/atom6:seo` | Só depois da POC pronta e aprovada, e só em projeto Next. Escreve os metadados de todas as páginas. |

---

## Perguntas frequentes

**Preciso instalar de novo a cada projeto?**
Não. Instala uma vez e vale pra todas as pastas. É a diferença pro fluxo antigo de ZIP.

**O padrão da casa mudou. Como recebo?**
`claude plugin update atom6`. Nada de baixar ZIP e substituir pasta na mão.

**Tenho um projeto antigo, feito com o ZIP. Quebra?**
Não. Aquele projeto tem o `.claude/` dele dentro e continua funcionando como sempre. O plugin vale pros projetos novos.

**O agente não apareceu / respondeu como Claude normal.**
Você provavelmente não rodou `/atom6:novo-projeto`, ou o projeto não tem `CLAUDE.md`. Diferente do fluxo antigo, o agente **não** liga sozinho.

**Quem cuida de domínio, deploy e analytics?**
O dev, depois. O que sai daqui é uma **POC com dados mockados** — o agente não configura hospedagem nem ferramenta de métrica, de propósito.

---

## Para quem mantém o padrão

Este repositório é ao mesmo tempo o **marketplace** e o **plugin**:

```
.claude-plugin/marketplace.json     ← o catálogo
plugins/atom6/
├── .claude-plugin/plugin.json      ← manifesto (versão fica aqui)
├── commands/                       ← /atom6:novo-projeto e /atom6:seo
│   ├── novo-projeto.md             ← a persona, o fluxo de descoberta e o guia de .claude/docs/
│   └── seo.md
└── skills/                         ← o padrão técnico, carregado sob demanda
    ├── nextjs-base/                ← projetos COM SEO: criação, estrutura, App Router
    ├── vite-base/                  ← projetos SEM SEO: SPA, React Router, auth, dados
    ├── tailwind-v4/                ← estilização: tema, tokens, tipografia fluida
    ├── ui-components/              ← ícones (Phosphor), Select customizado, espaçamentos
    └── seo-metadata/               ← passe final de SEO
```

**Editando o padrão:** mexa em `commands/` (como o agente conversa) ou `skills/` (o que ele escreve). Suba a `version` no `plugin.json`, faça commit e push — todo mundo pega no próximo `claude plugin update`.

**Testando antes de publicar**, sem mexer no que a equipe usa:

```bash
claude plugin marketplace add "$PWD" --scope local
claude plugin install atom6@atom6 --scope local
claude plugin validate plugins/atom6
claude plugin details atom6          # inventário e custo de token
```

Pra desfazer o teste: `claude plugin uninstall atom6` e `claude plugin marketplace remove atom6`.

**Publicando uma versão:**

```bash
claude plugin tag plugins/atom6 --push
```

Cria a tag `atom6--v<versão>` validando que o `plugin.json` e a entrada no marketplace concordam.
