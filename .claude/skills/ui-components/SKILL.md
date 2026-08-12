---
name: ui-components
description: Padrão de componentes de UI da Atom6 Studio — biblioteca de ícones default (Phosphor), proibição de controles nativos estilizados (nada de <select> do HTML), o Select customizado obrigatório com painel que abre pra cima ou pra baixo, e a escala de padding/altura/espaçamento dos controles de formulário. Use SEMPRE que for criar um select, dropdown, campo de formulário, usar ícone ou definir espaçamento interno de componente.
---

# Componentes de UI — padrão Atom6

Vale nos dois stacks (Next e Vite). Estilização segue a skill `tailwind-v4` — esta skill diz **quais componentes existem**, **como se comportam** e **quanto respiram**.

As três regras que mandam:

1. **Controle nativo do HTML não é estilizável — então não usamos.** `<select>` está fora. O que entra é o `Select` desta skill.
2. **Ícone é Phosphor**, salvo se o designer entregou outra lib.
3. **Espaçamento e altura de controle saem da tabela desta skill**, não do olho.

---

## Regra 1 — Nada de controle nativo estilizado

`<select>` nativo não aceita estilo no painel de opções: o navegador desenha a lista com o widget do sistema. Não dá pra controlar fonte, cor, radius, hover, altura de item nem a direção em que abre. Resultado: um campo que combina com o design no fechado e destoa no aberto, e que muda de cara entre Chrome, Safari e Android.

```jsx
<select className="rounded-lg border px-4">   {/* ❌ o painel ignora tudo isso */}
  <option>Opção</option>
</select>
```

```jsx
<Select label="Categoria" options={categories} value={value} onChange={setValue} />  {/* ✅ */}
```

Não existe exceção de "é só um campo simples" nem de "é POC". O `Select` é template pronto — copiar custa menos que estilizar o nativo.

A mesma lógica vale pros outros controles que o navegador desenha por conta: `checkbox`, `radio` e `range` só entram se o visual nativo passar no design; caso contrário, `appearance-none` + marca desenhada por você. `<input type="text">`, `<textarea>` e `<button>` são estilizáveis de verdade — esses ficam nativos.

---

## Regra 2 — Ícones: Phosphor é o default

**Se o designer não passou biblioteca de ícone**, use **Phosphor**:

```bash
npm i @phosphor-icons/react
```

```jsx
import { CaretDown, MagnifyingGlass, User } from "@phosphor-icons/react";

<CaretDown size={16} aria-hidden="true" className="text-muted" />
```

O que importa saber:

- **O chevron do Phosphor se chama `CaretDown`.** Não existe `ChevronDown` na lib — os nomes são `CaretDown`, `CaretUp`, `CaretLeft`, `CaretRight` (e `CaretLineDown`, `CaretDoubleDown` para as variações). Procurar por "chevron" e não achar é o erro mais comum de quem vem do Lucide/Heroicons.
- **Importe ícone por ícone.** `import { CaretDown } from "@phosphor-icons/react"` é tree-shakeable; `import * as Icons` arrasta a lib inteira pro bundle.
- **Ícone decorativo leva `aria-hidden="true"`.** Se o ícone é a *única* coisa dentro de um botão, o botão precisa de `aria-label` — senão o leitor de tela anuncia um botão sem nome.
- **Tamanho vai na prop `size`**, em número, alinhado ao texto ao lado: 16 para texto `text-sm`, 20 para `text-base`, 24 para ícone de ação isolado.
- **Cor vai por `className`** (`text-muted`, `text-primary`) — o Phosphor usa `currentColor`. Nunca a prop `color` com hex, que fura o token.
- **Peso**: `regular` é o default e é o nosso. Só troque (`bold`, `fill`, `duotone`) se o design pedir — e aí use o mesmo peso no projeto inteiro, via `<IconContext.Provider>` no shell da app, em vez de repetir a prop.
- **É client-side.** Em Next, ícone só aparece dentro de Client Component (ou num arquivo com `"use client"`). Se precisar de ícone num Server Component, extraia a parte interativa.

Se o designer **entregou** uma lib (Lucide, Heroicons, um pack próprio em SVG), use a dele — e aí é ela no projeto inteiro. Nunca misture duas libs de ícone: os traços têm peso e grid diferentes e a UI fica visivelmente remendada.

---

## Regra 3 — O `Select`

Copie `templates/Select.jsx` para `src/components/ui/Select.jsx`.

### O que ele resolve

- **Abre pra cima ou pra baixo sozinho.** Mede o espaço abaixo do campo; se não couber e sobrar mais espaço acima, o painel vira pra cima (`bottom-full`). Campo no fim da página não abre lista cortada nem empurra scroll.
- **Painel estilizado de verdade** — mesmo radius, borda, cor e hover do resto da UI, igual em todo navegador.
- **Teclado completo**: `↓`/`↑` navegam (e abrem se estiver fechado), `Enter`/`Espaço` selecionam, `Esc` fecha, `Home`/`End` vão pras pontas, `Tab` fecha e segue o fluxo. Opção `disabled` é pulada na navegação.
- **ARIA de combobox**: `role="combobox"` + `aria-expanded` + `aria-controls` no gatilho, `role="listbox"`/`role="option"` no painel, `aria-activedescendant` acompanhando o item destacado, `aria-invalid` e `aria-describedby` no estado de erro.
- **Fecha no clique fora** e devolve o foco pro gatilho depois de escolher.
- **Chevron gira 180°** quando abre — feedback de estado sem `style` inline.

### API

