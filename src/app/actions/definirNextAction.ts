'use server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createClientClient } from '@/lib/supabase/client';

export async function definirNextAction(tarefa_id: string, projeto_id: string) {
  const supabase = await createClient();

  // 1) unset previous next actions in the project
  const { error: e1 } = await supabase.from('tarefas_projeto').update({ is_next_action: false }).eq('projeto_id', projeto_id);
  if (e1) throw new Error(e1.message);

  // 2) set the requested task
  const { error: e2 } = await supabase.from('tarefas_projeto').update({ is_next_action: true }).eq('id', tarefa_id);
  if (e2) throw new Error(e2.message);

  return { ok: true };
}

// register gamification event for next action assignment
export async function definirNextActionWithEvent(tarefa_id: string, projeto_id: string) {
  const res = await definirNextAction(tarefa_id, projeto_id);
  try {
    const supa = createClientClient();
    const { data: { user } } = await supa.auth.getUser();
    const { data: member } = await supa.from('membros_workspace').select('workspace_id').eq('user_id', user?.id).limit(1).single();
    if (user && member?.workspace_id) {
      await supa.from('gamification_eventos').insert({ workspace_id: member.workspace_id, user_id: user.id, tipo: 'projeto_com_next_action', pontos: 3, descricao: 'Definiu next action' });
    }
  } catch (e) {
    console.warn('gamification definirNextAction failed', e);
  }
  return res;
}
