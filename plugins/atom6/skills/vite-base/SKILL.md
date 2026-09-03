---
name: vite-base
description: Padrão de projeto Vite + React Router da Atom6 Studio — a variação SPA, para quando o projeto NÃO precisa de SEO (dashboard, painel interno, app logado, protótipo). Cobre criação do projeto, limpeza pós-scaffold, Tailwind v4 via plugin do Vite, alias @/, estrutura de pastas, roteamento com React Router v7 (rotas aninhadas, dinâmicas, 404, lazy), o padrão obrigatório de login (AuthContext + ProtectedRoute, mesmo com usuário mockado) e a camada de dados — Axios, TanStack Query e Zustand, com mock simulando a API atrás de uma flag. Use quando o designer disser que não é site/landing page e não há necessidade de indexação, quando o projeto tiver área logada, ou ao montar consumo de API/estado global num projeto Vite. Restrita a projetos no padrão da Atom6 — os iniciados com /atom6:novo-projeto ou cujo CLAUDE.md aponta para estas skills; não use em projeto de outro padrão.
---

# Vite + React Router — base SPA Atom6

Esta é a **variação sem SEO** do padrão da casa. Quando o projeto é público e precisa aparecer no Google, o caminho é a skill `nextjs-base` — não esta.

> **Estilização não é assunto daqui.** Cor, tipografia, spacing e classes → carregue a skill `tailwind-v4`. Ela vale igual nos dois stacks; só muda **onde o `globals.css` mora** e **como a fonte entra** (as duas diferenças estão marcadas lá).

## Quando usar este stack (e quando não)

| Vai para **Vite** (esta skill) | Vai para **Next** (`nextjs-base`) |
|---|---|
| Dashboard, painel administrativo | Site institucional, landing page |
| App atrás de login | E-commerce, blog, portfólio |
| Ferramenta interna, back-office | Qualquer coisa que precise ser achada no Google |
| Protótipo/POC sem conteúdo público | Página que será compartilhada em rede social |

A pergunta que decide: **alguém precisa achar isso no Google, ou o conteúdo precisa aparecer bonito quando o link for compartilhado?** Sim → Next. Não → Vite.

**Na dúvida, escolha Next.** Migrar de Vite para Next depois significa reescrever roteamento e data fetching; o contrário quase nunca acontece. E confirme com o designer antes de fixar — SPA sem SEO é uma decisão que não dá pra desfazer barato.

## Stack fixo

| Peça | Escolha | Por quê |
|---|---|---|
| Runtime | **Node 22** (LTS) | padrão da casa; o Vite 8 exige `^20.19.0 \|\| >=22.12.0` |
| Build | **Vite 8** | dev server instantâneo, build enxuto |
| UI | **React 19** | |
| Linguagem | **JavaScript** | padrão da casa, igual ao Next; TypeScript só se o projeto pedir explicitamente |
| Rotas | **React Router v7** (modo declarativo) | padrão de fato em SPA React |
| HTTP | **Axios** | instância única, baseURL e interceptors num lugar só |
| Dados de API | **TanStack Query v5** | cache, loading/error, revalidação — sem `useEffect` de fetch |
| Estado global | **Zustand** | store simples, sem boilerplate e sem re-render desnecessário |
| Estilo | **Tailwind CSS v4** via `@tailwindcss/vite` + `tailwind-merge` + `tailwind-variants` | ver skill `tailwind-v4` |
| Lint | **ESLint 10** (flat config) | só vem com a flag `--eslint` — ver abaixo |
| Formatação | **Prettier** + `prettier-plugin-tailwindcss` | |

Não troque peça por conta própria. Sem roteador alternativo, sem CSS-in-JS, sem state manager "por precaução".

## Antes de criar: Node 22

```bash
node -v
```

Menor que `v22.12` (ou `v20.19`, o mínimo absoluto do Vite 8) → **pare e resolva o Node antes**. O Vite 8 não roda, e o erro **não parece ser de versão**: vem um `SyntaxError: The requested module 'node:util' does not provide an export named 'styleText'` no meio de um arquivo minificado. Já no `npm create vite`, antes de existir projeto. O procedimento de nvm é o mesmo descrito na skill `nextjs-base` (seção "Antes de criar: Node 22") — não vou repetir aqui.

Todo projeto nasce com a versão fixada em dois lugares:

**`.nvmrc`** na raiz:

```
22
```

**`engines`** no `package.json`:

```json
{
  "engines": {
    "node": ">=22.12.0"
  }
}
```

## Criando o projeto

### Onde o projeto nasce

**Na raiz da pasta em que você já está**, convivendo com o `.claude/` — não numa subpasta. Assim `npm run dev` funciona onde a pessoa abriu o editor, e o agente viaja junto com o projeto.

