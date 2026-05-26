# Handoff: Ordinum — Landing page + Sistema interno

## Visão geral

Pacote de design para o **Ordinum** — sistema executivo SaaS (B2B) que organiza
responsabilidades mistas em espaços operacionais separados. Inclui:

1. **Landing page de marketing** (`/`) — hero, social proof, "Como funciona",
   preços, CTA final, footer.
2. **Sistema interno** (`/app/*`) — sidebar + 4 views totalmente mockadas:
   Visão Geral, Kanban Global, Projetos, Pessoal/GTD.

Estética: **teal-on-deep-navy**. Dark mode é o default (e o único modo, por enquanto).
Tipografia mista: **Inter** no body + **Playfair Display** em flourishes editoriais.

---

## Sobre os arquivos deste pacote

Os arquivos `.jsx` e `.html` inclusos são **referências de design feitas em HTML/React** —
protótipos que mostram aparência final e comportamento esperado, **não código de produção
para copiar direto**. A tarefa é **recriar esses designs no ambiente existente do codebase**
(Next.js 16 App Router + React 19 + Tailwind v4) usando os padrões já estabelecidos:

- Componentes base em `src/components/ui/` (shadcn-style: `button.tsx`, `card.tsx`, etc).
- Tokens via `@theme` block em `src/app/globals.css` (já existe — vai precisar ampliar).
- Stores Zustand em `src/stores/` (já existem para dashboard, kanban, projetos, pessoal).
- Rotas em `src/app/(auth)/`, `src/app/(dashboard)/`, `src/app/app/`, `src/app/precos/`.

Use os arquivos `.jsx` como **especificação visual** — copie estrutura, paleta, espaçamento,
copy, animações; **traduza para Tailwind classes + shadcn components** no destino.

---

## Fidelidade

**Alta fidelidade (hifi).** Cores, espaçamento, tipografia, animações e copy são finais.
Reproduzir pixel-perfect na medida do possível. As únicas coisas marcadas como placeholder:

- Logo de social proof (texto, não logos reais).
- Avatares (gradientes com iniciais — substituir por fotos reais quando houver).

---

## Stack alvo (já no codebase)

| Camada | Lib |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 |
| Styling | Tailwind v4 com `@theme` em `globals.css` |
| Componentes base | shadcn/ui (existe em `src/components/ui/`) |
| Estado | Zustand (existe em `src/stores/`) |
| Ícones | **lucide-react** (instalar se ainda não) |
| Drag & drop | **@dnd-kit/core** (sugestão para o Kanban) |
| Animação | **framer-motion** (sugestão — não obrigatório) |
| Fontes | `next/font/google` para Inter + Playfair Display |

---

## Design tokens

Reescreva `src/app/globals.css` com este `@theme` block (substitui os tokens placeholder
que estão lá hoje). Os valores também estão em `tokens.css` deste pacote, como CSS vars.

```css
@import "tailwindcss";

@theme {
  /* ── Surfaces ─────────────────────────────────────── */
  --color-bg:           #030712;
  --color-bg-alt:       #061022;
  --color-surface:      #0A1525;
  --color-surface-2:    #0F1D33;
  --color-surface-3:    #142540;
  --color-surface-hover:#18294A;
  --color-sidebar:      #050B17;
  --color-input:        #0E1B30;

  /* ── Borders (rgba — use direto, não como token tailwind) ── */
  /* --border-subtle:    rgba(255,255,255,0.04) */
  /* --border:           rgba(255,255,255,0.07) */
  /* --border-strong:    rgba(255,255,255,0.11) */

  /* ── Text ─────────────────────────────────────────── */
  --color-text:           #F8FAFC;
  --color-text-muted:     #94A3B8;
  --color-text-faint:     #64748B;
  --color-text-disabled:  #475569;

  /* ── Brand — CYAN (escolha do user; antes era teal) ── */
  --color-brand-300:  #67E8F9;
  --color-brand-400:  #22D3EE;   /* primary */
  --color-brand-500:  #06B6D4;
  --color-brand-600:  #0891B2;
  --color-brand-700:  #0E7490;
  --color-brand-fg:   #062B33;   /* texto sobre fundo brand-400 */

  /* ── Semantic ─────────────────────────────────────── */
  --color-success: #34D399;
  --color-warning: #FBBF24;
  --color-error:   #F87171;
  --color-info:    #60A5FA;
  --color-purple:  #A78BFA;
  --color-rose:    #FB7185;
  --color-amber:   #F59E0B;
  --color-pink:    #F472B6;

  /* ── Type ─────────────────────────────────────────── */
  --font-display: "Playfair Display", Georgia, serif;
  --font-body:    "Inter", system-ui, -apple-system, sans-serif;
  --font-mono:    "JetBrains Mono", "Fira Code", monospace;

  /* ── Radius ───────────────────────────────────────── */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 18px;
  --radius-2xl: 24px;

  /* ── Motion ───────────────────────────────────────── */
  --ease-out: cubic-bezier(.22, 1, .36, 1);
}

@layer base {
  html, body {
    @apply bg-bg text-text;
    font-family: var(--font-body);
    -webkit-font-smoothing: antialiased;
  }
}
```

