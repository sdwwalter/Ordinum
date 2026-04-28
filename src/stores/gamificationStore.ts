import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface Badge {
  id: string;
  nome: string;
  descricao: string;
  icone: string; // emoji ou lucide class
}

export const BADGES_DISPONIVEIS: Record<string, Badge> = {
  primeiro_lancamento: { id: 'primeiro_lancamento', nome: 'Primeiro Passo', descricao: 'Realizou o primeiro lançamento financeiro.', icone: '🌱' },
  projeto_concluido: { id: 'projeto_concluido', nome: 'Executor', descricao: 'Entregou o seu primeiro projeto.', icone: '🚀' },
  alinhamento_realizado: { id: 'alinhamento_realizado', nome: 'Estrategista', descricao: 'Fez sua primeira reunião de alinhamento.', icone: '🎯' },
  fechamento_mes: { id: 'fechamento_mes', nome: 'Gestor Impecável', descricao: 'Fechou o mês financeiro.', icone: '🏆' },
};

interface GamificationState {
  pontosTotais: number;
  badgesDesbloqueados: string[];
  streakDias: number;
  gamificacaoAtiva: boolean;
  novoBadge: Badge | null; // Usado para mostrar o modal

  carregarStatus: (workspaceId: string) => Promise<void>;
  registrarEvento: (workspaceId: string, tipo: string, pontos: number, descricao: string) => Promise<void>;
  fecharModalBadge: () => void;
  setGamificacaoAtiva: (ativa: boolean) => void;
}

export const useGamificationStore = create<GamificationState>()(
  immer((set, get) => ({
    pontosTotais: 0,
    badgesDesbloqueados: [],
    streakDias: 0,
    gamificacaoAtiva: true,
    novoBadge: null,

    carregarStatus: async (workspaceId) => {
      // Verifica opt-out local
      const isAtiva = localStorage.getItem('gamificacao_desativada') !== 'true';
      set({ gamificacaoAtiva: isAtiva });
      if (!isAtiva) return;

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Carregar total de pontos (soma de gamification_eventos)
      const { data: eventos } = await supabase
        .from('gamification_eventos')
        .select('pontos, created_at')
        .eq('workspace_id', workspaceId)
        .eq('user_id', user.id);

      let total = 0;
      if (eventos) {
        total = eventos.reduce((sum, ev) => sum + ev.pontos, 0);
      }

      // 2. Carregar badges
      const { data: badges } = await supabase
        .from('gamification_badges')
        .select('badge_id')
        .eq('workspace_id', workspaceId)
        .eq('user_id', user.id);

      // Simulação simples de Streak (em ambiente real exigiria query de agrupamento de dias)
      // Se ele teve algum evento nas últimas 24h, mantém, caso contrário zera
      const hoje = new Date();
      let streak = 0;
      if (eventos && eventos.length > 0) {
        const datas = eventos.map(e => new Date(e.created_at).toDateString());
        const uniqDatas = Array.from(new Set(datas)).sort((a,b) => new Date(b).getTime() - new Date(a).getTime());
        // Se a data mais recente não for hoje nem ontem, streak quebra
        const dataMaisRecente = new Date(uniqDatas[0]);
        const diffDias = Math.floor((hoje.getTime() - dataMaisRecente.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDias <= 1) {
          streak = uniqDatas.length; // bem ingênuo, mas funciona pro MVP
        }
      }

      set(state => {
        state.pontosTotais = total;
        state.badgesDesbloqueados = badges?.map(b => b.badge_id) || [];
        state.streakDias = streak;
      });
    },

    registrarEvento: async (workspaceId, tipo, pontos, descricao) => {
      const state = get();
      if (!state.gamificacaoAtiva) return;

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Inserir evento
      await supabase.from('gamification_eventos').insert({
        workspace_id: workspaceId,
        user_id: user.id,
        tipo,
        pontos,
        descricao
      });

      // Feedback visual discreto
      toast.success(`+${pontos} pts: ${descricao}`, {
        icon: '✨',
      });

      // Atualizar store local
      set(s => { s.pontosTotais += pontos; });

      // Checar e Desbloquear Badges
      const checarBadge = async (badgeId: string) => {
        if (!state.badgesDesbloqueados.includes(badgeId)) {
          await supabase.from('gamification_badges').insert({
            workspace_id: workspaceId,
            user_id: user.id,
            badge_id: badgeId
          });
          set(s => { 
            s.badgesDesbloqueados.push(badgeId); 
            s.novoBadge = BADGES_DISPONIVEIS[badgeId];
          });
        }
      };

      if (tipo === 'primeiro_lancamento') await checarBadge('primeiro_lancamento');
      if (tipo === 'projeto_concluido') await checarBadge('projeto_concluido');
      if (tipo === 'alinhamento_realizado') await checarBadge('alinhamento_realizado');
      if (tipo === 'fechamento_mes') await checarBadge('fechamento_mes');
    },

    fecharModalBadge: () => {
      set({ novoBadge: null });
    },

    setGamificacaoAtiva: (ativa) => {
      if (ativa) {
        localStorage.removeItem('gamificacao_desativada');
      } else {
        localStorage.setItem('gamificacao_desativada', 'true');
      }
      set({ gamificacaoAtiva: ativa });
    }
  }))
);