O `create-vite` trava numa pasta não vazia (pergunta se quer apagar tudo — nunca responda que sim, o `.claude/` iria junto). O caminho é criar num diretório temporário e subir o conteúdo:

```bash
npm create vite@latest tmp-scaffold -- --template react --eslint --no-immediate
cp -R tmp-scaffold/. . && rm -rf tmp-scaffold
```

- **`--template react` — JavaScript, nunca `react-ts`.** O padrão da casa é JS nos dois stacks; TypeScript só entra se o projeto pedir explicitamente. `react-swc`, que já foi o nosso, **não existe mais** — e o pior: o CLI não dá erro, cai calado no `vanilla-ts` e você só descobre quando não acha nenhum `.jsx`. Confira os nomes válidos com `npm create vite@latest -- --help` se desconfiar.

**Confira o template logo depois de mover** — errar aqui só aparece muito depois:

```bash
ls src/*.jsx && ! ls tsconfig.json 2>/dev/null && echo "OK: projeto JS"
```

Achou `.ts`/`.tsx` ou um `tsconfig.json`? Veio o template errado. Apague tudo (menos o `.claude/`) e refaça — converter na mão dá muito mais trabalho.
- **`--eslint` é obrigatório.** Sem a flag, o scaffold instala **Oxlint** no lugar do ESLint, e o `eslint-config` da casa não se aplica.
- **`--no-immediate`** impede o CLI de já instalar as dependências e subir o dev server dentro da pasta temporária.
- **`tmp-scaffold`, não `.scaffold`.** Nome de pacote npm não pode começar com ponto.
- **`cp -R tmp-scaffold/. .`** leva junto os arquivos ocultos (`.gitignore`) e **não apaga** nada do que já está na pasta. Nunca use o `--overwrite` do create-vite numa pasta com `.claude/` — ele apaga tudo.

Depois de mover, **ajuste o `name` no `package.json`** — ele vem como `tmp-scaffold`. Use o slug do projeto em kebab-case (`painel-entregas`). Se a pasta tiver espaço ou maiúscula no nome (`Project 1`), não copie: nome de pacote npm só aceita minúscula, número e hífen.

> Pasta vazia, sem `.claude/`? Aí o comando direto funciona: `npm create vite@latest nome-do-projeto -- --template react --eslint`.

### Instalando

```bash
npm install
npm i react-router
npm i tailwindcss @tailwindcss/vite tailwind-merge tailwind-variants
npm i axios @tanstack/react-query zustand
npm i @phosphor-icons/react
npm i -D prettier prettier-plugin-tailwindcss @tanstack/react-query-devtools
```

Sobre as escolhas do comando:

- **`react-router`** é o pacote da v7. Não instale `react-router-dom` (nome antigo, hoje só um re-export).
- **`@tailwindcss/vite`** é o plugin oficial do Tailwind v4 para Vite. Não use PostCSS aqui — no Vite o plugin é mais rápido e dispensa `postcss.config`.
- **`axios` + `@tanstack/react-query` + `zustand`** entram sempre, mesmo na POC com mock. Ver "Dados e estado" — é o que faz a troca do mock pela API real custar quase nada.
- **`@phosphor-icons/react`** é a lib de ícone default da casa. Se o designer entregou outra (Lucide, Heroicons, pack próprio), instale a dele e não esta — nunca as duas. Ver `ui-components`.

### Limpeza pós-scaffold (obrigatória)

O template do Vite vem com uma demo. **Nada disso fica**:

1. **`src/App.css`** — apague o arquivo inteiro.
2. **`src/index.css`** — apague e crie `src/styles/globals.css` no lugar, com o template da skill `tailwind-v4`.
3. **`src/App.jsx`** — apague o conteúdo de demo. Ele vira o shell da aplicação — ver "Roteamento".
4. **Assets da demo** — apague `src/assets/react.svg`, `src/assets/vite.svg`, `src/assets/hero.png`, `public/icons.svg`. O `public/favicon.svg` fica, mas trocado pelo da marca.
5. **`index.html`** — troque `lang="en"` por **`lang="pt-BR"`**, ajuste o `<title>` e o favicon.
6. **`vite.config.js`** — adicione o plugin do Tailwind e o alias `@/` (ver abaixo).
7. **`jsconfig.json`** — não existe no scaffold; copie `templates/jsconfig.template.json` para a raiz **como `jsconfig.json`** (ver abaixo). Sem ele o editor não resolve `@/`.
8. **`.nvmrc` + `engines`** — nenhum dos dois vem pronto.
9. **Prettier** — copie `templates/.prettierrc` e `templates/.prettierignore`.
10. **`.vscode/settings.json`** — copie `templates/vscode-settings.json`.
11. **`README.md`** — reescreva com o nome do projeto e como rodar (incluindo o `nvm use`).
12. **Rota 404** — copie `templates/NotFound.jsx` (ver "404 é obrigatório").
13. **Camada de dados** — copie `templates/App.jsx`, `templates/api-client.js`, `templates/api-mock.js`, `templates/api-service.js`, `templates/useUsers.js`, `templates/ui-store.js` e `templates/.env.example` (→ `.env.local`). Ver "Dados e estado".
14. **`Select`, se o projeto tem formulário** — copie `templates/Select.jsx` da skill `ui-components` para `src/components/ui/Select.jsx`. `<select>` nativo não é opção — ver `ui-components`.
15. **Auth, se o projeto tem login** — copie `templates/AuthContext.js`, `templates/AuthProvider.jsx`, `templates/useAuth.js`, `templates/api-auth.js`, `templates/ProtectedRoute.jsx`, `templates/PublicOnlyRoute.jsx`, `templates/Login.jsx`, `templates/Forbidden.jsx` e `templates/users.js`. Entra **agora**, não depois (ver "Login e rota protegida"). Depende do passo 13 — o contexto usa o service e o `queryClient`.

