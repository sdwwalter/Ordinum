export type TipoEmpresa = 'servicos' | 'produto' | 'tech' | 'comercio' | 'imobiliario' | 'outro';

export type Empresa = {
  id: string;
  workspace_id: string;
  nome: string;
  tipo: TipoEmpresa;
  cnpj: string | null;
  cor: string;
  meta_faturamento: number | null;
  ativo: boolean;
};

export type ReceitaEmpresa = {
  id: string;
  empresa_id: string;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
  cliente: string | null;
  projeto_id: string | null;
  mes_referencia: string;
  criado_por: string;
  created_at: string;
};

export type DespesaEmpresa = {
  id: string;
  empresa_id: string;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
  fornecedor: string | null;
  projeto_id: string | null;
  recorrente: boolean;
  mes_referencia: string;
  criado_por: string;
  created_at: string;
};

export type Prolabore = {
  id: string;
  empresa_id: string;
  destinatario_id: string;
  valor: number;
  mes_referencia: string;
  pago: boolean;
  data_pagamento: string | null;
  receita_pessoal_id: string | null;
};
