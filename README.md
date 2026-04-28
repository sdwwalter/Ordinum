# Ordinum SaaS

> **"Executive system for order, clarity, and contextual separation."**

O **Ordinum** é um sistema organizacional executivo focado na gestão financeira e de projetos, desenhado especificamente para suportar as complexidades de separar contextos.

Em vez de silos de informação, o Ordinum integra tudo usando uma filosofia rigorosa e estruturada (SCLC-G: *Simple, Loveable, Complete, Connected, Gamified*), priorizando a tomada de decisão com menos ruído e fricção.

---

## 🚀 Principais Funcionalidades

O sistema é dividido em **6 Módulos Core**, estruturados para conversar entre si:

1. **🏢 Módulo Empresa (O Coração)**
   - Múltiplas empresas no mesmo workspace.
   - DRE (Demonstração do Resultado do Exercício) em tempo real.
   - **Fluxo Crítico:** Retirada de Prolabore gera automaticamente uma entrada de *Receita* na vida pessoal do sócio sem duplicar trabalho.
2. **🏠 Módulo Pessoal (A Casa)**
   - Rastreio otimista de Despesas e Receitas de membros.
   - Gestão de Metas e Reservas Financeiras.
   - Indicadores de saúde baseados na proporção Ganho x Gasto.
3. **🎯 Módulo Projetos (O Foco)**
   - Kanban nativo drag-and-drop para execução.
   - Acompanhamento financeiro em tempo real (Investimento Previsto vs. Custo Atual).
   - Cálculo automático de ROI no encerramento.
4. **📋 Módulo Kanban Global (A Execução)**
   - Visão mestra que compila tarefas ativas de Projetos + Ações definidas em reuniões de Alinhamento.
   - Atualização automática dos bancos de origem (Write-through).
5. **🤝 Módulo Alinhamento (A Estratégia)**
   - Reuniões estruturadas (CEO+CFO para casais/sócios ou Revisão Semanal para solos).
   - Assistente automático: a Pauta é pré-preenchida com base em tarefas atrasadas e orçamentos estourados dos outros módulos.
6. **🧠 Módulo Dashboard & Executivo (O Cérebro)**
   - Geração de Alertas preditivos coloridos baseados em risco.
   - Exportação para PDF consolidando toda a vida do Empreendedor em um documento de 1 clique.
   - Sistema de gamificação: pontos, streaks e badges comemorativos (com confetes) para incentivar a disciplina.

---

## 🛠️ Stack Tecnológica

- **Frontend:** Next.js 16 (App Router + Turbopack), React 19
- **Linguagem:** TypeScript Estrito
- **Estilização:** Tailwind CSS v4 (Design System focado em touch-targets amplos e contraste AA)
- **State Management:** Zustand + Immer (Foco em UI Otimista)
- **Backend/Database:** Supabase (PostgreSQL, Auth, RLS)
- **Componentes Chave:** 
  - `react-hook-form` + `zod` para validação
  - `@dnd-kit/core` para Kanban
  - `sonner` para toasts e alertas
  - `@react-pdf/renderer` para emissão de relatórios
  - `canvas-confetti` para gamificação

---

## 🔒 Segurança e Multi-tenancy

O banco de dados (PostgreSQL no Supabase) é rigidamente protegido por **Row Level Security (RLS)**.
- O dado de um `workspace_id` nunca vaza para outro.
- Membros dentro de um workspace no modo "Casal" possuem acessos escalonados (O "Admin" vê a casa toda, o "Membro" vê apenas o que lançou).

---

## 📦 Como rodar localmente

### 1. Pré-requisitos
- Node.js 18+ (recomendado 20 LTS)
- Uma conta no [Supabase](https://supabase.com/) com o banco configurado usando o arquivo `migration.sql` fornecido.

### 2. Configurando o Ambiente
Crie um arquivo `.env.local` na raiz do projeto contendo as suas chaves do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

*(Opcional: Para gerar dados de teste massivos, você também precisará da chave `SUPABASE_SERVICE_ROLE_KEY` e rodar o script de seed `npx ts-node src/scripts/seed.ts`)*

### 3. Instalação e Execução

```bash
# Instalar todas as dependências
npm install

# Rodar o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 📱 Progressive Web App (PWA)

O Duetto é um sistema **Mobile-First**. Ele possui manifesto, *service workers* pre-configurados via `next-pwa` e ícones em alta resolução.
Basta abrir no Safari/Chrome do celular e clicar em **"Adicionar à Tela de Início"** para obter uma experiência *App-Like* de tela cheia.

---

Desenvolvido para organizar não apenas os números, mas a paz de espírito dos empreendedores. 