| Prop | Tipo | Papel |
|---|---|---|
| `label` | string | Rótulo acima do campo. Também serve de `aria-label` do listbox |
| `options` | `[{ value, label, disabled? }]` | As opções |
| `value` | any | Valor selecionado (componente controlado) |
| `onChange` | `(value) => void` | Recebe o `value` da opção escolhida, não o evento |
| `placeholder` | string | Texto de vazio. Default: `"Selecione"` |
| `helperText` | string | Ajuda abaixo do campo |
| `error` | string | Mensagem de erro — troca a cor do campo e sobrepõe o `helperText` |
| `disabled` | boolean | Desliga o campo |
| `className` | string | Ajuste de fora, via `twMerge` |

```jsx
const [uf, setUf] = useState("");

const estados = [
  { value: "sc", label: "Santa Catarina" },
  { value: "pr", label: "Paraná" },
  { value: "rs", label: "Rio Grande do Sul", disabled: true },
];

<Select label="Estado" options={estados} value={uf} onChange={setUf} placeholder="Escolha um estado" />
```

### Duas armadilhas

- **`--color-danger` precisa existir no `@theme`.** O estado de erro usa `border-danger` e `text-danger`. Se o tema do projeto ainda não tem, adicione o token no `globals.css` (grupo de cores de texto/feedback) antes de usar o componente — ver `tailwind-v4`.
- **O painel é `absolute`, então morre dentro de `overflow-hidden`.** Se o Select vive num card ou numa tabela com `overflow-hidden`/`overflow-x-auto`, a lista é recortada. Solução na ordem: tire o `overflow` do ancestral; se não puder, aí sim o painel vai pra um portal (`createPortal` no `body`) com posição calculada — mas só nesse caso, porque portal traz o custo de reposicionar no scroll.

### Precisa de busca ou multi-seleção?

O template é single-select puro, de propósito — é 90% dos casos. Campo com busca (`combobox` filtrável) ou múltipla escolha são componentes **separados** (`SearchSelect`, `MultiSelect`), construídos sobre a mesma base de posicionamento e teclado. Não empilhe flags no `Select` até ele virar um monstro de sete props booleanas.

---

## Espaçamento de controles

Espaçamento não é chute: campo aberto demais parece solto, apertado demais fica difícil de acertar no dedo. A escala abaixo é o default da casa — tudo sai da escala do Tailwind, **zero colchete** (ver `tailwind-v4`, Regra 1).

### Altura e padding do controle

| Tamanho | Altura | Padding H | Texto | Quando |
|---|---|---|---|---|
| `sm` | `h-9` (36px) | `px-3` | `text-sm` | Filtro de tabela, toolbar densa — só em UI de desktop |
| **`md`** (default) | **`h-11` (44px)** | **`px-4`** | `text-sm` | Formulário, campo de tela, o padrão |
| `lg` | `h-12` (48px) | `px-5` | `text-base` | CTA e campo de destaque de landing page |

**44px é o piso pra qualquer coisa clicável no mobile** — é o alvo de toque mínimo recomendado. Por isso o default é `h-11`, e o `sm` fica restrito a interface de desktop.

Botão com ícone e texto: `gap-2` entre os dois. Botão só de ícone: quadrado (`size-11`), com `aria-label`.

### Dentro do campo

| Elemento | Espaçamento |
|---|---|
| Label → campo | `gap-2` (o wrapper é `flex flex-col`) |
| Campo → helper/erro | `gap-2`, texto em `text-xs` |
| Campo → painel do dropdown | `mt-2` (ou `mb-2` abrindo pra cima) |
| Padding do painel | `p-1` — a respiração real é do item |
| Item da lista | `px-3 py-2.5`, `rounded-md` |

O item do painel usa `px-3` contra `px-4` do gatilho de propósito: o painel já tem `p-1` por fora, e 1+3 alinha o texto da opção com o texto do campo fechado.

### Entre campos e blocos

| Contexto | Espaçamento |
|---|---|
| Campo → campo no mesmo formulário | `gap-5` |
| Grupo de campos → grupo de campos | `gap-8` |
| Formulário → botão de submit | `mt-8` |
| Padding interno de card | `p-4 md:p-6` |
| Padding interno de modal | `p-6` |
| Seção de página | `py-12 md:py-16 lg:py-20` |

Duas regras de ritmo que valem mais que a tabela:

- **Espaçamento cresce com a hierarquia.** O espaço entre dois campos irmãos tem que ser visivelmente menor que o espaço entre dois grupos. Se todos os gaps são iguais, o olho não enxerga a estrutura do formulário.
- **Padding é par e vem da escala.** `p-4`, `p-6`, `p-8`. Números ímpares e valores intermediários (`p-5`, `p-7`) só quando há motivo — senão o projeto acumula sete paddings quase iguais e nada alinha.

Espaçamento de seção que se repete no projeto inteiro vira token (`--spacing-section`) em vez de ser recopiado. Ver `tailwind-v4`.

---

## Checklist antes de entregar

- [ ] Nenhum `<select>` nativo no projeto — todo select é o `Select` de `components/ui/`
- [ ] `checkbox`/`radio`/`range` nativos só onde o visual do sistema passa no design
- [ ] Uma única lib de ícone no projeto — Phosphor, se o designer não pediu outra
- [ ] Ícone importado nomeadamente, com `size` numérico e cor via token
- [ ] Ícone decorativo com `aria-hidden`; botão só-de-ícone com `aria-label`
- [ ] Dropdown abre pra cima quando não há espaço abaixo
- [ ] Dropdown navegável e fechável só pelo teclado, sem mouse
- [ ] `--color-danger` no `@theme` se algum campo tem estado de erro
- [ ] Nenhum Select dentro de ancestral com `overflow-hidden`
- [ ] Controle clicável com no mínimo 44px de altura no mobile
- [ ] Padding e gap saem da escala — zero colchete no `className`
- [ ] Gap entre grupos maior que gap entre campos irmãos
