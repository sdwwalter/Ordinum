import { ItemKanban, StatusKanban } from '@/types/kanban';
import { TarefaProjeto, StatusTarefa } from '@/types/projetos';
import { AlinhamentoAcao, StatusAcao } from '@/types/alinhamento';

export function mapTarefaToKanban(
  tarefa: TarefaProjeto, 
  projetoId: string, 
  projetoNome: string, 
  projetoCor: string, 
  workspaceId: string
): ItemKanban {
  const statusMap: Record<StatusTarefa, StatusKanban> = {
    'pendente': 'a_fazer',
    'em_andamento': 'em_andamento',
    'bloqueada': 'bloqueado',
    'concluida': 'concluido'
  };

  const hoje = new Date().toISOString().split('T')[0];
  const vencido = tarefa.data_prevista ? tarefa.data_prevista < hoje && tarefa.status !== 'concluida' : false;

  return {
    id: tarefa.id,
    titulo: tarefa.titulo,
    descricao: tarefa.descricao,
    origem: 'tarefa_projeto',
    origem_id: projetoId,
    origem_nome: projetoNome,
    origem_cor: projetoCor,
    status_kanban: statusMap[tarefa.status],
    responsavel_id: tarefa.responsavel_id,
    data_prevista: tarefa.data_prevista,
    vencido,
    posicao: tarefa.posicao,
    workspace_id: workspaceId
  };
}

export function mapAcaoToKanban(
  acao: AlinhamentoAcao, 
  alinhamentoId: string, 
  alinhamentoNome: string, 
  workspaceId: string
): ItemKanban {
  const statusMap: Record<StatusAcao, StatusKanban> = {
    'pendente': 'a_fazer',
    'em_andamento': 'em_andamento',
    'bloqueado': 'bloqueado',
    'concluido': 'concluido'
  };

  const hoje = new Date().toISOString().split('T')[0];
  const vencido = acao.prazo ? acao.prazo < hoje && acao.status !== 'concluido' : false;

  return {
    id: acao.id,
    titulo: acao.descricao,
    descricao: null,
    origem: 'proximo_passo',
    origem_id: alinhamentoId,
    origem_nome: alinhamentoNome,
    origem_cor: '#8B5CF6', // violet-500
    status_kanban: statusMap[acao.status],
    responsavel_id: acao.responsavel_id || '',
    data_prevista: acao.prazo,
    vencido,
    posicao: acao.posicao,
    workspace_id: workspaceId
  };
}
