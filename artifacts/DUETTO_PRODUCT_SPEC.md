# DUETTO — Product Spec
**"Seu negócio. Sua casa. Tudo no lugar."**

> Versão 1.0 | Abril 2026

---

## 1. Visão do Produto

**Duetto** é um sistema de gestão financeira e de projetos desenhado para quem mistura vida pessoal e vida empreendedora — casais que empreendem juntos, sócios que dividem decisões, ou empreendedores solos que precisam separar o dinheiro da empresa do dinheiro da família.

A maioria das ferramentas financeiras foi feita para empresas ou para pessoas. Nenhuma foi feita para quem é os dois ao mesmo tempo.

**Duetto resolve exatamente isso.**

---

## 2. Filosofia SCLC-G

Cada decisão de produto — design, fluxo, feature — é avaliada contra cinco critérios:

| Letra | Princípio | O que significa na prática |
|-------|-----------|---------------------------|
| **S** | Simple | Toda ação principal em no máximo 3 cliques |
| **L** | Loveable | A experiência precisa gerar confiança, não ansiedade |
| **C** | Complete | Sem dados perdidos, sem módulo pela metade |
| **C** | Connected | Tudo conversa — um dado lançado aparece onde precisa |
| **G** | Gamified | Progresso visível, celebração real, consistência recompensada |

**Regra de corte:** Se uma feature não passa em pelo menos 4 dos 5 critérios, não entra no produto.

---

## 3. Personas

### Persona 1 — Casal Empreendedor
Dois cônjuges que tocam negócios juntos ou separados. Um opera (CEO), o outro organiza o dinheiro e os processos (CFO). Precisam separar o dinheiro da empresa do dinheiro da família — e tomar decisões financeiras juntos sem conflito.

**Dor central:** "O dinheiro da empresa e o dinheiro de casa se misturam. Não sabemos quanto sobra de verdade."

### Persona 2 — Empreendedor Solo
Toca um ou mais negócios sozinho. Precisa separar o dinheiro pessoal do empresarial, rastrear projetos e manter disciplina de gestão sem um parceiro para cobrar.

**Dor central:** "Sei que preciso de organização, mas qualquer ferramenta é complexa demais ou simples demais."

### Persona 3 — Sócios com Vidas Separadas
Dois sócios que compartilham uma empresa mas têm finanças pessoais distintas. Precisam de visibilidade compartilhada do negócio sem expor a vida financeira pessoal de cada um.

**Dor central:** "Precisamos de um lugar comum para o negócio, mas não queremos misturar o que é de cada um."

---

## 4. Modos de Uso

O onboarding adapta o produto inteiro com base no modo escolhido:

```
Ao criar workspace:
┌─────────────────────────────────────────────┐
│  Como você vai usar o Duetto?               │
│                                             │
│  👫  Casal empreendedor                     │
│      → dois usuários, papéis CEO + CFO,     │
│        módulo de reunião ativo              │
│                                             │
│  🧑  Empreendedor solo                      │
│      → um usuário, módulo de reunião        │
│        substituído por "Revisão Semanal"    │
│                                             │
│  🤝  Sócios de negócio                      │
│      → dois usuários, sem módulo CASA       │
│        compartilhado, foco em EMPRESA       │
│        e PROJETOS                           │
└─────────────────────────────────────────────┘
```

**O produto se adapta. Os módulos não mudam — apenas o que é visível e obrigatório.**

---

## 5. Módulos do Sistema

### Visão geral

| Módulo | Ícone | Cor | Quem usa | Solo? |
|--------|-------|-----|----------|-------|
| PESSOAL | 🏠 | Indigo | Membros do workspace | Sim |
| EMPRESA | 🏢 | Emerald | Todos | Sim |
| PROJETOS | 🚀 | Amber | Todos | Sim |
| KANBAN | 🗂️ | Slate | Todos | Sim |
| ALINHAMENTO | 📋 | Violet | Casal / Sócios | Opcional |
| DASHBOARD | 📊 | Neutro | Todos | Sim |

> No modo Solo, o módulo **ALINHAMENTO** vira **REVISÃO SEMANAL** — mesma estrutura, mas para uso individual.

---

### MÓDULO 1 — PESSOAL 🏠

**Propósito:** Controle financeiro da vida pessoal/familiar. Completamente separado das empresas.

Disponível apenas nos modos **Casal** e **Solo**. No modo **Sócios**, este módulo é privado por usuário (sem visibilidade cruzada).

#### Funcionalidades

- Lançamento de receitas e despesas pessoais
- Categorização (moradia, alimentação, saúde, educação, filhos, lazer, investimento, etc.)
- Orçamento mensal por categoria com barra de progresso
- Reservas e metas de poupança com prazo
- Fechamento mensal com aprovação
- Semáforo de saúde financeira (verde / amarelo / vermelho)

#### Tipos principais

```typescript
type DespesaPessoal = {
  id: string
  workspace_id: string
  descricao: string
  valor: number
  categoria: CategoriaPessoal
  tipo: 'fixa' | 'variavel' | 'eventual'
  data: string
  recorrente: boolean
  mes_referencia: string        // 'YYYY-MM'
  criado_por: string            // user_id
}

type ReceitaPessoal = {
  id: string
  workspace_id: string
  descricao: string
  valor: number
  origem: 'salario' | 'prolabore' | 'freelance' | 'investimento' | 'outro'
  data: string
  mes_referencia: string
}

type ReservaMeta = {
  id: string
  workspace_id: string
  nome: string
  meta: number
  saldo_atual: number
  prazo: string | null
}
```

#### Lógica de saúde

```typescript
function saudePessoal(saldo: number, categoriasAcima: number, percentualReserva: number) {
  if (saldo < 0) return 'vermelho'
  if (categoriasAcima >= 2 || percentualReserva < 10) return 'amarelo'
  return 'verde'
}
```

#### Conexão com EMPRESA (via Prolabore)

O prolabore é o **único canal oficial** de transferência de dinheiro da empresa para a vida pessoal. Ao criar um prolabore na empresa, o sistema automaticamente cria a receita correspondente no módulo PESSOAL.

```
Resultado da empresa
  → CFO define prolabore
  → Lançado em despesas_empresa (categoria: pessoal)
  → Automaticamente cria receita_pessoal (origem: prolabore)
  → Toast: "Prolabore registrado na vida pessoal automaticamente"
```

---

### MÓDULO 2 — EMPRESA 🏢

**Propósito:** Gestão financeira de cada negócio. Suporta múltiplas empresas por workspace.

#### Funcionalidades

