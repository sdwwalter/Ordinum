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

export interface TarefaProjeto {
  id: string;
  projeto_id: string;
  titulo: string;
  descricao?: string;
  responsavel_id?: string;
  status: TarefaStatus;
  data_prevista?: string;
  data_conclusao?: string;
  posicao: number;
  contexto?: GtdContexto;
  is_next_action: boolean;
  aguardando_de?: string;
  created_at: string;
}
