# Handoff: Ordinum — Parte 2 (Auth · Empresa · Alinhamento · Configurações)

## Contexto

Esta é a **parte 2** do redesign do Ordinum. A parte 1 (landing page + dashboard +
kanban global + projetos + pessoal) já foi implementada por você na sessão anterior.

**Agora preciso que você redesenhe estas páginas que ainda estão com classes do tema
claro antigo** (`text-neutral-*`, `bg-white`, `border-neutral-200`, etc):

| Página | Rota |
|---|---|
| Login | `/login` (`src/app/(auth)/login/page.tsx`) |
| Cadastro | `/cadastro` (`src/app/(auth)/cadastro/page.tsx`) |
| Convite | `/convite/[token]` (`src/app/(auth)/convite/[token]/`) |
| Lista de empresas | `/app/empresa/` (redirect — mas ver lista também) |
| Empresa · Lançamentos | `/app/empresa/[id]/lancamentos` |
| Empresa · DRE | `/app/empresa/[id]/dre` |
| Empresa · Pró-labore | `/app/empresa/[id]/prolabore` |
| Alinhamento | `/app/alinhamento` |
| Sessão ativa | `/app/alinhamento/[id]` |
| Configurações | `/app/configuracoes` |

Tudo deve seguir **a mesma DNA visual** já aplicada na parte 1: dark navy
(`#03060E` / `#0A1525`), accent **cyan** (`#22D3EE` / `#67E8F9`), Inter + Playfair,
tokens `--color-brand-*` / `--color-surface-*` / `--color-text-*` definidos em
`src/app/globals.css`.

---

## Como usar este pacote

1. Abra **`Ordinum Extras.html`** em um browser → você verá um design canvas com
   10 artboards organizados em 4 seções (Auth · Empresa · Alinhamento · Configurações).
   Pan/zoom funciona; cada artboard abre em focus mode com ←/→/Esc.
2. Veja os **screenshots em `screenshots/`** — uma imagem por tela, na ordem.
3. Use os `.jsx` como **referência visual** (não copie literalmente — traduza pra
   Tailwind classes + shadcn idiomáticos do codebase).

Os arquivos `components.jsx`, `system.jsx` e `tokens.css` neste pacote são **idênticos
aos da parte 1** — incluídos só pra `Ordinum Extras.html` rodar offline.
O único arquivo novo é **`views-extras.jsx`**.

---

## Convenções compartilhadas (já existem no codebase após parte 1)

Tudo que segue **assume** que estes elementos já existem (foram criados na parte 1):

- Tokens `@theme` em `globals.css` (`--color-bg`, `--color-surface`, `--color-brand-*`, etc).
- Fontes via `next/font/google` (Inter + Playfair Display + JetBrains Mono).
- Primitivos em `src/components/ui/`: `Button`, `Card`, `Badge`, `IconContainer`, `OrdinumLogo`.
- Layout `(dashboard)/layout.tsx` com `AppSidebar` + `AppTopBar`.
- `lucide-react` instalado.

Se algo não existir, peça antes de improvisar.

---

## SCREEN 1 — Login

**Rota:** `/login` · arquivo: `src/app/(auth)/login/page.tsx`

Atualmente: `<div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4">` etc.
Mantenha a lógica de auth (`supabase.auth.signInWithPassword`), só **troque o visual**.

### Layout

Página full-bleed centrada. Background:
```
radial-gradient(ellipse 800px 500px at 50% 20%, rgba(34,211,238,.08), transparent 60%), var(--color-bg)
```

Atrás do card, um SVG decorativo de **anéis concêntricos** (componente `<ConcentricRings size={620}>`
que já existe — opacidade .25, centralizado, `pointer-events-none`).

### Estrutura

