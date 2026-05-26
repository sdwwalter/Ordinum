export type GtdContexto =
  | '@computador'
  | '@telefone'
  | '@campo'
  | '@reuniao'
  | '@email'
  | '@qualquer';

export type ProjetoStatus =
  | 'rascunho'
  | 'ativo'
  | 'pausado'
  | 'concluido'
  | 'cancelado'
  | 'algum_dia';

export type TarefaStatus = 'pendente' | 'em_andamento' | 'concluida' | 'bloqueada';

export interface GtdInboxItem {
  id: string;
  workspace_id: string;
  user_id: string;
  conteudo: string;
  processado: boolean;
  created_at: string;
}
