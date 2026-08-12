---
name: tailwind-v4
description: Padrão de estilização da Atom6 Studio com Tailwind CSS v4 — configuração via CSS (@theme), tokens de cor nomeados, tipografia responsiva com clamp() e proibição de valores arbitrários (cor, texto, espaçamento). Use SEMPRE que for criar/editar globals.css, definir cores ou fontes, escrever classes de um componente ou revisar estilos de um projeto Tailwind v4.
---

# Tailwind v4 — padrão Atom6

Estilização na Atom6 é **Tailwind CSS v4**, configurado **dentro do CSS**. Não existe `tailwind.config.js`.
Todo o tema vive no `globals.css`, no bloco `@theme inline`.

Esta skill vale igual nos dois stacks da casa. **Só duas coisas mudam de lugar:**

| | Next (`nextjs-base`) | Vite (`vite-base`) |
|---|---|---|
| Onde mora o CSS | `src/app/globals.css` | `src/styles/globals.css` |
| Como a fonte entra | `next/font` | `@fontsource` ou `@font-face` |

Confira em qual stack você está antes de criar o arquivo ou carregar fonte. O resto — tokens, `clamp()`, regras de classe — é idêntico.

As três regras que mandam em tudo:

1. **Zero valores arbitrários.** Nada de `text-[32px]`, `bg-[#00526b]`, `p-[13px]`, `w-[347px]`, `gap-[7px]`. Se o valor não existe, ou você usa o mais próximo da escala, ou cria um token no `@theme`. Colchete no `className` é erro.
2. **Cor que não existe no Tailwind vira token nomeado no `@theme`.** Nunca hex solto no JSX.
3. **Texto que escala é `clamp()` via token.** Para tamanho fixo, a escala nativa do Tailwind (`text-sm`, `text-base`…) está liberada.

## Arquivo base

`templates/globals.css` (nesta skill) é o ponto de partida de **todo projeto novo**. Copie para `src/app/globals.css` (Next) ou `src/styles/globals.css` (Vite).

Ele é um **modelo, não um contrato**. Ao montar o tema do projeto:

1. **Troque os valores** pelas cores e pela fonte da marca.
2. **Apague todo token que o projeto não usa.** Se o site não tem cor de destaque, `--color-accent` sai. Se não existe botão fantasma, `--color-secondary-dark` sai. Não deixe token órfão "por precaução".
3. **Acrescente o que faltar**, dentro do grupo certo (marca / texto / superfície / tipografia).
4. **Mantenha os grupos e a ordem** dos comentários — é o que faz o arquivo continuar legível no mês seis.

Por que apagar importa: token que ninguém usa vira dúvida na próxima pessoa ("posso usar esse? é o certo pra esse caso?"), engorda o CSS gerado e faz a paleta parecer maior do que é. **O tema deve ser um retrato do site, não um catálogo.**

Ao entrar num projeto que já existe, **leia o `globals.css` dele primeiro** e trabalhe com os tokens que já estão lá — não recrie o tema.

### Antes de escrever o tema: levante as cores do site

Todo projeto é um **site de um cliente**, com identidade própria. As cores do template são placeholder — **nunca entregue um site com elas**. Antes de tocar no `globals.css`, tenha a paleta real em mãos.

**Onde buscar**, nesta ordem:

1. **Figma / arquivo de design** — a fonte mais confiável. Pegue os hex direto das camadas ou dos estilos de cor.
2. **Manual de marca ou logo** — se não há Figma, o logo entrega a primária. Extraia o hex do SVG/PNG.
3. **Site atual do cliente**, em caso de redesign — inspecione e anote.
4. **Pergunte ao designer.** Se nada disso existe, **pergunte antes de inventar**. Cor errada é retrabalho em todo componente já escrito.

**O mínimo pra começar**, mesmo em projeto simples:

| Precisa de | Token |
|---|---|
| Cor principal da marca (botão, link, destaque) | `--color-primary` |
| Estado hover dela | `--color-primary-hover` |
| Cor do texto de corpo | `--color-body` |
| Cor de título | `--color-heading` |
| Cor de borda / divisor | `--color-border` |

