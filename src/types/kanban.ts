export type StatusKanban = 'a_fazer' | 'em_andamento' | 'bloqueado' | 'concluido';
export type OrigemKanban = 'tarefa_projeto' | 'proximo_passo';

export type ItemKanban = {
  id: string;
  titulo: string;
  descricao: string | null;
  origem: OrigemKanban;
  origem_id: string;
  origem_nome: string;
  origem_cor: string;
  status_kanban: StatusKanban;
  responsavel_id: string;
  data_prevista: string | null;
  vencido: boolean;
  posicao: number;
  workspace_id: string;
};