```
Container 440px wide
  Logo Ordinum (top, centralizado, size 36)
  Card (padding 36, gradient surface-2→surface, border white/8, shadow forte)
    H1 (Playfair 28, weight 700) — "Bem-vindo de volta."
    Subhead (14, text-muted) — "Entre no seu workspace e continue de onde parou."
    Form
      Field "E-mail" (left icon mail, type email)
      Field "Senha" (left icon lock, type password)
      Row: [□ Manter conectado]  [Esqueci minha senha →brand-300]
      Button primary lg fullWidth "Entrar →"
      Divider "OU CONTINUE COM" (linha + texto + linha)
      Grid 2 cols: Button secondary "Google" + "SSO"
  Footer text (centralizado, 13px) — "Não tem conta ainda? Crie seu workspace →"
```

### AuthField (componente reutilizável — defina-o em `src/components/ui/`)

- Label 12px weight 600 color text-muted.
- Input 44px height, padding `0 14px` (40 com left icon), bg `var(--color-input)`,
  border 1px `var(--color-border)`, radius 10px.
- **Focus state**: border `rgba(34,211,238,.4)`, box-shadow `0 0 0 3px rgba(34,211,238,.08)`.
- Left icon color: faint quando blur, brand-300 quando focused.
- Hint embaixo (11px text-faint) quando aplicável.

### Microcopy

| Campo | Texto |
|---|---|
| H1 | "Bem-vindo de volta." |
| Subhead | "Entre no seu workspace e continue de onde parou." |
| Label e-mail | "E-mail" · placeholder "voce@empresa.com" |
| Label senha | "Senha" · placeholder "••••••••" |
| Checkbox | "Manter conectado" |
| Link | "Esqueci minha senha" |
| CTA | "Entrar" |
| Divider | "OU CONTINUE COM" |
| Social | "Google" / "SSO" |
| Footer | "Não tem conta ainda? **Crie seu workspace**" |

---

## SCREEN 2 — Cadastro

**Rota:** `/cadastro` · arquivo: `src/app/(auth)/cadastro/page.tsx`

Mesmo AuthShell do Login. Cardo com:

```
H1 (Playfair 28) — "Crie seu workspace."
Subhead — "Em 60 segundos. Sem cartão de crédito. Comece organizando hoje."
Form
  Field "Seu nome" (icon user) · placeholder "Thiago Martins" · autoFocus
  Field "E-mail corporativo" (icon mail, type email)
  Field "Senha" (icon lock, type password) · hint: "Use letras, números e ao menos um símbolo."
  Checkbox + label: "Concordo com os [Termos de uso] e a [Política de privacidade] da Ordinum."
    (checkbox custom: 16×16 radius 4, quando marcado bg cyan-tint + border cyan + ícone check)
  Button primary lg fullWidth "Criar workspace →"
Footer — "Já tem conta? Entrar"
```

---

## SCREEN 3 — Convite (`/convite/[token]`)

Mesmo AuthShell. Layout um pouco diferente — não tem form, é uma **confirmação**:

```
IconContainer cyan lg (icon "mail"), centralizado
Badge "VOCÊ FOI CONVIDADO" (eyebrow cyan)
H2 (Playfair 24) — "Marina Lopes (em italic cyan-300) convidou você para o workspace"
Nome workspace (18px weight 600) — "Northwind Estúdio"
Texto descritivo:
  "Como [Administrador], você terá acesso completo a projetos, kanban global,
   alinhamentos e financeiro."
Card sumário (bg input, padding 16, radius 12):
  Avatar 40×40 gradient cyan + iniciais
  Nome + e-mail
  Badge "Admin" (variant empresa)
Button primary lg fullWidth "Aceitar e entrar →"
Footer — "Não é você? Recusar convite"
```

Dados do convidante (nome, e-mail, role) e nome do workspace vêm do **token** (parse no server).

---

## SCREEN 4 — Empresa · Lista

**Rota:** `/app/empresa` · arquivo: `src/app/app/empresa/page.tsx`

> Hoje essa rota é só um **redirect** para `/app/empresa/[id]/lancamentos`.
> **Sugestão:** se o workspace tem mais de uma empresa, mostre esta lista
> antes de redirecionar. Se só tem uma, mantém o redirect direto.