**Nota sobre paleta:** existe um sistema de "accent swap" no protótipo (teal · cyan ·
emerald · sky). **Em produção, comitar UM accent.** O escolhido pelo usuário foi
**cyan (`#22D3EE`)** — toda a doc abaixo usa esses valores. Se decidirem voltar pra
teal, basta substituir `--color-brand-*` pelos valores em `tokens.css` linhas 36–43.

---

## Tipografia

Carregar via `next/font/google` em `src/app/layout.tsx`:

```tsx
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const playfair = Playfair_Display({
  subsets: ["latin"], variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"], display: "swap",
});
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
```

Aplique no `<html>`:
```tsx
<html lang="pt-BR" className={`${inter.variable} ${playfair.variable} ${mono.variable}`}>
```

### Escala de uso

| Onde | Família | Peso | Tamanho |
|---|---|---|---|
| H1 hero (landing) | `font-display` ou `font-body` | 700 / 800 | 72–76px (`text-7xl`) |
| H2 seções | `font-display` | 700 | 44–52px (`text-5xl`) |
| H3 cards/views | `font-body` | 600 / 700 | 15–22px |
| Body | `font-body` | 400 / 500 | 13–17px |
| KPI número | `font-body` | 700, `tabular-nums` | 24–32px |
| Timer/relógio | `font-mono` | 600, `tabular-nums` | 56px |
| Badge / micro label | `font-body` | 500–700, letter-spacing .08–.12em | 10–12px UPPER |
| Flourish editorial | `font-display`, *italic*, weight 500 | — | herda |

**Padrão "flourish":** em titles importantes uma palavra-chave aparece em
`font-display italic` na cor `brand-300`. Ex: "Quatro passos do *caos disperso* para
a operação executada." — ver `landing.jsx` linhas 360 e 533.

---

## Componentes-base (criar/adaptar em `src/components/ui/`)

Tudo abaixo já existe como JSX em `components.jsx` deste pacote. Tradução pra produção:

### `<OrdinumLogo size withWordmark color/>`
SVG inline: 3 círculos concêntricos + dot central com gradiente
`linear-gradient(#67E8F9 → #0E7490)`. Wordmark "Ordinum" ao lado, Inter 600, 19px.
Tamanho default 28×28.

### `<Button variant size leftIcon rightIcon fullWidth/>`
Variants: `primary` (bg `brand-400`, fg `brand-fg`, glow no hover),
`secondary` (bg `white/4`, border `white/10`), `ghost` (transparente),
`outline` (border `brand/30`, color `brand-300`), `danger`.
Sizes: `sm` (34px), `md` (42px), `lg` (52px). Border-radius 10px. Font-weight 600.

### `<Card hoverable elevated padding/>`
Bg `surface`, border `white/7`, radius 18px, padding 20px default.
Hover (quando `hoverable`): bg `surface-2`, border `white/11`, `translate-y-(-1px)`,
transição 250ms.

### `<Badge variant label dot size/>`
Pill: bg `<color>/10`, color `<color>`, border `<color>/30`, radius 6px,
fontSize 11px, weight 500. Variants mapeiam para cores de **contexto**:

