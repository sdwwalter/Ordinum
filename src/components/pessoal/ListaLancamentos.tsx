'use client';

import { usePessoalStore } from '@/stores/pessoalStore';
import { formatarMoeda, formatarData } from '@/lib/utils/formatters';
import { Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';

export function ListaLancamentos() {
  const { receitas, despesas, removerReceita, removerDespesa } = usePessoalStore();

  const todos = [
    ...receitas.map(r => ({ ...r, isReceita: true, sortDate: new Date(r.data).getTime() })),
    ...despesas.map(d => ({ ...d, isReceita: false, sortDate: new Date(d.data).getTime() }))
  ].sort((a, b) => b.sortDate - a.sortDate);

  if (todos.length === 0) {
    return (
      <EmptyState 
        icon={ArrowDownCircle} 
        title="Nenhum lançamento neste mês" 
        description="Suas receitas e despesas aparecerão aqui." 
      />
    );
  }

  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
      <div className="divide-y divide-neutral-100">
        {todos.map(item => (
          <div key={item.id} className="p-4 flex items-center justify-between hover:bg-neutral-50 transition-colors group">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${item.isReceita ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                {item.isReceita ? <ArrowUpCircle className="w-5 h-5" /> : <ArrowDownCircle className="w-5 h-5" />}
              </div>
              <div>
                <p className="font-medium text-neutral-900">{item.descricao}</p>
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <span>{formatarData(item.data)}</span>
                  <span>•</span>
                  <span>{item.isReceita ? (item as any).origem : (item as any).categoria}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`font-semibold ${item.isReceita ? 'text-emerald-600' : 'text-neutral-900'}`}>
                {item.isReceita ? '+' : '-'}{formatarMoeda(item.valor)}
              </span>
              <button 
                onClick={() => item.isReceita ? removerReceita(item.id) : removerDespesa(item.id)}
                className="text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
