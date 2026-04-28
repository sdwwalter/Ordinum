import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createClient } from '@/lib/supabase/client';
import { Projeto, TarefaProjeto } from '@/types/projetos';
import { DespesaEmpresa } from '@/types/empresa';
import { toast } from 'sonner';

interface ProjetosState {
  projetos: Projeto[];
  tarefas: TarefaProjeto[];
  despesas: DespesaEmpresa[];
  isLoading: boolean;
  error: string | null;

  carregarProjetos: (workspaceId: string) => Promise<void>;
  carregarDetalhesProjeto: (projetoId: string) => Promise<void>;
  
  addProjeto: (projeto: Omit<Projeto, 'id' | 'created_at'>) => Promise<void>;
  updateProjeto: (id: string, updates: Partial<Projeto>) => Promise<void>;
  
  addTarefa: (tarefa: Omit<TarefaProjeto, 'id' | 'created_at'>) => Promise<void>;
  updateTarefaStatus: (id: string, status: TarefaProjeto['status'], novaPosicao?: number) => Promise<void>;
  removerTarefa: (id: string) => Promise<void>;

  setDespesasEmTempoReal: (despesas: DespesaEmpresa[]) => void;
}

export const useProjetosStore = create<ProjetosState>()(
  immer((set, get) => ({
    projetos: [],
    tarefas: [],
    despesas: [],
    isLoading: false,
    error: null,

    carregarProjetos: async (workspaceId) => {
      set({ isLoading: true });
      const supabase = createClient();
      const { data, error } = await supabase.from('projetos').select('*, despesas_empresa(valor)').eq('workspace_id', workspaceId).order('created_at', { ascending: false });
      if (!error && data) {
        set(state => { state.projetos = data; state.isLoading = false; });
      } else {
        set(state => { state.isLoading = false; state.error = error?.message || null; });
      }
    },

    carregarDetalhesProjeto: async (projetoId) => {
      set({ isLoading: true });
      const supabase = createClient();
      
      const [projetoRes, tarefasRes, despesasRes] = await Promise.all([
        supabase.from('projetos').select('*').eq('id', projetoId).single(),
        supabase.from('tarefas_projeto').select('*').eq('projeto_id', projetoId).order('posicao', { ascending: true }),
        supabase.from('despesas_empresa').select('*').eq('projeto_id', projetoId)
      ]);

      set(state => {
        if (projetoRes.data) {
          const index = state.projetos.findIndex(p => p.id === projetoId);
          if (index !== -1) state.projetos[index] = projetoRes.data;
          else state.projetos.push(projetoRes.data);
        }
        state.tarefas = tarefasRes.data || [];
        state.despesas = despesasRes.data || [];
        state.isLoading = false;
      });
    },

    addProjeto: async (novoProjeto) => {
      const supabase = createClient();
      const tempId = crypto.randomUUID();
      const otimista = { ...novoProjeto, id: tempId, created_at: new Date().toISOString() } as Projeto;
      
      set(state => { state.projetos.unshift(otimista); });
      
      const { data, error } = await supabase.from('projetos').insert(novoProjeto).select().single();
      if (error) {
        set(state => { state.projetos = state.projetos.filter(p => p.id !== tempId); });
        toast.error('Erro ao criar projeto');
        throw error;
      } else {
        set(state => {
          const idx = state.projetos.findIndex(p => p.id === tempId);
          if (idx !== -1) state.projetos[idx] = data;
        });
        toast.success('Projeto criado com sucesso!');
      }
    },

    updateProjeto: async (id, updates) => {
      const supabase = createClient();
      const previous = get().projetos.find(p => p.id === id);
      
      set(state => {
        const idx = state.projetos.findIndex(p => p.id === id);
        if (idx !== -1) Object.assign(state.projetos[idx], updates);
      });

      const { error } = await supabase.from('projetos').update(updates).eq('id', id);
      if (error) {
        if (previous) {
          set(state => {
            const idx = state.projetos.findIndex(p => p.id === id);
            if (idx !== -1) state.projetos[idx] = previous;
          });
        }
        toast.error('Erro ao atualizar projeto');
        throw error;
      }

      // FASE 9: Gamificação - Projeto Concluído
      if (updates.status === 'concluido' && previous?.status !== 'concluido') {
        const { useGamificationStore } = await import('@/stores/gamificationStore');
        const workspaceId = previous?.workspace_id;
        if (workspaceId) {
          useGamificationStore.getState().registrarEvento(workspaceId, 'projeto_concluido', 100, `Concluiu o projeto: ${previous?.nome}`);
          import('canvas-confetti').then((confetti) => {
            confetti.default({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
          });
        }
      }
    },

    addTarefa: async (novaTarefa) => {
      const supabase = createClient();
      const tempId = crypto.randomUUID();
      const otimista = { ...novaTarefa, id: tempId, created_at: new Date().toISOString() } as TarefaProjeto;
      
      set(state => { state.tarefas.push(otimista); });
      
      const { data, error } = await supabase.from('tarefas_projeto').insert(novaTarefa).select().single();
      if (error) {
        set(state => { state.tarefas = state.tarefas.filter(t => t.id !== tempId); });
        throw error;
      } else {
        set(state => {
          const idx = state.tarefas.findIndex(t => t.id === tempId);
          if (idx !== -1) state.tarefas[idx] = data;
        });
      }
    },

    updateTarefaStatus: async (id, status, novaPosicao) => {
      const supabase = createClient();
      const stateAnterior = [...get().tarefas];
      
      set(state => {
        const idx = state.tarefas.findIndex(t => t.id === id);
        if (idx !== -1) {
          state.tarefas[idx].status = status;
          if (novaPosicao !== undefined) state.tarefas[idx].posicao = novaPosicao;
        }
      });

      const updates: any = { status };
      if (novaPosicao !== undefined) updates.posicao = novaPosicao;

      const { error } = await supabase.from('tarefas_projeto').update(updates).eq('id', id);
      if (error) {
        set(state => { state.tarefas = stateAnterior; });
        toast.error('Erro ao mover tarefa');
      }
    },

    removerTarefa: async (id) => {
      const supabase = createClient();
      const stateAnterior = [...get().tarefas];
      set(state => { state.tarefas = state.tarefas.filter(t => t.id !== id); });
      const { error } = await supabase.from('tarefas_projeto').delete().eq('id', id);
      if (error) {
        set(state => { state.tarefas = stateAnterior; });
        toast.error('Erro ao remover tarefa');
      }
    },

    setDespesasEmTempoReal: (despesas) => {
      set(state => { state.despesas = despesas; });
    }
  }))
);
