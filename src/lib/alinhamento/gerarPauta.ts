import { createClient } from '@/lib/supabase/server';

export async function contarInboxPendente(workspace_id?: string) {
  const supabase = await createClient();
  const { count, error } = await supabase.from('gtd_inbox').select('id', { count: 'exact', head: true }).eq('processado', false);
  if (error) throw new Error(error.message);
  return typeof count === 'number' ? count : 0;
}

export async function contarProjetosSemNextAction(workspace_id?: string) {
  const supabase = await createClient();
  // projects active where no tarefa with is_next_action = true
  const { data: projetos, error } = await supabase.from('projetos').select('id').in('status', ['ativo','em_andamento']);
  if (error) throw new Error(error.message);
  let sem = 0;
  for (const p of (projetos || [])) {
    const { count } = await supabase.from('tarefas_projeto').select('id', { count: 'exact', head: true }).eq('projeto_id', p.id).eq('is_next_action', true);
    if (!count) sem += 1;
  }
  return sem;
}

export async function listarAguardandoAntigos(workspace_id?: string, dias = 7) {
  const supabase = await createClient();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - dias);
  const { data, error } = await supabase.from('tarefas_projeto').select('*').not('aguardando_de', 'is', null).lt('created_at', cutoff.toISOString());
  if (error) throw new Error(error.message);
  return data || [];
}

export async function gerarPautaGTD(workspace_id?: string) {
  const [inboxCount, semNextAction, aguardandoAntigos] = await Promise.all([
    contarInboxPendente(workspace_id),
    contarProjetosSemNextAction(workspace_id),
    listarAguardandoAntigos(workspace_id, 7),
  ]);

  const itens: { tipo: string; texto: string }[] = [];

  if (inboxCount > 0)
    itens.push({ tipo: 'alerta', texto: `${inboxCount} itens no inbox para processar` });

  if (semNextAction > 0)
    itens.push({ tipo: 'alerta', texto: `${semNextAction} projetos sem próxima ação definida` });

  if ((aguardandoAntigos || []).length > 0)
    itens.push({ tipo: 'alerta', texto: `${(aguardandoAntigos || []).length} itens aguardando há mais de 7 dias` });

  return itens;
}
