// src/app/api/relatorios/mensal/route.tsx
import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { createClient } from '@/lib/supabase/server'
import { RelatorioPDF } from '@/components/relatorios/RelatorioPDF'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const mes = searchParams.get('mes')

  if (!mes) {
    return NextResponse.json({ erro: 'Parâmetro "mes" é obrigatório (formato YYYY-MM)' }, { status: 400 })
  }

  const supabase = await createClient()

  // Autenticação
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ erro: 'Não autenticado' }, { status: 401 })
  }

  // Buscar workspace do usuário
  const { data: membro } = await supabase
    .from('membros_workspace')
    .select('workspace_id, workspaces(nome)')
    .eq('user_id', user.id)
    .eq('ativo', true)
    .single()

  if (!membro) {
    return NextResponse.json({ erro: 'Workspace não encontrado' }, { status: 404 })
  }

  const wsId = membro.workspace_id
  const workspaceNome = (membro.workspaces as any)?.nome || 'Meu Workspace'

  // Buscar dados
  const [recP, despP, recE, despE, proj, acoes] = await Promise.all([
    supabase.from('receitas_pessoais').select('valor').eq('workspace_id', wsId).eq('mes_referencia', mes),
    supabase.from('despesas_pessoais').select('valor').eq('workspace_id', wsId).eq('mes_referencia', mes),
    supabase.from('receitas_empresa').select('valor, empresa_id').eq('workspace_id', wsId).eq('mes_referencia', mes),
    supabase.from('despesas_empresa').select('valor, empresa_id').eq('workspace_id', wsId).eq('mes_referencia', mes),
    supabase.from('projetos').select('nome, status, investimento_previsto, retorno_realizado, id').eq('workspace_id', wsId).neq('status', 'concluido'),
    supabase.from('alinhamento_acoes').select('descricao, prazo').neq('status', 'concluido'),
  ])

  // Agregar pessoal
  const pessoal = {
    receitas: (recP.data || []).reduce((a, b) => a + b.valor, 0),
    despesas: (despP.data || []).reduce((a, b) => a + b.valor, 0),
  }

  // Agregar empresas
  const empMap = new Map<string, { receitas: number; despesas: number }>()
  for (const r of recE.data || []) {
    if (!empMap.has(r.empresa_id)) empMap.set(r.empresa_id, { receitas: 0, despesas: 0 })
    empMap.get(r.empresa_id)!.receitas += r.valor
  }
  for (const d of despE.data || []) {
    if (!empMap.has(d.empresa_id)) empMap.set(d.empresa_id, { receitas: 0, despesas: 0 })
    empMap.get(d.empresa_id)!.despesas += d.valor
  }
  const empresas = Array.from(empMap.entries()).map(([id, vals]) => ({
    id,
    nome: 'Empresa Principal',
    receitas: vals.receitas,
    despesas: vals.despesas,
  }))

  // Agregar projetos com ROI
  const projetos = await Promise.all(
    (proj.data || []).map(async (p) => {
      const d = await supabase.from('despesas_empresa').select('valor').eq('projeto_id', p.id)
      const invReal = (d.data || []).reduce((a, b) => a + b.valor, 0)
      let roi: number | null = null
      if (p.retorno_realizado !== null && invReal > 0) {
        roi = ((p.retorno_realizado - invReal) / invReal) * 100
      }
      const prog = p.investimento_previsto > 0 ? (invReal / p.investimento_previsto) * 100 : 0
      return { nome: p.nome, status: p.status, progresso: prog, roi }
    })
  )

  // Formatar mês por extenso
  const [ano, mesNum] = mes.split('-')
  const date = new Date(parseInt(ano), parseInt(mesNum) - 1)
  const mesExtenso = date.toLocaleDateString('pt-BR', { month: 'long' })
  const mesRef = `${mesExtenso.charAt(0).toUpperCase() + mesExtenso.slice(1)} ${ano}`

  // Renderizar PDF
  const buffer = await renderToBuffer(
    <RelatorioPDF
      workspaceNome={workspaceNome}
      mesRef={mesRef}
      dados={{
        pessoal,
        empresas,
        projetos,
        acoes: acoes.data || [],
      }}
    />
  )

  const pdfBytes = new Uint8Array(buffer)

  return new NextResponse(pdfBytes, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="relatorio-${mes}.pdf"`,
    },
  })
}