Shell padrão (`AppSidebar` ativo em `empresa` + `AppTopBar`). Padding 28.

Header action: Button primary sm "+ Nova empresa".

Grid 2 colunas (`grid-cols-2 gap-4`). Cada card:

```
Header row
  Logo placeholder 48×48 (gradient cyan-tint + border cyan/22 + letra inicial em Playfair 22)
  + Nome (16 weight 600) + CNPJ (mono 11px faint)
  [right] Saúde pill: dot + label (verde "Saudável" / amarelo "Atenção" / vermelho "Crítico")
Grid 2x1: KPIs
  Faturamento mês (label faint + valor 18 weight 700 mono)
  Margem líquida (mesma estrutura — cor por valor: ≥20% emerald, ≥0 amber, <0 rose)
Progress bar: Meta R$ XX.XXX · % (gradient cyan; emerald se ≥100%)
```

Card inteiro `hoverable` → click leva para `/app/empresa/[id]/lancamentos`.

### Estado

Seed data está no `.jsx` linhas 268–281. Fonte real: `empresas` table no Supabase.
Cálculo de saúde usa `lib/utils/calculators.ts → saudeEmpresa()` (já existe).

---

## SCREEN 5 — Empresa · Lançamentos

**Rota:** `/app/empresa/[id]/lancamentos` · arquivo: `src/app/app/empresa/[id]/lancamentos/page.tsx`

Shell padrão. TopBar action: Button secondary "Exportar" + Button primary "Novo lançamento".

### Sub-nav (página interna)

Acima do conteúdo, segmented buttons (cyan ativo, secondary inactivos):
- **Lançamentos** (ativo) · DRE · Pró-labore · Histórico

À direita: **month picker** (pill com icon calendar + "Maio · 2026" + chevron-down).

### Tabs de tipo (receita/despesa/pró-labore)

3 botões pílula colorida (emerald · rose · blue), só o ativo com tint + border colorida.
Dot 6×6 da cor + label.

### Tabela de lançamentos

```
Card padding 0, overflow hidden
table:
  thead bg surface-2: Data · Descrição · Categoria · Status · Valor · [actions]
    headers 11px weight 700 letter-spacing .08em color text-muted
  tbody:
    Data (mono 12 muted)
    Descrição (13.5 white)
    Categoria (mini-badge na cor da categoria)
    Status (Badge "Pago" concluido OR "A receber" andamento)
    Valor (mono 13 weight 600; despesas mostram "−" e color rose)
    Actions (icon more-horizontal)
  Footer row (bg surface-2):
    TOTAL · N lançamentos (col-span 4)
    Valor total (mono 15 weight 700, cyan-300 OR rose se despesa)
```

### Categorias (cores)

| Categoria | Cor |
|---|---|
| `servicos` | `#5EEAD4` |
| `retainer` | `#34D399` |
| `treinamento` | `#A78BFA` |
| `produto` | `#FBBF24` |
| `operacional` | `#94A3B8` |
| `impostos` | `#F87171` |
| `custos_diretos` | `#FB7185` |
| `prolabore` | `#60A5FA` |

### Estado

Conecte ao `useEmpresaStore` (já existe). Dados: `receitas`, `despesas`, `prolabores`
filtrados pelo mês selecionado.

---

## SCREEN 6 — Empresa · DRE

**Rota:** `/app/empresa/[id]/dre` · arquivo: `src/app/app/empresa/[id]/dre/page.tsx`

Substituir o `<PainelDRE>` light-theme atual por este layout.

Shell padrão. TopBar action: Button secondary "Maio · 2026" + Button secondary "PDF".

Grid `1.3fr 1fr gap 18`, height 100%.

### Esquerda — Breakdown DRE

Card padding 26. Cada linha:

```
[label]                                          [valor mono tabular]
```

Estrutura (em ordem):