- CRUD de receitas e despesas por empresa
- DRE simplificado mensal
- Gestão de prolabore com conexão automática ao PESSOAL
- Metas de faturamento com barra de progresso
- Fechamento mensal
- Semáforo de saúde por empresa

#### DRE Simplificado

```
RECEITA BRUTA
  (−) Impostos
= RECEITA LÍQUIDA
  (−) Custos diretos
= LUCRO BRUTO
  (−) Despesas operacionais
= EBITDA
  (−) Prolabore
= RESULTADO LÍQUIDO
```

#### Tipos principais

```typescript
type Empresa = {
  id: string
  workspace_id: string
  nome: string
  tipo: 'servicos' | 'produto' | 'tech' | 'comercio' | 'imobiliario' | 'outro'
  cnpj: string | null
  cor: string               // hex — identidade visual no sistema
  meta_faturamento: number | null
  ativo: boolean
}

type Prolabore = {
  id: string
  empresa_id: string
  valor: number
  destinatario_id: string   // user_id do membro
  mes_referencia: string
  pago: boolean
  data_pagamento: string | null
  receita_pessoal_id: string | null   // FK gerada automaticamente
}
```

---

### MÓDULO 3 — PROJETOS 🚀

**Propósito:** Rastrear iniciativas com ROI esperado, distribuir tarefas e medir progresso.

#### Funcionalidades

- Lifecycle completo: rascunho → ativo → pausado → concluído → cancelado
- Tarefas com responsável, prazo e status
- Investimento previsto vs realizado (via despesas vinculadas)
- Cálculo automático de ROI
- Encerramento com checklist obrigatório
- Alertas: orçamento em 80%, tarefas vencidas, inatividade

#### Tipos principais

```typescript
type Projeto = {
  id: string
  workspace_id: string
  empresa_id: string | null
  nome: string
  descricao: string | null
  tipo: 'empresa' | 'pessoal'
  status: 'rascunho' | 'ativo' | 'pausado' | 'concluido' | 'cancelado'
  prioridade: 'alta' | 'media' | 'baixa'
  responsavel_id: string
  data_inicio: string
  data_prevista_conclusao: string | null
  investimento_previsto: number
  retorno_previsto: number | null
  retorno_realizado: number | null
  cor: string
}

type TarefaProjeto = {
  id: string
  projeto_id: string
  titulo: string
  descricao: string | null
  responsavel_id: string
  status: 'pendente' | 'em_andamento' | 'concluida' | 'bloqueada'
  data_prevista: string | null
  data_conclusao: string | null
  posicao: number
}
```

#### ROI

```typescript
const roi = ((retornoRealizado - investimentoRealizado) / investimentoRealizado) * 100
```

---

### MÓDULO 4 — KANBAN 🗂️

**Propósito:** Visão unificada de tudo que precisa ser feito no workspace.

> **Princípio:** O Kanban não cria dados. Ele revela o que já existe em outros módulos. Cada card é uma janela para um item real.

#### Duas visões

| Visão | Rota | Conteúdo |
|-------|------|----------|
| **Master** | `/kanban` | Todos os itens do workspace (tarefas + próximos passos) |
| **Projeto** | `/projetos/[id]` | Tarefas do projeto + painel financeiro lateral |

#### Tipo unificado

```typescript
type ItemKanban = {
  id: string
  titulo: string
  descricao: string | null
  origem: 'tarefa_projeto' | 'proximo_passo'
  origem_id: string           // ID do projeto ou do alinhamento
  origem_nome: string         // nome do projeto ou "Alinhamento 30/04"
  origem_cor: string
  status: 'a_fazer' | 'em_andamento' | 'bloqueado' | 'concluido'
  prioridade: 'alta' | 'media' | 'baixa'
  responsavel_id: string
  responsavel_nome: string
  data_prevista: string | null
  vencido: boolean
  posicao: number
}
```

#### Colunas

```
A FAZER  →  EM ANDAMENTO  →  BLOQUEADO  →  CONCLUÍDO
(cinza)      (azul)           (âmbar)        (verde, colapsado)
```

#### Write-through (drag → banco)

```typescript
async function onDragEnd(item: ItemKanban, novoStatus: StatusKanban) {
  // 1. Atualiza store local (otimista)
  kanbanStore.moverItem(item.id, novoStatus)
  try {
    // 2. Persiste na tabela de origem
    if (item.origem === 'tarefa_projeto') {
      await updateTarefaStatus(item.id, mapKanbanToTarefa[novoStatus])
    } else {
      await updateProximoPassoStatus(item.id, novoStatus)
    }
    // 3. Gamificação
    if (novoStatus === 'concluido') gamify.concluirItem()
  } catch {
    // 4. Rollback
    kanbanStore.rollback(item.id)
  }
}
```

---

### MÓDULO 5 — ALINHAMENTO 📋

**Modo Casal/Sócios:** Reunião semanal estruturada.
**Modo Solo:** Revisão semanal pessoal.

**Propósito:** Criar uma cadência obrigatória de análise e decisão. Não é um evento — é um módulo com dados.

#### Funcionalidades

- Pauta pré-gerada automaticamente (baseada em alertas, projetos e itens em aberto)
- Registro de decisões inline durante a sessão
- Próximos passos com responsável e prazo
- Ao encerrar: próximos passos viram cards no Kanban automaticamente
- Histórico completo de sessões

#### Pauta padrão (Modo Casal)

```
🏠 PESSOAL        (10 min) → saldo, desvios, alertas
🏢 EMPRESA(S)     (15 min) → faturamento, resultado, DRE parcial
🚀 PROJETOS       (10 min) → status, ROI, bloqueios
🧭 ESTRATÉGIA     (10 min) → próximos 30-90 dias
📋 AÇÕES          (5 min)  → próximos passos com nome e prazo
```

#### Pauta padrão (Modo Solo — Revisão Semanal)

```
💰 FINANÇAS       (10 min) → pessoal + empresa
🚀 PROJETOS       (10 min) → o que avançou, o que travou
🎯 PRIORIDADES    (10 min) → foco da próxima semana
📋 AÇÕES          (5 min)  → tarefas da semana
```

#### Geração automática da pauta

```typescript
async function gerarPauta(workspace_id: string): Promise<ItemPauta[]> {
  // Busca e inclui automaticamente:
  // 1. Próximos passos em aberto da semana anterior
  // 2. Projetos com tarefas vencidas
  // 3. Projetos com orçamento > 80% consumido
  // 4. Alertas críticos do dashboard
  // 5. Se dia 25+: item de fechamento mensal
}
```

---

### MÓDULO 6 — DASHBOARD 📊

**Propósito:** Uma tela = saúde completa do workspace.

#### Layout

