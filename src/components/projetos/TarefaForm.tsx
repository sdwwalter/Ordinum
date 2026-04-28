'use client';

import { useState } from 'react';
import { useProjetosStore } from '@/stores/projetosStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface TarefaFormProps {
  projetoId: string;
  userId: string;
  onSuccess?: () => void;
}

export function TarefaForm({ projetoId, userId, onSuccess }: TarefaFormProps) {
  const { addTarefa, tarefas } = useProjetosStore();
  
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataPrevista, setDataPrevista] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return;
    
    setLoading(true);
    try {
      const proximaPosicao = tarefas.filter(t => t.status === 'pendente').length;
      
      await addTarefa({
        projeto_id: projetoId,
        titulo,
        descricao: descricao || null,
        responsavel_id: userId,
        status: 'pendente',
        data_prevista: dataPrevista || null,
        data_conclusao: null,
        posicao: proximaPosicao
      });
      
      setTitulo('');
      setDescricao('');
      setDataPrevista('');
      if (onSuccess) onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-neutral-500 uppercase">Título da Tarefa</label>
        <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} required autoFocus />
      </div>
      <div>
        <label className="text-xs font-semibold text-neutral-500 uppercase">Descrição (opcional)</label>
        <Input value={descricao} onChange={(e) => setDescricao(e.target.value)} />
      </div>
      <div>
        <label className="text-xs font-semibold text-neutral-500 uppercase">Prazo</label>
        <Input type="date" value={dataPrevista} onChange={(e) => setDataPrevista(e.target.value)} />
      </div>

      <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white" disabled={loading}>
        {loading ? 'Adicionando...' : 'Adicionar Tarefa'}
      </Button>
    </form>
  );
}