## Config

### `vite.config.js`

Copie `templates/vite.config.js`. São duas adições ao arquivo gerado:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
```

**O alias precisa estar nos dois lugares.** O `vite.config.js` faz o import funcionar em runtime; o `jsconfig.json` faz o editor entender. Configurar só um resolve metade do problema — ou o build quebra, ou o autocomplete não aparece.

### `jsconfig.json`

Na raiz do projeto, com esse nome exato (o template desta skill se chama `jsconfig.template.json` só para não ser lido como config do próprio repositório de skills):

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src"]
}
```

### CSS de entrada

No Vite não existe `src/app/globals.css` — o arquivo mora em **`src/styles/globals.css`** e é importado uma vez só, no `main.jsx`:

```css
/* src/styles/globals.css */
@import "tailwindcss";

/* @theme inline { ... }  ← tema da skill tailwind-v4 */
```

```jsx
// src/main.jsx
import "@/styles/globals.css";
```

Nada de `@import` de CSS em componente. Um ponto de entrada só.

### Prettier

Mesma config do `nextjs-base`, com **uma linha diferente** — o caminho do stylesheet:

```json
{
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindStylesheet": "./src/styles/globals.css",
  "singleQuote": false,
  "tabWidth": 2,
  "bracketSameLine": false,
  "trailingComma": "all",
  "printWidth": 100
}
```

Sem o `tailwindStylesheet` apontando pro lugar certo, o plugin não enxerga os tokens do `@theme` e as classes customizadas ficam fora de ordem.

Scripts no `package.json`:

```json
"format": "prettier --write .",
"format:check": "prettier --check ."
```

```bash
npm run dev            # desenvolvimento
npm run build          # valida se compila — rode antes de entregar
npm run preview        # serve o build local, pra conferir o resultado real
npm run lint           # ESLint
npm run format         # formata tudo
```

## Estrutura de pastas

```
nome-do-projeto/
├── src/
│   ├── main.jsx               # entrada — monta o React e importa o CSS
│   ├── App.jsx                # shell: providers + RouterProvider
│   ├── router.jsx             # todas as rotas, em um lugar só
│   ├── pages/                 # uma página por rota
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Forbidden.jsx      # /sem-permissao — se usar roles
│   │   └── NotFound.jsx
│   ├── components/
│   │   ├── auth/              # ProtectedRoute — só em projeto com login
│   │   ├── layout/            # AppShell, Sidebar, Topbar — aparecem em toda tela
│   │   ├── sections/          # blocos de uma página específica
│   │   └── ui/                # Button, Card, Input — primitivos reutilizáveis
│   ├── context/               # AuthContext.js + AuthProvider.jsx
│   ├── store/                 # stores Zustand — estado global de interface
│   │   └── useUiStore.js
│   ├── lib/
│   │   ├── api/               # cliente Axios + um service por domínio
│   │   │   ├── client.js
│   │   │   ├── mock.js        # flag USE_MOCKS + delay()
│   │   │   ├── auth.js
│   │   │   └── users.js
│   │   ├── mocks/             # dados mockados da POC
│   │   └── format/            # helpers e formatadores
│   ├── hooks/
│   │   └── queries/           # hooks de TanStack Query, um por domínio
│   ├── styles/
│   │   └── globals.css        # tema Tailwind (skill tailwind-v4)
│   └── assets/                # imagens e fontes processadas pelo build
├── public/                    # assets servidos crus (favicon, robots)
├── index.html                 # o HTML raiz — existe de verdade aqui
├── .env.example               # versionado; .env.local fica fora do git
├── .nvmrc
├── .prettierrc
├── .prettierignore
├── eslint.config.js
├── jsconfig.json
├── vite.config.js
└── package.json
```