Se o designer deu **só uma cor**, não trave: derive o `hover` escurecendo ou clareando 10–15% e **avise que foi derivado**, pra ele validar. O resto (texto, borda) pode sair de neutros até a definição chegar.

**Confira o contraste** antes de fixar: corpo de texto precisa de 4.5:1 contra o fundo, título grande 3:1. Cor bonita que não se lê é bug de acessibilidade, não escolha estética — se a paleta do cliente não passa, aponte e proponha o ajuste.

### Ordem do arquivo

```
1. Reset                    box-sizing, margin de heading/parágrafo
2. :root                    valores crus (sem --color-), referenciados pelo @theme
3. body                     cor e fonte padrão
4. @theme inline
   ├── Fonte
   ├── Cores · marca        primary, secondary, accent
   ├── Cores · texto        body, heading, muted, disabled
   ├── Cores · superfície   background, surface, border
   ├── Tipografia fluida    --text-responsive-* (maior → menor)
   └── Tipografia rótulos   subheading, eyebrow (tamanho fixo)
```

---

## Regra 1 — Nada de valor arbitrário

A sintaxe de colchete do Tailwind (`[...]`) não é usada na Atom6. Vale para **tudo**: cor, tamanho de texto, espaçamento, largura, altura, border-radius, z-index.

```jsx
<div className="p-[13px] gap-[7px] w-[347px] text-[17px] bg-[#00526b] rounded-[10px]">  {/* ❌ */}
<div className="p-3 gap-2 w-full text-responsive-md bg-primary rounded-lg">            {/* ✅ */}
```

Quando o valor exato do Figma não existe na escala, a ordem de decisão é:

1. **Use o mais próximo da escala.** 13px vira `p-3` (12px). Design não quebra por 1px, e a escala mantém o ritmo visual do projeto inteiro.
2. **É um valor da identidade que se repete?** Vira token no `@theme` (`--spacing-section`, `--radius-card`, `--color-*`, `--text-*`) e passa a ter nome.
3. **É medida de layout?** Prefira a solução fluida — `w-full`, `max-w-*`, `flex-1`, `grid`, `aspect-*` — em vez de fixar pixel.

Exceção: valores que **não são de design** e não têm escala possível — `top-[52px]` para casar com a altura de um header medido, `translate-y-[2px]` de ajuste ótico. São raros; quando usar, deixe um comentário dizendo por quê. Se aparecer três vezes, virou token.

---

## Regra 2 — Cores

Toda cor da marca ou da UI vira uma variável `--color-<nome>` dentro de `@theme inline`. O Tailwind gera automaticamente os utilitários a partir do nome:

`--color-primary-hover` → `bg-primary-hover`, `text-primary-hover`, `border-primary-hover`, `hover:bg-primary-hover`, `ring-primary-hover`…

### Nomes são semânticos, não descritivos

O nome diz **o papel** da cor, não a cor em si.

| Faça | Não faça |
|---|---|
| `--color-primary` | `--color-azul-escuro` |
| `--color-muted` | `--color-cinza-2` |
| `--color-surface-hover` | `--color-fafafa` |
| `--color-accent` | `--color-blue` |

**Nome de token é em inglês**, como todo o resto do código — `--color-heading`, não `--color-titulo`. A regra completa de idioma está na skill `nextjs-base` (e vale igual no `vite-base`); aqui ela vale para tokens do `@theme` e para CSS variables criadas à mão.

Isso não é só estética. Nome de cor **descreve a aparência de hoje** — no dia em que o azul da marca virar verde, `--color-blue: #1a7f3c` é uma mentira que fica no código pra sempre. Nome semântico sobrevive à troca de identidade. E lembre que o template é um **exemplo**: o próximo cliente pode não ter azul nenhum.

### Nunca use nome da paleta do Tailwind

