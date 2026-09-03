---
name: nextjs-base
description: Padrão de projeto Next.js da Atom6 Studio — comando de criação, limpeza pós-scaffold, estrutura de pastas com src/, arquivos de config (next.config.mjs, jsconfig, eslint, postcss) e convenções de código (Server vs Client Component, nomenclatura, organização de componentes, imports com @/) e roteamento do App Router (criar páginas, rotas aninhadas, dinâmicas e agrupadas). Use SEMPRE que for criar um projeto Next.js do zero, criar/mover arquivos dentro de um projeto Next, ou decidir onde um componente deve morar. Restrita a projetos no padrão da Atom6 — os iniciados com /atom6:novo-projeto ou cujo CLAUDE.md aponta para estas skills; não use em projeto de outro padrão.
---

# Next.js — base de projeto Atom6

Todo projeto front da Atom6 que precisa de SEO/performance nasce assim. Esta skill cobre **como o projeto é montado e como o código se organiza dentro dele**.

> **Projeto sem SEO não vem pra cá.** Dashboard, painel interno, app atrás de login ou protótipo sem conteúdo público usam a skill `vite-base` (Vite + React Router). A pergunta que decide: alguém precisa achar isso no Google? Na dúvida, fique no Next.

> **Estilização não é assunto daqui.** Cor, tipografia, spacing e classes → carregue a skill `tailwind-v4`.

## Stack fixo

| Peça | Escolha | Por quê |
|---|---|---|
| Runtime | **Node 22** (LTS) | padrão da casa; o Next 16 exige >= 20.9, mas fixamos 22 nos dois stacks |
| Framework | **Next.js 16** — App Router | SSR/SSG, metadata nativo, otimização de imagem e fonte |
| UI | **React 19** | vem com o Next 16 |
| Linguagem | **JavaScript** | padrão da casa; TypeScript só se o projeto pedir explicitamente |
| Estilo | **Tailwind CSS v4** + `tailwind-merge` + `tailwind-variants` | ver skill `tailwind-v4` |
| Lint | **ESLint 9** (flat config) + `eslint-config-next` | Core Web Vitals no lint |
| Formatação | **Prettier** + `prettier-plugin-tailwindcss` | formatação automática e classes Tailwind ordenadas |
| Deploy | **Vercel** | |

Não troque nenhuma dessas peças por conta própria. Se o projeto parecer pedir outra coisa (ex.: SPA sem SEO), **levante a questão antes** de criar o projeto — e, se for mesmo o caso, mude para a skill `vite-base`.

## Antes de criar: Node 22

**Todo projeto da casa roda em Node 22 (LTS).** O Next 16 aceita a partir do 20.9, mas fixamos 22 para os dois stacks usarem a mesma versão — o Vite 8, do `vite-base`, precisa de 20.19+ ou 22.12+.

Primeira coisa, sempre, antes de qualquer comando:

```bash
node -v
```

- `v22.x` ou maior → segue o baile.
- Menor que isso, ou o comando não existe → **pare e resolva o Node antes**. Rodar `create-next-app` com Node velho não falha na hora; falha depois, com erro que não parece ser de versão. Não vale a pena.

### Trocando de versão (nvm)

O jeito recomendado é o **nvm**, que deixa várias versões instaladas e alterna por projeto.

```bash
nvm install 22        # baixa e instala (só na primeira vez)
nvm use 22            # ativa nesta janela do terminal
node -v               # confirma: v22.x
```

Já tem várias instaladas e quer ver quais?

```bash
nvm ls                # lista o que existe na máquina
nvm alias default 22  # faz o 22 ser o padrão de toda janela nova
```

> ⚠️ `nvm use` vale **só na janela de terminal atual**. Abriu uma aba nova, voltou pra versão padrão. Se ficar alternando toda hora, rode o `nvm alias default 22`.

### Não tem nvm?

Confira primeiro — às vezes está instalado e só não foi carregado:

```bash
command -v nvm || echo "nvm não encontrado"
```