```
┌─────────────────────────────────────────────────────────┐
│  Olá, [nome(s)] 👋                    Semana X de YYYY  │
├────────────────┬────────────────┬────────────────────────┤
│  🏠 PESSOAL    │  🏢 EMPRESA    │  🚀 PROJETOS           │
│  R$ X livre    │  R$ Y receita  │  N ativos              │
│  🟢 Saudável   │  🟡 Atenção    │  🟢 N em dia           │
├────────────────┴────────────────┴────────────────────────┤
│  📋 ALINHAMENTO — Próximo: qui 30/04 · 4 ações em aberto │
├──────────────────────────────────────────────────────────┤
│  🔔 ALERTAS                                              │
│  • Empresa X: resultado negativo este mês                │
│  • Projeto Y: 3 tarefas vencidas                        │
│  • Prolabore de Abril ainda não marcado como pago        │
└──────────────────────────────────────────────────────────┘
```

#### Semáforo de saúde

```typescript
// PESSOAL
saldo < 0                          → 🔴 vermelho
categorias acima do orçamento ≥ 2  → 🟡 amarelo
tudo dentro do previsto            → 🟢 verde

// EMPRESA
resultado_liquido < 0              → 🔴 vermelho
margem_liquida < 20%               → 🟡 amarelo
meta_faturamento < 50%             → 🟡 amarelo
tudo OK                            → 🟢 verde
```

---

## 6. Multi-tenancy e Permissões

### Estrutura de workspace

```typescript
type Workspace = {
  id: string
  nome: string                         // "Família Silva" / "Negócios Oliveira"
  modo: 'casal' | 'solo' | 'socios'
  plano: 'free' | 'pro' | 'business'
  criado_em: string
}

type MembroWorkspace = {
  id: string
  workspace_id: string
  user_id: string
  papel: 'admin' | 'membro'            // admin pode convidar, mudar plano
  apelido: string | null               // "CEO", "CFO", "Financeiro", etc.
  ativo: boolean
}
```

### Permissões por módulo

| Módulo | Membro | Admin |
|--------|--------|-------|
| PESSOAL | Lê e escreve apenas o próprio | Lê e escreve tudo |
| EMPRESA | Lê e escreve | Lê e escreve + deleta |
| PROJETOS | Lê e escreve | Lê e escreve + arquiva |
| KANBAN | Lê e move seus itens | Lê e move tudo |
| ALINHAMENTO | Lê e escreve | Lê, escreve e deleta |

> **Exceção:** No modo Solo, o único usuário tem permissão total em tudo.

---

## 7. Planos

| Feature | Free | Pro | Business |
|---------|------|-----|----------|
| Membros do workspace | 1 | 2 | 5 |
| Empresas | 1 | 3 | Ilimitado |
| Projetos ativos | 3 | Ilimitado | Ilimitado |
| Histórico (meses) | 3 | 24 | Ilimitado |
| Exportar PDF | ❌ | ✅ | ✅ |
| Realtime sync | ❌ | ✅ | ✅ |
| Gamificação | Básica | Completa | Completa |
| Suporte | FAQ | Email | Prioritário |

---

## 8. Gamificação

### Pontos por ação

| Ação | Pontos |
|------|--------|
| Primeiro lançamento | +10 |
| Concluir tarefa | +20 |
| Concluir projeto | +100 |
| Realizar alinhamento semanal | +25 |
| Fechar mês (aprovar) | +50 |
| Semana sem itens bloqueados | +30 |
| 7 dias consecutivos de uso | +50 |

### Badges

| Badge | Critério |
|-------|----------|
| Primeiro Passo | Primeiro lançamento feito |
| Alinhados | Primeira sessão de alinhamento realizada |
| Construtor | Primeiro projeto concluído |
| Consistência | 7 dias de uso consecutivos |
| CFO de Elite | 3 meses fechados no prazo |
| Fluxo Limpo | Semana sem nenhum card bloqueado |
| Mestre do ROI | 3 projetos com ROI positivo |

### Celebrações

- Tarefa concluída → toast discreto "+20 pts"
- Projeto concluído → animação de confetti + modal de celebração
- Badge desbloqueado → modal com badge animado
- Meta de faturamento atingida → banner no dashboard

---

## 9. Stack Técnica

```
Frontend:   Next.js 15 (App Router) + TypeScript
Styling:    TailwindCSS
Estado:     Zustand + Immer
Forms:      react-hook-form + Zod
Drag-drop:  @dnd-kit/core + @dnd-kit/sortable
Backend:    Supabase (PostgreSQL + Auth + Realtime + Storage)
PDF:        @react-pdf/renderer
PWA:        next-pwa
Testes:     Vitest + Testing Library
Deploy:     Vercel
Pagamento:  Stripe (futuro)
```

---

## 10. Schema de Banco de Dados