Proibido nomear token com `blue`, `red`, `green`, `gray`, `slate`, `zinc`, `neutral`, `stone`, `amber`, `yellow`, `lime`, `emerald`, `teal`, `cyan`, `sky`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose`, `orange`. Dois problemas concretos:

**1. Ambiguidade no uso.** `--color-blue` gera `text-blue`, que fica colado no `text-blue-500` nativo. Ninguém sabe qual é o da marca e qual é o do Tailwind.

**2. Sobrescrita silenciosa da paleta.** Variável crua no `:root` com nome da paleta **rouba a cor nativa no site inteiro**. O `:root` vem depois do `@import "tailwindcss"`, então o seu valor ganha:

```css
/* ❌ isso muda o bg-gray-50 de TODO o projeto */
:root {
  --color-gray-50: #fafafa;
}
```

```css
/* ✅ variável crua não leva o prefixo --color- */
:root {
  --surface-base: #fafafa;
}
```

Repare no padrão do template: `--background`, `--foreground`, `--surface-base` — valores crus **sem** `--color-`. O prefixo `--color-` é reservado para o que vira token dentro do `@theme`.

Famílias já estabelecidas — siga elas ao adicionar cor nova:

- `--color-primary` / `-hover` — ação principal
- `--color-secondary` / `-dark` — apoio
- **cor de texto** — `--color-body` (corpo), `--color-heading` (título), `--color-muted` (secundário), `--color-disabled`, `--color-accent` (destaque)
- `--color-surface-*` — fundo de elemento interativo (`hover`, `active`)
- `--color-background*` — fundo de página/seção
- `--color-border` — bordas e divisores

> As cores do template são **exemplo**, não obrigação. Cada projeto tem a sua identidade — o que se mantém é a **estrutura de nomes**, não os valores nem a lista exata de tokens.

> Cor de texto **não leva prefixo `text-` no token**. O utilitário já adiciona: `--color-muted` → `text-muted`. Nomear `--color-text-muted` geraria `text-text-muted`, que é o mesmo resultado com o dobro da leitura.
>
> Atenção a um vizinho: `text-heading` é **cor**, `text-heading-xs` é **tamanho**. O IntelliSense diferencia (um mostra bolinha de cor, o outro mostra o `clamp`), mas vale saber que os dois existem.

### `:root` vs `@theme inline`

- `:root` guarda o **valor bruto** de cores que podem variar por contexto (tema claro/escuro, white-label).
- `@theme inline` guarda os **tokens** que viram utilitário. Com `inline`, `--color-background: var(--background)` gera `bg-background` apontando direto pra `var(--background)` — então trocar `--background` no `:root` troca a cor em tempo real, sem rebuild.
- Cor fixa de marca pode ir com o hex direto no `@theme` (é o caso de `--color-primary`).

### Proibido

```jsx
<div className="bg-[#00526b] text-[#444]">        {/* ❌ hex arbitrário */}
<div style={{ color: "#00526b" }}>                 {/* ❌ style inline */}
<div className="text-slate-700">                   {/* ❌ paleta padrão onde existe token da marca */}
<div className="bg-primary/[0.87]">                {/* ❌ opacidade arbitrária — use bg-primary/90 */}
```

```jsx
<div className="bg-primary text-muted">       {/* ✅ */}
```

Precisa de uma cor que ainda não existe? **Adicione o token no `@theme` primeiro**, depois use. Se a cor aparece uma única vez e não tem papel semântico, ainda assim prefira o token — ela sempre volta.

Cinzas neutros de UI (`gray-*`, `neutral-*`) do próprio Tailwind podem ser usados direto quando não fazem parte da identidade. Qualquer coisa ligada à marca → token.

---

## Regra 3 — Tipografia

Todo tamanho de texto sai de uma classe pronta: ou um **token `clamp()` do tema**, ou a **escala nativa do Tailwind**. Nunca um valor arbitrário.

Como escolher:

| Situação | Use |
|---|---|
| Título, hero, corpo de texto — qualquer coisa que deve crescer no desktop | **Token `clamp()`** — `text-responsive-*`, `text-heading-xs` |
| Texto pequeno de UI que não muda entre mobile e desktop (tag, legenda, helper, label de input, badge) | **Escala nativa** — `text-xs`, `text-sm`, `text-base` |
| Tamanho que precisa existir e não está em nenhuma das duas | **Novo token `clamp()`** no `@theme` (fórmula abaixo) |

O clamp existe pra você **não precisar** empilhar `text-2xl md:text-4xl lg:text-5xl`. Se o texto escala, resolve com token — é uma classe só e a transição fica fluida, não em degraus. Escalar fonte por breakpoint só se justifica quando o salto é intencional (ex.: um número de destaque que muda de papel no desktop).

### Escala do tema

| Token | Classe | Tamanho | Uso |
|---|---|---|---|
| `--text-responsive-2xl` | `text-responsive-2xl` | 32 → 56px | Hero / H1 de destaque |
| `--text-responsive-xl` | `text-responsive-xl` | 28 → 48px | H1 / título de seção |
| `--text-responsive-lg` | `text-responsive-lg` | 26 → 40px | H2 |
| `--text-responsive-sm` | `text-responsive-sm` | 22 → 32px | H3 |
| `--text-responsive-md` | `text-responsive-md` | 16 → 18px | Corpo de texto |
| `--text-heading-xs` | `text-heading-xs` | 18 → 22px | Título de card |
| `--text-subheading` | `text-subheading` | 20px fixo | Rótulo de bloco ("Conteúdos relacionados") |
| `--text-eyebrow` | `text-eyebrow` | 12px fixo | Tag, categoria, data de card — caixa alta |

`text-eyebrow` e `text-subheading` já trazem `line-height`, `letter-spacing` e `font-weight` embutidos (sufixo `--`), então não precisa repetir essas classes.

Textos micro (12–14px: legenda, tag, helper) podem ser **fixos** — a diferença entre mobile e desktop não justifica o clamp, e aí `text-xs` / `text-sm` do Tailwind resolve. Do corpo de texto pra cima, **clamp**.

### Criando um token novo

Só crie se nenhum existente serve. A faixa de interpolação padrão é **768px → 1440px** de viewport.

```
slope_vw     = (max_px - min_px) / (1440 - 768) * 100
intercept_px = min_px - (slope_vw / 100) * 768