| Variant | Cor (hex) | Uso |
|---|---|---|
| `empresa` | `#22D3EE` | Contexto Empresa (cyan) |
| `produto` | `#FBBF24` | Contexto Produto |
| `marketing` | `#F472B6` | Contexto Marketing |
| `dados` | `#60A5FA` | Contexto Dados |
| `pessoal` | `#FB7185` | Contexto Pessoal |
| `cliente` | `#A78BFA` | Cliente / CRM |
| `novo` | `#67E8F9` | Status: novo |
| `andamento` | `#FBBF24` | Status: em andamento (com `dot-pulse`) |
| `concluido` | `#34D399` | Status: concluído |
| `bloqueado` | `#F87171` | Status: bloqueado |

### `<IconContainer icon color size/>`
Quadrado arredondado (sm 32 / md 44 / lg 56), bg `<color>/10`, border `<color>/18`,
ícone Lucide centralizado. Cores: `teal/cyan, emerald, blue, purple, amber, rose, pink, neutral`.

### `<MetricCard titulo valor delta deltaPositivo sparkPoints sparkColor/>`
KPI card. Título (13px muted) + valor grande (32px bold tabular) + sparkline SVG +
delta colorido (success/error) + "vs mês anterior" muted.

### `<Sparkline points color width height/>`
SVG path com area gradient (color stop 0%: alpha 30, stop 100%: alpha 0) + linha
(stroke 1.8, round caps).

### `<ConcentricRings size/>`
4 anéis SVG concêntricos com gradient `#67E8F9 → #0F766E`, opacidades 0.15 → 0.51,
sobre radial gradient de glow. Logo (círculo + ponto) no centro.

---

## SCREEN 1 — Landing page

Rota: `/` (já existe como `src/app/page.tsx` — substituir conteúdo).

### Estrutura (top → bottom)

```
NavBar (sticky, transparente sobre bg radial teal)
Hero (split 1.05/.95 — copy esquerda, anel+features direita, dashboard preview embutido abaixo)
LogoCloud (7 logos placeholder)
ComoFunciona (4 cards lado-a-lado, connector line)
Pricing (3 tiers)
FinalCta (card com gradient + anéis decorativos)
Footer (1.5fr + 4 cols)
```

Container: `max-w-[1280px] mx-auto`, padding lateral 56px.

### NavBar
- Sticky top 0, padding 20×56.
- Esquerda: logo. Centro: 5 links (Recursos, Soluções ↓, Preços, Sobre, Contato).
  Hover muda cor de `text-muted` → branco em 250ms.
- Direita: "Entrar" (link muted) + Button primary "Começar grátis".
- Background fica `rgba(3,7,18,.75)` com `backdrop-blur(12px)` quando scrolled.

### Hero

Background: `radial-gradient(ellipse 1100px 700px at 65% 30%, rgba(34,211,238,.08), transparent 60%)`
sobre `bg`.

Padding `pt-20 pb-25`. Grid `1.05fr .95fr` gap 60px.

**Coluna esquerda:**
1. Eyebrow pill — bg `brand/8` border `brand/22`, ícone `square-stack` + texto
   "ORGANIZE. PRIORIZE. EXECUTE." (11px, weight 600, letter-spacing .12em, color `brand-300`).
2. H1 — duas opções (controladas por `heroStyle`):
   - **Sans bold** (default escolhido): Inter 800, 72px, line-height 1.04,
     letter-spacing -0.035em. Palavras "ordem, clareza e separação" em `brand-300`.
   - **Playfair editorial**: Playfair 700, 76px, line-height 1.05.
     Mesmas palavras em `<em>` (italic, weight 500, color `brand-300`).
3. Subhead — 17px, line-height 1.55, `text-muted`, max-width 520px.
4. CTAs row: Button primary lg "Crie seu Workspace Agora" + ícone arrow-right;
   ao lado, link "Ver como funciona" precedido por ícone play em círculo 38px
   (bg `white/4`, border `white/10`).

**Coluna direita** (height 480px relativa):
- À esquerda, `ConcentricRings` size 460 (deslocado -40px).
- À direita, 3 feature pills em coluna gap 32px:
  - "Espaços organizados" — icon `layout-grid`, color teal.
  - "Visão estratégica" — icon `layers`, color emerald.
  - "Execução com foco" — icon `git-fork`, color purple.