Regras da estrutura:

- **`pages/` é só página.** Componente de UI mora em `components/`, mesmo que só uma página use. A regra de onde colocar componente é idêntica à do `nextjs-base` (layout / sections / ui).
- **Página é magra.** Ela monta sections e cuida do estado da rota. Passou de ~60 linhas, tem section querendo nascer.
- **`assets/` vs `public/`**: imagem importada no JSX vai em `assets/` (ganha hash e otimização do build); arquivo que precisa de URL fixa (favicon, `robots.txt`) vai em `public/`.
- **`router.jsx` é a única fonte de rotas.** Não espalhe `<Routes>` pelo projeto.

## Roteamento — React Router v7

Aqui está a diferença mental em relação ao Next: **pasta não vira rota**. Nada é automático — toda rota é uma linha que você escreve em `src/router.jsx`. Criar o arquivo da página e esquecer de registrar é o erro nº 1 deste stack, e ele não dá erro: a URL simplesmente cai no 404.

### O básico

Copie `templates/router.jsx` e `templates/AppLayout.jsx` como ponto de partida:

```jsx
// src/router.jsx
import { createBrowserRouter } from "react-router";
import AppLayout from "@/components/layout/AppLayout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import NotFound from "@/pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "quem-somos", element: <About /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
```

```jsx
// src/App.jsx
import { RouterProvider } from "react-router";
import { router } from "@/router";

export default function App() {
  return <RouterProvider router={router} />;
}
```

```jsx
// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App";
import "@/styles/globals.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

### Layout compartilhado

O equivalente ao `layout.js` do Next é uma **rota pai com `<Outlet />`**. O que estiver fora do `Outlet` não remonta na troca de página — é o que segura sidebar e header estáveis:

```jsx
// src/components/layout/AppLayout.jsx
import { Outlet } from "react-router";
import Sidebar from "@/components/layout/Sidebar";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
```

Layout aninhado é o mesmo padrão: uma rota filha com `element` próprio e `children` dentro.

### Rota dinâmica

```jsx
{ path: "posts/:slug", element: <PostPage /> }
```

```jsx
import { useParams } from "react-router";

export default function PostPage() {
  const { slug } = useParams();   // string direta — não é Promise como no Next
  return <article>{slug}</article>;
}
```

### Navegação

```jsx
import { Link, NavLink, useNavigate } from "react-router";

<Link to="/quem-somos">Quem somos</Link>

{/* NavLink sabe se está ativo — use pra menu */}
<NavLink to="/dashboard" className={({ isActive }) => (isActive ? "text-primary" : "text-muted")}>
  Dashboard
</NavLink>
```

Nunca `<a href="/rota">` para rota interna — recarrega a página inteira e mata a SPA. `<a>` só para link externo, com `target="_blank"` e `rel="noreferrer"`.

Navegação por código (depois de submeter formulário, por exemplo) é `const navigate = useNavigate()` → `navigate("/sucesso")`.

### 404 é obrigatório

**Todo projeto sai com 404 próprio**, mesmo sendo painel interno — usuário digita URL errada em qualquer lugar. Basta a rota `path: "*"` no fim da lista de children.

Copie `templates/NotFound.jsx` para `src/pages/NotFound.jsx` e ajuste o texto. Ele já usa os tokens do tema.

O que a página precisa ter:
- Dizer **o que aconteceu**, em português e sem jargão ("Página não encontrada", não "Error 404")
- **Um caminho de volta** — `<Link>` pra home, no mínimo
- **A cara do projeto** — mesma fonte, mesmas cores, dentro do layout

### Lazy loading de rota

Vale a pena quando a tela é pesada (gráfico, editor, tabela grande) e não é a primeira que abre:

```jsx
{
  path: "relatorios",
  lazy: async () => {
    const { default: Reports } = await import("@/pages/Reports");
    return { Component: Reports };
  },
}
```

Não faça isso em tudo — em tela leve, o split rende mais request do que economia.

---

## Login e rota protegida (obrigatório quando existe login)

**Se o projeto tem login — dashboard, painel, área logada — o `AuthContext` e o `ProtectedRoute` entram desde o primeiro dia, mesmo com usuário mockado.** Não é etapa de "depois que o backend existir".

O motivo é concreto: sem rota protegida, qualquer pessoa digita `/dashboard` na URL e entra. A tela de login vira decoração e a POC não demonstra o produto que ela deveria demonstrar. Pior: quando o backend chegar, a proteção tem que ser enfiada num roteamento que já cresceu sem ela, e aí ou sobra rota desprotegida ou o refactor custa mais que fazer certo agora.

Com o padrão abaixo, trocar o mock pela API real mexe em **uma função** (`login`) — nada mais.

> **Isso é proteção de navegação, não de segurança.** Todo o código está no bundle e o usuário pode manipular o `localStorage`. Segurança de verdade é o backend validando cada request. Nunca coloque dado sensível no mock nem confie no front pra autorizar coisa alguma — e deixe isso claro na entrega.

### 1. O contexto — três arquivos, não um

Parece exagero, mas o lint do projeto obriga: **arquivo que exporta componente não pode exportar mais nada**, senão o Fast Refresh quebra (`react-refresh/only-export-components`). Então o contexto, o provider e o hook ficam separados.

```js
// src/context/AuthContext.js  → templates/AuthContext.js
import { createContext } from "react";