--text-<nome>: clamp(<min_rem>, <intercept_rem> + <slope_vw>vw, <max_rem>);
/* min_px → max_px */
```

Exemplo, 20 → 30px:
- `slope = 10 / 672 * 100 = 1.4881vw`
- `intercept = 20 - 0.014881 * 768 = 8.5714px = 0.5357rem`
- `--text-responsive-x: clamp(1.25rem, 0.5357rem + 1.4881vw, 1.875rem); /* 20px → 30px */`

Sempre deixe o comentário `/* min → max */` na linha seguinte, como no arquivo base.

> `--text-responsive-sm` foi gerado com outra faixa (≈391px → 1280px). É a exceção, não o padrão — para tokens novos use 768 → 1440.

### Proibido

```jsx
<p  className="text-[17px]">                         {/* ❌ tamanho arbitrário */}
<h1 className="text-[clamp(2rem,4vw,3.5rem)]">       {/* ❌ clamp inline em vez de token */}
<h1 className="text-3xl md:text-5xl lg:text-6xl">    {/* ❌ existe token clamp pra isso */}
```

```jsx
<h1   className="text-responsive-xl text-heading font-bold">  {/* ✅ título escala */}
<span className="text-xs text-muted">                         {/* ✅ micro-texto fixo */}
```

---

## Como escrever as classes

- **Mobile-first sempre.** Base sem prefixo é o mobile; `sm:` `md:` `lg:` `xl:` só somam. Nunca `lg:`-first.
- **Breakpoints são para layout**: grid, flex-direction, espaçamento, visibilidade. Tipografia raramente precisa deles — o clamp já resolve.
- **Espaçamento sai da escala** (`p-4`, `gap-6`, `mt-12`, `space-y-8`). Espaçamento de seção que se repete no projeto inteiro vira token (`--spacing-section`) em vez de um número mágico repetido. Os valores default de altura, padding e gap de **controle e formulário** estão tabelados na skill `ui-components` — consulte lá em vez de escolher no olho.
- **Ordem das classes é automática.** O `prettier-plugin-tailwindcss` ordena tudo no save/format — não perca tempo organizando na mão nem discuta ordem em review. Escreva na ordem que pensar; o Prettier normaliza. (Config em `nextjs-base` ou `vite-base`; o `tailwindStylesheet` precisa apontar pro `globals.css` do stack, senão os tokens do `@theme` ficam fora de ordem.)
- **Estado com token**: `hover:bg-surface-hover`, `active:bg-surface-active`, `disabled:text-disabled` — os tokens já existem pra isso.
- **Repetiu 3x, virou componente.** Não copie um bloco de 12 classes pra três lugares — extraia pra `/components`.
- **Sem `@apply`.** Se um conjunto de classes se repete, o lugar dele é um componente React, não uma classe CSS. Exceção: estilo em HTML que você não controla (`dangerouslySetInnerHTML`, `prose`).
- Classe condicional em JS: monte com `twMerge()` (abaixo) — nunca concatene nome de classe parcial (`text-${color}-500` não é detectado pelo Tailwind e não gera CSS).

---

## Composição de classes — `twMerge()` e `tv()`

Duas bibliotecas, instaladas em todo projeto:

```bash
npm i tailwind-merge tailwind-variants
```

O problema que elas resolvem é o mesmo: **classe do Tailwind não sobrescreve classe do Tailwind**. `"bg-primary bg-secondary"` deixa as duas no HTML e quem ganha é a ordem do CSS, não a que você escreveu por último. Juntar classe com template literal produz esse bug silenciosamente.

Importe direto das bibliotecas — sem wrapper, sem arquivo de setup:

```js
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";
```

### `twMerge()` — condicional, estado e prop `className`

Use sempre que as classes forem montadas em runtime:

```jsx
import { twMerge } from "tailwind-merge";

