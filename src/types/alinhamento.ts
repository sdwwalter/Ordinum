export type TipoAlinhamento = 'semanal' | 'revisao_solo';
export type StatusAlinhamento = 'agendado' | 'em_andamento' | 'realizado' | 'cancelado';

export type Alinhamento = {
  id: string;
  workspace_id: string;
  data: string;
  tipo: TipoAlinhamento;
  status: StatusAlinhamento;
  pauta: any;
  decisoes: any;
  notas_livres: string | null;
  duracao_minutos: number | null;
  created_at: string;
};

export type StatusAcao = 'pendente' | 'em_andamento' | 'bloqueado' | 'concluido';

export type AlinhamentoAcao = {
  id: string;
  alinhamento_id: string;
  descricao: string;
  responsavel_id: string | null;
  prazo: string | null;
  status: StatusAcao;
  posicao: number;
  created_at: string;
};
