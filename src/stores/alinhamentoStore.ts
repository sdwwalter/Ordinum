import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createClient } from '@/lib/supabase/client';
import { Alinhamento, AlinhamentoAcao, StatusAcao } from '@/types/alinhamento';
import { toast } from 'sonner';
import { useEmpresaStore } from './empresaStore';
import { useProjetosStore } from './projetosStore';

export interface ItemPauta {
  id: string;
  tipo: 'acao_passada' | 'projeto_atrasado' | 'orcamento_estourado' | 'fechamento' | 'alerta_dre';
  titulo: string;
  descricao: string;
  referenciaId?: string;
  discutido: boolean;
}

interface AlinhamentoState {
  historico: Alinhamento[];
  sessaoAtiva: Alinhamento | null;
  pautaAtiva: ItemPauta[];
  acoesSessao: Partial<AlinhamentoAcao>[];
  isLoading: boolean;

  carregarHistorico: (workspaceId: string) => Promise<void>;
  iniciarSessao: (workspaceId: string, tipo: 'semanal' | 'revisao_solo') => Promise<void>;
  gerarPautaAutomatica: (workspaceId: string) => Promise<void>;
  marcarPautaDiscutida: (pautaId: string, discutido: boolean) => void;
  adicionarAcao: (acao: Pick<AlinhamentoAcao, 'descricao' | 'responsavel_id' | 'prazo'>) => void;
  removerAcao: (id: string) => void;
  encerrarSessao: (notas_livres: string, decisoes: any) => Promise<void>;
}