1. **RECEITA BRUTA** (bold uppercase white, valor branco) — destaque
2. `(−) Impostos (Simples Nacional)` (indent 22px, muted) — vermelho subtle
3. `(−) Custos diretos (freelas, materiais)` (indent, muted)
4. **LUCRO BRUTO** (bold uppercase, valor color cyan-300)
5. `(−) Despesas operacionais (software, contador)` (indent, muted)
6. **LUCRO OPERACIONAL** (bold uppercase, valor cyan-300)
7. `(−) Pró-labore dos sócios` (indent, muted)
8. **RESULTADO LÍQUIDO** (big — fontSize 22, color emerald se ≥0 ou rose se <0)

Cada linha tem `border-bottom: 1px solid var(--color-border-subtle)`.

### Direita (col gap 16)

**Card "MARGEM LÍQUIDA"** (com IconContainer emerald sm + eyebrow):
- Valor 48px Playfair weight 700, color emerald.
- Texto "Ideal acima de **20%**. Você está em uma faixa saudável." (12px muted).
- Mini progress bar (gradient amber→emerald).

**Card "Comparativo · últimos 6 meses"**:
- 6 colunas de duplas (receita cyan top + despesa rose bottom, empilhadas verticalmente).
- Último mês destacado (cor sólida) vs anteriores (transparência .4).
- Label do mês embaixo (10px); "Mai" em branco weight 600.
- Legenda embaixo: swatches Receita / Despesa.

**Card "Insight do mês"** (cyan gradient bg + cyan border):
- IconContainer cyan sm "lightbulb".
- "Despesas caíram **12%** vs abril enquanto a receita cresceu **8%**. Continue assim."

### Cálculo

Use `lib/utils/calculators.ts → calcularDRE()` (já existe). Argumentos:
`receitaBruta, impostos, custosDiretos, despesasOperacionais, prolabore`.

---

## SCREEN 7 — Empresa · Pró-labore

**Rota:** `/app/empresa/[id]/prolabore` · arquivo: `src/app/app/empresa/[id]/prolabore/page.tsx`

Shell padrão. TopBar action: Button primary "+ Registrar pró-labore".

Grid `1.3fr 1fr gap 18`.

### Esquerda

**Card "Distribuição vigente"**:
- Subtítulo: "Total mensal: R$ XX.XXX".
- **Stacked bar** (height 14, radius 999, border): segmentos por sócio com gradients distintos.
- Lista de sócios, cada um em card `surface-2`:
  - Avatar 44×44 com gradient característico + iniciais.
  - Nome + role + "X% das cotas" (faint).
  - À direita: valor mono 18 weight 700 + "mensal".

**Card "Registrar pró-labore"** (form preview):
- Grid 2-1: Sócio (dropdown) + Valor (mono).
- Grid 1-1: Data (mono) + Observação (texto).
- Button "Salvar lançamento".

Cada "field" é uma div estilizada (não input real — pode trocar por input real em produção):
padding `10px 14px`, bg `--color-input`, border `--color-border`, radius 10.

### Direita

**Card "Histórico"** com lista de meses anteriores:
- Mês (13.5 weight 500) + "2 sócios" (faint 11px).
- À direita: valor mono + Badge "Pago" concluido.

---

## SCREEN 8 — Alinhamento (lista + iniciar)

**Rota:** `/app/alinhamento` · arquivo: `src/app/app/alinhamento/page.tsx`

Shell padrão. Sem TopBar action.

Grid `1.1fr 1fr gap 20`.

### Esquerda — Iniciar nova sessão

**Card hero** (gradient surface-2→surface, border cyan/18, anéis concêntricos decorativos no canto):
- Eyebrow "NOVA SESSÃO" (cyan).
- H2 (Playfair 32) — "Iniciar *alinhamento* agora" (alinhamento em italic cyan-300).
- Subhead — "Capture pauta, decisões e plano de ação. Tudo flui pro Kanban global automaticamente."
- Label "Modo do alinhamento" + grid 3 cols:
  - **Solo** (icon user) — "Sua revisão semanal"
  - **Casal** (icon heart) — "Você + parceiro(a)"
  - **Sócios** (icon users) — "Reunião com sócios" *(ativo)*
