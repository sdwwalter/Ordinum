'use client';

import { useAlinhamentoStore } from '@/stores/alinhamentoStore';
import { Checkbox } from '@/components/ui/checkbox';

export function PautaSection() {
  const { pautaAtiva, marcarPautaDiscutida } = useAlinhamentoStore();

  if (pautaAtiva.length === 0) {
    return (
      <div className="bg-neutral-50 p-6 rounded-lg text-center border border-dashed border-neutral-200">
        <p className="text-neutral-500">Nenhum alerta crítico para a pauta de hoje. Ótimo trabalho!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {pautaAtiva.map(item => (
        <div key={item.id} className={`p-4 rounded-lg border transition-colors ${item.discutido ? 'bg-neutral-50 border-neutral-200 opacity-60' : 'bg-white border-violet-200 shadow-sm'}`}>
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <Checkbox 
                checked={item.discutido} 
                onCheckedChange={(c) => marcarPautaDiscutida(item.id, c === true)} 
              />
            </div>
            <div>
              <h4 className={`font-semibold ${item.discutido ? 'line-through text-neutral-500' : 'text-neutral-900'}`}>
                {item.titulo}
              </h4>
              <p className="text-sm text-neutral-600 mt-1">{item.descricao}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
