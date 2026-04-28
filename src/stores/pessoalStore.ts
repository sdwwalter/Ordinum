import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ReceitaPessoal, DespesaPessoal, OrcamentoPessoal, ReservaMeta } from '@/types/pessoal';
import { createClient } from '@/lib/supabase/client';

interface PessoalState {
  receitas: ReceitaPessoal[];
  despesas: DespesaPessoal[];
  orcamentos: OrcamentoPessoal[];
  reservas: ReservaMeta[];
  isLoading: boolean;
  error: string | null;

  // Actions
  carregarDados: (workspaceId: string, mesReferencia: string) => Promise<void>;
  addDespesa: (despesa: Omit<DespesaPessoal, 'id' | 'created_at'>) => Promise<void>;
  addReceita: (receita: Omit<ReceitaPessoal, 'id' | 'created_at'>) => Promise<void>;
  addReceitaLocal: (receita: ReceitaPessoal) => void;
  removerDespesa: (id: string) => Promise<void>;
  removerReceita: (id: string) => Promise<void>;
  
  addReserva: (reserva: Omit<ReservaMeta, 'id'>) => Promise<void>;
  addOrcamento: (orcamento: Omit<OrcamentoPessoal, 'id'>) => Promise<void>;
}

export const usePessoalStore = create<PessoalState>()(
  immer((set, get) => ({
    receitas: [],
    despesas: [],
    orcamentos: [],
    reservas: [],
    isLoading: false,
    error: null,

    carregarDados: async (workspaceId, mesReferencia) => {
      set({ isLoading: true, error: null });
      const supabase = createClient();
      
      try {
        const [receitasRes, despesasRes, orcamentosRes, reservasRes] = await Promise.all([
          supabase.from('receitas_pessoais').select('*').eq('workspace_id', workspaceId).eq('mes_referencia', mesReferencia),
          supabase.from('despesas_pessoais').select('*').eq('workspace_id', workspaceId).eq('mes_referencia', mesReferencia),
          supabase.from('orcamento_pessoal').select('*').eq('workspace_id', workspaceId).eq('mes_referencia', mesReferencia),
          supabase.from('reservas_metas').select('*').eq('workspace_id', workspaceId)
        ]);

        if (receitasRes.error) throw receitasRes.error;
        if (despesasRes.error) throw despesasRes.error;

        set((state) => {
          state.receitas = receitasRes.data || [];
          state.despesas = despesasRes.data || [];
          state.orcamentos = orcamentosRes.data || [];
          state.reservas = reservasRes.data || [];
          state.isLoading = false;
        });
      } catch (err: any) {
        set({ error: err.message, isLoading: false });
      }
    },

    addDespesa: async (novaDespesa) => {
      const supabase = createClient();
      const tempId = crypto.randomUUID();
      const despesaOtimista: DespesaPessoal = {
        ...novaDespesa,
        id: tempId,
        created_at: new Date().toISOString(),
      };

      set((state) => {
        state.despesas.push(despesaOtimista);
      });

      try {
        const { data, error } = await supabase.from('despesas_pessoais').insert(novaDespesa).select().single();
        if (error) throw error;
        
        set((state) => {
          const index = state.despesas.findIndex(d => d.id === tempId);
          if (index !== -1) state.despesas[index] = data;
        });

        // FASE 9: Gamificação
        const { useGamificationStore } = await import('@/stores/gamificationStore');
        useGamificationStore.getState().registrarEvento(novaDespesa.workspace_id, 'primeiro_lancamento', 10, 'Registrou uma despesa pessoal');
      } catch (err: any) {
        set((state) => {
          state.despesas = state.despesas.filter(d => d.id !== tempId);
          state.error = err.message;
        });
      }
    },

    addReceita: async (novaReceita) => {
      const supabase = createClient();
      const tempId = crypto.randomUUID();
      const receitaOtimista: ReceitaPessoal = {
        ...novaReceita,
        id: tempId,
        created_at: new Date().toISOString(),
      };

      set((state) => {
        state.receitas.push(receitaOtimista);
      });

      try {
        const { data, error } = await supabase.from('receitas_pessoais').insert(novaReceita).select().single();
        if (error) throw error;
        
        set((state) => {
          const index = state.receitas.findIndex(r => r.id === tempId);
          if (index !== -1) state.receitas[index] = data;
        });

        // FASE 9: Gamificação
        const { useGamificationStore } = await import('@/stores/gamificationStore');
        useGamificationStore.getState().registrarEvento(novaReceita.workspace_id, 'primeiro_lancamento', 10, 'Registrou uma receita pessoal');
      } catch (err: any) {
        set((state) => {
          state.receitas = state.receitas.filter(r => r.id !== tempId);
          state.error = err.message;
        });
      }
    },

    addReceitaLocal: (receita) => {
      set((state) => {
        state.receitas.push(receita);
      });
    },

    removerDespesa: async (id) => {
      const supabase = createClient();
      const stateAnterior = [...get().despesas];
      
      set((state) => {
        state.despesas = state.despesas.filter(d => d.id !== id);
      });

      try {
        const { error } = await supabase.from('despesas_pessoais').delete().eq('id', id);
        if (error) throw error;
      } catch (err: any) {
        set((state) => {
          state.despesas = stateAnterior;
          state.error = err.message;
        });
      }
    },

    removerReceita: async (id) => {
      const supabase = createClient();
      const stateAnterior = [...get().receitas];
      
      set((state) => {
        state.receitas = state.receitas.filter(r => r.id !== id);
      });

      try {
        const { error } = await supabase.from('receitas_pessoais').delete().eq('id', id);
        if (error) throw error;
      } catch (err: any) {
        set((state) => {
          state.receitas = stateAnterior;
          state.error = err.message;
        });
      }
    },

    addReserva: async (novaReserva) => {
      const supabase = createClient();
      const { data, error } = await supabase.from('reservas_metas').insert(novaReserva).select().single();
      if (!error && data) {
        set((state) => { state.reservas.push(data); });
      }
    },

    addOrcamento: async (novoOrcamento) => {
      const supabase = createClient();
      const { data, error } = await supabase.from('orcamento_pessoal').upsert(novoOrcamento).select().single();
      if (!error && data) {
        set((state) => { 
          const index = state.orcamentos.findIndex(o => o.id === data.id || (o.mes_referencia === data.mes_referencia && o.user_id === data.user_id));
          if(index !== -1) state.orcamentos[index] = data;
          else state.orcamentos.push(data); 
        });
      }
    }
  }))
);