export const AuthContext = createContext(null);
```

```jsx
// src/context/AuthProvider.jsx  → templates/AuthProvider.jsx
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { loginRequest } from "@/lib/api/auth";

const USER_KEY = "atom.auth.user";
const TOKEN_KEY = "atom.auth.token";

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY)) ?? null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const queryClient = useQueryClient();

  async function login(credentials) {
    const { user: loggedUser, token } = await loginRequest(credentials);

    localStorage.setItem(USER_KEY, JSON.stringify(loggedUser));
    localStorage.setItem(TOKEN_KEY, token);
    setUser(loggedUser);
    return loggedUser;
  }

  function logout() {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    queryClient.clear();
  }

  const value = { user, isAuthenticated: Boolean(user), login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
```

```js
// src/hooks/useAuth.js  → templates/useAuth.js
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth precisa estar dentro de <AuthProvider>.");
  return context;
}
```

Quatro detalhes que não são enfeite:

- **A sessão é restaurada no inicializador do `useState`, não em `useEffect`.** Este é o bug nº 1 do padrão: com `useEffect`, o primeiro render tem `user = null`, o `ProtectedRoute` avalia e **chuta o usuário logado pra tela de login a cada F5**. O inicializador lazy roda antes do primeiro render e resolve — sem estado de loading, sem tela piscando. (O `react-hooks/set-state-in-effect`, no ESLint 10, hoje barra a versão com efeito.)
- **`readStoredUser` tem `try/catch`.** Um `localStorage` corrompido faria o `JSON.parse` estourar dentro do render — tela branca, sem mensagem.
- **O provider não conhece o mock.** Ele chama `loginRequest` do service (`src/lib/api/auth.js`), igual a qualquer outra chamada do app — quem decide entre mock e API é a camada de service. Ver "Dados e estado".
- **`queryClient.clear()` no logout.** Sem isso, o cache do usuário anterior continua vivo e o próximo login abre o dashboard **com os dados de quem saiu** até a primeira revalidação. Em app com perfis diferentes, isso é vazamento de dado na tela.

> Se um dia a sessão precisar ser validada contra a API (`GET /me`), aí sim volta um estado de carregamento — e os guards precisam esperar por ele antes de redirecionar.

O token vai pro `localStorage` porque é dele que o interceptor do Axios lê o `Authorization`. Com mock ele é uma string fake — o importante é o caminho já existir montado.

O `AuthProvider` envolve o roteador **e fica dentro do `QueryClientProvider`** — é o que dá acesso ao `queryClient` no logout. O `App.jsx` completo está em "Dados e estado" (`templates/App.jsx`).

### 2. O service e o usuário mockado

O login é uma chamada como qualquer outra, e passa pelo service:

```js
// src/lib/api/auth.js
import { api } from "@/lib/api/client";
import { delay, USE_MOCKS } from "@/lib/api/mock";
import { findUser } from "@/lib/mocks/users";

export async function loginRequest({ email, password }) {
  if (USE_MOCKS) {
    await delay();
    const found = findUser(email, password);
    if (!found) throw new Error("E-mail ou senha inválidos.");

    const { password: _password, ...user } = found;
    return { user, token: `mock-token-${user.id}` };
  }
  return api.post("/auth/login", { email, password });
}
```

**A senha nunca sai do service** — o que volta é o usuário sem ela, mesmo no mock.

`src/lib/mocks/users.js` — a POC precisa de credencial pra demonstrar, e ela vai na entrega:

```js
export const users = [
  { id: 1, name: "Ana Souza", email: "admin@exemplo.com", password: "123456", role: "admin" },
  { id: 2, name: "Bruno Lima", email: "user@exemplo.com", password: "123456", role: "user" },
];