```sql
-- WORKSPACE (raiz de tudo)
CREATE TABLE workspaces (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome        TEXT NOT NULL,
  modo        TEXT CHECK (modo IN ('casal','solo','socios')) NOT NULL,
  plano       TEXT CHECK (plano IN ('free','pro','business')) DEFAULT 'free',
  criado_em   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE membros_workspace (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id       UUID REFERENCES auth.users(id),
  papel         TEXT CHECK (papel IN ('admin','membro')) DEFAULT 'membro',
  apelido       TEXT,
  ativo         BOOLEAN DEFAULT TRUE,
  UNIQUE(workspace_id, user_id)
);

-- PESSOAL
CREATE TABLE receitas_pessoais (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id       UUID REFERENCES auth.users(id),
  descricao     TEXT NOT NULL,
  valor         DECIMAL(12,2) NOT NULL,
  origem        TEXT NOT NULL,
  data          DATE NOT NULL,
  mes_referencia TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE despesas_pessoais (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id       UUID REFERENCES auth.users(id),
  descricao     TEXT NOT NULL,
  valor         DECIMAL(12,2) NOT NULL,
  categoria     TEXT NOT NULL,
  tipo          TEXT CHECK (tipo IN ('fixa','variavel','eventual')) NOT NULL,
  data          DATE NOT NULL,
  recorrente    BOOLEAN DEFAULT FALSE,
  mes_referencia TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE orcamento_pessoal (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES auth.users(id),
  mes_referencia  TEXT NOT NULL,
  receita_prevista DECIMAL(12,2) DEFAULT 0,
  despesa_prevista DECIMAL(12,2) DEFAULT 0,
  reserva_meta     DECIMAL(12,2) DEFAULT 0,
  UNIQUE(workspace_id, user_id, mes_referencia)
);

CREATE TABLE reservas_metas (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id       UUID REFERENCES auth.users(id),
  nome          TEXT NOT NULL,
  meta          DECIMAL(12,2) NOT NULL,
  saldo_atual   DECIMAL(12,2) DEFAULT 0,
  prazo         DATE,
  ativo         BOOLEAN DEFAULT TRUE
);

-- EMPRESA
CREATE TABLE empresas (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  nome          TEXT NOT NULL,
  tipo          TEXT NOT NULL,
  cnpj          TEXT,
  cor           TEXT DEFAULT '#10B981',
  meta_faturamento DECIMAL(12,2),
  ativo         BOOLEAN DEFAULT TRUE
);

CREATE TABLE receitas_empresa (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id    UUID REFERENCES empresas(id) ON DELETE CASCADE,
  descricao     TEXT NOT NULL,
  valor         DECIMAL(12,2) NOT NULL,
  categoria     TEXT NOT NULL,
  data          DATE NOT NULL,
  cliente       TEXT,
  projeto_id    UUID,                   -- FK adicionada após criar projetos
  mes_referencia TEXT NOT NULL,
  criado_por    UUID REFERENCES auth.users(id),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE despesas_empresa (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id    UUID REFERENCES empresas(id) ON DELETE CASCADE,
  descricao     TEXT NOT NULL,
  valor         DECIMAL(12,2) NOT NULL,
  categoria     TEXT NOT NULL,
  data          DATE NOT NULL,
  fornecedor    TEXT,
  projeto_id    UUID,
  recorrente    BOOLEAN DEFAULT FALSE,
  mes_referencia TEXT NOT NULL,
  criado_por    UUID REFERENCES auth.users(id),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE prolabores (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id        UUID REFERENCES empresas(id) ON DELETE CASCADE,
  destinatario_id   UUID REFERENCES auth.users(id),
  valor             DECIMAL(12,2) NOT NULL,
  mes_referencia    TEXT NOT NULL,
  pago              BOOLEAN DEFAULT FALSE,
  data_pagamento    DATE,
  receita_pessoal_id UUID REFERENCES receitas_pessoais(id)
);

-- PROJETOS
CREATE TABLE projetos (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id                UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  empresa_id                  UUID REFERENCES empresas(id),
  nome                        TEXT NOT NULL,
  descricao                   TEXT,
  tipo                        TEXT CHECK (tipo IN ('empresa','pessoal')) NOT NULL,
  status                      TEXT CHECK (status IN ('rascunho','ativo','pausado','concluido','cancelado')) DEFAULT 'rascunho',
  prioridade                  TEXT CHECK (prioridade IN ('alta','media','baixa')) DEFAULT 'media',
  responsavel_id              UUID REFERENCES auth.users(id),
  data_inicio                 DATE NOT NULL,
  data_prevista_conclusao     DATE,
  investimento_previsto       DECIMAL(12,2) DEFAULT 0,
  retorno_previsto            DECIMAL(12,2),
  retorno_realizado           DECIMAL(12,2),
  cor                         TEXT DEFAULT '#F59E0B',
  created_at                  TIMESTAMPTZ DEFAULT NOW()
);

-- FK dos lançamentos para projetos (adicionada após criar tabelas)
ALTER TABLE receitas_empresa ADD CONSTRAINT fk_receita_projeto
  FOREIGN KEY (projeto_id) REFERENCES projetos(id);
ALTER TABLE despesas_empresa ADD CONSTRAINT fk_despesa_projeto
  FOREIGN KEY (projeto_id) REFERENCES projetos(id);

CREATE TABLE tarefas_projeto (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  projeto_id      UUID REFERENCES projetos(id) ON DELETE CASCADE,
  titulo          TEXT NOT NULL,
  descricao       TEXT,
  responsavel_id  UUID REFERENCES auth.users(id),
  status          TEXT CHECK (status IN ('pendente','em_andamento','concluida','bloqueada')) DEFAULT 'pendente',
  data_prevista   DATE,
  data_conclusao  DATE,
  posicao         INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ALINHAMENTO
CREATE TABLE alinhamentos (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id      UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  data              DATE NOT NULL,
  tipo              TEXT CHECK (tipo IN ('semanal','revisao_solo')) NOT NULL,
  status            TEXT CHECK (status IN ('agendado','realizado','cancelado')) DEFAULT 'agendado',
  pauta             JSONB DEFAULT '[]',
  decisoes          JSONB DEFAULT '[]',
  notas_livres      TEXT,
  duracao_minutos   INTEGER,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE alinhamento_acoes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alinhamento_id  UUID REFERENCES alinhamentos(id) ON DELETE CASCADE,
  descricao       TEXT NOT NULL,
  responsavel_id  UUID REFERENCES auth.users(id),
  prazo           DATE,
  status          TEXT CHECK (status IN ('pendente','em_andamento','bloqueado','concluido')) DEFAULT 'pendente',
  posicao         INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- GAMIFICAÇÃO
CREATE TABLE gamification_eventos (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id       UUID REFERENCES auth.users(id),
  tipo          TEXT NOT NULL,
  pontos        INTEGER NOT NULL,
  descricao     TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE gamification_badges (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id       UUID REFERENCES auth.users(id),
  badge_id      TEXT NOT NULL,
  desbloqueado_em TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, user_id, badge_id)
);
```

---

## 11. RLS — Row-Level Security

**Princípio:** Toda tabela com `workspace_id` é protegida. Nenhum dado vaza entre workspaces.

```sql
-- Função auxiliar (usada em todas as policies)
CREATE OR REPLACE FUNCTION workspace_do_usuario()
RETURNS UUID AS $$
  SELECT workspace_id FROM membros_workspace
  WHERE user_id = auth.uid() AND ativo = TRUE
  LIMIT 1
$$ LANGUAGE sql SECURITY DEFINER;

-- Aplicar em todas as tabelas com workspace_id:
ALTER TABLE [tabela] ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workspace_proprio" ON [tabela]
  USING (workspace_id = workspace_do_usuario());

-- Tabelas com user_id (dados pessoais):
-- Membro vê apenas os próprios; admin vê todos do workspace
CREATE POLICY "pessoal_proprio" ON despesas_pessoais
  USING (
    user_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM membros_workspace
      WHERE user_id = auth.uid()
      AND workspace_id = despesas_pessoais.workspace_id
      AND papel = 'admin'
    )
  );
```

> Replicar a policy `pessoal_proprio` para: `receitas_pessoais`, `orcamento_pessoal`, `reservas_metas`.

---

## 12. View Unificada do Kanban