- Selecionado: bg `rgba(34,211,238,.10)`, border `rgba(34,211,238,.35)`, ícone+label cyan.
- Button primary lg "▶ Iniciar sessão" → chama `iniciarSessao(workspaceId, tipo)` e
  redireciona para `/app/alinhamento/[id]`.

### Direita — Histórico

Header "Histórico de sessões" + "Ver tudo".

Cards `hoverable`, cada um:
- Dia 46×46 (surface-2 + border): mês em cima (9px faint) + dia (Playfair 18 weight 700).
- Título + meta row (icon clock + duração, icon check-square + N ações).
- Chevron-right à direita.

### Modo

O store `alinhamentoStore` (já existe) tem o conceito de modo. O `workspaces.modo`
do Supabase pode ser `solo` / `casal` / `socios`. O modo selecionado vira o `tipo`
da sessão (`revisao_solo` se solo, `semanal` caso contrário).

---

## SCREEN 9 — Alinhamento · Sessão ativa

**Rota:** `/app/alinhamento/[id]` · arquivo: `src/app/app/alinhamento/[id]/page.tsx`

Shell padrão. TopBar title: "Sessão em andamento · Sócios". Subtitle: timer ao vivo
("00:18:42 · 3 ações criadas até agora"). Actions: Button secondary "Pausar" +
Button primary "Encerrar e salvar".

Grid 2 cols igual.

### Esquerda — Pauta + Anotações

**Card "Pauta automática"**:
- Header com contador "X de Y cobertos".
- Lista de items (checkbox 18×18 + texto + resposta opcional):
  - **done=true**: checkbox emerald preenchido com check, texto faint (sem riscar).
    Mostra resposta capturada embaixo (12px muted, lineHeight 1.5).
  - **active=true**: checkbox cyan (não preenchido), texto branco weight 600,
    background do row é `rgba(34,211,238,.06)` + border cyan/30.
    Embaixo: "EM DISCUSSÃO ›" (11px cyan weight 600 letter-spacing .08em).
  - **default**: checkbox vazio cinza, texto branco weight 500.

Pauta padrão (todas em PT-BR, tom direto):
1. "Como estamos vs metas do trimestre?"
2. "Decisões pendentes"
3. "Bloqueios da semana"
4. "Compromissos para próxima semana"
5. "Riscos identificados"

**Card "Anotações da sessão"**:
- `<textarea>` (em produção) com placeholder "Anotações gerais, pautas extras...".
- Visual: bg `--color-input`, border `--color-border`, padding 14, radius 10,
  minHeight 130, fontSize 13 color muted lineHeight 1.6.

### Direita — Plano de ação

Card bg `surface-2` (destaque sutil), display flex column.

Header: "Plano de ação" + Badge "N ações" (variant empresa).
Subhead: "Estas ações irão para o Kanban global automaticamente."

**Quick add** (dashed border):
- Plus icon cyan + "Adicionar nova ação..." (text-muted) + shortcut "⌘ + N" (mono faint).
- Em produção: vira input real on click.

Lista de cards de ação (each):
- Título 13.5 white lineHeight 1.4.
- Footer row: avatar 22×22 (linear-gradient slate) + data (12 muted) à esquerda;
  prioridade (dot + label colorida — alta rose / media amber / baixa neutral) à direita.

### Persistência

Salvar a sessão (botão "Encerrar") chama `encerrarSessao(notas, acoes)` que insere
as ações no `kanbanStore` automaticamente (lógica já no store atual).

---

## SCREEN 10 — Configurações

**Rota:** `/app/configuracoes` · arquivo: `src/app/app/configuracoes/page.tsx`

Substituir todo o conteúdo atual (light theme com `bg-white`, `text-neutral-*`).

Shell padrão. Sem TopBar action.

Grid `220px 1fr gap 24`. Internal sub-nav à esquerda, conteúdo à direita.