Se realmente não tiver, instale (macOS/Linux):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

**Feche e abra o terminal** depois de instalar, senão o comando `nvm` não aparece. Aí siga com o `nvm install 22`.

Alternativas, se preferir não usar nvm:
- **Homebrew** (macOS): `brew install node@22`
- **Instalador oficial**: baixe o LTS em [nodejs.org](https://nodejs.org) — mas aí você fica com uma versão só na máquina, e isso incomoda quando um projeto antigo precisar de outra.

### Fixando a versão no projeto

Todo projeto novo nasce com a versão declarada em dois lugares, pra ninguém (nem a Vercel) rodar com Node errado.

**`.nvmrc`** na raiz — assim quem clonar o projeto só roda `nvm use`:

```
22
```

**`engines`** no `package.json` — o npm avisa se a versão não bate:

```json
{
  "engines": {
    "node": ">=22.12.0"
  }
}
```

Com o `.nvmrc` no lugar, o fluxo de quem entra no projeto vira:

```bash
nvm use          # lê o .nvmrc sozinho
nvm install      # só se a versão ainda não estiver na máquina
npm install
npm run dev
```

## Criando o projeto

### Onde o projeto nasce

**Na raiz da pasta em que você já está**, convivendo com o `.claude/` — não numa subpasta. Assim `npm run dev` funciona onde a pessoa abriu o editor, e o agente viaja junto com o projeto.

Só que o `create-next-app` **se recusa a rodar** numa pasta que já tem arquivos que ele não reconhece, e o `.claude/` é exatamente isso. O caminho é criar num diretório temporário e subir o conteúdo:

```bash
npx create-next-app@latest tmp-scaffold \
  --js --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --use-npm --skip-install

cp -R tmp-scaffold/. . && rm -rf tmp-scaffold
npm install
```

- **`tmp-scaffold`, não `.scaffold`.** Nome de pacote npm não pode começar com ponto — o CLI aborta antes de criar qualquer coisa.
- **`cp -R tmp-scaffold/. .`** copia inclusive os arquivos ocultos (`.gitignore`) e **não apaga** o que já existe na pasta.
- **`--skip-install` antes de mover.** Copiar `node_modules` (dezenas de milhares de arquivos) é lento à toa; instale depois, já na raiz.

Depois de mover, **ajuste o `name` no `package.json`**: ele vem como `tmp-scaffold`. Use o slug do projeto em kebab-case (`painel-entregas`). Se o nome da pasta tiver espaço ou maiúscula (`Project 1`), não copie — nome de pacote npm só aceita minúscula, número e hífen.

> Pasta vazia, sem `.claude/`? Aí o comando direto funciona: `npx create-next-app@latest nome-do-projeto [flags]`.

As flags não são negociáveis — elas *são* o padrão da casa. Passando todas, o CLI não faz nenhuma pergunta.

### Limpeza pós-scaffold (obrigatória)

O `create-next-app` deixa boilerplate de demonstração. **Nada disso vai pra produção** — limpe antes de escrever a primeira linha do projeto:

1. **`src/app/globals.css`** — substitua o conteúdo inteiro pelo template da skill `tailwind-v4`, troque as cores pelas da marca e **apague os tokens que o projeto não usa**. O gerado pelo Next vem com dark mode via `prefers-color-scheme` e `font-family: Arial` — não é o nosso padrão.
2. **`src/app/page.js`** — apague o conteúdo de demo, deixe só o esqueleto da home.
3. **`src/app/layout.js`** — troque a fonte Geist pela fonte do projeto e `lang="en"` por **`lang="pt-BR"`**. No `metadata`, deixe só `title`/`description` do projeto, em uma linha cada — SEO completo é a skill `seo-metadata`, no passe final.
4. **`public/*.svg`** — apague `next.svg`, `vercel.svg`, `file.svg`, `globe.svg`, `window.svg`.
5. **`src/app/favicon.ico`** — troque pelo favicon da marca (ou deixe um placeholder marcado como pendência).
6. **`README.md`** — reescreva com o nome do projeto e como rodar (incluindo o `nvm use`).
7. **`.nvmrc` + `engines`** — crie o `.nvmrc` com `22` e adicione o bloco `engines` no `package.json` (ver seção do Node acima). O `create-next-app` não gera nenhum dos dois.
8. **Prettier** — instale e copie a config (ver seção do Prettier abaixo). Também não vem no scaffold.
9. **Helpers do Tailwind** — `npm i tailwind-merge tailwind-variants` (uso na skill `tailwind-v4`).
10. **`.vscode/settings.json`** — copie `templates/vscode-settings.json` (ver seção do Editor abaixo).
11. **Página 404** — copie `templates/not-found.js` para `src/app/not-found.js` e ajuste o texto (ver "404 é obrigatório").
12. **Ícones** — `npm i @phosphor-icons/react`, o default da casa. Se o designer entregou outra lib, instale a dele em vez desta. Ver `ui-components`.
13. **`Select`** — se o projeto tem formulário, copie `templates/Select.jsx` da skill `ui-components` para `src/components/ui/Select.jsx`. `<select>` nativo não é opção.

Deixe **`AGENTS.md`** onde está — é a orientação oficial do Next para agentes. `CLAUDE.md` é só um ponteiro (`@AGENTS.md`) para o mesmo arquivo; mantenha os dois.

## Estrutura de pastas

```
nome-do-projeto/
├── src/
│   ├── app/
│   │   ├── layout.js          # layout raiz — html/body, fonte, metadata
│   │   ├── page.js            # home
│   │   ├── not-found.js       # 404 do site — obrigatório
│   │   ├── globals.css        # tema Tailwind (skill tailwind-v4)
│   │   ├── favicon.ico
│   │   └── fonts/             # só se a fonte não for do Google Fonts
│   ├── components/
│   │   ├── layout/            # Header, Footer, Nav — aparecem em toda página
│   │   ├── sections/          # Hero, About, Testimonials — blocos de página
│   │   └── ui/                # Button, Card, Input — primitivos reutilizáveis
│   ├── lib/                   # helpers, formatadores, clientes de API
│   └── hooks/                 # hooks próprios (useMediaQuery, useScroll…)
├── public/                    # imagens e assets estáticos
├── .vscode/
│   └── settings.json          # format on save + IntelliSense em twMerge()/tv()
├── .nvmrc                     # versão do Node (22)
├── .prettierrc                # formatação + ordenação de classes Tailwind
├── .prettierignore
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── postcss.config.mjs
└── package.json               # com "engines": { "node": ">=22.12.0" }
```

Regras da estrutura:

- **Tudo que é código fica em `src/`.** A raiz é só config.
- **`src/app/` é roteamento, não é lixeira.** Ali só entram arquivos que o Next reconhece: `page.js`, `layout.js`, `loading.js`, `error.js`, `not-found.js`, `route.js`. Componente não mora em `app/`.
- **Rota nova = pasta nova** em `src/app/` com um `page.js` dentro → ver "Rotas — como criar mais de uma página".
- `public/` é só asset estático servido cru. Fonte **não** vai em `public/` (ver `tailwind-v4`).

### Onde colocar um componente

Pergunte, nesta ordem:

1. **Aparece em toda (ou quase toda) página?** → `components/layout/`
2. **É um bloco de uma página específica?** → `components/sections/`
3. **É um primitivo que outros componentes usam por dentro?** → `components/ui/`

Componente usado por **uma única** section pode ficar co-localizado numa subpasta dela — mas na segunda vez que outro lugar precisar dele, sobe para `ui/`.

---

## Rotas — como criar mais de uma página

O App Router é **baseado em pastas**: cada pasta dentro de `src/app/` vira um segmento da URL. Mas atenção à regra que pega todo mundo:

> **Pasta sozinha não cria rota.** Só vira página quando existe um `page.js` dentro dela. Uma pasta com outros arquivos e sem `page.js` é invisível pro roteador — nenhuma URL é gerada.

### O básico

```
src/app/
├── page.js                      →  /
├── quem-somos/
│   └── page.js                  →  /quem-somos
├── servicos/
│   ├── page.js                  →  /servicos
│   └── consultoria/
│       └── page.js              →  /servicos/consultoria
└── contato/
    └── page.js                  →  /contato
```

Aninhar pasta = aninhar URL. Não existe arquivo de configuração de rotas; **a árvore de pastas é o roteador**.

### Arquivos especiais

Nomes reservados. Cada um tem um papel e só funciona com esse nome exato:

| Arquivo | Para que serve | Obrigatório? |
|---|---|---|
| `page.js` | a página em si — **é ele que cria a rota** | sim, para a rota existir |
| `layout.js` | casca compartilhada; envolve a página e as rotas filhas | só na raiz de `app/` |
| `loading.js` | tela de carregamento (Suspense automático) | não |
| `error.js` | captura erro daquele trecho — precisa de `"use client"` | não |
| `not-found.js` | 404 daquele trecho | não |
| `route.js` | endpoint de API; **não convive com `page.js`** na mesma pasta | não |

### Layout aninhado

`layout.js` numa subpasta envolve **todas** as rotas abaixo dela, e não é remontado na navegação entre elas — útil pra sidebar, menu de seção, breadcrumb:

```
src/app/
├── layout.js                    ← envolve o site inteiro (html/body)
└── servicos/
    ├── layout.js                ← envolve /servicos e tudo abaixo
    ├── page.js
    └── consultoria/page.js
```

### Rota dinâmica

Colchete no nome da pasta = segmento variável. O valor chega em `params`:

```
src/app/blog/[slug]/page.js      →  /blog/qualquer-coisa
```

```jsx
export default async function PostPage({ params }) {
  const { slug } = await params;   // params é Promise no Next 15+
  return <article>{slug}</article>;
}
```

Variações: `[...slug]` pega vários segmentos, `[[...slug]]` idem mas opcional.

### Agrupar sem mudar a URL

Pasta entre parênteses organiza o código **sem virar segmento**. Serve pra dar um layout comum a um conjunto de páginas:

```
src/app/
└── (institucional)/
    ├── layout.js                ← vale só pra essas páginas
    ├── contato/page.js          →  /contato      (o "(institucional)" some)
    └── quem-somos/page.js       →  /quem-somos
```

### 404 é obrigatório

**Todo site sai com página 404 própria.** A tela padrão do Next é preto-e-branco, em inglês e sem a marca — entregar com ela é entregar pela metade. Basta um `not-found.js` na raiz de `src/app/`, que atende o site inteiro:

```
src/app/not-found.js             →  qualquer URL inexistente
```

Copie `templates/not-found.js` (nesta skill) e ajuste o texto. Ele já usa os tokens do tema, então sai com as cores do projeto automaticamente.

O que a página precisa ter:
- Dizer **o que aconteceu**, em português e sem jargão ("Página não encontrada", não "Error 404: NOT_FOUND")
- **Um caminho de volta** — link pra home, no mínimo. Beco sem saída faz o visitante fechar a aba.
- **A cara do site** — mesma fonte, mesmas cores, e de preferência o Header/Footer se o layout raiz já os inclui

É Server Component e não leva `"use client"`. Se alguma seção precisar de um 404 diferente (ex.: post de blog inexistente), põe um `not-found.js` dentro daquela pasta — o mais próximo vence.

### Esconder uma pasta do roteador

Prefixo `_` torna a pasta privada — o Next ignora, **mesmo que tenha `page.js` dentro**:

```
src/app/_rascunhos/page.js       →  nenhuma rota gerada
```

### Convenções da Atom6 em cima disso

O Next **permite** colocar componentes dentro de `src/app/` (só `page.js`/`route.js` viram público). Aqui a gente **não faz isso**:

- **`src/app/` só tem arquivo de rota.** Section e componente vivem em `src/components/` — ver "Onde colocar um componente".
- **Slug da pasta em kebab-case e no idioma do site**: `quem-somos/`, não `about-us/` nem `quemSomos`. A URL é conteúdo e conta pra SEO.
- **Componente da página em inglês**, mesmo com slug em português: `src/app/quem-somos/page.js` exporta `AboutPage()`.
- **Uma página = um `page.js` magro** que monta sections. Se o `page.js` passou de umas 60 linhas, tem section querendo nascer.

```jsx
// src/app/quem-somos/page.js
import Hero from "@/components/sections/Hero";
import Timeline from "@/components/sections/Timeline";

export default function AboutPage() {
  return (
    <main>
      <Hero title="Quem somos" />
      <Timeline />
    </main>
  );
}
```

## Arquivos de config

O que o `create-next-app` já entrega pronto — **não mexa sem motivo**:

```js
// jsconfig.json — alias @/ apontando pra src/
{ "compilerOptions": { "paths": { "@/*": ["./src/*"] } } }
```

```js
// eslint.config.mjs — flat config, já com core-web-vitals
// postcss.config.mjs — plugin do Tailwind v4
```

```js
// next.config.mjs — começa vazio, e o normal é continuar vazio
/** @type {import('next').NextConfig} */
const nextConfig = {};
export default nextConfig;
```

A adição mais comum ao `next.config.mjs` é liberar um domínio de imagem externa, quando o `next/image` precisa carregar de fora do projeto:

```js
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.exemplo.com" }],
  },
};
```

Nunca adicione config "por precaução". Cada linha ali precisa ter um motivo concreto.

## Prettier

Formatação é automática — ninguém alinha código na mão nem discute vírgula em review. **Todo projeto instala o Prettier**, e junto com ele o plugin que ordena as classes do Tailwind.

### Instalação

Os **dois** pacotes, sempre juntos — o plugin não é opcional:

```bash
npm i -D prettier prettier-plugin-tailwindcss
```

- **`prettier`** — formatação do código (aspas, vírgula, quebra de linha, indentação).
- **`prettier-plugin-tailwindcss`** — ordena as classes do Tailwind na ordem oficial do framework, automaticamente. É o que impede aquele `className` virar uma sopa aleatória de 15 classes: layout, spacing, tipografia e cor sempre caem no mesmo lugar, em qualquer componente e de qualquer pessoa do time. É mantido pela própria Tailwind Labs.

Copie `templates/.prettierrc` e `templates/.prettierignore` (nesta skill) para a raiz do projeto.

```json
// .prettierrc
{
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindStylesheet": "./src/app/globals.css",
  "singleQuote": false,
  "tabWidth": 2,
  "bracketSameLine": false,
  "trailingComma": "all",
  "printWidth": 100
}
```

**`tailwindStylesheet` é obrigatório.** No Tailwind v4 não existe `tailwind.config.js`, então sem apontar o caminho do CSS o plugin não enxerga os tokens do `@theme` e deixa toda classe customizada fora de ordem, empilhada no começo:

```jsx
{/* sem tailwindStylesheet — tokens do tema ignorados */}
<div className="text-eyebrow text-muted bg-surface-hover text-responsive-md rounded-lg p-4" />

{/* com tailwindStylesheet — ordenação correta */}
<div className="rounded-lg bg-surface-hover p-4 text-eyebrow text-responsive-md text-muted" />
```

Se o projeto tiver o `globals.css` em outro lugar, **ajuste o caminho** — é a única linha da config que muda de projeto pra projeto.

> Use `bracketSameLine`, não `jsxBracketSameLine`. O nome antigo foi renomeado e o Prettier 3 avisa `jsxBracketSameLine is deprecated` a cada execução.

### Scripts

Adicione os dois de formatação ao `package.json`:

```json
"format": "prettier --write .",
"format:check": "prettier --check ."
```

O conjunto final do projeto:

```bash
npm run dev            # desenvolvimento
npm run build          # valida se o projeto compila — rode antes de entregar
npm run lint           # ESLint (no Next 16 é `eslint`, não mais `next lint`)
npm run format         # formata tudo
npm run format:check   # só verifica, sem escrever — útil em CI
```

**Rode `npm run format` antes de entregar.** Prettier e ESLint não brigam aqui: o `eslint-config-next` cuida de qualidade e Core Web Vitals, o Prettier cuida de formatação — não há sobreposição de regras.

### Editor (VS Code)

Copie `templates/vscode-settings.json` para **`.vscode/settings.json`** na raiz do projeto. Ele resolve duas coisas:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",

  // IntelliSense do Tailwind dentro de twMerge() e tv()
  "tailwindCSS.experimental.classRegex": [
    ["([\"'`][^\"'`]*.*?[\"'`])", "[\"'`]([^\"'`]*).*?[\"'`]"],
    "class:\\s*?[\"'`]([^\"'`]*).*?,"
  ]
}
```

1. **Format on Save** — código já nasce formatado e as classes se auto-ordenam a cada save.
2. **`classRegex`** — sem isso, a extensão *Tailwind CSS IntelliSense* só autocompleta dentro de `className="..."`. Classe escrita dentro de `twMerge()` ou de um bloco `tv({ variants: ... })` fica sem autocomplete, sem preview de cor e sem aviso de classe inexistente. Com o regex, tudo isso volta a funcionar nesses lugares — inclusive para os tokens do `@theme` (`text-responsive-*`, `bg-surface-*`).

Requer a extensão **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`) instalada.

