export type OrigemReceitaPessoal = 'salario' | 'prolabore' | 'freelance' | 'investimento' | 'outro';
export type TipoDespesaPessoal = 'fixa' | 'variavel' | 'eventual';

export type ReceitaPessoal = {
  id: string;
  workspace_id: string;
  user_id: string;
  descricao: string;
  valor: number;
  origem: OrigemReceitaPessoal;
  data: string;
  mes_referencia: string;
  created_at: string;
};

export type DespesaPessoal = {
  id: string;
  workspace_id: string;
  user_id: string;
  descricao: string;
  valor: number;
  categoria: string;
  tipo: TipoDespesaPessoal;
  data: string;
  recorrente: boolean;
  mes_referencia: string;
  created_at: string;
};

export type OrcamentoPessoal = {
  id: string;
  workspace_id: string;
  user_id: string;
  mes_referencia: string;
  receita_prevista: number;
  despesa_prevista: number;
  reserva_meta: number;
};

export type ReservaMeta = {
  id: string;
  workspace_id: string;
  user_id: string;
  nome: string;
  meta: number;
  saldo_atual: number;
  prazo: string | null;
  ativo: boolean;
};
