'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useEmpresaStore } from '@/stores/empresaStore';
import { createClient } from '@/lib/supabase/client';
import { IndicadoresEmpresa } from '@/components/empresa/IndicadoresEmpresa';
import { ListaLancamentosEmpresa } from '@/components/empresa/ListaLancamentosEmpresa';
import { LancamentoEmpresaForm } from '@/components/empresa/LancamentoEmpresaForm';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';

export default function EmpresaLancamentosPage() {
  const params = useParams();
  const id = params.id as string;
  const { carregarDados, isLoading } = useEmpresaStore();
  
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentMes = format(new Date(), 'yyyy-MM');

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      
      const { data: membro } = await supabase
        .from('membros_workspace')
        .select('workspace_id')
        .eq('user_id', user.id)
        .eq('ativo', true)
        .single();

      if (membro) {
        setWorkspaceId(membro.workspace_id);
        carregarDados(membro.workspace_id, id, currentMes);
      }
    };
    init();
  }, [id, currentMes, carregarDados]);

  if (isLoading || !workspaceId || !userId) {
    return <div className="animate-pulse h-64 bg-neutral-100 rounded-xl"></div>;
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <Button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-5 h-5 mr-2" />
          Novo Lançamento
        </Button>
      </div>
      
      <IndicadoresEmpresa empresaId={id} />
      <ListaLancamentosEmpresa />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Lançamento Empresarial">
        <LancamentoEmpresaForm 
          empresaId={id} 
          userId={userId} 
          onSuccess={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
}