export function findUser(email, password) {
  return users.find((u) => u.email === email && u.password === password) ?? null;
}
```

### 3. A rota protegida

`src/components/auth/ProtectedRoute.jsx` — copie `templates/ProtectedRoute.jsx`:

```jsx
import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedRoute({ roles }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // guarda de onde veio, pra voltar pra lá depois do login
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/sem-permissao" replace />;
  }

  return <Outlet />;
}
```

`replace` evita que o botão "voltar" do navegador jogue a pessoa de novo na rota bloqueada.

**Se usar `roles`, a rota `/sem-permissao` precisa existir** (`templates/Forbidden.jsx`), senão o redirect cai no 404 e a pessoa lê "página não encontrada" quando o caso é falta de permissão — mensagem errada, e o suporte recebe o chamado errado.

### 4. Amarrando no roteador

O `ProtectedRoute` é uma **rota pai sem path** — tudo que estiver dentro dela herda a proteção. Rota nova dentro do bloco já nasce protegida, sem ninguém lembrar de nada:

```jsx
// src/router.jsx
export const router = createBrowserRouter([
  { path: "/login", element: <PublicOnlyRoute />, children: [{ index: true, element: <Login /> }] },

  {
    element: <ProtectedRoute />,          // ← tudo abaixo exige login
    children: [
      {
        path: "/",
        element: <AppLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "relatorios", element: <Reports /> },
          { path: "sem-permissao", element: <Forbidden /> },
          {
            element: <ProtectedRoute roles={["admin"]} />,   // ← e isto, ser admin
            children: [{ path: "usuarios", element: <Users /> }],
          },
        ],
      },
    ],
  },

  { path: "*", element: <NotFound /> },
]);
```

**Rota pública fica fora do bloco.** Login, recuperação de senha e a landing (se houver) não entram ali.

### 5. Voltar pra onde a pessoa tentou ir

A tela de login usa o `state.from` guardado pelo `ProtectedRoute` — quem tentou abrir `/relatorios` sem sessão volta pra `/relatorios`, não pra home:

```jsx
// src/pages/Login.jsx
const { login } = useAuth();
const navigate = useNavigate();
const location = useLocation();
const from = location.state?.from?.pathname ?? "/";

async function handleSubmit(event) {
  event.preventDefault();
  setError("");
  try {
    await login({ email, password });
    navigate(from, { replace: true });
  } catch (err) {
    setError(err.message);
  }
}
```

O caminho inverso é o `PublicOnlyRoute`: quem já está logado e abre `/login` é mandado pro app, em vez de ver a tela de login de novo.

```jsx
// src/components/auth/PublicOnlyRoute.jsx
export default function PublicOnlyRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}
```

### 6. Logout

No `Sidebar`/`Topbar`, `logout()` do contexto já limpa tudo — o `ProtectedRoute` reage sozinho e redireciona:

```jsx
const { user, logout } = useAuth();
<button onClick={logout}>Sair, {user.name}</button>
```

### Checklist de auth

- [ ] `AuthProvider` envolvendo o `RouterProvider` no `App.jsx`
- [ ] Sessão restaurada no inicializador do `useState`, não em `useEffect` — F5 em rota interna não desloga
- [ ] Senha fora do estado e do `localStorage`
- [ ] Toda rota interna dentro do bloco `<ProtectedRoute />` — nenhuma solta
- [ ] `/login` fora do bloco, com `PublicOnlyRoute`
- [ ] Usou `roles`? A rota `/sem-permissao` existe
- [ ] `queryClient.clear()` no logout — o próximo login não herda cache do anterior
- [ ] Redirect pós-login volta pro `state.from`
- [ ] Logout acessível na interface
- [ ] Erro de credencial aparece na tela de login (não só no console)
- [ ] Credenciais mockadas informadas na entrega, com o aviso de que a proteção é só de navegação

---

## Dados e estado

Projeto Vite quase sempre vira app com backend. Então **a POC já nasce com a arquitetura de dados montada** — só que apontando pra mock em vez de API. Quando o backend existir, muda a origem do dado, não a estrutura do app.

### A regra que decide onde cada coisa mora

Estado errado no lugar errado é a maior fonte de bug em SPA. São três caixas, e elas não se misturam:

| Tipo de estado | Onde vai | Exemplo |
|---|---|---|
| **Dado que vem do servidor** | **TanStack Query** | lista de pedidos, perfil, métricas do dashboard |
| **Estado global da interface** | **Zustand** | sidebar aberta, filtro selecionado, tema, modal |
| **Estado de um componente só** | `useState` | valor de input, accordion aberto |
| **Sessão do usuário** | **`AuthContext`** | usuário logado, login/logout |

Duas fronteiras que **não** podem ser cruzadas:

- **Nunca copie dado de API para dentro do Zustand.** Se veio do servidor, quem manda é o Query — ele já tem cache, revalidação, loading e error. Duplicar na store cria dois valores que divergem no primeiro update, e ninguém sabe qual é o certo.
- **Sessão fica no `AuthContext`, não no Zustand.** Já existe e resolve; ter os dois disputando "quem sabe quem está logado" é confusão garantida. Zustand aqui é estado de **interface**.

### 1. Axios — um cliente só

`src/lib/api/client.js` — copie `templates/api-client.js`. Toda chamada do projeto passa por essa instância; ninguém importa `axios` direto no componente.

```js
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});
```

Os interceptors são o motivo de existir a instância única — token e tratamento de erro em **um** lugar, não espalhados por 40 chamadas:

```js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("atom.auth.token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response.data,          // o consumidor recebe o dado, não o envelope
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("atom.auth.user");
      window.location.assign("/login");
    }
    // mensagem única e legível pra UI mostrar
    return Promise.reject(new Error(error.response?.data?.message ?? "Não foi possível concluir a operação."));
  },
);
```

`response.data` no interceptor é decisão de projeto: o service devolve o dado limpo e nenhum componente precisa lembrar de `.data`.

### 2. Services — a camada que troca de mock pra API

Um arquivo por domínio em `src/lib/api/`. **É aqui, e só aqui, que o mock existe** — a tela nunca sabe se o dado veio de `users.js` ou de um servidor:

```js
// src/lib/api/users.js
import { api } from "@/lib/api/client";
import { users } from "@/lib/mocks/users";
import { delay, USE_MOCKS } from "@/lib/api/mock";

