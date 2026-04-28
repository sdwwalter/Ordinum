'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { createClient } from '@/lib/supabase/client';
import { FileText, Download, Loader2 } from 'lucide-react';
import { RelatorioPDF } from '@/components/relatorios/RelatorioPDF';
import { formatarMesRef } from '@/lib/utils/formatters';

// O PDFViewer precisa ser carregado via client side somente, por usar Web APIs
const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
  { ssr: false, loading: () => <div className="animate-pulse bg-neutral-100 w-full h-[600px] rounded-xl flex items-center justify-center">Carregando visualizador PDF...</div> }
);

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

export default function RelatorioMensalPage() {
  const [dados, setDados] = useState<any>(null);
  const [workspaceNome, setWorkspaceNome] = useState('Meu Workspace');
  const [isLoading, setIsLoading] = useState(true);

  const hoje = new Date();
  const mesAtual = hoje.toISOString().slice(0, 7);

  useEffect(() => {
    const fetchDados = async () => {
      setIsLoading(true);
      const supabase = createClient();
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data: membro } = await supabase.from('membros_workspace').select('workspace_id, workspaces(nome)').eq('user_id', user.id).eq('ativo', true).single();
      
      if (!membro) return;
      setWorkspaceNome((membro.workspaces as any)?.nome || 'Meu Workspace');

      const wsId = membro.workspace_id;

      // Buscar todos os dados
      const [recP, despP, recE, despE, proj, acoes] = await Promise.all([
        supabase.from('receitas_pessoais').select('valor').eq('workspace_id', wsId).eq('mes_referencia', mesAtual),
        supabase.from('despesas_pessoais').select('valor').eq('workspace_id', wsId).eq('mes_referencia', mesAtual),
        supabase.from('receitas_empresa').select('valor, empresa_id').eq('workspace_id', wsId).eq('mes_referencia', mesAtual),
        supabase.from('despesas_empresa').select('valor, empresa_id').eq('workspace_id', wsId).eq('mes_referencia', mesAtual),
        supabase.from('projetos').select('nome, status, investimento_previsto, retorno_realizado, id').eq('workspace_id', wsId).neq('status', 'concluido'),
        supabase.from('alinhamento_acoes').select('descricao, prazo').neq('status', 'concluido') // simplificado, precisa join com alinhamento na v2
      ]);

      // Agregando para o PDF
      const pessoal = {
        receitas: (recP.data || []).reduce((a,b)=>a+b.valor,0),
        despesas: (despP.data || []).reduce((a,b)=>a+b.valor,0)
      };

      // Empresas (Mockando 1 empresa agregada se não tiver nome)
      const empMap = new Map();
      (recE.data || []).forEach(r => {
        if (!empMap.has(r.empresa_id)) empMap.set(r.empresa_id, { receitas: 0, despesas: 0 });
        empMap.get(r.empresa_id).receitas += r.valor;
      });
      (despE.data || []).forEach(d => {
        if (!empMap.has(d.empresa_id)) empMap.set(d.empresa_id, { receitas: 0, despesas: 0 });
        empMap.get(d.empresa_id).despesas += d.valor;
      });
      const empresas = Array.from(empMap.entries()).map(([id, vals]) => ({
        id, nome: 'Empresa Principal', receitas: vals.receitas, despesas: vals.despesas
      }));

      // Projetos
      const projetosPdf = await Promise.all((proj.data || []).map(async p => {
        const d = await supabase.from('despesas_empresa').select('valor').eq('projeto_id', p.id);
        const invReal = (d.data || []).reduce((a,b)=>a+b.valor,0);
        let roi = null;
        if (p.retorno_realizado !== null && invReal > 0) {
          roi = ((p.retorno_realizado - invReal) / invReal) * 100;
        }
        let prog = p.investimento_previsto > 0 ? (invReal / p.investimento_previsto) * 100 : 0;
        return { nome: p.nome, status: p.status, progresso: prog, roi };
      }));

      setDados({
        pessoal,
        empresas,
        projetos: projetosPdf,
        acoes: acoes.data || []
      });
      setIsLoading(false);
    };

    fetchDados();
  }, [mesAtual]);

  if (isLoading) {
    return <div className="p-8 flex items-center justify-center h-[50vh]"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
  }

  if (!dados) return null;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
      <div className="shrink-0 flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-2">
            <FileText className="w-8 h-8 text-neutral-600" />
            Relatório de Fechamento
          </h1>
          <p className="text-neutral-500 mt-1">Geração de PDF com os indicadores do mês {formatarMesRef(mesAtual)}.</p>
        </div>
        
        <PDFDownloadLink 
          document={<RelatorioPDF workspaceNome={workspaceNome} mesRef={formatarMesRef(mesAtual)} dados={dados} />}
          fileName={`relatorio_${mesAtual}.pdf`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm"
        >
          {({ loading }) => loading ? 'Gerando...' : <><Download className="w-4 h-4" /> Baixar PDF</>}
        </PDFDownloadLink>
      </div>

      <div className="flex-1 bg-neutral-200 rounded-xl overflow-hidden border border-neutral-300 shadow-inner">
        <PDFViewer width="100%" height="100%" className="border-none">
          <RelatorioPDF workspaceNome={workspaceNome} mesRef={formatarMesRef(mesAtual)} dados={dados} />
        </PDFViewer>
      </div>
    </div>
  );
}
