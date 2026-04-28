'use client';

import { useState } from 'react';
import { useEmpresaStore } from '@/stores/empresaStore';
import { Input } from '@/components/ui/input';
import { InputMoeda } from '@/components/ui/input-moeda';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ReceitaEmpresa, DespesaEmpresa } from '@/types/empresa';

interface LancamentoEmpresaFormProps {
  empresaId: string;
  userId: string;
  onSuccess?: () => void;
}

export function LancamentoEmpresaForm({ empresaId, userId, onSuccess }: LancamentoEmpresaFormProps) {
  const { addDespesa, addReceita } = useEmpresaStore();
  const [tipoLancamento, setTipoLancamento] = useState<'despesa' | 'receita'>('despesa');
  
  const [valor, setValor] = useState(0);
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (valor <= 0) {
      toast.error('O valor deve ser maior que zero.');
      return;
    }
    setLoading(true);

    try {
      const mesRef = data.substring(0, 7); 
      
      if (tipoLancamento === 'despesa') {
        const payload: Omit<DespesaEmpresa, 'id' | 'created_at'> = {
          empresa_id: empresaId,
          descricao: descricao || categoria,
          valor,
          categoria,
          data,
          recorrente: false,
          mes_referencia: mesRef,
          criado_por: userId,
          fornecedor: null,
          projeto_id: null
        };
        await addDespesa(payload);
        toast.success('Despesa empresarial adicionada!');
      } else {
        const payload: Omit<ReceitaEmpresa, 'id' | 'created_at'> = {
          empresa_id: empresaId,
          descricao: descricao || categoria,
          valor,
          categoria,
          data,
          mes_referencia: mesRef,
          criado_por: userId,
          cliente: null,
          projeto_id: null
        };
        await addReceita(payload);
        toast.success('Receita empresarial adicionada!');
      }

      setValor(0);
      setDescricao('');
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error('Erro ao adicionar lançamento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex bg-neutral-100 rounded-md p-1 mb-4">
        <button
          type="button"
          className={`flex-1 py-1 text-sm font-medium rounded-sm ${tipoLancamento === 'despesa' ? 'bg-white shadow text-neutral-900' : 'text-neutral-500'}`}
          onClick={() => setTipoLancamento('despesa')}
        >
          Despesa
        </button>
        <button
          type="button"
          className={`flex-1 py-1 text-sm font-medium rounded-sm ${tipoLancamento === 'receita' ? 'bg-white shadow text-neutral-900' : 'text-neutral-500'}`}
          onClick={() => setTipoLancamento('receita')}
        >
          Receita
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-neutral-500 uppercase">Valor</label>
          <InputMoeda value={valor} onChange={setValor} autoFocus />
        </div>
        
        <div>
          <label className="text-xs font-semibold text-neutral-500 uppercase">Descrição (opcional)</label>
          <Input type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Ex: Aluguel, Venda #102..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-neutral-500 uppercase">Categoria DRE</label>
            {tipoLancamento === 'despesa' ? (
              <Select 
                value={categoria} 
                onChange={(e) => setCategoria(e.target.value)} 
                required
                options={[
                  { label: 'Impostos', value: 'impostos' },
                  { label: 'Custo Direto', value: 'custos_diretos' },
                  { label: 'Despesa Operacional', value: 'operacional' },
                  { label: 'Prolabore / Pessoal', value: 'pessoal' },
                ]}
              />
            ) : (
              <Select 
                value={categoria} 
                onChange={(e) => setCategoria(e.target.value)} 
                required
                options={[
                  { label: 'Receita Operacional', value: 'operacional' },
                  { label: 'Receita Financeira', value: 'financeira' },
                  { label: 'Outras Receitas', value: 'outras' },
                ]}
              />
            )}
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-500 uppercase">Data</label>
            <Input type="date" value={data} onChange={(e) => setData(e.target.value)} required />
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" disabled={loading}>
        {loading ? 'Adicionando...' : 'Adicionar Lançamento'}
      </Button>
    </form>
  );
}