### Sub-nav (esquerda)

Lista vertical de botões (mesmo padrão de nav-item do sidebar — só q em vez de rotas, troca seção):

| Key | Label | Icon |
|---|---|---|
| `workspace` | Workspace | building |
| `membros` | Membros | users |
| `plano` | Plano e faturamento | credit-card |
| `integracoes` | Integrações | plug |
| `gamificacao` | Gamificação | gamepad-2 |
| `notificacoes` | Notificações | bell |
| `aparencia` | Aparência | palette |
| `seguranca` | Segurança | shield |
| `lgpd` | Privacidade | scale |

### Conteúdo (direita) — seção "Workspace" mostrada como exemplo

3 cards empilhados:

**Card "Identidade do workspace"**:
- H3 + subhead "Nome, logo e fuso horário que todo o time vê."
- Row: Logo box 72×72 (mesma estética do logo de empresa) + Button secondary
  "↑ Trocar logo" + hint "PNG ou SVG · mín 256×256 · max 2MB".
- Grid 2 cols com 4 fields: Nome / Slug / Fuso horário / Moeda padrão.
- Slug field tem **sub-hint** mono "northwind.ordinum.app".

**Card "Preferências"** (3 rows com toggles):
- Cada row: IconContainer + título + descrição + Toggle.
  - **Gamificação** (purple, icon gamepad-2, ON): "Pontos, streaks e badges...
    Reconhece trabalho real — nunca pune."
  - **Notificações por e-mail** (amber, icon bell, ON): "Resumo diário das ações
    pendentes, decisões e alinhamentos do dia."
  - **Relatório semanal automático** (cyan, icon send, OFF): "Envia toda segunda 8h:
    progresso por contexto + KPIs do workspace."

**Toggle** (componente novo — defina em `src/components/ui/`):
- 40×22 pill com border. Knob 16×16 round.
- ON: bg `--color-brand-400` + border `--color-brand-300`, knob esquerda 19px, knob cor `--color-brand-fg`.
- OFF: bg `rgba(255,255,255,.08)` + border strong, knob esquerda 2px, knob cor white.
- Transição all 150ms ease.

**Card "Plano atual"** (cyan gradient + cyan border):
- Eyebrow "PLANO ATUAL" (cyan).
- H3 (Playfair 24) — "Pro · 5 usuários".
- Subtext: "Renova em **30 de junho** · `R$ 245`/mês".
- À direita: Button outline "Gerenciar plano".
- Grid 3 cols com mini-stats: Workspaces / Membros / Contextos (label faint + valor white).

### Estado

- `gamificacaoAtiva` → `useGamificationStore` (já existe).
- Outras toggles → criar key correspondente no store de workspace.

---

## Componentes novos a criar em `src/components/ui/`

A parte 1 já criou os primitivos básicos. Esta parte adiciona:

| Componente | Onde aparece |
|---|---|
| `<AuthShell title subtitle footerText footerLink>` | Login, Cadastro, Convite |
| `<AuthField label type leftIcon hint>` | Auth pages |
| `<Toggle on onChange/>` | Configurações |
| `<EmpresaLogo letter size/>` | Lista de empresas, settings |
| `<KpiTile label value color/>` | Mini-stats em cards |
| `<MonthPicker value onChange/>` | Lançamentos |
| `<CategoryBadge cat/>` | Tabela de lançamentos (mapeia categoria → cor) |
| `<HealthPill status/>` | Lista empresas (verde/amarelo/vermelho) |

---

## Microcopy — tom "direto e acolhedor" (PT-BR)

