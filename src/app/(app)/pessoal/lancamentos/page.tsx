'use client';

import { useEffect, useState } from 'react';
import { usePessoalStore } from '@/stores/pessoalStore';
import { createClient } from '@/lib/supabase/client';
import { IndicadoresPessoal } from '@/components/pessoal/IndicadoresPessoal';
import { ListaLancamentos } from '@/components/pessoal/ListaLancamentos';
import { LancamentoForm } from '@/components/pessoal/LancamentoForm';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';

export default function LancamentosPessoalPage() {
  const { carregarDados, isLoading } = usePessoalStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  const currentMes = format(new Date(), 'yyyy-MM');

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      // Descobrir workspace do usuário
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

  if (!workspaceId || !userId) return <div className="p-8 text-center text-neutral-500">Carregando contexto...</div>;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Finanças Pessoais</h1>
          <p className="text-neutral-500">Controle do seu dinheiro de casa</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 w-full md:w-auto">
          <Plus className="w-5 h-5 mr-2" />
          Novo Lançamento
        </Button>
      </div>

      {isLoading ? (
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-24 bg-neutral-200 rounded"></div>
            <div className="h-64 bg-neutral-200 rounded"></div>
          </div>
        </div>
      ) : (
        <>
          <IndicadoresPessoal />
          <ListaLancamentos />
        </>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Lançamento Pessoal">
        <LancamentoForm 
          workspaceId={workspaceId} 
          userId={userId} 
          onSuccess={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
}