**Dashboard preview embutido** (abaixo do hero, mesma seção):
- Container max-width 1280px, margin-top 100px.
- Border-radius 20px, border `white/8`, sombra dupla:
  `0 40px 80px -20px rgba(0,0,0,.6), 0 0 80px -20px rgba(34,211,238,.15)`.
- Bg `linear-gradient(180deg, surface, bg-alt)`.
- Conteúdo: réplica em escala reduzida do sistema (sidebar 220px + main com 4 KPIs +
  mini-kanban 3 colunas + "Próximas ações"). Ver `landing.jsx` linhas 145–290.

### LogoCloud

Section padding 60×56, border-y `border-subtle`. Texto pequeno topo
"ORGANIZAÇÕES QUE EXECUTAM COM ORDINUM" (12px letter-spacing .18em, color `text-faint`).
Logos: 7 nomes em mix de tipografia (Inter bold uppercase para LATTICE/ARCANE/QUANTA;
Playfair italic para Pellucid/Roseira; Playfair bold para Vellovy/Northwind). Opacity .6.

→ **Substituir por logos reais de clientes quando disponíveis.**

### ComoFunciona

Padding 120×56. Header em duas colunas: H2 grande à esquerda + parágrafo curto à direita.

Grid 4 colunas, gap 20px. Cada card padding 24px, bg `surface`, border `white/7`, radius 16px.
**Connector line** entre cards: posição absolute, top 28px, left 80, right 80, height 1,
gradient horizontal `transparent → brand/30 → brand/30 → transparent`.

