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
    return (
      <div className="p-7">
        <div className="h-64 rounded-[18px] bg-surface border border-white/7 animate-shimmer" />
      </div>
    );
  }

  return (
    <div className="p-7 flex flex-col gap-4 animate-fade-in-up">
      <div className="flex justify-end">
        <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" strokeWidth={2.2} />
          Novo Lancamento
        </Button>
      </div>

      <IndicadoresEmpresa empresaId={id} />
      <ListaLancamentosEmpresa />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Lancamento Empresarial">
        <LancamentoEmpresaForm
          empresaId={id}
          userId={userId}
          onSuccess={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
