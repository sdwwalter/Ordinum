'use client';

import { Projeto } from '@/types/projetos';
import { calcularProgresso, calcularROI } from '@/lib/utils/calculators';
import { formatarMoeda, formatarData } from '@/lib/utils/formatters';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Card, CardContent } from '@/components/ui/card';
import { useProjetosStore } from '@/stores/projetosStore';
import Link from 'next/link';

interface CardProjetoProps {
  projeto: Projeto;
}

export function CardProjeto({ projeto }: CardProjetoProps) {
  // O progresso precisaria do número total de tarefas.
  // Como as tarefas detalhadas ficam em /projetos/[id], podemos simplificar ou usar um hook.
  // Aqui faremos uma estimativa de status, ou podíamos injetar a prop.
  
  const statusColors = {
    rascunho: 'bg-neutral-100 text-neutral-600',
    ativo: 'bg-amber-100 text-amber-700',
    pausado: 'bg-neutral-200 text-neutral-700',
    concluido: 'bg-emerald-100 text-emerald-700',
    cancelado: 'bg-red-100 text-red-700',
  };

  const investimentoRealizado = projeto.despesas_empresa?.reduce((acc, d) => acc + d.valor, 0) || 0;
  const roi = projeto.retorno_realizado !== null 
    ? calcularROI(investimentoRealizado, projeto.retorno_realizado)
    : null;

  return (
    <Link href={`/app/projetos/${projeto.id}`} className="block group">
      <Card className="h-full transition-shadow hover:shadow-md border-l-4" style={{ borderLeftColor: projeto.cor || '#F59E0B' }}>
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-lg text-neutral-900 group-hover:text-amber-600 transition-colors">{projeto.nome}</h3>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full uppercase ${statusColors[projeto.status]}`}>
              {projeto.status}
            </span>
          </div>
          
          <p className="text-sm text-neutral-500 line-clamp-2 mb-4 h-10">
            {projeto.descricao || 'Sem descrição'}
          </p>

          <div className="flex justify-between text-sm mb-1 text-neutral-500">
            <span>Investimento Previsto</span>
            <span className="font-medium text-neutral-900">{formatarMoeda(projeto.investimento_previsto)}</span>
          </div>

          {projeto.retorno_realizado !== null && (
            <div className="flex justify-between items-center text-sm mb-3">
              <span className="text-neutral-500">Retorno / ROI</span>
              <div className="flex items-center gap-2">
                <span className="font-medium text-emerald-600">{formatarMoeda(projeto.retorno_realizado)}</span>
                {roi !== null && (
                  <span className={`font-bold px-1.5 py-0.5 rounded text-xs ${roi >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {roi.toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between text-xs text-neutral-400">
            <span>Início: {formatarData(projeto.data_inicio)}</span>
            {projeto.data_prevista_conclusao && <span>Prazo: {formatarData(projeto.data_prevista_conclusao)}</span>}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
