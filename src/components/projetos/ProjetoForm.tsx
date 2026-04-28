'use client';

import { useState } from 'react';
import { useProjetosStore } from '@/stores/projetosStore';
import { useEmpresaStore } from '@/stores/empresaStore';
import { Input } from '@/components/ui/input';
import { InputMoeda } from '@/components/ui/input-moeda';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface ProjetoFormProps {
  workspaceId: string;
  userId: string;
  onSuccess?: () => void;
}

export function ProjetoForm({ workspaceId, userId, onSuccess }: ProjetoFormProps) {
  const { addProjeto } = useProjetosStore();
  const { empresas } = useEmpresaStore(); // Necessário para vincular a empresa se for tipo 'empresa'
  
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState<'empresa' | 'pessoal'>('empresa');
  const [empresaId, setEmpresaId] = useState('');
  const [prioridade, setPrioridade] = useState<'alta' | 'media' | 'baixa'>('media');
  const [dataInicio, setDataInicio] = useState(new Date().toISOString().split('T')[0]);
  const [dataPrevista, setDataPrevista] = useState('');
  const [investimentoPrevisto, setInvestimentoPrevisto] = useState(0);
  const [cor, setCor] = useState('#F59E0B');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addProjeto({
        workspace_id: workspaceId,
        empresa_id: tipo === 'empresa' ? (empresaId || null) : null,
        nome,
        descricao,
        tipo,
        status: 'ativo',
        prioridade,
        responsavel_id: userId,
        data_inicio: dataInicio,
        data_prevista_conclusao: dataPrevista || null,
        investimento_previsto: investimentoPrevisto,
        retorno_previsto: null,
        retorno_realizado: null,
        cor
      });
      if (onSuccess) onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-neutral-500 uppercase">Nome do Projeto</label>
        <Input value={nome} onChange={(e) => setNome(e.target.value)} required autoFocus />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-neutral-500 uppercase">Tipo</label>
          <Select 
            value={tipo} 
            onChange={(e) => setTipo(e.target.value as 'empresa' | 'pessoal')} 
            options={[{label: 'Empresarial', value: 'empresa'}, {label: 'Pessoal', value: 'pessoal'}]}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-neutral-500 uppercase">Prioridade</label>
          <Select 
            value={prioridade} 
            onChange={(e) => setPrioridade(e.target.value as 'alta' | 'media' | 'baixa')} 
            options={[{label: 'Alta', value: 'alta'}, {label: 'Média', value: 'media'}, {label: 'Baixa', value: 'baixa'}]}
          />
        </div>
      </div>

      {tipo === 'empresa' && empresas.length > 0 && (
        <div>
          <label className="text-xs font-semibold text-neutral-500 uppercase">Empresa Vinculada</label>
          <Select 
            value={empresaId} 
            onChange={(e) => setEmpresaId(e.target.value)} 
            options={[{label: 'Selecione...', value: ''}, ...empresas.map(e => ({ label: e.nome, value: e.id }))]}
          />
        </div>
      )}

      <div>
        <label className="text-xs font-semibold text-neutral-500 uppercase">Orçamento Previsto</label>
        <InputMoeda value={investimentoPrevisto} onChange={setInvestimentoPrevisto} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-neutral-500 uppercase">Data Início</label>
          <Input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} required />
        </div>
        <div>
          <label className="text-xs font-semibold text-neutral-500 uppercase">Previsão Entrega</label>
          <Input type="date" value={dataPrevista} onChange={(e) => setDataPrevista(e.target.value)} />
        </div>
      </div>

      <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white" disabled={loading}>
        {loading ? 'Criando...' : 'Criar Projeto'}
      </Button>
    </form>
  );
}
