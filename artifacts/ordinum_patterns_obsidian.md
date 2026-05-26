# Ordinum — System Architecture & Memory Context

Este documento centraliza as premissas arquiteturais, decisões de design, padrões de código e regras de negócios (SCLC-G) referentes ao projeto **Ordinum**. Criado para servir como "cérebro" em consultas futuras via Obsidian ou em novos ciclos de desenvolvimento com IAs.

---

## 1. Filosofia de Produto e Regras de Negócios

- **Filosofia SCLC-G:** *Simple, Loveable, Complete, Connected, Gamified*. O sistema não deve ser apenas funcional, deve encorajar o uso e recompensar o usuário.
- **Estrutura Core (6 Módulos):**
  1. Empresa (DRE, faturamento, custos).
  2. Pessoal (Receitas, despesas, gestão familiar).
  3. Projetos (Kanban + tracking de ROI e investimento).
  4. Kanban Global (Visão unificada das tarefas).
  5. Alinhamento (Gestão de reuniões, geração de pautas).
  6. Dashboard Executivo (Visão holística do sistema).
- **Modos de Uso:** O acesso atende fluxos `casal` (com acesso escalonado CEO/CFO, onde permissões importam) e fluxos `solo`.

## 2. Tech Stack Base

| Camada | Tecnologia Principal | Contexto de Uso |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | Usa Turbopack. Divisão clara entre Server/Client Components. |
| **Linguagem** | TypeScript 5 Strict Mode | Proibido o uso de `any` explícito e `@ts-ignore`. |
| **Backend/Auth** | Supabase | Controle via `@supabase/ssr`, Postgres, Row Level Security e Realtime. |
| **Estilização** | Tailwind CSS v4 | UI clean, uso de Radix UI (primitivos acessíveis) e Lucide React para ícones. |
| **Estado/Store** | Zustand + Immer | Centralização de stores como `kanbanStore`, `projetosStore`, `gamificationStore`. |
| **Complex UI** | `@dnd-kit/core` | Utilizado estritamente para os motores de Drag & Drop (Kanban). |
| **Relatórios** | `@react-pdf/renderer` | Usado na geração de PDFs (DREs, Fechamentos). |

---

## 3. Padrões Arquiteturais e Regras de Código

### 3.1. Roteamento e Autenticação (Next.js)
- **Rotas Públicas:** `/`, `/login`, `/cadastro`, `/precos` (Renderizadas via SSG - Static Site Generation).
- **Rotas Privadas:** Agrupadas rigidamente sob o segmento `/app/` (ex: `/app/dashboard`, `/app/alinhamento`). Renderizadas dinamicamente (SSR) devido à ingestão de sessão/cookies pelo Supabase server-side no core (como a Sidebar).
- **Middleware:** No Next.js 16/Turbopack, a proteção de acesso é exportada pelo `src/proxy.ts`. Ele realiza o match verificando se a rota é pública ou se o *Supabase User* está validado e aplica os redirects. **Regra:** Não utilizar `middleware.ts` para evitar conflito com a engine de proxy adotada neste sistema.

### 3.2. Boundary e Bundle Optimization
- **Módulos Pesados (PDF/Confetti):**
  - **Relatórios:** Componentes que utilizam `@react-pdf` (Document, Page) NÃO DEVEM receber `'use client'`. A geração de buffer PDF ocorre no **lado do servidor** (via API Route `renderToBuffer`), servindo ao frontend apenas o endpoint de download, livrando o bundle do cliente de >400KB.
  - **Gamificação (canvas-confetti):** Chamadas visuais pontuais DEVEM utilizar lazy loading (`next/dynamic` ou `await import()`) para evitar gargalos na thread principal da UI.

### 3.3. Convenções de Variáveis e Tipagem (TS)
- **Zero `float` Financeiro:** **Todo** valor monetário e transacional trafegado em código e banco deve ser estritamente manipulado como INTEIRO EM CENTAVOS (R$ 89,90 vira `8990`). A formatação `Intl.NumberFormat` ou `formatarMoeda()` atua UNICAMENTE na camada de exibição final da UI.
- **Unions Literais:** Priorizar o uso de Strict Union Strings (ex: `type Contexto = '@email' | '@reuniao'`) ao invés de primitivos soltos (`string`). Sempre usar asserções `as const` ao iterar sobre esses arrays de configuração dentro do código para o TS inferir corretamente os tipos.
- **Client Supabase vs Server Supabase:** 
  - `src/lib/supabase/client.ts` → Instancia `createBrowserClient` (usado APENAS em Client Components).
  - `src/lib/supabase/server.ts` → Instancia `createServerClient` com acesso aos `cookies()` (usado em API Routes, Server Actions e Server Components). NUNCA importar do server em componentes que contenham `'use client'`.

### 3.4. Isolamento Multitenancy
- A arquitetura de dados e de queries de fetch obriga o isolamento via **`workspace_id`** (não confundir com o isolamento de outros projetos como o *Vellovy* que utiliza `salao_id`). Toda leitura/gravação ao Supabase que lide com finanças ou projetos requer validação pelo identificador cruzado na tabela `membros_workspace`.

### 3.5. Tratamentos e Qualidade
- **Zod Required:** Validação obrigatória tanto no *client* (Formulários/RHF) quanto no *server* (Server Actions/APIs).
- **Hardcodes Proibidos:** Cores, Tokens de Estado, Strings de Erro e Mapas Críticos (ex: Mapeamento de cor baseado em `StatusProjeto`) devem sempre ser estruturados como constantes no topo do componente ou em arquivos utilitários globais.

---

*Gerado como um artefato de referência após a sessão de reestruturação de build, Typescript fix e diagnóstico Next.js (Maio de 2026).*
