export type ModoWorkspace = 'casal' | 'solo' | 'socios';
export type PlanoWorkspace = 'free' | 'pro' | 'business';
export type PapelMembro = 'admin' | 'membro';

export type Workspace = {
  id: string;
  nome: string;
  modo: ModoWorkspace;
  plano: PlanoWorkspace;
  criado_em: string;
};

export type MembroWorkspace = {
  id: string;
  workspace_id: string;
  user_id: string;
  papel: PapelMembro;
  apelido: string | null;
  ativo: boolean;
};