export async function getUsers() {
  if (USE_MOCKS) {
    await delay();                                  // simula latência de rede
    return users.map(({ password, ...user }) => user);
  }
  return api.get("/users");
}

export async function createUser(payload) {
  if (USE_MOCKS) {
    await delay();
    return { id: Date.now(), ...payload };
  }
  return api.post("/users", payload);
}
```

```js
// src/lib/api/mock.js
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true";

export function delay(ms = 600) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```

```
# .env.local
VITE_USE_MOCKS=true
VITE_API_URL=http://localhost:3000
```

Por que o `delay()` importa: sem latência, o loading nunca aparece em dev e ninguém percebe que a tela não tem skeleton — aí só na integração com a API real é que se descobre. **Simular a demora é o que faz a POC ser honesta.**

Por que a flag em vez de apagar o mock depois: a chamada real já está escrita e revisada. Virar a chave é trocar `VITE_USE_MOCKS` para `false` — sem caçar mock espalhado pelo projeto.

### 3. TanStack Query — o provider

```jsx
// src/App.jsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "react-router";
import { AuthProvider } from "@/context/AuthProvider";
import { router } from "@/router";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,      // 1 min sem refetch — evita request a cada foco
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

**O `queryClient` é criado fora do componente.** Dentro, ele seria recriado a cada render e o cache se perderia inteiro.

Ordem dos providers: Query por fora, Auth dentro — assim o auth pode usar query no futuro, e não o contrário.

### 4. Hooks de query — uma tela nunca chama service direto

Todo acesso a dado vira um hook em `src/hooks/queries/`. Isso mantém a `queryKey` consistente (ela é a identidade do cache — chave torta = cache que não invalida):

```js
// src/hooks/queries/useUsers.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, getUsers } from "@/lib/api/users";

export const userKeys = {
  all: ["users"],
  detail: (id) => ["users", id],
};

export function useUsers() {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: getUsers,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    // depois de criar, a lista volta a buscar sozinha
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
  });
}
```

Na tela, os três estados são **obrigatórios** — loading e erro não são opcionais nem em POC:

```jsx
export default function UsersPage() {
  const { data: users, isLoading, isError, error } = useUsers();

  if (isLoading) return <UsersSkeleton />;
  if (isError) return <ErrorState message={error.message} />;

  return <UserTable users={users} />;
}
```

**Nada de `useEffect` + `useState` para buscar dado.** É o padrão que o Query existe pra substituir: sem cache, sem cancelamento, com race condition e com loading feito na mão.

### 5. Zustand — estado global de interface

`src/store/` — um arquivo por store, nome `use...Store`. Copie `templates/ui-store.js`:

```js
// src/store/useUiStore.js
import { create } from "zustand";

export const useUiStore = create((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  closeSidebar: () => set({ isSidebarOpen: false }),
}));
```

**Consuma sempre com seletor**, nunca a store inteira:

```jsx
// ✅ só re-renderiza quando isSidebarOpen muda
const isSidebarOpen = useUiStore((state) => state.isSidebarOpen);
const toggleSidebar = useUiStore((state) => state.toggleSidebar);

// ❌ re-renderiza a cada mudança de qualquer campo da store
const { isSidebarOpen, toggleSidebar } = useUiStore();
```

Regras da store:

- **Ação dentro da store**, não `set` espalhado pelo componente. A store é dona das próprias transições.
- **Uma store por assunto** (UI, filtros, preferências) — não crie uma `useAppStore` gigante.
- **Zustand não é cache de API.** Se você está prestes a colocar `users: []` numa store, o lugar é o TanStack Query.

### Checklist de dados