| Página | Lugar | Copy |
|---|---|---|
| Login | H1 | "Bem-vindo de volta." |
| Login | CTA | "Entrar" |
| Cadastro | H1 | "Crie seu workspace." |
| Cadastro | Subhead | "Em 60 segundos. Sem cartão de crédito. Comece organizando hoje." |
| Cadastro | Termos | "Concordo com os Termos de uso e a Política de privacidade da Ordinum." |
| Convite | Eyebrow | "VOCÊ FOI CONVIDADO" |
| Convite | H2 | "*[Nome]* convidou você para o workspace" (nome em italic cyan) |
| Convite | CTA | "Aceitar e entrar" |
| Empresa Lista | TopBar | "Empresas" / "Gestão financeira das empresas do seu workspace." |
| Empresa Lança. | TopBar | "[Nome] · Lançamentos" / "Receitas, despesas e pró-labore do mês corrente." |
| Empresa DRE | TopBar | "[Nome] · DRE" / "Demonstração de Resultado simplificada — [mês] de [ano]." |
| Empresa Pró | TopBar | "[Nome] · Pró-labore" / "Distribuição entre sócios e histórico." |
| Alinha. lista | H2 hero | "Iniciar *alinhamento* agora" (italic cyan) |
| Alinha. ativa | TopBar | "Sessão em andamento · [Modo]" / "[Timer] · N ações criadas até agora" |
| Alinha. ativa | Quick add | "Adicionar nova ação..." (faint) |
| Config | TopBar | "Configurações" / "Workspace, integrações, plano e preferências globais." |
| Config | Gamif desc | "Pontos, streaks e badges ao completar ações. Reconhece trabalho real — nunca pune." |

---

## Checklist para você (Claude Code)

- [ ] Trocar `bg-white`, `text-neutral-*`, `border-neutral-200` por tokens dark
      em **todos** os arquivos das 10 páginas listadas.
- [ ] Criar/adaptar os componentes novos da tabela acima.
- [ ] **Auth pages**: implementar AuthShell + AuthField; aplicar nos 3 (login, cadastro, convite).
      Manter toda a lógica Supabase existente.
- [ ] **Empresa pages**: layout do shell já existe; trocar conteúdo de `Lancamentos`, `DRE`,
      `Prolabore` + criar a Lista (se decidirem mostrá-la antes do redirect).
- [ ] **Alinhamento**: refazer a `page.tsx` (lista) e o `[id]/page.tsx` (sessão ativa).
      Substituir os componentes em `src/components/alinhamento/` (`PautaSection`,
      `CardAcao`, `AdicionarAcao`) — ou pelo menos atualizar suas classes.
- [ ] **Configurações**: refazer com sub-nav lateral + 3 seções de exemplo.
      Conectar gamification toggle ao store existente.
- [ ] Validar dark-only. Validar `prefers-reduced-motion`.
- [ ] **NÃO** mexer em rotas, schemas Supabase ou stores Zustand — só visual.

---

## Arquivos neste pacote

| Arquivo | O que é |
|---|---|
| `Ordinum Extras.html` | Design canvas — abre no browser, mostra todos os 10 artboards |
| `views-extras.jsx` | **Único arquivo novo** — todas as 10 views |
| `tokens.css` | Cópia idêntica à parte 1 (pra o HTML rodar offline) |
| `components.jsx` | Cópia idêntica à parte 1 |
| `system.jsx` | Cópia idêntica à parte 1 (fornece `AppSidebar`, `AppTopBar`) |
| `screenshots/01-login.png` | Tela de login |
| `screenshots/02-cadastro.png` | Cadastro / criar workspace |
| `screenshots/03-convite.png` | Aceitar convite |
| `screenshots/04-empresa-lista.png` | Grid de empresas com KPIs |
| `screenshots/05-empresa-lancamentos.png` | Tabela de lançamentos (tabs receita/despesa/pró-labore) |
| `screenshots/06-empresa-dre.png` | DRE breakdown + margem + comparativo + insight |
| `screenshots/07-empresa-prolabore.png` | Distribuição entre sócios + form + histórico |
| `screenshots/08-alinhamento-lista.png` | Iniciar sessão + histórico |
| `screenshots/09-alinhamento-sessao.png` | Pauta + plano de ação |
| `screenshots/10-configuracoes.png` | Sub-nav + workspace + preferências + plano |

Se faltar algo, pergunta antes de improvisar.
