'use client';

import { useState } from 'react';
import { useAlinhamentoStore } from '@/stores/alinhamentoStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function AdicionarAcao() {
  const { adicionarAcao } = useAlinhamentoStore();
  const [descricao, setDescricao] = useState('');
  const [prazo, setPrazo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao.trim()) return;

    adicionarAcao({
      descricao,
      prazo: prazo || null,
      responsavel_id: null // Em uma versão multi-user teríamos um Select do Membro
    });

    setDescricao('');
    setPrazo('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <Input 
        value={descricao} 
        onChange={(e) => setDescricao(e.target.value)} 
        placeholder="Descreva a ação..." 
        className="flex-1"
        required 
      />
      <Input 
        type="date" 
        value={prazo} 
        onChange={(e) => setPrazo(e.target.value)} 
        className="w-40"
      />
      <Button type="submit" className="bg-violet-100 hover:bg-violet-200 text-violet-700">
        <Plus className="w-5 h-5" />
      </Button>
    </form>
  );
}
