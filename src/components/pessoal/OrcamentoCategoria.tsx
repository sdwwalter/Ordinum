'use client';

import { ProgressBar } from '@/components/ui/progress-bar';
import { formatarMoeda, formatarPercentual } from '@/lib/utils/formatters';

interface OrcamentoCategoriaProps {
  categoria: string;
  gasto: number;
  teto: number;
}

export function OrcamentoCategoria({ categoria, gasto, teto }: OrcamentoCategoriaProps) {
  const percentual = teto > 0 ? (gasto / teto) * 100 : 0;
  
  let cor = 'bg-indigo-500';
  if (percentual > 90) cor = 'bg-red-500';
  else if (percentual > 75) cor = 'bg-amber-500';

  return (
    <div className="bg-white p-4 rounded-lg border border-neutral-200">
      <div className="flex justify-between items-end mb-2">
        <h4 className="font-medium text-neutral-900">{categoria}</h4>
        <div className="text-sm">
          <span className={percentual > 100 ? 'text-red-600 font-medium' : 'text-neutral-900'}>{formatarMoeda(gasto)}</span>
          <span className="text-neutral-500"> / {formatarMoeda(teto)}</span>
        </div>
      </div>
      <ProgressBar progresso={percentual} cor={cor} />
      <div className="mt-2 text-xs text-neutral-500 text-right">
        {formatarPercentual(percentual)} consumido
      </div>
    </div>
  );
}
