'use client';

import { useEffect, useState } from 'react';
import { useProjetosStore } from '@/stores/projetosStore';
import { createClient } from '@/lib/supabase/client';
import { CardProjeto } from '@/components/projetos/CardProjeto';
import { ProjetoForm } from '@/components/projetos/ProjetoForm';
import { useEmpresaStore } from '@/stores/empresaStore';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Plus, FolderKanban } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';

export default function ProjetosPage() {
  const { projetos, carregarProjetos, isLoading } = useProjetosStore();
  const { carregarEmpresas } = useEmpresaStore();
  
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        carregarEmpresas(membro.workspace_id);
        carregarProjetos(membro.workspace_id);
      }
    };
    init();
  }, [carregarProjetos, carregarEmpresas]);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Projetos</h1>
          <p className="text-neutral-500">Acompanhe suas iniciativas e ROI</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-amber-500 hover:bg-amber-600 w-full md:w-auto text-white">
          <Plus className="w-5 h-5 mr-2" />
          Novo Projeto
        </Button>
      </div>

      {isLoading ? (
        <div className="animate-pulse grid md:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-48 bg-neutral-100 rounded-xl"></div>)}
        </div>
      ) : projetos.length === 0 ? (
        <EmptyState icon={FolderKanban} title="Nenhum projeto ativo" description="Crie seu primeiro projeto para rastrear tarefas e orçamentos." />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projetos.map(p => (
            <CardProjeto key={p.id} projeto={p} />
          ))}
        </div>
      )}

      {workspaceId && userId && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Projeto">
          <ProjetoForm 
            workspaceId={workspaceId} 
            userId={userId} 
            onSuccess={() => setIsModalOpen(false)} 
          />
        </Modal>
      )}
    </div>
  );
}
