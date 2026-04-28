'use client';

import { useState } from 'react';
import { useEmpresaStore } from '@/stores/empresaStore';
import { InputMoeda } from '@/components/ui/input-moeda';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ProlaboreFormProps {
  empresaId: string;
  workspaceId: string;
  userId: string;
  onSuccess?: () => void;
}

export function ProlaboreForm({ empresaId, workspaceId, userId, onSuccess }: ProlaboreFormProps) {
  const { createProlabore } = useEmpresaStore();
  const [valor, setValor] = useState(0);
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (valor <= 0) return;
    
    setLoading(true);
    try {
      await createProlabore({
        empresa_id: empresaId,
        destinatario_id: userId,
        valor,
        mes_referencia: data.substring(0, 7),
        pago: true,
        data_pagamento: data,
        receita_pessoal_id: null // Vai ser populado pela store
      }, workspaceId);
      
      setValor(0);
      if (onSuccess) onSuccess();
    } catch (error) {
      // toast de erro já é tratado na store
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-neutral-500 uppercase">Valor da Retirada</label>
        <InputMoeda value={valor} onChange={setValor} autoFocus />
      </div>
      <div>
        <label className="text-xs font-semibold text-neutral-500 uppercase">Data de Pagamento</label>
        <Input type="date" value={data} onChange={(e) => setData(e.target.value)} required />
      </div>
      <div className="bg-emerald-50 text-emerald-800 p-3 rounded text-sm mb-4">
        Ao confirmar, esse valor será adicionado nas suas Receitas Pessoais automaticamente.
      </div>
      <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" disabled={loading}>
        {loading ? 'Registrando...' : 'Registrar Prolabore'}
      </Button>
    </form>
  );
}
