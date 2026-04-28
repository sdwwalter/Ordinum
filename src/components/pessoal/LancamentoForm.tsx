'use client';

import { useState } from 'react';
import { usePessoalStore } from '@/stores/pessoalStore';
import { Input } from '@/components/ui/input';
import { InputMoeda } from '@/components/ui/input-moeda';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { addMonths, format } from 'date-fns';
import { TipoDespesaPessoal, OrigemReceitaPessoal } from '@/types/pessoal';
import { toast } from 'sonner';

interface LancamentoFormProps {
  workspaceId: string;
  userId: string;
  onSuccess?: () => void;
}

export function LancamentoForm({ workspaceId, userId, onSuccess }: LancamentoFormProps) {
  const { addDespesa, addReceita } = usePessoalStore();
  const [tipoLancamento, setTipoLancamento] = useState<'despesa' | 'receita'>('despesa');
  
  // Fields
  const [valor, setValor] = useState(0);
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState(''); // ou origem para receita
  const [tipo, setTipo] = useState<TipoDespesaPessoal>('variavel');
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [recorrente, setRecorrente] = useState(false);
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (valor <= 0) {
      toast.error('O valor deve ser maior que zero.');
      return;
    }
    setLoading(true);

    try {
      const mesRef = data.substring(0, 7); // YYYY-MM
      
      if (tipoLancamento === 'despesa') {
        const payload = {
          workspace_id: workspaceId,
          user_id: userId,
          descricao: descricao || categoria, // simplificação
          valor,
          categoria,
          tipo,
          data,
          recorrente,
          mes_referencia: mesRef,
        };

        await addDespesa(payload);
        
        // Gerar mais 2 meses se for recorrente
        if (recorrente) {
          const dateObj = new Date(data);
          for (let i = 1; i <= 2; i++) {
            const nextDate = addMonths(dateObj, i);
            await addDespesa({
              ...payload,
              data: format(nextDate, 'yyyy-MM-dd'),
              mes_referencia: format(nextDate, 'yyyy-MM')
            });
          }
          toast.success('Despesa e próximas 2 recorrências adicionadas!');
        } else {
          toast.success('Despesa adicionada!');
        }
      } else {
        await addReceita({
          workspace_id: workspaceId,
          user_id: userId,
          descricao: descricao || categoria,
          valor,
          origem: categoria as OrigemReceitaPessoal,
          data,
          mes_referencia: mesRef,
        });
        toast.success('Receita adicionada!');
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
          <label className="text-xs font-semibold text-neutral-500 uppercase">{tipoLancamento === 'despesa' ? 'Categoria' : 'Origem'}</label>
          {tipoLancamento === 'despesa' ? (
            <Select 
              value={categoria} 
              onChange={(e) => setCategoria(e.target.value)} 
              required
              options={[
                { label: 'Moradia', value: 'Moradia' },
                { label: 'Alimentação', value: 'Alimentacao' },
                { label: 'Transporte', value: 'Transporte' },
                { label: 'Lazer', value: 'Lazer' },
                { label: 'Educação', value: 'Educacao' },
                { label: 'Saúde', value: 'Saude' },
                { label: 'Outros', value: 'Outros' },
              ]}
            />
          ) : (
            <Select 
              value={categoria} 
              onChange={(e) => setCategoria(e.target.value)} 
              required
              options={[
                { label: 'Salário', value: 'salario' },
                { label: 'Prolabore', value: 'prolabore' },
                { label: 'Freelance', value: 'freelance' },
                { label: 'Investimentos', value: 'investimento' },
                { label: 'Outro', value: 'outro' },
              ]}
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-neutral-500 uppercase">Data</label>
            <Input type="date" value={data} onChange={(e) => setData(e.target.value)} required />
          </div>
          
          {tipoLancamento === 'despesa' && (
            <div>
              <label className="text-xs font-semibold text-neutral-500 uppercase">Tipo</label>
              <Select 
                value={tipo} 
                onChange={(e) => setTipo(e.target.value as TipoDespesaPessoal)}
                options={[
                  { label: 'Fixa', value: 'fixa' },
                  { label: 'Variável', value: 'variavel' },
                  { label: 'Eventual', value: 'eventual' },
                ]}
              />
            </div>
          )}
        </div>
        
        {tipoLancamento === 'despesa' && (
          <div className="flex items-center gap-2 pt-2">
            <input 
              type="checkbox" 
              id="recorrente" 
              className="w-4 h-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-600"
              checked={recorrente}
              onChange={(e) => setRecorrente(e.target.checked)}
            />
            <label htmlFor="recorrente" className="text-sm text-neutral-700">
              Repetir nos próximos meses?
            </label>
          </div>
        )}
      </div>

      <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" disabled={loading}>
        {loading ? 'Adicionando...' : 'Adicionar Lançamento'}
      </Button>
    </form>
  );
}
