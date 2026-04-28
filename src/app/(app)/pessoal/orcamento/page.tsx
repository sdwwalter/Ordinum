'use client';

import { useEffect, useState } from 'react';
import { usePessoalStore } from '@/stores/pessoalStore';
import { createClient } from '@/lib/supabase/client';
import { OrcamentoCategoria } from '@/components/pessoal/OrcamentoCategoria';
import { format } from 'date-fns';

export default function OrcamentoPessoalPage() {
  const { orcamentos, despesas, carregarDados } = usePessoalStore();
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  
  const currentMes = format(new Date(), 'yyyy-MM');

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: membro } = await supabase
        .from('membros_workspace')
        .select('workspace_id')
        .eq('user_id', user.id)
        .eq('ativo', true)
        .single();

      if (membro) {
        setWorkspaceId(membro.workspace_id);
        carregarDados(membro.workspace_id, currentMes);
      }
    };
    init();
  }, [carregarDados, currentMes]);

  if (!workspaceId) return <div className="p-8 text-center text-neutral-500">Carregando...</div>;

  // Calcula gastos por categoria no mês atual
  const gastos = despesas.reduce((acc, d) => {
    acc[d.categoria] = (acc[d.categoria] || 0) + d.valor;
    return acc;
  }, {} as Record<string, number>);

  // Mock de orçamentos se vazio (em produção, o admin define tetos por categoria numa tela de setup)
  // Como o model atual só tem um teto geral de despesa, vamos simular ou dividir
  // O correto na fase 3 é mostrar os gastos agrupados no mínimo, usando os limites definidos
  // O Spec diz "Orçamento por categoria com barra de progresso".
  const mockCategorias = ['Moradia', 'Alimentacao', 'Transporte', 'Lazer'];

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Orçamento</h1>
        <p className="text-neutral-500">Acompanhe seus tetos de gastos no mês</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {mockCategorias.map(cat => (
          <OrcamentoCategoria 
            key={cat}
            categoria={cat}
            gasto={gastos[cat] || 0}
            teto={2000} // Valor estático para mockup. Em um cenário real viria de uma tabela orcamento_categorias
          />
        ))}
      </div>
    </div>
  );
}
