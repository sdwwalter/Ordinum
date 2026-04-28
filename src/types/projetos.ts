export type TipoProjeto = 'empresa' | 'pessoal';
export type StatusProjeto = 'rascunho' | 'ativo' | 'pausado' | 'concluido' | 'cancelado';
export type PrioridadeProjeto = 'alta' | 'media' | 'baixa';

export type Projeto = {
  id: string;
  workspace_id: string;
  empresa_id: string | null;
  nome: string;
  descricao: string | null;
  tipo: TipoProjeto;
  status: StatusProjeto;
  prioridade: PrioridadeProjeto;
  responsavel_id: string;
  data_inicio: string;
  data_prevista_conclusao: string | null;
  investimento_previsto: number;
  retorno_previsto: number | null;
  retorno_realizado: number | null;
  cor: string;
  created_at: string;
  despesas_empresa?: { valor: number }[];
};

export type StatusTarefa = 'pendente' | 'em_andamento' | 'concluida' | 'bloqueada';

export type TarefaProjeto = {
  id: string;
  projeto_id: string;
  titulo: string;
  descricao: string | null;
  responsavel_id: string;
  status: StatusTarefa;
  data_prevista: string | null;
  data_conclusao: string | null;
  posicao: number;
  created_at: string;
};
