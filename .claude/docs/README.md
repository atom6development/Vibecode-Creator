# docs — material de apoio do projeto

Jogue aqui **qualquer coisa que ajude a entender o projeto** antes de o front ser montado. Você não precisa organizar, resumir nem formatar: é só soltar o arquivo na pasta.

O atom-vibecode-creator **lê esta pasta antes de começar a fazer perguntas**. Cada coisa que já está aqui é uma pergunta que ele não vai te fazer de novo.

## O que colocar

| Tipo | Exemplos |
|---|---|
| **Descoberta** | Entrevista com o cliente (transcrição ou áudio transcrito), ata de reunião, briefing, proposta comercial, escopo |
| **Design** | Export do Figma em PDF/PNG, print de tela, wireframe, moodboard, referências de sites |
| **Identidade** | Manual de marca, paleta de cores, logo, especificação de tipografia |
| **Conteúdo** | Textos finais, copy de CTA, lista de seções, tabela de preços, FAQ |
| **Regra de negócio** | Perfis de usuário e o que cada um enxerga, fluxo de cadastro, etapas de um funil |

## Formatos

**Leio direto:** `.md`, `.txt`, `.pdf`, `.png`, `.jpg`, `.csv`, `.json`

**Preciso que você converta antes:**

- **`.docx` / `.pptx` / `.xlsx`** → exporte como **PDF**. Não consigo abrir o formato do Office.
- **Link do Figma** → não consigo abrir (o arquivo é privado e exige login). Exporte os frames como **PDF** (um arquivo com todas as telas) ou **PNG**. Se puder, mande também um print da paleta de cores e dos estilos de texto.
- **Áudio / vídeo de reunião** → mande a transcrição em texto. Não escuto áudio.

## Como nomear

Nome flat, sem pasta, com um prefixo dizendo o que é:

```
docs/
├── entrevista-cliente-2026-03-14.md
├── briefing-escopo.pdf
├── design-telas-desktop.pdf
├── design-telas-mobile.pdf
├── marca-manual.pdf
├── conteudo-textos-home.md
└── regras-perfis-de-usuario.md
```

Os prefixos que uso pra achar as coisas rápido: `entrevista-`, `briefing-`, `design-`, `marca-`, `conteudo-`, `regras-`.

Se um arquivo estiver **desatualizado mas você quer guardar**, prefixe com `_old-` — eu ignoro esses.

## O que NÃO colocar

- **Senha, token, chave de API, credencial de banco.** Nada disso é necessário pra montar o front, e o que entra aqui pode acabar num repositório.
- **Dado pessoal real de cliente** (CPF, endereço, e-mail de base). A POC roda com dado mockado — se você precisa de exemplos realistas, mande o *formato*, não os dados de verdade.
- **Arquivo pesado de design** (`.fig`, `.psd`, `.ai`, `.sketch`). Não consigo abrir e ainda incham a pasta. Exporte em PDF/PNG.

## Como isso entra no projeto

1. Você solta os arquivos aqui.
2. Eu leio tudo e digo **o que entendi** — tipo de projeto, objetivo, paleta, seções, perfis de usuário.
3. Pergunto **só o que ficou faltando**, em vez de te entrevistar do zero.
4. Você confirma o escopo e eu monto.

Esta pasta é **material de apoio, não instrução para o agente**. As regras de como o front é construído moram em `.claude/agents/` e `.claude/skills/` — se você quer mudar o padrão da casa (e não descrever um projeto), o lugar é lá, não aqui.