- [ ] Nenhum componente importa `axios` direto — tudo pela instância de `@/lib/api/client`
- [ ] Interceptors de request (token) e response (401 + mensagem de erro) configurados
- [ ] Mock isolado nos services, atrás de `USE_MOCKS`, com `delay()` simulando rede
- [ ] `queryClient` criado fora do componente
- [ ] Toda busca de dado passa por hook em `hooks/queries/` — zero `useEffect` de fetch
- [ ] `queryKey` centralizada em objeto de keys por domínio
- [ ] Mutation invalida a query afetada no `onSuccess`
- [ ] Toda tela com dado trata **loading e erro** na interface
- [ ] Zustand consumido com seletor, e sem nenhum dado de API dentro
- [ ] `.env.local` com `VITE_USE_MOCKS` e `VITE_API_URL`, e `.env.example` versionado

## Convenções de código

Valem **as mesmas** do `nextjs-base`, e não são repetidas aqui:

- **Código sempre em inglês** (componente, prop, função, arquivo). Exceção: slug de rota, texto de tela e comentários ficam em pt-BR.
- **Nomenclatura** — `PascalCase.jsx` para componente, `camelCase.js` para helper/hook, `is`/`has` para booleano, `handle` para evento.
- **Imports com `@/`**, nunca `../../`. Ordem: libs → `@/` → CSS.
- **Um componente, uma responsabilidade**; repetiu 3x, extraia; nada de `index.js` barril.
- **Quase nenhum comentário.** Só o que explica um *porquê* não óbvio. Os templates desta skill seguem isso — ao copiar, mantenha o padrão em vez de comentar cada etapa.

O que **não** se aplica aqui, porque é específico do Next:

- `"use client"` / Server Components — no Vite **tudo é client**, sem exceção. Não escreva a diretiva.
- `next/image` — não existe. Use `<img>` com `width`/`height` explícitos (evita CLS), `loading="lazy"` fora da primeira dobra e `alt` descritivo sempre. Imagem local vai em `src/assets/` e é importada:
  ```jsx
  import hero from "@/assets/hero.jpg";
  <img src={hero} alt="Equipe reunida na sede" width={1200} height={800} />
  ```
- `next/font` — a fonte entra por `@fontsource` ou `@font-face` local. Ver a seção de fontes da skill `tailwind-v4`.
- `metadata` / skill `seo-metadata` — **não use neste stack**. SPA não indexa; o que existe é o `<title>` e a `<meta name="description">` do `index.html`, escritos à mão, e ponto.

## Variáveis de ambiente

No Vite, só variável prefixada com **`VITE_`** chega ao código:

```
# .env.local
VITE_API_URL=https://api.exemplo.com
```

```js
const url = import.meta.env.VITE_API_URL;   // não é process.env
```

**Tudo que tem `VITE_` vai pro bundle e é público.** Nunca coloque segredo, chave privada ou token de API aí — em SPA não existe lugar seguro para segredo no front.

Versione um **`.env.example`** (copie `templates/.env.example`) com as chaves e valores de exemplo; o `.env.local` fica fora do git. Sem isso, quem clona o projeto não descobre quais variáveis existem.

## Checklist antes de entregar

- [ ] `node -v` >= 22.12; `.nvmrc` e `engines` no lugar
- [ ] Projeto na raiz da pasta, `tmp-scaffold/` apagado e `name` do `package.json` com o slug real
- [ ] Projeto em **JavaScript** — nenhum `.ts`/`.tsx`, nenhum `tsconfig.json`
- [ ] Demo do Vite removida (`App.css`, `index.css`, `react.svg`, `vite.svg`, contador)
- [ ] `lang="pt-BR"`, `<title>` e favicon ajustados no `index.html`
- [ ] Alias `@/` nos **dois** arquivos: `vite.config.js` e `jsconfig.json`
- [ ] Tailwind via `@tailwindcss/vite`, CSS único em `src/styles/globals.css` importado no `main.jsx`
- [ ] `.prettierrc` com `tailwindStylesheet` apontando pra `./src/styles/globals.css`
- [ ] Toda rota registrada em `src/router.jsx` — nenhuma página órfã em `pages/`
- [ ] Rota `path: "*"` com o 404 do projeto
- [ ] Projeto com login: `AuthContext` + `ProtectedRoute` implementados e o "Checklist de auth" fechado
- [ ] Camada de dados montada (Axios + TanStack Query + Zustand) e o "Checklist de dados" fechado
- [ ] Zero `<a href>` para rota interna — tudo `Link`/`NavLink`
- [ ] Nenhum `"use client"` no projeto
- [ ] Todo `<img>` com `alt`, `width` e `height`
- [ ] Nenhum segredo em variável `VITE_`
- [ ] Cores do template substituídas pelas da marca
- [ ] `npm run format` rodado, `npm run lint` limpo, `npm run build` passa
