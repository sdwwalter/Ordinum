import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createClient } from '@/lib/supabase/client';
import { ItemKanban, StatusKanban } from '@/types/kanban';
import { toast } from 'sonner';

interface KanbanFiltros {
  responsavel_id: string | null;
  projeto_id: string | null;
}

interface KanbanState {
  items: ItemKanban[];
  filtros: KanbanFiltros;
  isLoading: boolean;

  fetchKanbanItems: (workspaceId: string) => Promise<void>;
  updateItemStatus: (id: string, novoStatus: StatusKanban, novaPosicao?: number) => Promise<void>;
  setFiltro: (key: keyof KanbanFiltros, value: string | null, workspaceId: string) => void;
  carregarFiltros: (workspaceId: string) => void;
}

const mapStatusToTarefa = (status: StatusKanban) => {
  const map: Record<string, string> = {
    'a_fazer': 'pendente',
    'em_andamento': 'em_andamento',
    'bloqueado': 'bloqueada',
    'concluido': 'concluida'
  };
  return map[status] || 'pendente';
};

const mapStatusToAcao = (status: StatusKanban) => {
  const map: Record<string, string> = {
    'a_fazer': 'pendente',
    'em_andamento': 'em_andamento',
    'bloqueado': 'bloqueado',
    'concluido': 'concluido'
  };
  return map[status] || 'pendente';
};

export const useKanbanStore = create<KanbanState>()(
  immer((set, get) => ({
    items: [],
    filtros: { responsavel_id: null, projeto_id: null },
    isLoading: false,

    fetchKanbanItems: async (workspaceId) => {
      set({ isLoading: true });
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('v_kanban_items')
        .select('*')
        .eq('workspace_id', workspaceId);

      if (error) {
        toast.error('Erro ao carregar Kanban');
        set({ isLoading: false });
        return;
      }

      set(state => {
        state.items = data as ItemKanban[];
        state.isLoading = false;
      });
    },

    updateItemStatus: async (id, novoStatus, novaPosicao) => {
      const stateAnterior = [...get().items];
      const item = stateAnterior.find(i => i.id === id);
      if (!item) return;

      // Otimista
      set(state => {
        const idx = state.items.findIndex(i => i.id === id);
        if (idx !== -1) {
          state.items[idx].status_kanban = novoStatus;
          if (novaPosicao !== undefined) state.items[idx].posicao = novaPosicao;
        }
      });

      const supabase = createClient();
      let error = null;

      if (item.origem === 'tarefa_projeto') {
        const updates: any = { status: mapStatusToTarefa(novoStatus) };
        if (novaPosicao !== undefined) updates.posicao = novaPosicao;
        const res = await supabase.from('tarefas_projeto').update(updates).eq('id', id);
        error = res.error;
      } else if (item.origem === 'proximo_passo') {
        const updates: any = { status: mapStatusToAcao(novoStatus) };
        if (novaPosicao !== undefined) updates.posicao = novaPosicao;
        const res = await supabase.from('alinhamento_acoes').update(updates).eq('id', id);
        error = res.error;
      }

      if (error) {
        set(state => { state.items = stateAnterior; });
        toast.error('Erro ao mover item. Alterações revertidas.');
        throw error;
      }

      // FASE 9: Gamificação - Tarefa Concluída
      if (novoStatus === 'concluido' && item.status_kanban !== 'concluido') {
        const { useGamificationStore } = await import('@/stores/gamificationStore');
        const workspaceId = (item as any).workspace_id || localStorage.getItem('duetto-workspace-id'); // fallback
        if (workspaceId) {
          useGamificationStore.getState().registrarEvento(workspaceId, 'tarefa_concluida', 20, `Concluiu a tarefa: ${item.titulo}`);
        }
      }
    },

    carregarFiltros: (workspaceId) => {
      const salvas = localStorage.getItem(`kanban-filtros-${workspaceId}`);
      if (salvas) {
        set(state => { state.filtros = JSON.parse(salvas); });
      }
    },

    setFiltro: (key, value, workspaceId) => {
      set(state => {
        state.filtros[key] = value;
        localStorage.setItem(`kanban-filtros-${workspaceId}`, JSON.stringify(state.filtros));
      });
    }
  }))
);
