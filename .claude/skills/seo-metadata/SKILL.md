---
name: seo-metadata
description: Passe final de SEO da Atom6 — varre todas as rotas do projeto Next.js e cria/ajusta os metadados de cada página (title, description, Open Graph, Twitter, canonical, favicon/OG image, sitemap.js e robots.js). Roda DEPOIS que a POC está pronta e aprovada, nunca durante a construção das telas. Use quando o pedido for "rodar o SEO", "ajustar os metadados", "preparar pra publicar" ou quando o projeto entrar na fase final.
---

# SEO & metadados — passe final Atom6

Esta skill é o **último passe** de um projeto. Ela existe para separar duas coisas que não devem competir:

- **Durante a POC** → tela, layout, componente, dados mockados. Metadado é uma linha de placeholder e ponto.
- **Depois da POC aprovada** → esta skill, que percorre o projeto inteiro e faz o SEO de verdade, de uma vez só.

> **Só vale para projeto Next.** Em SPA (Vite + React Router, skill `vite-base`) não existe metadado por rota — o que há é o `<title>` e a description do `index.html`, escritos à mão. Se o projeto é Vite, esta skill não se aplica: diga isso e pare.

> **Não rode isto no meio da construção.** Se as telas ainda estão mudando de nome, de rota e de conteúdo, todo metadado escrito agora vira retrabalho. Se alguém pedir SEO antes da POC fechar, diga que é a etapa final e siga com o front.

## Pré-requisitos

Antes de começar, confirme que:

1. **As rotas estão estáveis** — nenhuma página vai nascer, sumir ou trocar de slug.
2. **O conteúdo real (ou quase) está nas telas** — description tirada de lorem ipsum não serve.
3. **`npm run build` passa.** Se não passa, conserte antes; metadado em projeto quebrado não é verificável.

## Informações que você precisa coletar

Pergunte tudo de uma vez, em uma única mensagem — são poucas coisas e travar a cada item irrita:

| O quê | Para quê | Se não tiver |
|---|---|---|
| **Nome do site/marca** | `title.template`, `openGraph.siteName` | pega do conteúdo da home |
| **URL final de produção** | `metadataBase`, canonical, sitemap | usa placeholder — ver abaixo |
| **Descrição do negócio (1–2 frases)** | description da home | escreve a partir do hero e confirma |
| **Imagem de compartilhamento (OG)** | preview em WhatsApp/LinkedIn | gera um placeholder 1200×630 e marca como pendência |
| **Favicon / logo** | `icon`, `apple-icon` | mantém o placeholder e marca como pendência |
| **O site deve ser indexado?** | `robots` | assume que sim |

### Quando não existe domínio ainda

Isso é comum — domínio e deploy ficam com o dev depois. Não trave a skill por causa disso: centralize a URL em **um único lugar** (copie `templates/site.js`) e deixe explícito que é pendência.

```js
// src/lib/site.js
export const site = {
  name: "Nome do Projeto",
  // TODO: trocar pelo domínio final antes do deploy
  url: "https://exemplo.com.br",
  description: "Descrição curta do negócio, em uma ou duas frases.",
  locale: "pt_BR",
};
```

Todo metadado passa a ler daqui. Na hora do deploy, o dev troca **uma linha** e o site inteiro fica correto — canonical, OG e sitemap juntos.

## Ordem de execução

### 1. Mapear as rotas

Levante toda página real do projeto antes de escrever qualquer coisa:

```bash
find src/app -name "page.js" -o -name "page.jsx"
```

Monte a lista de rotas (URL → arquivo) e trate cada uma como um item a fechar. Rota dinâmica (`[slug]`) entra na lista como caso de `generateMetadata`, não como metadado fixo.

### 2. Layout raiz — a base de tudo

`src/app/layout.js` é onde mora o que vale para o site inteiro:

```jsx
import { site } from "@/lib/site";

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — o que o site faz`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: `${site.name} — o que o site faz`,
    description: site.description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — o que o site faz`,
    description: site.description,
    images: ["/og.jpg"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport = {
  themeColor: "#0f172a",
};
```

Pontos que quebram na prática:

- **`metadataBase` é obrigatório.** Sem ele, `openGraph.images: "/og.jpg"` vira URL relativa e o preview não carrega em rede social nenhuma. O build ainda avisa `metadataBase property in metadata export is not set`.
- **`title.template`** aplica o sufixo em toda página filha automaticamente — cada página escreve só o próprio nome. `title.default` é o da home.
- **`viewport` e `themeColor` têm export próprio** desde o Next 14. Dentro de `metadata` são ignorados e o build reclama.
- **`lang="pt-BR"`** no `<html>` — confira, o scaffold vem `en`.

### 3. Uma página, um metadado

Toda rota estática ganha o seu `export const metadata`. É Server Component, então basta exportar do próprio `page.js`:

```jsx
// src/app/quem-somos/page.js
export const metadata = {
  title: "Quem somos",                      // vira "Quem somos | Nome do Projeto"
  description: "Conheça a história e o time por trás da marca.",
  alternates: { canonical: "/quem-somos" },
};

export default function AboutPage() { /* ... */ }
```

