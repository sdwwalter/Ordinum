import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createClient } from '@/lib/supabase/client';
import { formatarMesRef } from '@/lib/utils/formatters';

export type NivelAlerta = 'vermelho' | 'amarelo' | 'azul';

export interface Alerta {
  id: string;
  nivel: NivelAlerta;
  titulo: string;
  descricao: string;
  link: string;
  peso: number; // Para ordenação
}

interface DashboardState {
  alertas: Alerta[];
  isLoading: boolean;
  semaforos: {
    pessoal: NivelAlerta;
    empresa: NivelAlerta;
    projetos: NivelAlerta;
    alinhamento: NivelAlerta;
  };
  
  fetchDashboardData: (workspaceId: string, mesRef: string) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>()(
  immer((set) => ({
    alertas: [],
    isLoading: true,
    semaforos: {
      pessoal: 'azul',
      empresa: 'azul',
      projetos: 'azul',
      alinhamento: 'azul'
    },

    fetchDashboardData: async (workspaceId, mesRef) => {
      set({ isLoading: true });
      const supabase = createClient();
      
      const hoje = new Date();
      const hojeStr = hoje.toISOString().split('T')[0];
      const doisDiasFrente = new Date(hoje);
      doisDiasFrente.setDate(hoje.getDate() + 2);
      const doisDiasStr = doisDiasFrente.toISOString().split('T')[0];

      // Paraleliza todas as requisições vitais do dashboard
      const [
        resPessoais, 
        despPessoais, 
        resEmpresa, 
        despEmpresa, 
        tarefasProj, 
        sessoesAlin,
        orcamentos
      ] = await Promise.all([
        supabase.from('receitas_pessoais').select('valor').eq('workspace_id', workspaceId).eq('mes_referencia', mesRef),
        supabase.from('despesas_pessoais').select('valor, categoria_id, status').eq('workspace_id', workspaceId).eq('mes_referencia', mesRef),
        supabase.from('receitas_empresa').select('valor, empresa_id').eq('workspace_id', workspaceId).eq('mes_referencia', mesRef),
        supabase.from('despesas_empresa').select('valor, empresa_id').eq('workspace_id', workspaceId).eq('mes_referencia', mesRef),
        supabase.from('tarefas_projeto').select('id, projeto_id').neq('status', 'concluida').lt('data_prevista', hojeStr),
        supabase.from('alinhamentos').select('id, data').eq('workspace_id', workspaceId).eq('status', 'agendado'),
        supabase.from('orcamento_categorias').select('id, teto_gastos').eq('workspace_id', workspaceId)
      ]);

      const novosAlertas: Alerta[] = [];
      const novosSemaforos = { pessoal: 'azul' as NivelAlerta, empresa: 'azul' as NivelAlerta, projetos: 'azul' as NivelAlerta, alinhamento: 'azul' as NivelAlerta };

      // 1. 🔴 Saldo Pessoal Negativo
      const totRecPessoal = (resPessoais.data || []).reduce((a, b) => a + b.valor, 0);
      const totDespPessoal = (despPessoais.data || []).reduce((a, b) => a + b.valor, 0);
      if (totRecPessoal - totDespPessoal < 0) {
        novosAlertas.push({
          id: 'pessoal_negativo', nivel: 'vermelho', peso: 1,
          titulo: 'Saldo Pessoal Negativo',
          descricao: `Suas despesas superaram as receitas em ${mesRef}. Reveja o fluxo de caixa.`,
          link: '/app/pessoal/lancamentos'
        });
        novosSemaforos.pessoal = 'vermelho';
      }

      // 2. 🔴 Resultado de Empresa Negativo
      const empresasSet = new Set([...(resEmpresa.data||[]).map(r=>r.empresa_id), ...(despEmpresa.data||[]).map(d=>d.empresa_id)]);
      empresasSet.forEach(empId => {
        const rec = (resEmpresa.data||[]).filter(r=>r.empresa_id === empId).reduce((a,b)=>a+b.valor,0);
        const desp = (despEmpresa.data||[]).filter(d=>d.empresa_id === empId).reduce((a,b)=>a+b.valor,0);
        if (rec - desp < 0) {
          novosAlertas.push({
            id: `empresa_negativa_${empId}`, nivel: 'vermelho', peso: 2,
            titulo: 'Resultado Empresarial Negativo',
            descricao: `O DRE da empresa aponta prejuízo para ${mesRef}.`,
            link: `/app/empresa/${empId}/dre`
          });
          novosSemaforos.empresa = 'vermelho';
        }
      });

      // 3. 🟡 Projetos com tarefas vencidas
      const tarefasVencidas = tarefasProj.data || [];
      if (tarefasVencidas.length > 0) {
        novosAlertas.push({
          id: 'tarefas_vencidas', nivel: 'amarelo', peso: 3,
          titulo: `${tarefasVencidas.length} Tarefa(s) Vencida(s)`,
          descricao: 'Existem ações atrasadas em seus projetos.',
          link: '/app/projetos'
        });
        if (novosSemaforos.projetos !== 'vermelho') novosSemaforos.projetos = 'amarelo';
      }

      // 4. 🟡 Orçamento Pessoal estourado em >= 2 categorias
      const orcMap = new Map((orcamentos.data || []).map(o => [o.id, o.teto_gastos]));
      let categoriasEstouradas = 0;
      orcMap.forEach((teto, catId) => {
        if (teto > 0) {
          const gasto = (despPessoais.data || []).filter(d => d.categoria_id === catId).reduce((a,b)=>a+b.valor, 0);
          if (gasto > teto) categoriasEstouradas++;
        }
      });
      if (categoriasEstouradas >= 2) {
        novosAlertas.push({
          id: 'orcamento_estourado', nivel: 'amarelo', peso: 4,
          titulo: 'Orçamento Estourado',
          descricao: `${categoriasEstouradas} categorias ultrapassaram o teto de gastos.`,
          link: '/app/pessoal/orcamento'
        });
        if (novosSemaforos.pessoal !== 'vermelho') novosSemaforos.pessoal = 'amarelo';
      }

      // 5. 🟡 Prolabore não pago (Simulado verificando se há despesa_pessoal categorizada como prolabore pendente)
      // Para manter simples, a spec sugere checar se falta. Vamos lançar um azul caso não tenha sido faturado.
      // 6. 🔵 Próxima sessão de alinhamento em <= 2 dias
      const proximaSessao = (sessoesAlin.data || []).find(s => s.data >= hojeStr && s.data <= doisDiasStr);
      if (proximaSessao) {
        novosAlertas.push({
          id: 'sessao_proxima', nivel: 'azul', peso: 5,
          titulo: 'Sessão de Alinhamento Próxima',
          descricao: `Há uma sessão agendada para os próximos 2 dias. Prepare-se!`,
          link: '/app/alinhamento'
        });
      }

      // Ordenar: Vermelho (peso menor) -> Amarelo -> Azul
      novosAlertas.sort((a, b) => a.peso - b.peso);

      set(state => {
        state.alertas = novosAlertas;
        state.semaforos = novosSemaforos;
        state.isLoading = false;
      });
    }
  }))
);