```sql
CREATE OR REPLACE VIEW v_kanban_items AS

  -- Tarefas de projetos ativos
  SELECT
    tp.id,
    tp.titulo,
    tp.descricao,
    'tarefa_projeto'            AS origem,
    p.id                        AS origem_id,
    p.nome                      AS origem_nome,
    COALESCE(p.cor, '#F59E0B')  AS origem_cor,
    CASE tp.status
      WHEN 'pendente'     THEN 'a_fazer'
      WHEN 'em_andamento' THEN 'em_andamento'
      WHEN 'bloqueada'    THEN 'bloqueado'
      WHEN 'concluida'    THEN 'concluido'
    END                         AS status_kanban,
    tp.responsavel_id,
    tp.data_prevista,
    tp.data_prevista < CURRENT_DATE
      AND tp.status != 'concluida' AS vencido,
    tp.posicao,
    p.workspace_id
  FROM tarefas_projeto tp
  JOIN projetos p ON tp.projeto_id = p.id
  WHERE p.status IN ('ativo', 'em_andamento')

  UNION ALL

  -- Ações de alinhamentos (não concluídas)
  SELECT
    aa.id,
    aa.descricao                AS titulo,
    NULL                        AS descricao,
    'proximo_passo'             AS origem,
    a.id                        AS origem_id,
    'Alinhamento ' || TO_CHAR(a.data, 'DD/MM') AS origem_nome,
    '#8B5CF6'                   AS origem_cor,
    aa.status                   AS status_kanban,
    aa.responsavel_id,
    aa.prazo                    AS data_prevista,
    aa.prazo < CURRENT_DATE
      AND aa.status != 'concluido' AS vencido,
    aa.posicao,
    a.workspace_id
  FROM alinhamento_acoes aa
  JOIN alinhamentos a ON aa.alinhamento_id = a.id
  WHERE aa.status != 'concluido';
```

---

## 13. Navegação e Rotas

```
/
├── (marketing)/
│   ├── page.tsx                   # Landing page
│   ├── precos/page.tsx            # Página de planos
│   └── sobre/page.tsx
│
├── (auth)/
│   ├── login/page.tsx
│   ├── cadastro/page.tsx          # + seleção de modo
│   └── convite/[token]/page.tsx   # aceitar convite de workspace
│
└── (app)/
    ├── layout.tsx                 # layout protegido
    ├── dashboard/page.tsx
    ├── kanban/page.tsx
    ├── pessoal/
    │   ├── lancamentos/page.tsx
    │   ├── orcamento/page.tsx
    │   └── reservas/page.tsx
    ├── empresa/[id]/
    │   ├── lancamentos/page.tsx
    │   ├── dre/page.tsx
    │   └── prolabore/page.tsx
    ├── projetos/
    │   ├── page.tsx
    │   └── [id]/page.tsx          # kanban do projeto + painel financeiro
    ├── alinhamento/
    │   ├── page.tsx
    │   └── [id]/page.tsx
    ├── relatorios/
    │   ├── mensal/page.tsx
    │   └── projetos/page.tsx
    └── configuracoes/
        ├── workspace/page.tsx
        ├── membros/page.tsx
        └── plano/page.tsx
```

---

## 14. Onboarding

O onboarding define o modo do workspace e personaliza o que o usuário vê.

```
Passo 1 — Modo
  Casal / Solo / Sócios
  → define: módulos visíveis, papéis disponíveis, linguagem da UI

Passo 2 — Workspace
  Nome do workspace (ex: "Família Oliveira" / "Meus Negócios")
  Convidar segundo membro (se modo Casal ou Sócios)

Passo 3 — Primeira empresa
  Nome + tipo + cor
  CNPJ opcional

Passo 4 — Configuração rápida
  Definir prolabore base (para já conectar EMPRESA → PESSOAL)
  Meta de faturamento mensal (opcional)

Passo 5 — Pronto
  Dashboard com dados zerados + guia de primeiros passos
  (checklist gamificado: "Complete seu perfil → +50 pts")
```

---

## 15. Plano de Implementação

### Mapa de fases

```
FASE 0 — Ambiente              (Dia 1-2)
FASE 1 — Infra + Auth + Tipos  (Dia 3-5)
FASE 2 — Landing + Onboarding  (Semana 2)
FASE 3 — Módulo PESSOAL        (Semana 3)
FASE 4 — Módulo EMPRESA        (Semana 4)
FASE 5 — Módulo PROJETOS       (Semana 5)
FASE 6 — Módulo KANBAN         (Semana 6)
FASE 7 — Módulo ALINHAMENTO    (Semana 7)
FASE 8 — Dashboard + Alertas   (Semana 8)
FASE 9 — Gamificação + PDF     (Semana 9)
FASE 10 — PWA + Testes + Deploy (Semana 10)
```

---

### FASE 0 — Ambiente

**Pré-requisito:** Nenhum.

```bash
# Criar projeto
npx create-next-app@latest duetto \
  --typescript --tailwind --app --src-dir --import-alias "@/*"

# Dependências
npm install @supabase/supabase-js @supabase/ssr
npm install zustand immer
npm install react-hook-form @hookform/resolvers zod
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install class-variance-authority clsx tailwind-merge lucide-react sonner
npm install @react-pdf/renderer date-fns next-pwa
npm install -D vitest @vitejs/plugin-react @testing-library/react
```

Estrutura de pastas conforme seção 13 (rotas) + espelhar em `src/`:
- `components/` → `ui/`, `layout/`, `pessoal/`, `empresa/`, `projetos/`, `kanban/`, `alinhamento/`, `shared/`
- `lib/` → `supabase/`, `validations/`, `utils/`
- `stores/` → um arquivo por módulo
- `types/` → um arquivo por módulo

**Critério de conclusão:**
- [ ] `npm run dev` sem erros
- [ ] Tailwind com cores do sistema (`pessoal`, `empresa`, `projeto`, `alinhamento`)
- [ ] `.env.local` configurado

---

### FASE 1 — Infra + Auth + Tipos

**Pré-requisito:** FASE 0.

**Tarefas:**
- Executar schema SQL completo no Supabase (todas as tabelas + RLS + view `v_kanban_items`)
- Criar todos os tipos TypeScript em `src/types/`
- Configurar Supabase client (browser + server)
- Implementar auth: login, cadastro, middleware de proteção de rotas, callback
- Criar formatters, calculators e mappers em `src/lib/utils/`
- Criar Zod schemas em `src/lib/validations/`
- Criar componentes UI primitivos: Button, Input, InputMoeda, Select, Card, Badge, Semaforo, Skeleton, Modal, ProgressBar, EmptyState, Toast
- Implementar layout protegido com Sidebar (desktop) e BottomNav (mobile)

