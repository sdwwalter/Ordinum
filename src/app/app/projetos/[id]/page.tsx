'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useProjetosStore } from '@/stores/projetosStore';
import { KanbanProjeto } from '@/components/projetos/KanbanProjeto';
import { PainelFinanceiroProjeto } from '@/components/projetos/PainelFinanceiroProjeto';
import { TarefaForm } from '@/components/projetos/TarefaForm';
import { EncerramentoProjeto } from '@/components/projetos/EncerramentoProjeto';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Plus, CheckSquare, ListTodo, Wallet } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ProjetoDetalhesPage() {
  const params = useParams();
  const id = params.id as string;
  const { projetos, carregarDetalhesProjeto, isLoading } = useProjetosStore();
  const projeto = projetos.find(p => p.id === id);

  const [userId, setUserId] = useState<string | null>(null);
  const [isTarefaModalOpen, setIsTarefaModalOpen] = useState(false);
  const [isEncerramentoModalOpen, setIsEncerramentoModalOpen] = useState(false);
  
  // Mobile tabs
  const [activeTab, setActiveTab] = useState<'tarefas' | 'financeiro'>('tarefas');

  useEffect(() => {
    carregarDetalhesProjeto(id);
    const getU = async () => {
      const { data: { user } } = await createClient().auth.getUser();
      if (user) setUserId(user.id);
    };
    getU();
  }, [id, carregarDetalhesProjeto]);

  if (isLoading || !projeto || !userId) {
    return <div className="p-8"><div className="animate-pulse h-96 bg-neutral-100 rounded-xl"></div></div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto pb-24 h-screen flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
            <span className="w-4 h-4 rounded-full" style={{ backgroundColor: projeto.cor || '#F59E0B' }}></span>
            {projeto.nome}
          </h1>
          <p className="text-neutral-500 mt-1">{projeto.descricao}</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          {projeto.status !== 'concluido' && (
            <>
              <Button variant="outline" onClick={() => setIsTarefaModalOpen(true)} className="flex-1 md:flex-none">
                <Plus className="w-4 h-4 mr-2" /> Tarefa
              </Button>
              <Button onClick={() => setIsEncerramentoModalOpen(true)} className="bg-amber-500 hover:bg-amber-600 text-white flex-1 md:flex-none">
                <CheckSquare className="w-4 h-4 mr-2" /> Encerrar Projeto
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Tabs */}
      <div className="md:hidden flex bg-neutral-100 p-1 rounded-lg mb-4 shrink-0">
        <button 
          className={`flex-1 py-2 text-sm font-medium rounded flex items-center justify-center gap-2 ${activeTab === 'tarefas' ? 'bg-white shadow' : 'text-neutral-500'}`}
          onClick={() => setActiveTab('tarefas')}
        >
          <ListTodo className="w-4 h-4" /> Kanban
        </button>
        <button 
          className={`flex-1 py-2 text-sm font-medium rounded flex items-center justify-center gap-2 ${activeTab === 'financeiro' ? 'bg-white shadow' : 'text-neutral-500'}`}
          onClick={() => setActiveTab('financeiro')}
        >
          <Wallet className="w-4 h-4" /> Financeiro
        </button>
      </div>

      <div className="flex-1 min-h-0">
        <div className="grid md:grid-cols-12 gap-6 h-full">
          {/* Coluna Esquerda: KANBAN (70% no desktop) */}
          <div className={`md:col-span-8 lg:col-span-9 h-full flex flex-col ${activeTab !== 'tarefas' ? 'hidden md:flex' : 'flex'}`}>
            <KanbanProjeto />
          </div>

          {/* Coluna Direita: FINANCEIRO (30% no desktop) */}
          <div className={`md:col-span-4 lg:col-span-3 h-full overflow-y-auto ${activeTab !== 'financeiro' ? 'hidden md:block' : 'block'}`}>
            <PainelFinanceiroProjeto projeto={projeto} />
          </div>
        </div>
      </div>

      <Modal isOpen={isTarefaModalOpen} onClose={() => setIsTarefaModalOpen(false)} title="Nova Tarefa">
        <TarefaForm projetoId={projeto.id} userId={userId} onSuccess={() => setIsTarefaModalOpen(false)} />
      </Modal>

      <Modal isOpen={isEncerramentoModalOpen} onClose={() => setIsEncerramentoModalOpen(false)} title="Encerrar Projeto">
        <EncerramentoProjeto projeto={projeto} onSuccess={() => setIsEncerramentoModalOpen(false)} />
      </Modal>
    </div>
  );
}
