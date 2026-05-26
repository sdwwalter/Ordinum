# Resumo da Sessão: Resolução de Roteamento 404 e Otimização de Build (Ordinum)

Este documento centraliza todos os problemas encontrados, diagnósticos realizados e soluções implementadas durante esta sessão de suporte.

---

## 1. O Problema Inicial: Erro 404 nas Rotas Autenticadas

### Diagnóstico
O usuário reportou um erro 404 ao tentar acessar `https://ordinum.vercel.app/app/alinhamento`. 
Ao investigar a estrutura do Next.js (App Router), identificou-se que a pasta raiz da área logada estava nomeada como `src/app/(app)`. No Next.js, pastas entre parênteses são **Route Groups** e são omitidas da URL. Assim, a rota real gerada era `/alinhamento`, mas todos os links internos (Sidebar, BottomNav, redirecionamentos) apontavam rigidamente para `/app/alinhamento`.

Adicionalmente, notou-se que a proteção de rotas (redirecionamento de usuários não autenticados) não estava funcionando porque o arquivo de middleware customizado `proxy.ts` não estava sendo registrado corretamente como `middleware.ts` na raiz do projeto.

### Soluções Aplicadas
1. **Renomeação do Route Group:** A pasta `src/app/(app)` foi renomeada para `src/app/app`, tornando o segmento `/app` parte efetiva da URL e validando todos os links existentes no sistema.
2. **Correção do Proxy:** A lógica do `proxy.ts` estava redirecionando usuários logados de `/login` para `/dashboard` (rota inexistente). Foi corrigido para `/app/dashboard`. O `proxy.ts` foi mantido como estava, pois no Next.js 16 (ambiente em uso), a documentação do projeto (`AGENTS.md`) definia o uso específico do `proxy.ts` em vez do padrão `middleware.ts` para lidar com a configuração Turbopack/Next.js atual.

---

## 2. Falhas no Build de Produção (TypeScript / SSR)

Ao executar `npm run build`, três erros estáticos impediram a compilação:

### Erros e Correções:
1. **`ssr: false` em Server Component:** 
   - *Problema:* O arquivo `src/app/(dashboard)/gtd/page.tsx` tentava usar `next/dynamic` com `{ ssr: false }`, o que só é permitido em Client Components.
   - *Solução:* Adicionada a diretiva `'use client'` no topo do arquivo.
2. **Export `Switch` não encontrado em `checkbox.tsx`:** 
   - *Problema:* O `TarefaForm.tsx` importava um componente `Switch` do Radix UI que não existia no projeto.
   - *Solução:* Substituído pelo componente nativo existente `Checkbox`, e a propriedade `onCheckedChange` foi atualizada logicamente para refletir o boolean.
3. **Erros de Tipagem Estrita (Typescript Strict Mode):** 
   - *Problema 1:* O `Supa` extraído via `ReturnType<typeof createClient>` retornava uma `Promise<SupabaseClient>` causando falha no método `.from()`. Corrigido envolvendo com `Awaited<>`.
   - *Problema 2:* O mapeamento `statusColors` não incluía a chave `'algum_dia'`. Inclusão adicionada.
   - *Problema 3:* O `useState` de contexto GTD no `TarefaForm` exigia tipos estritos. Resolvido aplicando `as const` ao array de botões para inferência literal.
   - *Problema 4:* Conflito de re-exportação da interface genérica `TarefaProjeto` nos módulos do GTD e Projetos. Resolvido elegendo a interface de `projetos.ts` como canônica.

---

## 3. Otimização de Bundle (Bundle Optimization Plan)

Após estabilizar o build, foi solicitado a execução do `refactoring-plan-agent.md` para reduzir drasticamente o tamanho do pacote (Shared Baseline) enviado ao client, cujo peso superava os 800KB.

### Implementações de Performance:
- **Remoção de `@react-pdf/renderer` do Client Side:** A biblioteca massiva (466KB) estava vazando para o navegador via `'use client'`. 
  - *Ação:* Movida a lógica de renderização para uma **API Route Server-Side** (`/api/relatorios/mensal/route.tsx`) usando `renderToBuffer()`. A UI client (`relatorios/mensal/page.tsx`) agora exibe o relatório isoladamente via um `iframe` leve, solicitando o documento já renderizado via *fetch*.
- **Lazy Loading de Animações:** A lib `canvas-confetti` (para gamificação) travava a main thread em todo `layout.tsx`.
  - *Ação:* Criado o `BadgeModalLazy.tsx` com `next/dynamic` (`ssr: false`). O `canvas-confetti` agora só é importado condicionalmente (via `await import`) no exato milissegundo em que uma conquista (Badge) é engatilhada.
- **Validação de Isolamento:** Confirmado que `@dnd-kit` e `@supabase/ssr` estavam arquiteturalmente deduplicados e centralizados da melhor maneira possível.

O build finalizou em cerca de 2 minutos (`Exit code: 0`), consolidando as rotas com extrema performance.

---

## 4. Dúvida Arquitetural: SSR (Rotas Dinâmicas) vs SSG (Rotas Estáticas)

No final da sessão, houve um questionamento a respeito de grande parte do SaaS ter sido empacotado como Dinâmico (`ƒ`) pelo build do Next.js.

**Veredito:** 
Como o sistema Ordinum lida com Autenticação Supabase em camadas do servidor (`createClient`), a simples checagem de cookies (para isolar os dados de cada usuário/workspace) força o Next.js a renderizar via Server-Side Rendering (SSR). Isso é arquiteturalmente **o estado da arte e perfeito** para plataformas SaaS. Somente a landing page e portas de entrada (login/cadastro) foram preservadas como Static Site Generation (SSG).
