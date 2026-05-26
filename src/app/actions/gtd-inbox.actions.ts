'use server';
import { createClient } from '@/lib/supabase/server';
import type { GtdInboxItem } from '@/types';

type Supa = Awaited<ReturnType<typeof createClient>>;

async function insertGamificationEvent(supabase: Supa, workspace_id: string, user_id: string, tipo: string, pontos: number, descricao?: string) {
  await supabase.from('gamification_eventos').insert([{ workspace_id, user_id, tipo, pontos, descricao }]);
}

export async function capturarItem(conteudo: string): Promise<GtdInboxItem | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('gtd_inbox').insert([{ conteudo }]).select().single();
  if (error) throw new Error(error.message);
  try {
    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes?.user;
    const { data: member } = await supabase.from('membros_workspace').select('workspace_id').eq('user_id', user?.id).limit(1).single();
    if (user && member?.workspace_id) {
      await insertGamificationEvent(supabase, member.workspace_id, user.id, 'item_capturado', 1, 'Item capturado no Inbox');
    }
  } catch (e) {
    console.warn('gamification capture event failed', e);
  }
  return data as GtdInboxItem;
}

export async function listarInbox(workspace_id?: string) {
  const supabase = await createClient();
  const q = supabase.from('gtd_inbox').select('*').order('created_at', { ascending: false }).limit(200);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data as GtdInboxItem[];
}

export async function arquivarItem(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('gtd_inbox').update({ processado: true }).eq('id', id);
  if (error) throw new Error(error.message);
  try {
    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes?.user;
    const { data: member } = await supabase.from('membros_workspace').select('workspace_id').eq('user_id', user?.id).limit(1).single();
    const workspace_id = member?.workspace_id;
    if (user && workspace_id) {
      await insertGamificationEvent(supabase, workspace_id, user.id, 'item_processado', 2, 'Item arquivado no Inbox');
      const { data: pendentes } = await supabase.from('gtd_inbox').select('id', { count: 'exact' }).eq('workspace_id', workspace_id).eq('processado', false);
      const count = (pendentes as any)?.length || 0;
      if (count === 0) {
        await insertGamificationEvent(supabase, workspace_id, user.id, 'inbox_zerado', 10, 'Inbox zerado');
      }
    }
  } catch (e) {
    console.warn('gamification arquivar event failed', e);
  }
}

export async function processarItem(id: string, destino: string, payload?: any): Promise<void> {
  // Mark as processed and route to destination handling (ação/projeto/aguardando/referência/feito)
  const supabase = await createClient();

  // fetch inbox item for context
  const { data: item, error: itemErr } = await supabase.from('gtd_inbox').select('*').eq('id', id).single();
  if (itemErr) throw new Error(itemErr.message);

  const { error: updErr } = await supabase.from('gtd_inbox').update({ processado: true }).eq('id', id);
  if (updErr) throw new Error(updErr.message);

  // get user and workspace
  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes?.user;
  const { data: member } = await supabase.from('membros_workspace').select('workspace_id').eq('user_id', user?.id).limit(1).single();
  const workspace_id = member?.workspace_id;

  try {
    if (destino === 'feito') {
      // create a small alinhamento note for record
      await supabase.from('alinhamentos').insert([{ workspace_id, data: new Date().toISOString().slice(0,10), tipo: 'semanal', status: 'realizado', notas_livres: payload?.notas || item?.conteudo }]);

    } else if (destino === 'acao_unica') {
      // create an alinhamento with a single action
      const { data: alinh } = await supabase.from('alinhamentos').insert([{ workspace_id, data: new Date().toISOString().slice(0,10), tipo: 'semanal', status: 'agendado', pauta: [], notas_livres: null }]).select().single();
      await supabase.from('alinhamento_acoes').insert([{ alinhamento_id: alinh.id, descricao: payload?.titulo || item?.conteudo, responsavel_id: payload?.responsavel_id || user?.id, prazo: payload?.prazo || null }]);

    } else if (destino === 'projeto') {
      // create a project (rascunho or algum_dia)
      const projetoNome = payload?.nome || (item?.conteudo ? item.conteudo.slice(0,120) : 'Projeto (Inbox)');
      const status = payload?.algum_dia ? 'algum_dia' : 'rascunho';
      const { data: proj } = await supabase.from('projetos').insert([{ workspace_id, nome: projetoNome, tipo: 'pessoal', status, data_inicio: new Date().toISOString().slice(0,10) }]).select().single();
      if (payload?.nextAction) {
        const { data: tarefa } = await supabase.from('tarefas_projeto').insert([{ projeto_id: proj.id, titulo: payload.nextAction.titulo || 'Próxima ação', descricao: payload.nextAction.descricao || null, responsavel_id: payload.nextAction.responsavel_id || user?.id, status: 'pendente', is_next_action: true }]).select().single();
        // register gamification event for project with next action
        if (workspace_id && user) {
          await supabase.from('gamification_eventos').insert([{ workspace_id, user_id: user.id, tipo: 'projeto_com_next_action', pontos: 3, descricao: 'Criou projeto com next action' }]);
        }
      }

    } else if (destino === 'aguardando') {
      // create or use project, then create a blocked task
      let projetoId = payload?.projeto_id;
      if (!projetoId) {
        const { data: proj } = await supabase.from('projetos').insert([{ workspace_id, nome: payload?.projeto_nome || (item?.conteudo ? item.conteudo.slice(0,80) : 'Projeto Inbox'), tipo: 'pessoal', status: 'rascunho', data_inicio: new Date().toISOString().slice(0,10) }]).select().single();
        projetoId = proj.id;
      }
      await supabase.from('tarefas_projeto').insert([{ projeto_id: projetoId, titulo: payload?.titulo || item?.conteudo || 'Aguardando', descricao: payload?.descricao || null, responsavel_id: payload?.responsavel_id || user?.id, status: 'bloqueada', aguardando_de: payload?.aguardando_de || null }]);

    } else if (destino === 'referencia') {
      // persist as an alinhamento nota for easy retrieval in Referência
      await supabase.from('alinhamentos').insert([{ workspace_id, data: new Date().toISOString().slice(0,10), tipo: 'semanal', status: 'agendado', notas_livres: payload?.notas || item?.conteudo }]);
    }

    // fallback: already the caller inserts generic gamification events
  } catch (e: any) {
    console.error('processarItem destination error', e);
    throw e;
  }
}
