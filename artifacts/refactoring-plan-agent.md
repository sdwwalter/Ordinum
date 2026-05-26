# Plano de Refatoração — Bundle Optimization
> Enviar direto para o agente. Executar na ordem. Não pular etapas.

---

## CONTEXTO

Bundle atual: **812KB gzip** de shared chunks carregados em 100% das páginas.
Meta: **< 350KB gzip** de shared baseline.
Causa principal: `@react-pdf/renderer` e dependências em chunks shared.
Causa secundária: `canvas-confetti` + `BadgeModal` no `app/app/layout`.
Causa terciária: `@supabase/ssr` duplicado em 2 chunks server-side.

---

## TAREFA 1 — Isolar react-pdf da página de relatórios

**Impacto:** Remove **466KB gzip** do First Load JS de **toda** a aplicação.

### 1.1 — Auditar o import atual

Buscar em todo o projeto:
```
grep -r "react-pdf" src/ app/ --include="*.tsx" --include="*.ts" -l
grep -r "@react-pdf" src/ app/ --include="*.tsx" --include="*.ts" -l
```

Anotar todos os arquivos encontrados. Todos eles **devem** estar sob `app/app/relatorios/` ou ser um componente chamado exclusivamente por essa rota.

### 1.2 — Criar Server Action para geração do PDF

Criar o arquivo `app/app/relatorios/mensal/actions.ts`:

```ts
'use server'

// Todos os imports de @react-pdf ficam AQUI — nunca em 'use client'
import { renderToBuffer } from '@react-pdf/renderer'
import { RelatorioMensalDocument } from './RelatorioMensalDocument'

export async function gerarRelatorioPDF(dados: RelatorioMensalDados): Promise<Uint8Array> {
  const buffer = await renderToBuffer(<RelatorioMensalDocument dados={dados} />)
  return buffer
}
```

> Se `RelatorioMensalDocument.tsx` tiver `'use client'` no topo, **remover**. Componentes react-pdf são renderizados server-side via `renderToBuffer` — não são React DOM components e não precisam de `'use client'`.

### 1.3 — Criar API Route para download do PDF

Criar `app/api/relatorios/mensal/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { RelatorioMensalDocument } from '@/app/app/relatorios/mensal/RelatorioMensalDocument'
// importar função que busca os dados (server-side)
import { buscarDadosRelatorio } from '@/lib/relatorios'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const mes = searchParams.get('mes')
  const empresaId = searchParams.get('empresaId')

  const dados = await buscarDadosRelatorio({ mes, empresaId })

  const buffer = await renderToBuffer(
    <RelatorioMensalDocument dados={dados} />
  )

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="relatorio-${mes}.pdf"`,
    },
  })
}
```

### 1.4 — Refatorar o componente client da página

Localizar o componente client em `app/app/relatorios/mensal/` que contém `PDFDownloadLink` ou `BlobProvider` do react-pdf.

Substituir pelo botão que chama a API Route:

```tsx
'use client'

// REMOVER: import { PDFDownloadLink } from '@react-pdf/renderer'
// REMOVER: import { RelatorioMensalDocument } from './RelatorioMensalDocument'