> Esse `classRegex` é só do **editor** — não muda nada em runtime. Ele faz o autocomplete aparecer; não interfere em como o `twMerge` resolve conflito de classe.

---

## Convenções de código

### Server Component é o padrão

Todo componente é **Server Component** até prova em contrário. Server Component não manda JavaScript pro browser — é isso que segura o bundle pequeno e o LCP bom.

Só use `"use client"` quando o componente precisa de:
- estado ou ciclo de vida (`useState`, `useEffect`, `useRef`)
- evento de usuário (`onClick`, `onChange`, `onSubmit`)
- API do browser (`window`, `localStorage`, `IntersectionObserver`)
- hook de contexto/biblioteca que exige cliente

Regras que evitam o erro clássico:

- **`"use client"` vai na folha da árvore, o mais fundo possível.** A diretiva contamina tudo que o componente importa — um `"use client"` no layout raiz joga o site inteiro pro cliente.
- **Não transforme a página inteira em client por causa de um botão.** Extraia o botão pra um componente próprio com `"use client"` e mantenha a página server.
- Server Component **pode** renderizar Client Component. O contrário não vale — Client Component só recebe Server Component via `children`/props.
- Só passe dados **serializáveis** de server pra client (nada de função ou classe como prop).

```jsx
// ✅ src/app/page.js — server, sem "use client"
import Hero from "@/components/sections/Hero";
import ContactForm from "@/components/sections/ContactForm";  // esse sim é client

export default function Home() {
  return (
    <main>
      <Hero />
      <ContactForm />
    </main>
  );
}
```