Cada card:
- Ícone container 56×56 radius 14, bg `bg` (#030712), border `brand/30`, ícone 26px brand.
- Numeração `01`–`04` em `font-mono`, 11px, color `brand-300`, weight 600.
- Title 18px weight 600.
- Desc 13px line-height 1.55, `text-muted`.

Steps (na ordem):
1. **01** · `compass` · Defina seus contextos · "Empresa, Pessoal, Projetos, Time. Cada esfera ganha seu próprio espaço sem se misturar."
2. **02** · `list-todo` · Capture tudo num só lugar · "Tarefas, decisões, alinhamentos, métricas. Ordinum organiza por contexto automaticamente."
3. **03** · `git-fork` · Priorize com clareza · "Kanban global cruzando contextos. Veja onde está parado e o que move o ponteiro hoje."
4. **04** · `trending-up` · Execute e acompanhe · "Dashboards executivos por contexto. Foco no que importa, sem ruído."

### Pricing

Padding 120×56, bg `linear-gradient(180deg, bg, bg-alt)`.

Header centrado: eyebrow PREÇOS + H2 "Eleve seu padrão de execução." + parágrafo.

Grid 3 colunas max-width 1080px, gap 20.

**Starter** (Grátis): variant secondary, features [1 workspace, Até 3 contextos, Kanban global, 100 tarefas/mês].

**Pro** (R$ 49 /mês por usuário) — **destacado**:
  - Border `brand/32`, sombra `0 0 60px -20px brand/30`.
  - Badge "RECOMENDADO" no canto superior direito (bg `brand-400`, fg `brand-fg`).
  - Background gradient sutil `surface-2 → surface`.
  - Features: Workspaces ilimitados, Contextos ilimitados, Dashboards executivos, Alinhamento estratégico, Integrações (Slack, Google), Suporte prioritário.

**Empresa** (Sob medida): variant outline. Features: Tudo do Pro, SSO + SCIM, Logs de auditoria, SLA dedicado, CSM dedicado.

Preço em `font-display`, 44px, weight 700. Lista de features com ícone `check` brand-300, gap 10px.

### FinalCta

Card único max-w 1100, padding 72×60, radius 24.
Bg: `linear-gradient(135deg, rgba(34,211,238,.12), rgba(13,148,136,.04) 60%, transparent), surface`.
Border `brand/22`.
Anéis concêntricos decorativos no canto direito (size 400, opacity .5).

Conteúdo (max-w 560 relative):
- H2 "Pronto para *elevar seu padrão*?" (Playfair, palavras em italic brand-300).
- Subhead "Crie seu workspace gratuito em menos de 60 segundos. Sem cartão de crédito."
- Botões: Button primary lg "Crie seu Workspace Agora" + Button ghost lg "Agendar demo".

### Footer

Padding 80×56 40px bottom. Border-top, bg `bg-alt`.
Grid `1.5fr repeat(4, 1fr)` gap 40, margin-bottom 60.

Coluna 1: Logo + descrição (max-w 280) + 3 social icons (linkedin, instagram, youtube)
em squares 34×34 radius 8.

Colunas 2–5: títulos UPPERCASE 12px weight 700, listas com 5 links cada:
- **Produto**: Recursos, Soluções, Preços, Integrações, Mudanças
- **Empresa**: Sobre, Manifesto, Carreiras, Imprensa, Contato
- **Recursos**: Blog, Central de ajuda, Status, Comunidade, API
- **Legal**: Privacidade, Termos, Segurança, LGPD, DPO

Linha inferior: "© 2026 Ordinum. Todos os direitos reservados." + "Feito com clareza no Brasil." (12px text-faint).

---

## SCREEN 2 — Sistema (shell + 4 views)

Rotas sugeridas (mapear pra `src/app/(dashboard)/` ou `src/app/app/`):

| Rota | View |
|---|---|
| `/app/visao-geral` | VisaoGeralView (default após login) |
| `/app/empresa` | EmpresaView |
| `/app/pessoal` | PessoalView (GTD) |
| `/app/projetos` | ProjetosView |
| `/app/kanban` | KanbanView |
| `/app/alinhamento` | AlinhamentoView |
| `/app/relatorios` | RelatoriosView |
| `/app/configuracoes` | ConfiguracoesView |

### Shell

Layout grid `240px 1fr`, height 100vh, overflow hidden.

#### Sidebar (240×100%)
- Bg `sidebar` (#050B17), border-right `white/7`, shadow `4px 0 24px rgba(0,0,0,.5)`.
- Padding 22×14.
- Header: logo (size 26) com padding 4×10×22.
- Nav items (8 itens listados na tabela acima): cada item é botão flex padding 10×12 radius 9.
  - Inactivo: color `text-muted`, weight 500. Hover bg `white/3`.
  - Ativo: color `brand-300`, weight 600, bg `brand/10`, border `brand/20`,
    com indicador 2px à esquerda (absolute, bg `brand-400`, border-radius 999).
- Rodapé: **PlanCard**:
  - Padding 14, radius 12, bg `linear-gradient(135deg, brand/10, brand/2)`, border `brand/18`.
  - "PLANO PRO" (11px brand-300 weight 600) + "7 de 12 contextos usados" (12px muted) +
    barra progresso 4px (preenchimento 58%, gradient `brand-300 → brand-500`).

#### TopBar
Padding 22×28, border-bottom `border-subtle`. Flex space-between.
- Esquerda: H1 (Inter 22px weight 700) + subtitle (13px muted).
- Direita: action slot + 2 botões icon (search, bell com dot vermelho 6×6 absolute) +
  user pill (avatar gradient 30×30 com iniciais "TM" + nome/role + chevron-down).

Títulos+subtítulos por view (em PT-BR, mantém o tom "direto e acolhedor"):
- visao: "Visão Geral" / "Acompanhe o que importa em todos os seus contextos."
- kanban: "Kanban Global" / "Visão única de execução cruzando todos os contextos."
- projetos: "Projetos" / "6 ativos · 1 em revisão · 1 concluído este mês."
- pessoal: "Pessoal · GTD" / "Foco hoje, claro amanhã. Captura tudo sem perder a cabeça."

### View 1: VisaoGeralView

Padding 28.

**KPI row** (grid 4 cols gap 16):
- Projetos ativos: 24, +12%, sparkline cyan
- Tarefas em andamento: 87, +8%, sparkline blue
- Concluídas: 142, +18%, sparkline emerald
- Pendências: 15, -5% (negativo), sparkline amber

**Main grid** (1.4fr 1fr gap 16):

*Card "Velocidade de execução"* (esquerda):
- Header: title + subtitle + 3 segment buttons (7d/30d/90d, 30d ativo).
- Area chart SVG: 4 séries (Empresa cyan, Produto amber, Pessoal rose, Marketing pink),
  com gradient fill (alpha 25→0), strokes 2px round, grid horizontal tracejado a 25/50/75%.
- Legend embaixo (border-top): 4 swatches 8×8 + nomes.

*Coluna direita* (gap 16):
- **Próximas ações**: lista 4 itens com número em pill cyan 22×22 + título + data muted.
- **Decisões pendentes**: 3 itens em cards `surface-2`, cada um com título + badge de contexto.

### View 2: KanbanView (interativo — drag & drop)

Padding 28, height 100%, flex column.

**Header**: filtros à esquerda (segmented "Todos contextos, Empresa, Produto, Marketing, Pessoal";
"Todos" ativo). Direita: Button secondary "Filtros" + Button primary "Novo card".

**Grid** 4 colunas iguais, gap 14, flex 1.

Cada coluna:
- Bg `surface`, border `white/7`, radius 14, padding 12.
- Header: dot 8×8 (cor por coluna: gray, amber, purple, emerald) + título + count + plus.
- Cards `KanbanCard` em coluna gap 8.

`KanbanCard`:
- Bg `surface-3`, border `white/7`, radius 10, padding 12, cursor grab.
- Título 13px weight 500 mb 10.
- Footer: badge de contexto à esquerda; à direita: dot prio (alta=error / media=warning / baixa=neutral) + avatar 22×22 gradient com iniciais.

**Drag interaction:**
- `draggable` + `onDragStart` salva `{cardId, fromCol}`.
- `onDragOver` em coluna marca hover (border brand/40, bg surface-2).
- Coluna em hover mostra **drop hint**: div border dashed `brand/50`, padding 16×12,
  centro "Solte aqui" (12px weight 500 brand-300).
- `onDrop` move card entre colunas.
- Card sendo arrastado: opacity 0.4, transition 150ms.

**Recomendação produção:** trocar HTML5 drag-and-drop por **@dnd-kit/core** (mais acessível,
suporta keyboard, animações suaves). Estado no `kanbanStore` Zustand (já existe).

Colunas: `fazer`, `andamento`, `revisao`, `concluido`. Conteúdo seed em `system.jsx` linhas 226–262.

### View 3: ProjetosView

Padding 28, grid 1.3fr 1fr gap 18, height 100%.

**Esquerda — grade de projetos**:
- Filtros segment: "Todos 6 / Ativos 4 / Em revisão 1 / Concluídos 1" + Button "Novo projeto".
- Grid 2 colunas, cards `Card hoverable` clicáveis:
  - Header: título + ícone `more-horizontal`.
  - Row: badge contexto + badge status (com dot).
  - Barra de progresso (height 5, gradient `brand-300 → brand-500`, ou success se concluído).
  - Footer: stack de avatares 24×24 (margin-left -8 a partir do 2º) + "X/Y tarefas · prazo".
- Card selecionado: border `brand/35`, bg `surface-2`.

**Direita — painel detalhe**:
- Badge contexto + ícone external-link.
- H2 nome do projeto (Playfair 22px).
- Descrição 13px muted.
- Grid 3 stats (Concluído, Total, Prazo): cada uma card `surface-2`,
  ícone 11px + label faint + valor 16px weight 700.
- **Timeline de marcos**:
  - Linha vertical à esquerda, dots 10×10:
    - `done=true`: dot success, riscado + faint.
    - `done=false, active=true`: dot brand-300, ring `brand/30`, glow `brand/10`, weight 600.
    - `done=false`: dot `surface-3`.
  - Texto + data à direita de cada dot.

Seed em `system.jsx` linhas 459–479 (projects) e 521–528 (milestones).

### View 4: PessoalView (GTD)

Padding 28, grid 1.4fr 1fr gap 18.

**Esquerda — coluna principal:**

*Card "Hoje, terça-feira"* (Playfair com "terça-feira" em italic brand-300):
- Header: título + "X de Y concluídas".
- Barra de progresso (gradient brand-300 → brand-500).
- Lista de tarefas (`GtdRow` clicável toggle):
  - Checkbox 18×18 radius 6: inactive border `white/11`; active bg `brand-400` com check 11px brand-fg weight 3.
  - Texto: branco (riscado + faint quando done).
  - Badge contexto à direita.
  - Time chip mono `surface/3`, padding 2×7, min-width 38, center.
- Botão "Adicionar tarefa" full-width dashed.

*Card "Próximos dias"*: mesma lista, sem header de progresso.

**Direita — coluna lateral** (gap 16):

*Card FOCO AGORA* (gradient header `brand/10 → brand/2`):
- Header: "FOCO AGORA" eyebrow + ícone zap, título "Preparar slides para 1:1 com diretor", badge Empresa.
- Body: timer mono 56px "23:47" (tabular) + "Pomodoro em andamento" + Button secondary "Pausar" / Button outline "Encerrar".

*Card "Distribuição por contexto"*: 5 barras horizontais (Empresa 12, Produto 8, Pessoal 6, Marketing 4, Dados 3).
Cada barra: nome + count à direita, bar 6px com cor do contexto.

*Card "Streak"*:
- Ícone flame 28px amber dentro de container 60×60 gradient amber.
- "14 dias" 28px weight 700 + "Cumprindo as 3 tarefas-chave" 12px muted.

---

## Interações & comportamento

### Hover/focus states (todo o app)
- Focus-visible: `outline: 2px solid rgba(34,211,238,.7); outline-offset: 2px`.
- Card hoverable: border 7→11, bg surface→surface-2, translate-y -1px, 250ms ease-out.
- Button primary hover: bg `brand-400 → brand-300`, shadow expansão `-6px → -8px`.
- Nav item hover (inactive): bg `transparent → white/3`.

### Animações
- `fadeInUp` 350ms ease-out — entrada de views/cards.
- `dot-pulse` 1.8s infinite — apenas em badges com status `andamento`/`em_andamento`.
- `shimmer` 1.8s infinite — skeletons.
- Easing default: `cubic-bezier(.22, 1, .36, 1)`.
- Respeitar `prefers-reduced-motion: reduce`.

### Drag & drop (Kanban)
Migrar HTML5 → `@dnd-kit/core`. Mover card publica `kanbanStore.moveCard(cardId, toCol)`.

### Toggle (Pessoal)
Click no checkbox ou linha alterna `done`. Persistir em `pessoalStore`.

### Navegação (Sidebar)
Route-based via Next.js. Indicador animado opcional (Framer Motion `layoutId`).

---

## Conteúdo / Microcopy (mantém o tom)

**Tom:** "direto e acolhedor" — confiante, profissional, claro. PT-BR sempre.

| Lugar | Copy |
|---|---|
| Eyebrow do hero | "ORGANIZE. PRIORIZE. EXECUTE." |
| H1 hero | "Sistema executivo para *ordem, clareza e separação* de contextos." |
| Subhead hero | "O produto desenvolvido para organizar responsabilidades mistas em espaços operacionais claros, reduzindo o ruído na tomada de decisão." |
| CTA primário | "Crie seu Workspace Agora" |
| CTA secundário | "Ver como funciona" |
| Pricing CTA Starter | "Começar grátis" |
| Pricing CTA Pro | "Iniciar Pro" |
| Pricing CTA Empresa | "Falar com vendas" |
| Final CTA H2 | "Pronto para *elevar seu padrão*?" |
| Final CTA sub | "Crie seu workspace gratuito em menos de 60 segundos. Sem cartão de crédito." |
| Sistema Pessoal H1 | "Hoje, *terça-feira*" (dia da semana dinâmico em italic brand) |
| Empty state padrão | "Que tal criar o primeiro ___?" — nunca "Nenhum resultado encontrado." |

**Imperativo nos CTAs**: `Confirmar`, `Adicionar tarefa`, `Marcar como concluído`,
`Novo projeto`, `Reagendar`.

**Números**: sempre `font-variant-numeric: tabular-nums` (`tabular` utility class).
**Datas**: `dd/MM` ou `dd/MM/yyyy`. **Telefone**: `(11) 99988-7766`. **Moeda**: `R$ 1.234,56`.

---

## Ícones (Lucide)

Já está no codebase via `lucide-react`. Lista usada neste design:

```
home · building-2 · user · folder-kanban · columns-3 · compass · bar-chart-3 · settings
square-stack · layout-grid · layers · git-fork · trending-up · list-todo
search · bell · chevron-down · plus · filter · sliders-horizontal · more-horizontal
arrow-right · play · check · file-text · target · calendar · zap · flame · pause · square
external-link · list · users
linkedin · instagram · youtube
```

Defaults: `size 16` inline, `20` nav/buttons, `24` headers. `strokeWidth 1.8` inactive, `2.2–2.5` active.

---

## Estado (Zustand stores existentes)

| View | Store | Estado mínimo |
|---|---|---|
| Visão Geral | `dashboardStore` | KPIs (calculados), série temporal por contexto |
| Kanban | `kanbanStore` | `{ colunas: { fazer, andamento, revisao, concluido } }`, `moveCard(id, toCol)` |
| Projetos | `projetosStore` | `projects[]`, `selectedId`, `selectProject(id)` |
| Pessoal | `pessoalStore` | `tasks[]`, `toggleTask(id)`, `addTask(t)`, `pomodoro state` |

Schemas TypeScript em `src/types/` já cobrem `kanban.ts`, `projetos.ts`, `pessoal.ts` — alinhar.

---

## Lista de arquivos neste pacote

| Arquivo | O que é |
|---|---|
| `Ordinum.html` | Entry point do protótipo (design canvas com Tweaks) |
| `tokens.css` | CSS vars completas + animações + cards/utilities |
| `components.jsx` | Primitives (Button, Card, Badge, IconContainer, MetricCard, Sparkline, ConcentricRings, OrdinumLogo) |
| `landing.jsx` | Toda a landing page (NavBar, Hero, LogoCloud, ComoFunciona, Pricing, FinalCta, Footer + DashboardPreviewMini) |
| `system.jsx` | Shell + 4 views (Visão Geral, Kanban, Projetos, Pessoal) |
| `screenshots/01-landing-hero.png` | Hero (eyebrow + H1 + subhead + CTAs + anel concêntrico + 3 feature pills) |
| `screenshots/02-landing-preview-logos.png` | Dashboard preview embutido + logo cloud |
| `screenshots/03-landing-como-funciona.png` | Seção "Como funciona" (4 passos + connector line) |
| `screenshots/04-landing-pricing.png` | 3 tiers de pricing (Starter / Pro destacado / Empresa) |
| `screenshots/05-landing-cta-footer.png` | Final CTA card + Footer 5 colunas |
| `screenshots/06-sistema-visao-geral.png` | Dashboard com KPIs, area chart, próximas ações, decisões |
| `screenshots/07-sistema-kanban.png` | Kanban Global 4 colunas (com drag & drop no protótipo) |
| `screenshots/08-sistema-projetos.png` | Grid de projetos + painel de detalhe com timeline |
| `screenshots/09-sistema-pessoal.png` | GTD (hoje/próximos + foco/pomodoro + distribuição + streak) |

Abra `Ordinum.html` em um browser para ver tudo funcionando (drag-and-drop, navegação,
checkboxes, hover states). O painel **Tweaks** no canto direito permite trocar `heroStyle`
e `accent` em tempo real.

---

## Tarefa para o Claude Code

1. Atualizar `src/app/globals.css` com o `@theme` completo deste handoff.
2. Carregar Inter + Playfair Display + JetBrains Mono via `next/font/google` em `layout.tsx`.
3. Garantir que `lucide-react`, `@dnd-kit/core`, `framer-motion` estejam instalados.
4. Criar/adaptar primitivos em `src/components/ui/`: `Button`, `Card`, `Badge`, `IconContainer`, `MetricCard`, `Sparkline`, `OrdinumLogo`.
5. Implementar `src/app/page.tsx` (landing) seguindo a spec da SCREEN 1.
6. Implementar layout `src/app/(dashboard)/layout.tsx` com Sidebar + TopBar.
7. Implementar as 4 views (`visao-geral`, `kanban`, `projetos`, `pessoal`) seguindo a spec da SCREEN 2.
8. Conectar a stores Zustand existentes (não criar novas).
9. Para Kanban: usar `@dnd-kit` em vez de HTML5 DnD nativo.
10. Validar em dark mode (único modo). Validar `prefers-reduced-motion`.

**Não copie os `.jsx` deste pacote literalmente** — eles usam `style={{}}` inline e
React global, padrões que não batem com o codebase. Traduza tudo para Tailwind classes +
componentes shadcn/ui idiomáticos.