// ✅ condicional e estado
<button className={twMerge("rounded-lg px-6 py-3", isActive && "bg-primary text-white", isDisabled && "text-disabled")} />

// ✅ prop className — deixa o componente ser ajustado de fora sem quebrar
export default function Card({ className, children }) {
  return <div className={twMerge("rounded-lg border border-border p-6", className)}>{children}</div>;
}
```

Todo componente reutilizável deve **aceitar `className` e passar por `twMerge()`**. É isso que permite `<Card className="bg-primary" />` realmente sobrescrever o fundo padrão.

Aceita string, ternário, `&&`, array e valores falsy. **Não aceita objeto no estilo `clsx`** — `twMerge("p-4", { "bg-primary": true })` retorna só `p-4` e a classe some:

```jsx
twMerge("p-4", isActive && "bg-primary")     // ✅
twMerge("p-4", { "bg-primary": isActive })   // ❌ silenciosamente ignorado
```

> **Não passe token de tamanho de texto pelo merge.** O `twMerge` só conhece as classes nativas: como `text-responsive-xl` não está na lista dele, ele chuta que é cor e descarta o token quando há uma cor junto — `twMerge("text-responsive-xl text-heading")` devolve só `text-heading`. Na prática isso quase não aparece, porque o `clamp()` existe justamente pra o tamanho não precisar de troca em runtime: deixe o tamanho fixo no `className` e use o merge para fundo, espaçamento, borda e condicional. `text-` é o único prefixo com esse risco — `border-border border` convivem sem problema.

### `tv()` — componentes com muitas variantes

Quando o componente tem **2+ eixos de variação** (variante × tamanho, tipo × estado), pare de encadear ternário e use `tv()`:

```jsx
// src/components/ui/Button.jsx
import { tv } from "tailwind-variants";

const button = tv({
  base: "inline-flex items-center justify-center rounded-lg font-medium transition-colors",
  variants: {
    variant: {
      primary: "bg-primary text-white hover:bg-primary-hover",
      secondary: "bg-secondary text-white hover:bg-secondary-dark",
      ghost: "bg-transparent text-primary hover:bg-surface-hover",
    },
    size: {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-responsive-md",
    },
  },
  defaultVariants: { variant: "primary", size: "md" },
});

