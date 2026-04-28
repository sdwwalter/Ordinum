import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createClient } from '@/lib/supabase/client';
import { usePessoalStore } from './pessoalStore';
import { Empresa, ReceitaEmpresa, DespesaEmpresa, Prolabore } from '@/types/empresa';
import { ReceitaPessoal } from '@/types/pessoal';
import { toast } from 'sonner';

interface EmpresaState {
  empresas: Empresa[];
  receitas: ReceitaEmpresa[];
  despesas: DespesaEmpresa[];
  prolabores: Prolabore[];
  isLoading: boolean;
  error: string | null;

  carregarDados: (workspaceId: string, empresaId: string, mesReferencia: string) => Promise<void>;
  carregarEmpresas: (workspaceId: string) => Promise<void>;
  
  addReceita: (receita: Omit<ReceitaEmpresa, 'id' | 'created_at'>) => Promise<void>;
  addDespesa: (despesa: Omit<DespesaEmpresa, 'id' | 'created_at'>) => Promise<void>;
  createProlabore: (prolabore: Omit<Prolabore, 'id'>, workspaceId: string) => Promise<void>;
  
  removerReceita: (id: string) => Promise<void>;
  removerDespesa: (id: string) => Promise<void>;
}

export const useEmpresaStore = create<EmpresaState>()(
  immer((set, get) => ({
    empresas: [],
    receitas: [],
    despesas: [],
    prolabores: [],
    isLoading: false,
    error: null,

    carregarEmpresas: async (workspaceId) => {
      const supabase = createClient();
      const { data } = await supabase.from('empresas').select('*').eq('workspace_id', workspaceId).eq('ativo', true);
      if (data) {
        set(state => { state.empresas = data; });
      }
    },

    carregarDados: async (workspaceId, empresaId, mesReferencia) => {
      set({ isLoading: true, error: null });
      const supabase = createClient();
      
      try {
        const [empresasRes, receitasRes, despesasRes, prolaboresRes] = await Promise.all([
          supabase.from('empresas').select('*').eq('workspace_id', workspaceId).eq('ativo', true),
          supabase.from('receitas_empresa').select('*').eq('empresa_id', empresaId).eq('mes_referencia', mesReferencia),
          supabase.from('despesas_empresa').select('*').eq('empresa_id', empresaId).eq('mes_referencia', mesReferencia),
          supabase.from('prolabores').select('*').eq('empresa_id', empresaId).eq('mes_referencia', mesReferencia)
        ]);

        set((state) => {
          state.empresas = empresasRes.data || [];
          state.receitas = receitasRes.data || [];
          state.despesas = despesasRes.data || [];
          state.prolabores = prolaboresRes.data || [];
          state.isLoading = false;
        });
      } catch (err: any) {
        set({ error: err.message, isLoading: false });
      }
    },

    addReceita: async (novaReceita) => {
      const supabase = createClient();
      const tempId = crypto.randomUUID();
      const receitaOtimista = { ...novaReceita, id: tempId, created_at: new Date().toISOString() } as ReceitaEmpresa;

      set((state) => { state.receitas.push(receitaOtimista); });

      try {
        const { data, error } = await supabase.from('receitas_empresa').insert(novaReceita).select().single();
        if (error) throw error;
        set((state) => {
          const index = state.receitas.findIndex(r => r.id === tempId);
          if (index !== -1) state.receitas[index] = data;
        });
      } catch (err: any) {
        set((state) => {
          state.receitas = state.receitas.filter(r => r.id !== tempId);
          state.error = err.message;
        });
        throw err;
      }
    },

    addDespesa: async (novaDespesa) => {
      const supabase = createClient();
      const tempId = crypto.randomUUID();
      const despesaOtimista = { ...novaDespesa, id: tempId, created_at: new Date().toISOString() } as DespesaEmpresa;

      set((state) => { state.despesas.push(despesaOtimista); });

      try {
        const { data, error } = await supabase.from('despesas_empresa').insert(novaDespesa).select().single();
        if (error) throw error;
        set((state) => {
          const index = state.despesas.findIndex(d => d.id === tempId);
          if (index !== -1) state.despesas[index] = data;
        });
      } catch (err: any) {
        set((state) => {
          state.despesas = state.despesas.filter(d => d.id !== tempId);
          state.error = err.message;
        });
        throw err;
      }
    },

    removerReceita: async (id) => {
      const supabase = createClient();
      const stateAnterior = [...get().receitas];
      set((state) => { state.receitas = state.receitas.filter(r => r.id !== id); });
      const { error } = await supabase.from('receitas_empresa').delete().eq('id', id);
      if (error) {
        set((state) => { state.receitas = stateAnterior; state.error = error.message; });
      }
    },

    removerDespesa: async (id) => {
      const supabase = createClient();
      const stateAnterior = [...get().despesas];
      set((state) => { state.despesas = state.despesas.filter(d => d.id !== id); });
      const { error } = await supabase.from('despesas_empresa').delete().eq('id', id);
      if (error) {
        set((state) => { state.despesas = stateAnterior; state.error = error.message; });
      }
    },

    createProlabore: async (prolabore, workspaceId) => {
      const supabase = createClient();
      
      try {
        // 1. Inserir receita pessoal
        const { data: receitaData, error: receitaError } = await supabase.from('receitas_pessoais').insert({
          workspace_id: workspaceId,
          user_id: prolabore.destinatario_id,
          descricao: 'Prolabore',
          valor: prolabore.valor,
          origem: 'prolabore',
          data: prolabore.data_pagamento || new Date().toISOString().split('T')[0],
          mes_referencia: prolabore.mes_referencia
        }).select().single();

        if (receitaError) throw receitaError;

        // 2 & 3. Inserir prolabore com FK
        const { data: prolaboreData, error: prolaboreError } = await supabase.from('prolabores').insert({
          ...prolabore,
          receita_pessoal_id: receitaData.id
        }).select().single();

        if (prolaboreError) {
          // Compensação simples (rollback manual do DB)
          await supabase.from('receitas_pessoais').delete().eq('id', receitaData.id);
          throw prolaboreError;
        }

        // 4. Injetar na store pessoal se carregada, e na da empresa
        set(state => { state.prolabores.push(prolaboreData); });
        usePessoalStore.getState().addReceitaLocal(receitaData as ReceitaPessoal);
        
        // Também lançar a despesa correspondente na empresa para DRE se for a regra.
        // O Spec diz "Lançado em despesas_empresa (categoria: pessoal)".
        // Wait: The spec explicitly says "Lançado em despesas_empresa (categoria: pessoal)".
        // I will do that here automatically!
        const { data: despesaData, error: despesaError } = await supabase.from('despesas_empresa').insert({
          empresa_id: prolabore.empresa_id,
          descricao: 'Prolabore',
          valor: prolabore.valor,
          categoria: 'pessoal',
          data: prolabore.data_pagamento || new Date().toISOString().split('T')[0],
          mes_referencia: prolabore.mes_referencia,
          criado_por: prolabore.destinatario_id
        }).select().single();

        if (despesaData && !despesaError) {
          set(state => { state.despesas.push(despesaData as DespesaEmpresa); });
        }

        // 5. Toast
        toast.success('✓ Prolabore registrado automaticamente na vida pessoal');
        
      } catch (err: any) {
        toast.error('Erro ao registrar prolabore: ' + err.message);
        throw err;
      }
    }
  }))
);