**Prompt para agente:**
```
Leia o arquivo DUETTO_PRODUCT_SPEC.md antes de começar.
Implemente a FASE 1: Infra + Auth + Tipos.

Contexto do produto: Duetto é um SaaS de gestão financeira e de projetos
para empreendedores. Suporta 3 modos: casal, solo e sócios.

Tarefas:
1. Gerar migration.sql com o schema completo da seção 10
2. Criar src/types/ com os tipos de cada módulo
3. Configurar Supabase client (browser + server)
4. Auth: login, cadastro (com seleção de modo no step 1), middleware
5. Formatters: formatarMoeda (BRL), formatarData, formatarMesRef, formatarPercentual
6. Calculators: calcularROI, calcularDRE, calcularProgresso, saudePessoal, saudeEmpresa
7. Mappers: mapTarefaToKanban, mapAcaoToKanban (de alinhamento_acoes)
8. Componentes UI primitivos (lista acima)
9. Layout protegido: Sidebar desktop + BottomNav mobile

Restrições:
- TypeScript estrito (sem 'any')
- Tailwind com cores do sistema (seção 5 da SKILL)
- Touch targets ≥ 48px no mobile
- Sem bibliotecas de UI externas (apenas os primitivos listados)
```

**Critério de conclusão:**
- [ ] Schema criado no Supabase, RLS ativo em todas as tabelas
- [ ] Cadastro cria workspace + membro no banco
- [ ] Middleware protege `/app/*`
- [ ] Layout renderiza corretamente em mobile e desktop
- [ ] `npm run build` sem erros

---

### FASE 2 — Landing + Onboarding

**Pré-requisito:** FASE 1.

**Tarefas:**
- Landing page: hero, proposta de valor, os 3 modos (casal/solo/sócios), planos, CTA
- Onboarding de 5 passos (seção 14): modo → workspace → empresa → prolabore base → pronto
- Página de convite (`/convite/[token]`) para segundo membro
- Página de preços com comparativo dos planos

**Prompt para agente:**
```
Leia o arquivo DUETTO_PRODUCT_SPEC.md antes de começar.
Implemente a FASE 2: Landing + Onboarding.

Landing page:
- Hero: headline "Seu negócio. Sua casa. Tudo no lugar." + subheadline + CTA
- Seção de modos: Casal / Solo / Sócios com diferencial de cada um
- Seção de módulos: 6 cards com ícone, cor e descrição de cada módulo
- Planos: tabela comparativa Free / Pro / Business (seção 7 do spec)
- Footer simples

Onboarding (5 passos em /cadastro):
- Passo 1: Seleção de modo (casal/solo/sócios) com ilustração e descrição
- Passo 2: Nome do workspace + convidar membro (se modo ≠ solo)
- Passo 3: Criar primeira empresa (nome, tipo, cor)
- Passo 4: Prolabore base (opcional, pode pular)
- Passo 5: Tela de boas-vindas com checklist gamificado de primeiros passos

O modo selecionado deve ser salvo em workspaces.modo e condicionar
o que aparece no app (módulo PESSOAL = só casal+solo; ALINHAMENTO = casal+sócios).
```

**Critério de conclusão:**
- [ ] Landing page renderiza em mobile e desktop
- [ ] Onboarding cria workspace + empresa + redireciona para /dashboard
- [ ] Convite funciona (envia email via Supabase Auth)
- [ ] Modo `solo` esconde opção de convidar membro

---

### FASE 3 — Módulo PESSOAL

**Pré-requisito:** FASE 2. Layout e auth funcionando.

**Tarefas:**
- Queries: CRUD receitas, despesas, orçamento, reservas
- Store: `pessoalStore` com operações otimistas e rollback
- Componentes: LancamentoForm, ListaLancamentos, OrcamentoCategoria, BarraProgresso, CardReserva, IndicadoresPessoal
- Pages: `/pessoal/lancamentos`, `/pessoal/orcamento`, `/pessoal/reservas`

**Prompt para agente:**
```
Leia o arquivo DUETTO_PRODUCT_SPEC.md antes de começar.
Implemente a FASE 3: Módulo PESSOAL.

Regras críticas:
1. Formulário de lançamento: máximo 4 campos visíveis (valor, categoria, tipo, data)
2. InputMoeda com máscara BRL em todos os campos de valor
3. Despesa recorrente: ao criar, perguntar "Repetir nos próximos meses?" → gerar 3 meses
4. saudePessoal() retorna verde/amarelo/vermelho conforme calculators.ts
5. Operações: otimista (UI atualiza antes do banco) + rollback em erro
6. Cor âncora: indigo (classe 'pessoal' no Tailwind)

No modo 'solo': módulo mostra dados do único usuário, sem filtro de membro.
No modo 'casal': admin vê dados de ambos os membros; membro vê apenas os próprios.
```

**Critério de conclusão:**
- [ ] Criar receita → saldo atualiza imediatamente
- [ ] Semáforo muda conforme lógica de saudePessoal()
- [ ] Orçamento por categoria com barra de progresso
- [ ] Reserva com progresso e prazo visíveis
- [ ] Funciona no mobile via FAB + bottom sheet

---

### FASE 4 — Módulo EMPRESA

**Pré-requisito:** FASE 3 (ReceitaPessoal reutilizada no prolabore).

**Tarefas:**
- Queries: CRUD empresas, receitas, despesas, prolabore (com conexão automática PESSOAL)
- Store: `empresaStore` com DRE como selector derivado
- Componentes: SeletorEmpresa, LancamentoEmpresaForm, PainelDRE, CardProlabore, ProlaboreForm, IndicadoresEmpresa, EmpresaForm
- Pages: `/empresa/[id]/lancamentos`, `/empresa/[id]/dre`, `/empresa/[id]/prolabore`

**Prompt para agente:**
```
Leia o arquivo DUETTO_PRODUCT_SPEC.md antes de começar.
Implemente a FASE 4: Módulo EMPRESA.

CRÍTICO — Fluxo do Prolabore (seção 5, Módulo 1):
createProlabore() deve:
1. Inserir em receitas_pessoais (origem: 'prolabore', user_id: destinatario_id)
2. Capturar ID retornado
3. Inserir em prolabores com receita_pessoal_id preenchido
4. Disparar pessoalStore.adicionarReceita() no cliente
5. Toast: "✓ Prolabore registrado automaticamente na vida pessoal"

Cor âncora: emerald (classe 'empresa' no Tailwind)
DRE calculado no cliente com calcularDRE() de calculators.ts
SeletorEmpresa: chips persistidos em localStorage por workspace+user
```