### Código é sempre em inglês

**Todo identificador que você escreve é em inglês** — componente, prop, variante, função, variável, hook, helper, nome de arquivo e nome de pasta de componente. Sem exceção e sem meio-termo (`CardDepoimento`, `botaoPrimario`, `handleEnviar` estão errados).

```jsx
// ❌ português, ou pior, misturado
export default function CardDepoimento({ titulo, ativo }) {}
const botao = tv({ variants: { variante: { primario: "..." } } });

// ✅
export default function TestimonialCard({ title, isActive }) {}
const button = tv({ variants: { variant: { primary: "..." } } });
```

Por quê: o Tailwind, o React e o Next são em inglês, então código misturado gera linha como `<Botao variante="primario" onClick={handleClick} />`, que troca de idioma no meio. Inglês também é o que todo dev que entrar no projeto já lê.

**A exceção é conteúdo, não código.** Continuam em português:

- **Slug de rota** — `src/app/quem-somos/page.js` → `/quem-somos`. URL é conteúdo e conta pra SEO; traduzir prejudica.
- **Texto visível na tela** — títulos, labels, mensagens, `alt` de imagem.
- **Comentários e documentação** — escreva no idioma do time.

```jsx
// src/app/quem-somos/page.js        ← slug pt-BR (SEO)
export default function AboutPage() {         // ← componente em inglês
  return <h1 className="text-responsive-xl">Quem somos</h1>;  // ← texto em pt-BR
}
```

