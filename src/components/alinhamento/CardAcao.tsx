'use client';

import { AlinhamentoAcao } from '@/types/alinhamento';
import { useAlinhamentoStore } from '@/stores/alinhamentoStore';
import { Trash2, Calendar } from 'lucide-react';
import { formatarData } from '@/lib/utils/formatters';

interface CardAcaoProps {
  acao: Partial<AlinhamentoAcao>;
}

export function CardAcao({ acao }: CardAcaoProps) {
  const { removerAcao } = useAlinhamentoStore();

  return (
    <div className="bg-white p-3 rounded-lg border border-neutral-200 shadow-sm flex justify-between items-center group">
      <div>
        <p className="text-sm font-medium text-neutral-900">{acao.descricao}</p>
        {acao.prazo && (
          <div className="flex items-center text-xs text-neutral-500 mt-1">
            <Calendar className="w-3 h-3 mr-1" />
            Prazo: {formatarData(acao.prazo)}
          </div>
        )}
      </div>
      <button 
        onClick={() => acao.id && removerAcao(acao.id)} 
        className="text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