**Critério de conclusão:**
- [ ] Criar prolabore → aparece em /empresa/prolabore E em /pessoal/lancamentos
- [ ] DRE atualiza ao lançar receita ou despesa
- [ ] Múltiplas empresas: SeletorEmpresa troca sem reload
- [ ] Meta de faturamento com barra de progresso no IndicadoresEmpresa

---

### FASE 5 — Módulo PROJETOS

**Pré-requisito:** FASE 4.

**Tarefas:**
- Queries: CRUD projetos, tarefas, investimento realizado
- Store: `projetosStore` com progresso e ROI como selectors
- Componentes: ListaProjetos, CardProjeto, ProjetoForm, KanbanProjeto, PainelFinanceiroProjeto, TarefaCard, TarefaForm, EncerramentoProjeto
- Pages: `/projetos`, `/projetos/[id]`

**Prompt para agente:**
```
Leia o arquivo DUETTO_PRODUCT_SPEC.md antes de começar.
Implemente a FASE 5: Módulo PROJETOS.

Drag-and-drop em KanbanProjeto:
- @dnd-kit/core + @dnd-kit/sortable
- PointerSensor (desktop) + TouchSensor (mobile)
- onDragEnd: atualiza status + reordena posicao na tabela
- Otimista com rollback

/projetos/[id] — layout dois painéis:
- Desktop: esquerda kanban (70%), direita painel financeiro (30%)
- Mobile: tabs (Tarefas | Financeiro)

PainelFinanceiroProjeto subscreve realtime do Supabase no projeto_id.

EncerramentoProjeto — checklist obrigatório antes de confirmar:
- [ ] Todas as tarefas concluídas ou justificadas
- [ ] Todas as despesas lançadas
- [ ] Retorno realizado registrado

Cor âncora: amber (classe 'projeto' no Tailwind)
```

**Critério de conclusão:**
- [ ] Drag funciona em touch e pointer
- [ ] Despesa vinculada ao projeto → PainelFinanceiro atualiza em tempo real
- [ ] Encerramento bloqueado sem checklist completo
- [ ] ROI calculado e visível no card e no painel

---

### FASE 6 — Módulo KANBAN

**Pré-requisito:** FASE 5. View `v_kanban_items` criada no banco.

**Tarefas:**
- Queries: fetchKanbanItems (via view), updateItemStatus (write-through), reordenarColuna
- Store: `kanbanStore` com itensPorColuna(), moverItem() otimista, rollback(), filtros
- Componentes: KanbanBoard, KanbanColuna, KanbanCard, KanbanFiltros, KanbanColunaConcluido
- Page: `/kanban` com realtime subscriptions

**Prompt para agente:**
```
Leia o arquivo DUETTO_PRODUCT_SPEC.md antes de começar.
Implemente a FASE 6: Módulo KANBAN (Master View).

Write-through (CRÍTICO — seção 5, Módulo 4):
onDragEnd → identifica item.origem:
- 'tarefa_projeto'  → UPDATE tarefas_projeto SET status
- 'proximo_passo'   → UPDATE alinhamento_acoes SET status
Rollback em erro.

KanbanCard — borda esquerda colorida por origem:
- tarefa_projeto: border-l-amber-500
- proximo_passo:  border-l-violet-500

Coluna CONCLUÍDO: colapsada por padrão, expande no clique.

Filtros persistidos: localStorage['kanban-filtros-' + workspaceId]

Realtime:
supabase.channel('kanban').on('postgres_changes', { table: 'tarefas_projeto' }, reload)
  .on('postgres_changes', { table: 'alinhamento_acoes' }, reload).subscribe()
```

**Critério de conclusão:**
- [ ] Itens de projetos E de alinhamentos aparecem no mesmo board
- [ ] Drag atualiza tabela de origem correta
- [ ] Mudança em /projetos/[id] reflete em /kanban em tempo real
- [ ] Filtros por responsável e por projeto funcionam

---

### FASE 7 — Módulo ALINHAMENTO

**Pré-requisito:** FASE 6 (ações do alinhamento aparecem no Kanban).

**Tarefas:**
- Queries: CRUD alinhamentos, CRUD ações, gerarPautaAutomatica()
- Store: `alinhamentoStore`
- Componentes: HistoricoAlinhamentos, SessaoAtiva, PautaSection, AdicionarDecisao, AdicionarAcao, CardAcao, ResumoSessao
- Pages: `/alinhamento`, `/alinhamento/[id]`
- Adaptar linguagem conforme modo do workspace: "Reunião" (casal/sócios) vs "Revisão Semanal" (solo)

**Prompt para agente:**
```
Leia o arquivo DUETTO_PRODUCT_SPEC.md antes de começar.
Implemente a FASE 7: Módulo ALINHAMENTO.

Adaptar ao modo do workspace:
- modo 'casal' ou 'socios' → tipo: 'semanal', linguagem: "Reunião CEO+CFO"
- modo 'solo'              → tipo: 'revisao_solo', linguagem: "Revisão Semanal"
  A pauta no modo solo usa a estrutura da seção 5, Módulo 5 (versão solo).

gerarPautaAutomatica() busca:
1. alinhamento_acoes com status != 'concluido' da semana anterior
2. projetos com tarefas vencidas (data_prevista < hoje)
3. projetos com sum(despesas) > 80% do investimento_previsto
4. Se dia >= 25: item de fechamento mensal
5. Alertas críticos (resultado_liquido < 0 em alguma empresa)

Ao encerrar sessão:
- Todas as ações criadas → inserir em alinhamento_acoes
- kanbanStore.carregarItems() para atualizar o Kanban
- Toast: "✓ Sessão encerrada. X ações criadas no Kanban."

Cor âncora: violet (classe 'alinhamento' no Tailwind)
```

**Critério de conclusão:**
- [ ] Pauta pré-gerada com itens relevantes do sistema
- [ ] Ações criadas na sessão aparecem no Kanban ao encerrar
- [ ] Histórico mostra sessões passadas
- [ ] Linguagem correta por modo (casal vs solo)

---

### FASE 8 — Dashboard + Alertas + Relatórios

**Pré-requisito:** FASE 7. Todos os módulos funcionando.

**Tarefas:**
- Query de dashboard (Promise.all, todos os dados em paralelo)
- Sistema de alertas com gerarAlertas() (seção 6, MÓDULO 6)
- Page `/dashboard` conforme layout da seção 6
- Relatório mensal PDF com @react-pdf/renderer
- Page `/relatorios/mensal` com preview e download