export function BotaoDownloadPDF({ mes, empresaId }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleDownload() {
    setLoading(true)
    try {
      const res = await fetch(
        `/api/relatorios/mensal?mes=${mes}&empresaId=${empresaId}`
      )
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `relatorio-${mes}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handleDownload} disabled={loading}>
      {loading ? 'Gerando PDF...' : 'Baixar PDF'}
    </button>
  )
}
```

### 1.5 — Verificar que nenhum arquivo com 'use client' importa @react-pdf

```
grep -r "react-pdf" src/ app/ --include="*.tsx" --include="*.ts" -l | xargs grep -l "'use client'"
```

Se retornar qualquer arquivo: **remover o `'use client'`** desse arquivo ou mover o import de react-pdf para fora do componente client.

---

## TAREFA 2 — Lazy load do BadgeModal e canvas-confetti no layout

**Impacto:** Remove canvas-confetti (10KB + overhead) do critical path de toda página autenticada.

### 2.1 — Localizar o layout

Arquivo: `app/app/layout.tsx`

Buscar os imports de:
- `canvas-confetti` (direto ou via `confetti.module.mjs`)
- `BadgeModal` (componente que dispara confete)
- `gamificationStore` (zustand store ou context)

### 2.2 — Aplicar dynamic import

```tsx
// app/app/layout.tsx

// REMOVER imports estáticos de BadgeModal e confetti
// import BadgeModal from './BadgeModal'           ← remover
// import confetti from 'canvas-confetti'          ← remover (se direto)

import dynamic from 'next/dynamic'

// ADICIONAR:
const BadgeModal = dynamic(
  () => import('@/components/gamification/BadgeModal'),
  {
    ssr: false,
    loading: () => null, // não renderizar nada enquanto carrega
  }
)
```

### 2.3 — Mover canvas-confetti para dentro do BadgeModal

No arquivo `BadgeModal.tsx` (ou equivalente):

```tsx
'use client'

import { useEffect } from 'react'

// Import lazy do confetti — só carrega quando o componente monta
async function dispararConfete() {
  const confetti = (await import('canvas-confetti')).default
  confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
}

export function BadgeModal({ badge, onClose }: Props) {
  useEffect(() => {
    dispararConfete()
  }, [])

  // ... resto do componente
}
```

> **Não usar** `import confetti from 'canvas-confetti'` no topo do arquivo. Usar `await import(...)` dentro da função.

---

## TAREFA 3 — Deduplicar @supabase/ssr no bundle do servidor

**Contexto:** `5940.js` (213KB) e `3296.js` (208KB) no bundle nodejs ambos contêm `@supabase/ssr/dist/module` — são duas cópias do mesmo módulo em chunks diferentes. Isso indica que `createServerClient` está sendo instanciado em locais diferentes sem compartilhar o módulo.

### 3.1 — Centralizar o cliente Supabase server

Verificar se existe um único `lib/supabase/server.ts`. Se não existir, criar:

```ts
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
```

### 3.2 — Garantir que o client browser também é centralizado

```ts
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### 3.3 — Substituir todos os `createClient` ad-hoc no projeto

```
grep -r "createBrowserClient\|createServerClient" app/ src/ --include="*.ts" --include="*.tsx" -l
```

Para cada arquivo encontrado: substituir pelo import de `@/lib/supabase/server` ou `@/lib/supabase/client` conforme o contexto.

### 3.4 — Garantir que nenhum componente `'use client'` importa de `lib/supabase/server`

```
grep -r "supabase/server" app/ src/ --include="*.tsx" | grep -v "// "
```

Qualquer arquivo que aparece nessa busca E tem `'use client'` = **erro de boundary**. Remover o import server do componente client.

---

## TAREFA 4 — Isolar @dnd-kit do chunk shared

**Contexto:** `@dnd-kit` (43KB parsed) está no chunk `313.js` (shared). Verificar se é usado em mais de uma página.

### 4.1 — Verificar uso

```
grep -r "dnd-kit\|DndContext\|useDraggable\|useDroppable\|useSortable" app/ src/ --include="*.tsx" -l
```

### 4.2 — Se usado apenas em `app/app/kanban/`

No arquivo `app/app/kanban/page.tsx`:

```tsx
// Se KanbanBoard usa @dnd-kit internamente:
import dynamic from 'next/dynamic'

const KanbanBoard = dynamic(() => import('./_components/KanbanBoard'), {
  ssr: false,
  loading: () => <KanbanSkeleton />,
})
```

O `@dnd-kit` passará a estar apenas no chunk de kanban, removido do shared.

### 4.3 — Se usado em múltiplas páginas

Manter como está. O custo de 43KB compartilhado entre N páginas é aceitável.

---

## VERIFICAÇÃO FINAL

Após todas as tarefas, executar o build e comparar:

```bash
ANALYZE=true next build
```

Abrir `client.html` gerado e verificar:

| Métrica | Antes | Meta |
|---------|-------|------|
| Shared baseline (gzip) | 812KB | < 350KB |
| Chunk `4019` (react-pdf+brotli) | 260KB gzip | **não deve existir no client** |
| Chunk `b2d98e07` (pdfkit) | 83KB gzip | **não deve existir no client** |
| Chunk `ff804112` (fontkit) | 66KB gzip | **não deve existir no client** |
| `app/app/layout` chunk | 17KB parsed | < 10KB parsed |
| `relatorios/mensal` page chunk | 9KB gzip | igual ou menor |

### Checklist de regressão

- [ ] Download de PDF funciona em `/app/relatorios/mensal`
- [ ] Badges de gamificação ainda disparam confete ao ganhar
- [ ] Login/logout Supabase funciona
- [ ] Kanban drag-and-drop funciona
- [ ] Sem erros de hidratação no console do browser
- [ ] `grep -r "react-pdf" app/ --include="*.tsx" | grep "'use client'"` retorna vazio

---

## ORDEM DE EXECUÇÃO

```
TAREFA 1 (react-pdf)     → maior impacto, executar primeiro
TAREFA 2 (confetti)      → independente, pode ser paralelo
TAREFA 3 (supabase)      → executar depois de 1 e 2 (menor risco de conflito)
TAREFA 4 (dnd-kit)       → executar por último (verificar uso antes)
```

---

## NÃO FAZER

- Não remover `@react-pdf` do `package.json` — ainda é usado na API Route
- Não mover a lógica de PDF para o client com `dynamic()` — usar API Route/Server Action
- Não adicionar `'use client'` no `RelatorioMensalDocument.tsx`
- Não usar `ssr: true` no dynamic import do BadgeModal
- Não criar múltiplas instâncias de Supabase client em um mesmo arquivo