### Nomenclatura

| O quê | Padrão | Exemplo |
|---|---|---|
| Arquivo de componente | PascalCase, inglês | `TestimonialCard.jsx` |
| Arquivo de rota | nome reservado do Next, minúsculo | `page.js`, `layout.js` |
| Pasta de rota | kebab-case, **idioma do site** | `src/app/quem-somos/` |
| Helper / hook | camelCase, inglês | `formatDate.js`, `useScroll.js` |
| Componente e função | PascalCase / camelCase, inglês | `function TestimonialCard()` |
| Booleano | prefixo `is` / `has` | `isActive`, `hasError` |
| Handler de evento | prefixo `handle` | `handleSubmit`, `handleClick` |

Nome de arquivo **igual** ao nome do componente que ele exporta. Componente = `export default`; helpers = named export.

### Imports

Sempre `@/` — nunca `../../`:

```jsx
import Header from "@/components/layout/Header";   // ✅
import Header from "../../components/layout/Header"; // ❌
```

Ordem: libs externas → `@/` internos → CSS.

### Componentes

- **Um componente, uma responsabilidade.** Passou de ~150 linhas, provavelmente são dois.
- **Props explícitas e desestruturadas** na assinatura, com default onde fizer sentido:
  `export default function Button({ variant = "primary", children })`