export default function Button({ variant, size, className, ...props }) {
  return <button className={button({ variant, size, class: className })} {...props} />;
}
```

Repare no `class: className` — é assim que o `tv()` recebe o override de fora e resolve o conflito. **Não** use `className` como chave; a propriedade é `class`.

**Um eixo só, duas opções?** Não precisa de `tv()` — `twMerge()` com ternário resolve. `tv()` compensa a partir de 2 eixos, ou quando aparecem `compoundVariants` (combinações que precisam de estilo próprio).

---

## Evite `style` inline ao máximo

Estilo mora no `className`. `style={{}}` fura o design system inteiro: não passa por token, não responde a breakpoint, não aceita `hover:`/`focus:`, e ganha de qualquer classe na especificidade — então quem for mexer depois não consegue sobrescrever pelo Tailwind.

```jsx
<div style={{ padding: 24, color: "#444", display: "flex" }}>   {/* ❌ */}
<div className="flex p-6 text-body">                            {/* ✅ */}
```

Se você está escrevendo `style` porque o valor não existe na escala, o problema é outro: volte pra **Regra 1** e resolva com token ou com o valor mais próximo. Trocar `p-[13px]` por `style={{ padding: 13 }}` não conserta nada — só esconde.

**A única exceção** é valor que só existe em runtime e é genuinamente contínuo — largura de barra de progresso, posição vinda de scroll/drag, cor que chega de uma API. Nesses casos, não jogue a propriedade direto: passe uma **CSS variable** e deixe a classe do Tailwind consumir, assim o estilo continua no design system e o inline carrega só o número.

```jsx
{/* ✅ valor dinâmico, estilo ainda no className */}
<div
  className="h-2 rounded-full bg-primary transition-[width]"
  style={{ width: `${progress}%` }}
/>

{/* ✅ cor definida em runtime, via variable */}
<section
  className="bg-(--section-bg) py-16"
  style={{ "--section-bg": section.backgroundColor }}
/>
```

Estado (aberto/fechado, ativo, selecionado) **nunca** é `style` — é troca de classe com `twMerge()` ou `data-*` + variante (`data-[state=open]:rotate-180`).

## Fontes

A regra que vale nos dois stacks: **fonte é self-hostada, baixada em build**. Nunca `<link>` pro Google Fonts, nunca `@import` de fonte no CSS — os dois criam request externo e CLS.

O **como** muda conforme o stack:

- **Next** → `next/font` (seções abaixo).
- **Vite** → `@fontsource` ou `@font-face` local (seção "Fontes no Vite", mais adiante).

### Next — preferência: Google Fonts

Se a fonte existe no Google Fonts, **use ela por lá** — é o caminho padrão, sem arquivo pra gerenciar:

```js
// src/app/layout.js
import { Roboto } from "next/font/google";
const roboto = Roboto({ subsets: ["latin"], weight: ["400","500","700"], variable: "--font-roboto" });
// <html className={roboto.variable}>
```

Antes de assumir que a fonte não está lá, **confira no fonts.google.com** — muita fonte que parece proprietária tem equivalente ou está no catálogo (Inter, Poppins, Montserrat, DM Sans, Manrope, Plus Jakarta Sans…). Se o designer pediu uma paga, vale sugerir a alternativa Google mais próxima e deixar ele decidir.

### Next — fonte fora do Google Fonts

Se a fonte é proprietária/comprada e não tem no Google, **pare e peça os arquivos ao designer** antes de codar. Não invente substituto silenciosamente nem deixe fallback genérico pra "resolver depois".

O que pedir:
- Arquivos em **`.woff2`** (se vier `.ttf`/`.otf`, converta — `.woff2` é bem menor)
- Todos os pesos e estilos que o design usa (400, 500, 700, itálico…)
- Confirmação de que há **licença para uso web** no projeto

Onde colocar: **`src/app/fonts/`** — junto do código, não em `public/`. Em `public/` o arquivo fica exposto e sem hash de build.

```
src/app/
├── fonts/
│   ├── Marca-Regular.woff2
│   ├── Marca-Medium.woff2
│   └── Marca-Bold.woff2
└── layout.js
```

```js
// src/app/layout.js
import localFont from "next/font/local";

const marca = localFont({
  src: [
    { path: "./fonts/Marca-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Marca-Medium.woff2",  weight: "500", style: "normal" },
    { path: "./fonts/Marca-Bold.woff2",    weight: "700", style: "normal" },
  ],
  variable: "--font-marca",
  display: "swap",
});
// <html className={marca.variable}>
```

### Fontes no Vite

Não existe `next/font` aqui. O equivalente é o **`@fontsource`**: pacote npm com a fonte do Google já em `.woff2`, self-hostada e versionada junto com o projeto.

```bash
npm i @fontsource-variable/roboto     # versão variable, quando existe
# ou, para pesos fixos:
npm i @fontsource/roboto
```

```css
/* src/styles/globals.css — antes do @import "tailwindcss" */
@import "@fontsource-variable/roboto";

