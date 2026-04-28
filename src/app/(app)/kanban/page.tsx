'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useKanbanStore } from '@/stores/kanbanStore';
import { KanbanFiltros } from '@/components/kanban/KanbanFiltros';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { KanbanSquare } from 'lucide-react';

export default function KanbanPage() {
  const { fetchKanbanItems } = useKanbanStore();
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);

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
        fetchKanbanItems(membro.workspace_id);
        
        // Supabase Realtime para write-through cross tabs
        const channel = supabase.channel('kanban_global')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'tarefas_projeto' }, () => {
            fetchKanbanItems(membro.workspace_id);
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'alinhamento_acoes' }, () => {
            fetchKanbanItems(membro.workspace_id);
          })
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      }
    };
    init();
  }, [fetchKanbanItems]);

  if (!workspaceId) {
    return <div className="p-8"><div className="animate-pulse h-[600px] bg-neutral-100 rounded-xl"></div></div>;
  }

  return (
    <div className="p-4 md:p-8 flex flex-col h-screen max-h-screen overflow-hidden">
      <div className="shrink-0 mb-6">
        <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-2">
          <KanbanSquare className="w-8 h-8 text-blue-600" />
          Kanban Global
        </h1>
        <p className="text-neutral-500 mt-1">Visão centralizada de execução de tarefas e planos de ação.</p>
      </div>

      <div className="shrink-0">
        <KanbanFiltros workspaceId={workspaceId} />
      </div>

      <KanbanBoard />
    </div>
  );
}
