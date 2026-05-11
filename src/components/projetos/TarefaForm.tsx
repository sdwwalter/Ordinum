'use client';

import { useState } from 'react';
import { useProjetosStore } from '@/stores/projetosStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/checkbox';

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
  const [contexto, setContexto] = useState<string | null>(null);
  const [isNextAction, setIsNextAction] = useState(false);
  const [aguardandoDe, setAguardandoDe] = useState('');
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
        posicao: proximaPosicao,
        contexto: contexto || null,
        is_next_action: isNextAction,
        aguardando_de: aguardandoDe || null,
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
      <div>
        <label className="text-xs font-semibold text-neutral-500 uppercase">Contexto (opcional)</label>
        <div className="flex gap-2 mt-2 flex-wrap">
          {['@computador','@telefone','@campo','@reuniao','@email','@qualquer'].map((c) => (
            <button key={c} type="button" onClick={() => setContexto(contexto === c ? null : c)}
              className={`px-2 py-1 border rounded ${contexto === c ? 'bg-slate-800 text-white' : 'bg-white'}`}>
              {c.replace('@','')}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-xs font-semibold text-neutral-500 uppercase">Próxima Ação</label>
        <Switch checked={isNextAction} onCheckedChange={(v) => setIsNextAction(Boolean(v))} />
      </div>

      <div>
        <label className="text-xs font-semibold text-neutral-500 uppercase">Aguardando de (aparece se bloqueada)</label>
        <Input value={aguardandoDe} onChange={(e) => setAguardandoDe(e.target.value)} placeholder="Nome ou contato" />
      </div>

      <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white" disabled={loading}>
        {loading ? 'Adicionando...' : 'Adicionar Tarefa'}
      </Button>
    </form>
  );
}