**Prompt para agente:**
```
Leia o arquivo DUETTO_PRODUCT_SPEC.md antes de começar.
Implemente a FASE 8: Dashboard + Alertas + Relatórios.

fetchDashboardData() deve usar Promise.all — não fazer roundtrips sequenciais.

Alertas — gerarAlertas() prioridade:
1. 🔴 saldo pessoal negativo
2. 🔴 resultado de empresa negativo
3. 🟡 projetos com tarefas vencidas
4. 🟡 orçamento pessoal estourado em ≥ 2 categorias
5. 🟡 prolabore do mês não marcado como pago
6. 🔵 próxima sessão de alinhamento em 2 dias

Cada alerta tem link direto para resolver.
Alertas ordenados: vermelho → amarelo → azul.

PDF (RelatorioPDF):
- Capa: nome do workspace + mês/ano
- Seção PESSOAL: receitas, despesas por categoria, saldo, reservas
- Seção EMPRESA(S): DRE de cada empresa
- Seção PROJETOS: projetos ativos com progresso e ROI
- Seção AÇÕES: ações em aberto do último alinhamento
```

**Critério de conclusão:**
- [ ] Dashboard carrega em < 1s
- [ ] Semáforos corretos para cada módulo
- [ ] Alertas clicáveis levam ao módulo correto
- [ ] PDF gerado com dados reais do mês selecionado

---

### FASE 9 — Gamificação + PDF + Recorrências

**Pré-requisito:** FASE 8.

**Tarefas:**
- Store: `gamificationStore` com pontos, badges, streaks
- Integrar eventos de gamificação nos módulos (tarefas, projetos, alinhamentos, fechamentos)
- Toasts de celebração (sonner customizado)
- Automação de recorrências: ao fazer login no dia 1, gerar lançamentos recorrentes do mês
- Página de perfil com pontuação, badges desbloqueados e streak

**Prompt para agente:**
```
Leia o arquivo DUETTO_PRODUCT_SPEC.md antes de começar.
Implemente a FASE 9: Gamificação + Recorrências.

Pontos por ação (seção 8):
- Primeiro lançamento: +10
- Concluir tarefa: +20
- Concluir projeto: +100
- Realizar alinhamento: +25
- Fechar mês: +50
- Semana sem bloqueados: +30
- 7 dias consecutivos: +50

Badges (seção 8): implementar verificação após cada ação relevante.

Celebrações:
- Tarefa concluída → toast discreto "+20 pts"
- Badge desbloqueado → modal com badge animado (CSS keyframes)
- Projeto concluído → confetti (canvas-confetti) + modal

Recorrências (rodar no login se hoje = dia 1):
- Buscar despesas_pessoais com recorrente=true do mês anterior
- Para cada: verificar se já existe no mês atual → se não: criar cópia
- Mesmo para despesas_empresa recorrentes

Gamificação pode ser desabilitada em /configuracoes/workspace.
```

**Critério de conclusão:**
- [ ] Pontos incrementam em todas as ações definidas
- [ ] Badge "Primeiro Passo" desbloqueia no primeiro lançamento
- [ ] Confetti ao concluir projeto
- [ ] Lançamentos recorrentes gerados no dia 1
- [ ] Gamificação desabilitável nas configurações

---

### FASE 10 — PWA + Testes + Deploy

**Pré-requisito:** FASE 9. Sistema completo.

**Tarefas:**
- Configurar PWA (next-pwa + manifest.json)
- Testes unitários críticos (calculators, mappers, kanbanStore write-through)
- Checklist SCLC-G completo (gerar relatório)
- Script de seed para dados de demonstração
- Deploy Vercel com variáveis de ambiente

**Prompt para agente:**
```
Leia o arquivo DUETTO_PRODUCT_SPEC.md antes de começar.
Implemente a FASE 10: PWA + Testes + Deploy.

Testes obrigatórios:
- calculators.test.ts: calcularROI, calcularDRE, saudePessoal, saudeEmpresa
- mappers.test.ts: mapTarefaToKanban, mapAcaoToKanban
- kanbanStore.test.ts: moverItem otimista + rollback

Checklist SCLC-G — gerar relatório com:
✅ OK | ⚠️ Ressalva (descrever) | ❌ Falhou (descrever)

Itens obrigatórios do checklist:
- Toda ação principal em ≤ 3 cliques
- Estados cobertos: loading / success / error / empty
- Toast em toda ação do usuário
- Contraste ≥ 4.5:1
- Touch targets ≥ 48px
- RLS ativo em todas as tabelas
- Build sem erros TypeScript
- PWA instalável (manifest + service worker)
- Sem 'any' no TypeScript

Seed (src/scripts/seed.ts):
- 1 workspace no modo 'casal'
- 2 usuários (papel admin e membro)
- 2 empresas
- 3 projetos (1 ativo, 1 concluído, 1 rascunho)
- 1 mês de lançamentos pessoais e empresariais
- 1 sessão de alinhamento com ações
```

**Critério de conclusão:**
- [ ] Checklist SCLC-G: 0 itens ❌
- [ ] Testes: todos passando
- [ ] PWA instalável no mobile
- [ ] Deploy Vercel funcionando
- [ ] Seed popula dados sem erros
- [ ] Testado em 375px (mobile) e 1440px (desktop)

---

## 16. Resumo do Plano

| Fase | Entregável | Semana |
|------|-----------|--------|
| 0 | Projeto configurado e rodando | 1 (D1-2) |
| 1 | Auth, schema, tipos, UI base | 1 (D3-5) |
| 2 | Landing page + onboarding | 2 |
| 3 | Módulo PESSOAL | 3 |
| 4 | Módulo EMPRESA + prolabore | 4 |
| 5 | Módulo PROJETOS | 5 |
| 6 | Módulo KANBAN | 6 |
| 7 | Módulo ALINHAMENTO | 7 |
| 8 | Dashboard + Alertas + PDF | 8 |
| 9 | Gamificação + Recorrências | 9 |
| 10 | PWA + Testes + Deploy | 10 |

**Regra de execução:** Uma fase por prompt ao agente. Sempre passar este documento como contexto. Nunca pular o critério de conclusão da fase anterior.

---

## 17. Como Usar Este Documento com um Agente de IA

```
Prompt base para qualquer fase:

"Leia o arquivo DUETTO_PRODUCT_SPEC.md antes de começar.

Você está desenvolvendo o Duetto — um SaaS de gestão financeira e de projetos
para empreendedores (casais, solos e sócios).

Implemente a FASE [N]: [nome da fase].

[Colar o bloco completo da fase aqui]

Após cada tarefa, confirme o critério de conclusão da fase.
Não avance para a próxima fase sem todos os itens marcados."
```

---

**Produto:** Duetto
**Versão do Spec:** 1.0
**Filosofia:** SCLC-G — Simple, Loveable, Complete, Connected, Gamified
**Tagline:** "Seu negócio. Sua casa. Tudo no lugar."