export const useAlinhamentoStore = create<AlinhamentoState>()(
  immer((set, get) => ({
    historico: [],
    sessaoAtiva: null,
    pautaAtiva: [],
    acoesSessao: [],
    isLoading: false,

    carregarHistorico: async (workspaceId) => {
      set({ isLoading: true });
      const supabase = createClient();
      const { data } = await supabase
        .from('alinhamentos')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('data', { ascending: false });
      
      if (data) {
        set(state => { state.historico = data; state.isLoading = false; });
      } else {
        set({ isLoading: false });
      }
    },

    iniciarSessao: async (workspaceId, tipo) => {
      const supabase = createClient();
      const novaSessao = {
        workspace_id: workspaceId,
        data: new Date().toISOString(),
        tipo,
        status: 'em_andamento' as const,
        pauta: [],
        decisoes: [],
        notas_livres: null,
        duracao_minutos: null
      };

      const { data, error } = await supabase.from('alinhamentos').insert(novaSessao).select().single();
      if (!error && data) {
        set(state => { 
          state.sessaoAtiva = data; 
          state.pautaAtiva = []; 
          state.acoesSessao = []; 
        });
        await get().gerarPautaAutomatica(workspaceId);
      }
    },

    gerarPautaAutomatica: async (workspaceId) => {
      const supabase = createClient();
      const pauta: ItemPauta[] = [];

      // 1. Ações não concluídas da sessão passada
      const { data: ultimo } = await supabase.from('alinhamentos')
        .select('id')
        .eq('workspace_id', workspaceId)
        .eq('status', 'realizado')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      if (ultimo) {
        const { data: acoes } = await supabase.from('alinhamento_acoes')
          .select('*')
          .eq('alinhamento_id', ultimo.id)
          .neq('status', 'concluido');
        
        if (acoes) {
          acoes.forEach(a => {
            pauta.push({
              id: crypto.randomUUID(),
              tipo: 'acao_passada',
              titulo: `Ação Pendente: ${a.descricao}`,
              descricao: 'Cobrar atualização ou repactuar prazo.',
              referenciaId: a.id,
              discutido: false
            });
          });
        }
      }

      // 2. Projetos com tarefas vencidas
      const hoje = new Date().toISOString().split('T')[0];
      const { data: tarefasVencidas } = await supabase.from('tarefas_projeto')
        .select('id, titulo, projeto_id, data_prevista')
        .lt('data_prevista', hoje)
        .neq('status', 'concluida');
        
      if (tarefasVencidas && tarefasVencidas.length > 0) {
        pauta.push({
          id: crypto.randomUUID(),
          tipo: 'projeto_atrasado',
          titulo: `Tarefas Vencidas (${tarefasVencidas.length})`,
          descricao: 'Existem projetos com tarefas que ultrapassaram o prazo.',
          discutido: false
        });
      }

      // 3. Projetos com sum(despesas) > 80% do investimento_previsto
      const { data: projetos } = await supabase.from('projetos').select('id, nome, investimento_previsto, despesas_empresa(valor)').eq('workspace_id', workspaceId).neq('status', 'concluido');
      if (projetos) {
        projetos.forEach(p => {
          if (p.investimento_previsto > 0) {
            const sumDespesas = (p.despesas_empresa as any[]).reduce((a, b) => a + b.valor, 0);
            if (sumDespesas > p.investimento_previsto * 0.8) {
              pauta.push({
                id: crypto.randomUUID(),
                tipo: 'orcamento_estourado',
                titulo: `Orçamento Crítico: ${p.nome}`,
                descricao: `As despesas já atingiram ${((sumDespesas / p.investimento_previsto) * 100).toFixed(1)}% do previsto.`,
                discutido: false
              });
            }
          }
        });
      }

      // 5. Alertas críticos (resultado_liquido < 0 em alguma empresa) no mês anterior ou atual
      const mesAtual = hoje.substring(0, 7);
      const { data: recEmpresa } = await supabase.from('receitas_empresa').select('empresa_id, valor').eq('workspace_id', workspaceId).eq('mes_referencia', mesAtual);
      const { data: despEmpresa } = await supabase.from('despesas_empresa').select('empresa_id, valor').eq('workspace_id', workspaceId).eq('mes_referencia', mesAtual);
      
      const empSet = new Set([...(recEmpresa || []).map(r => r.empresa_id), ...(despEmpresa || []).map(d => d.empresa_id)]);
      empSet.forEach(empId => {
        const r = (recEmpresa || []).filter(x => x.empresa_id === empId).reduce((a, b) => a + b.valor, 0);
        const d = (despEmpresa || []).filter(x => x.empresa_id === empId).reduce((a, b) => a + b.valor, 0);
        if (r - d < 0) {
          pauta.push({
            id: crypto.randomUUID(),
            tipo: 'alerta_dre',
            titulo: 'Alerta de DRE Negativo',
            descricao: `A empresa está operando com prejuízo neste mês (${mesAtual}).`,
            discutido: false
          });
        }
      });

      // 4. Fechamento mensal (dia >= 25)
      const diaAtual = new Date().getDate();
      if (diaAtual >= 25) {
        pauta.push({
          id: crypto.randomUUID(),
          tipo: 'fechamento',
          titulo: 'Fechamento Mensal',
          descricao: 'Estamos próximos da virada do mês. Lançar notas e checar impostos.',
          discutido: false
        });
      }

      set(state => { state.pautaAtiva = pauta; });
    },

    marcarPautaDiscutida: (id, discutido) => {
      set(state => {
        const item = state.pautaAtiva.find(p => p.id === id);
        if (item) item.discutido = discutido;
      });
    },

    adicionarAcao: (acao) => {
      set(state => {
        state.acoesSessao.push({
          ...acao,
          id: crypto.randomUUID(),
          status: 'pendente' as StatusAcao,
          posicao: state.acoesSessao.length
        });
      });
    },

    removerAcao: (id) => {
      set(state => {
        state.acoesSessao = state.acoesSessao.filter(a => a.id !== id);
      });
    },

    encerrarSessao: async (notas_livres, decisoes) => {
      const state = get();
      if (!state.sessaoAtiva) return;
      
      const supabase = createClient();
      const sessaoId = state.sessaoAtiva.id;

      // 1. Inserir todas as ações geradas na tabela alinhamento_acoes
      if (state.acoesSessao.length > 0) {
        const payload = state.acoesSessao.map((a, idx) => ({
          alinhamento_id: sessaoId,
          descricao: a.descricao!,
          responsavel_id: a.responsavel_id,
          prazo: a.prazo,
          status: 'pendente' as StatusAcao,
          posicao: idx
        }));
        await supabase.from('alinhamento_acoes').insert(payload);
      }

      // 2. Atualizar o status da sessão para realizado
      await supabase.from('alinhamentos').update({
        status: 'realizado',
        notas_livres,
        decisoes,
        pauta: state.pautaAtiva
      }).eq('id', sessaoId);

      set(state => { state.sessaoAtiva = null; state.pautaAtiva = []; state.acoesSessao = []; });
      
      toast.success(`✓ Sessão encerrada. ${state.acoesSessao.length} ações criadas no Kanban.`);
      
      // FASE 9: Gamificação - Alinhamento Realizado
      const { useGamificationStore } = await import('@/stores/gamificationStore');
      const wsId = state.sessaoAtiva.workspace_id;
      if (wsId) {
        useGamificationStore.getState().registrarEvento(wsId, 'alinhamento_realizado', 25, 'Sessão de alinhamento concluída');
      }

    }
  }))
);
