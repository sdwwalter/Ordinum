'use client';

import { useEffect } from 'react';
import { useProjetosStore } from '@/stores/projetosStore';
import { createClient } from '@/lib/supabase/client';
import { formatarMoeda } from '@/lib/utils/formatters';
import { ProgressBar } from '@/components/ui/progress-bar';
import { calcularROI } from '@/lib/utils/calculators';
import { Projeto } from '@/types/projetos';

interface PainelFinanceiroProjetoProps {
  projeto: Projeto;
}

export function PainelFinanceiroProjeto({ projeto }: PainelFinanceiroProjetoProps) {
  const { despesas, setDespesasEmTempoReal, carregarDetalhesProjeto } = useProjetosStore();
  
  useEffect(() => {
    const supabase = createClient();
    
    const channel = supabase.channel(`public:despesas_empresa:projeto_id=eq.${projeto.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'despesas_empresa', filter: `projeto_id=eq.${projeto.id}` },
        () => {
          // Re-carregar despesas quando houver mudança (ou dar append no store)
          carregarDetalhesProjeto(projeto.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projeto.id, carregarDetalhesProjeto]);

  const investimentoRealizado = despesas.reduce((acc, d) => acc + d.valor, 0);
  const progresso = projeto.investimento_previsto > 0 
    ? (investimentoRealizado / projeto.investimento_previsto) * 100 
    : 0;

  let corProgresso = 'bg-emerald-500';
  if (progresso > 100) corProgresso = 'bg-red-500';
  else if (progresso > 80) corProgresso = 'bg-amber-500';

  const roi = projeto.retorno_realizado !== null 
    ? calcularROI(investimentoRealizado, projeto.retorno_realizado)
    : null;

  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm sticky top-24">
      <div className="p-4 bg-neutral-50 border-b border-neutral-200">
        <h3 className="font-bold text-lg text-neutral-900">Financeiro</h3>
        <p className="text-sm text-neutral-500">Orçamento do Projeto</p>
      </div>

      <div className="p-5 space-y-6">
        <div>
          <div className="flex justify-between items-end mb-2">
            <h4 className="text-sm font-semibold text-neutral-500 uppercase">Investido</h4>
            <div className="text-right">
              <span className={`font-bold ${progresso > 100 ? 'text-red-600' : 'text-neutral-900'}`}>
                {formatarMoeda(investimentoRealizado)}
              </span>
              <span className="text-sm text-neutral-500 block">
                / {formatarMoeda(projeto.investimento_previsto)} previsto
              </span>
            </div>
          </div>
          <ProgressBar progresso={progresso} cor={corProgresso} />
        </div>

        <div className="pt-4 border-t border-neutral-100">
          <h4 className="text-sm font-semibold text-neutral-500 uppercase mb-2">Retorno</h4>
          <div className="flex justify-between items-center">
            <span className="text-sm text-neutral-700">Realizado</span>
            <span className="font-bold text-emerald-600">
              {projeto.retorno_realizado !== null ? formatarMoeda(projeto.retorno_realizado) : '-'}
            </span>
          </div>
          
          {roi !== null && (
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-neutral-700">ROI</span>
              <span className={`font-bold px-2 py-1 rounded text-xs ${roi >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                {roi.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
