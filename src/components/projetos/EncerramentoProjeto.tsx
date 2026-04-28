'use client';

import { useProjetosStore } from '@/stores/projetosStore';
import { Projeto } from '@/types/projetos';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle } from 'lucide-react';
import { InputMoeda } from '@/components/ui/input-moeda';

interface EncerramentoProjetoProps {
  projeto: Projeto;
  onSuccess: () => void;
}

export function EncerramentoProjeto({ projeto, onSuccess }: EncerramentoProjetoProps) {
  const { tarefas, updateProjeto } = useProjetosStore();
  const [retorno, setRetorno] = useState(0);
  const [loading, setLoading] = useState(false);

  const tarefasPendentes = tarefas.some(t => t.status !== 'concluida');
  
  // Condições do checklist
  const condicaoTarefas = !tarefasPendentes;
  const condicaoDespesas = true; // Supõe-se validado pelo usuário ("Todas despesas lançadas")
  const condicaoRetorno = retorno > 0 || projeto.retorno_realizado !== null;

  const podeEncerrar = condicaoTarefas && condicaoDespesas && condicaoRetorno;

  const handleEncerrar = async () => {
    if (!podeEncerrar) return;
    setLoading(true);
    try {
      await updateProjeto(projeto.id, {
        status: 'concluido',
        retorno_realizado: retorno,
        data_prevista_conclusao: new Date().toISOString().split('T')[0] // encerrou hoje
      });
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
        <h4 className="font-semibold text-amber-900 mb-2">Checklist de Encerramento</h4>
        <ul className="space-y-3">
          <li className="flex items-center gap-2 text-sm text-amber-800">
            {condicaoTarefas ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Circle className="w-5 h-5" />}
            Todas as tarefas concluídas (nenhuma pendente/bloqueada)
          </li>
          <li className="flex items-center gap-2 text-sm text-amber-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Todas as despesas lançadas (confirmação manual)
          </li>
          <li className="flex items-center gap-2 text-sm text-amber-800">
            {condicaoRetorno ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Circle className="w-5 h-5" />}
            Retorno realizado registrado
          </li>
        </ul>
      </div>

      <div>
        <label className="text-xs font-semibold text-neutral-500 uppercase">Qual foi o retorno financeiro real gerado?</label>
        <div className="mt-1">
          <InputMoeda value={retorno} onChange={setRetorno} />
        </div>
        <p className="text-xs text-neutral-400 mt-1">Coloque o valor bruto gerado pelo projeto para cálculo de ROI.</p>
      </div>

      <Button 
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" 
        onClick={handleEncerrar}
        disabled={!podeEncerrar || loading}
      >
        {loading ? 'Encerrando...' : 'Confirmar Encerramento'}
      </Button>
    </div>
  );
}