- **Repetiu 3x, extraia.** Vale pra JSX e pra bloco de classes.
- **Nada de `index.js` barril** re-exportando pastas inteiras — atrapalha tree-shaking e esconde de onde a coisa vem.
- **Quase nenhum comentário.** Só o que explica um *porquê* não óbvio — uma armadilha, uma decisão contraintuitiva. Nada de comentar o que a linha já diz, de bloco explicativo no topo do arquivo ou de narrar etapas. Precisou explicar o *como*? O problema é o nome ou o tamanho da função.

### Imagens

`next/image` **sempre** — nunca `<img>`. `alt` descritivo obrigatório (vazio só em imagem puramente decorativa), `width`/`height` ou `fill` para não gerar CLS, e `priority` na imagem de LCP (normalmente a do hero).

---

## Checklist antes de entregar

- [ ] `node -v` >= 22.12
- [ ] Projeto na raiz da pasta, `tmp-scaffold/` apagado e `name` do `package.json` com o slug real
- [ ] `.nvmrc` com `22` na raiz e `engines` no `package.json`
- [ ] Prettier instalado, `.prettierrc` na raiz com `tailwindStylesheet` apontando pro `globals.css`
- [ ] Boilerplate do `create-next-app` removido (SVGs, page de demo, globals.css, fonte Geist)
- [ ] `lang="pt-BR"` no `<html>` e `metadata` mínimo do layout raiz preenchido (SEO completo fica pra skill `seo-metadata`)
- [ ] Nenhum componente dentro de `src/app/` — só arquivos de rota
- [ ] `"use client"` só onde precisa, e na folha da árvore
- [ ] Todos os imports internos com `@/`
- [ ] Zero `<img>` — tudo `next/image` com `alt`
- [ ] Cores do template substituídas pelas da marca — nenhum placeholder sobrou
- [ ] `src/app/not-found.js` existe e usa as cores do site
- [ ] `npm run format` rodado
- [ ] `npm run lint` limpo
- [ ] `npm run build` passa