Regras do conteúdo:

- **Title** — até ~60 caracteres contando o sufixo do template. Descreve a página, não o site (o sufixo já faz isso). Sem repetir a marca no meio.
- **Description** — 120 a 160 caracteres, frase de verdade, em pt-BR, com o benefício ou o assunto da página. Não é lista de palavra-chave.
- **Única por página.** Duas páginas com a mesma description é o erro mais comum e o Google trata como conteúdo duplicado.
- **Canonical em toda página**, sempre relativa (`/quem-somos`) — o `metadataBase` completa.

Página que precisa de `"use client"` **não pode exportar `metadata`**. Nesse caso o metadado vai no `layout.js` da pasta, ou o `page.js` vira server e o trecho interativo é extraído pra um componente client.

### 4. Rotas dinâmicas

`[slug]` usa `generateMetadata`, que recebe os mesmos `params` da página:

```jsx
// src/app/blog/[slug]/page.js
import { getPost } from "@/lib/mocks/posts";

export async function generateMetadata({ params }) {
  const { slug } = await params;             // params é Promise no Next 15+
  const post = getPost(slug);

  if (!post) return { title: "Post não encontrado" };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.cover, width: 1200, height: 630, alt: post.title }],
    },
  };
}
```

Com dados mockados isso funciona igual — a função lê do mock em vez da API. Quando o backend entrar, muda só a origem do dado.

### 5. Arquivos de imagem

O App Router resolve por **convenção de nome**, sem nenhuma tag manual:

| Arquivo em `src/app/` | Vira |
|---|---|
| `favicon.ico` | favicon do site |
| `icon.png` (ou `.svg`) | ícone moderno, múltiplos tamanhos |
| `apple-icon.png` (180×180) | ícone de iOS |
| `opengraph-image.jpg` (1200×630) | OG image daquela rota |
| `twitter-image.jpg` (1200×630) | card do X/Twitter |

Colocado na raiz de `src/app/` vale pro site inteiro; dentro de uma pasta de rota, sobrescreve só ali. Nunca escreva `<link rel="icon">` na mão.

Sem arte definitiva: gere um OG placeholder 1200×630 com o nome do projeto, deixe funcionando, e **liste como pendência na entrega** em vez de omitir.

### 6. `sitemap.js` e `robots.js`

Dois arquivos na raiz de `src/app/`. Copie `templates/sitemap.js` e `templates/robots.js` desta skill e ajuste a lista de rotas — ela sai direto do mapeamento do passo 1.

```js
// src/app/sitemap.js
import { site } from "@/lib/site";

const routes = ["", "/quem-somos", "/servicos", "/contato"];

export default function sitemap() {
  return routes.map((route) => ({
    url: `${site.url}${route}`,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
```

```js
// src/app/robots.js
import { site } from "@/lib/site";

export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
```

Não use `lastModified: new Date()` — muda a cada build e polui o diff sem informar nada real.

Se o cliente **não** quiser o site indexado ainda (comum enquanto é POC), troque para `rules: { userAgent: "*", disallow: "/" }` e ponha `robots: { index: false, follow: false }` no layout raiz. **Avise explicitamente na entrega** que o site está bloqueado para buscadores — esquecer disso ligado é o erro que mata o SEO de um lançamento.

### 7. Dados estruturados (só quando cabe)

JSON-LD entra quando o conteúdo tem um tipo claro — negócio local, artigo, produto, FAQ. Não force em landing page genérica.

```jsx
export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ... */}
    </>
  );
}
```

## Verificação antes de entregar

```bash
npm run build
```

O build lista todas as rotas e falha em erro de metadado. Depois dele, confira:

- [ ] `src/lib/site.js` existe e é a **única** fonte de nome/URL/descrição
- [ ] `metadataBase` no layout raiz, sem warning de `metadataBase not set` no build
- [ ] `lang="pt-BR"` no `<html>`
- [ ] `title.template` + `title.default` no raiz; toda página filha com title curto e próprio
- [ ] **Toda** rota da lista do passo 1 tem `metadata` ou `generateMetadata` — nenhuma sobrou
- [ ] Nenhuma description repetida entre páginas, todas em 120–160 caracteres
- [ ] `alternates.canonical` em cada página
- [ ] OG + Twitter configurados e a imagem 1200×630 existindo (mesmo que placeholder)
- [ ] `favicon.ico` / `icon.png` / `apple-icon.png` no lugar
- [ ] `sitemap.js` com todas as rotas públicas; `robots.js` coerente com a decisão de indexação
- [ ] Se o site está bloqueado pra buscadores, isso foi **dito na entrega**
- [ ] Pendências de arte (OG, favicon) e o `TODO` do domínio listados na entrega

## O que esta skill NÃO faz

Deploy, domínio, DNS, Google Analytics, Search Console, tag manager. Tudo isso é pós-entrega e fica com o dev.