@import "tailwindcss";
```

> Este `@import` é a exceção à regra de não importar fonte no CSS: o arquivo vem do `node_modules` e é processado pelo build — não é request externo. `@import url("https://fonts.googleapis.com/...")` continua proibido.

Com pesos fixos, importe **só os que o design usa** — cada peso é um arquivo:

```css
@import "@fontsource/roboto/400.css";
@import "@fontsource/roboto/500.css";
@import "@fontsource/roboto/700.css";
```

**Fonte proprietária** (sem `@fontsource`): peça os `.woff2` ao designer, coloque em `src/assets/fonts/` e declare à mão:

```css
@font-face {
  font-family: "Marca";
  src: url("@/assets/fonts/Marca-Regular.woff2") format("woff2");
  font-weight: 400;
  font-display: swap;
}
```

Um bloco por peso. Em `src/assets/` o arquivo ganha hash de build; em `public/` ficaria exposto e sem cache versionado.

Para evitar CLS — que o `next/font` resolveria sozinho — pré-carregue a fonte da primeira dobra no `index.html`:

```html
<link rel="preload" as="font" type="font/woff2" href="/fonts/Marca-Regular.woff2" crossorigin />
```

### Registrando no tema

Qualquer que seja o caminho, o final é igual — a fonte vira token no `@theme` e o `body` aplica a padrão:

```css
/* Next: a variable vem do next/font */
@theme inline {
  --font-roboto: var(--font-roboto);
}
```

```css
/* Vite: o nome vem do @fontsource ou do @font-face */
@theme inline {
  --font-roboto: "Roboto Variable", sans-serif;
}
```

```css
body {
  font-family: var(--font-roboto), sans-serif;
}
```

O `body` já aplica a fonte padrão no `globals.css` — só use `font-roboto` onde precisar sobrescrever.

## Outras diretivas v4 (quando precisar)

- `@custom-variant` — variante própria (ex.: `@custom-variant dark (&:where(.dark, .dark *));`)
- `@utility` — utilitário próprio, quando um padrão não é componível com o que existe
- `@plugin "..."` — plugin (ex.: `@tailwindcss/typography`)
- `@theme` sem `inline` — quando o token não precisa referenciar outra variável

Use com parcimônia. 95% do trabalho é token de cor + token de texto + utilitário nativo.

---

## Checklist antes de entregar

- [ ] **Zero colchetes no `className`** — nenhum `[...]` de cor, texto, spacing, largura ou radius
- [ ] Nenhum hex ou `rgb()` no JSX — tudo token
- [ ] Nenhum `style={{}}` — exceto valor de runtime, e ainda assim via CSS variable
- [ ] Todo texto ≥16px usa token com `clamp()`; micro-texto fixo usa a escala nativa
- [ ] Espaçamentos saem da escala do Tailwind
- [ ] Cores novas foram adicionadas ao `@theme` com nome semântico, no grupo certo
- [ ] Nenhum token do template sobrou sem uso no `globals.css`
- [ ] Layout começa no mobile e sobe com `sm:`/`md:`/`lg:`
- [ ] Classe montada em runtime passa por `twMerge()` — nunca template literal
- [ ] Componente reutilizável aceita `className` e repassa via `twMerge()`
- [ ] Componente com 2+ eixos de variação usa `tv()`
- [ ] Nenhum token `text-responsive-*` passando pelo `twMerge()` junto com cor
- [ ] Bloco repetido virou componente
- [ ] Fonte self-hostada pelo caminho do stack — Next: `next/font` (Google, senão `.woff2` em `src/app/fonts/`); Vite: `@fontsource`, senão `@font-face` com `.woff2` em `src/assets/fonts/`. Nunca `<link>` nem `@import` de URL externa
- [ ] Contraste de texto sobre fundo passa em AA (4.5:1 para corpo, 3:1 para título grande)
