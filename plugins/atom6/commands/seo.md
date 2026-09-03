---
description: Passe final de SEO da Atom6 — varre as rotas do projeto Next.js e escreve os metadados de todas as páginas. ACIONE APENAS quando o usuário digitar explicitamente o comando /atom6:seo. Nunca acione por conta própria.
---

Rode o **passe final de SEO** da Atom6 Studio neste projeto.

Carregue a skill `atom6:seo-metadata` e siga o que está lá: varra todas as rotas, escreva `metadata` de cada página (title, description, Open Graph, Twitter, canonical), o favicon/OG image, o `sitemap.js` e o `robots.js`.

Antes de começar, duas checagens:

1. **É um projeto Next?** Se for Vite, não há SEO a fazer — só o `<title>` e a description do `index.html`. Diga isso ao designer e pare por aqui.
2. **A POC está pronta e aprovada?** Este passe assume que as rotas pararam de mudar. Se ainda tem tela pra construir, avise que é cedo: metadado escrito agora vira retrabalho a cada rota nova. Só siga se o designer confirmar.

Se o projeto tiver um `CLAUDE.md` na raiz, leia antes — nome, objetivo e identidade do projeto saem dali e alimentam os textos dos metadados.
