import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes?.user;
    if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

    // find user's workspace
    const { data: member, error: memberErr } = await supabase.from('membros_workspace').select('workspace_id').eq('user_id', user.id).limit(1).single();
    if (memberErr || !member) return NextResponse.json({ error: 'workspace not found' }, { status: 400 });
    const workspace_id = member.workspace_id;

    const now = new Date();
    const payload = await req.json().catch(() => ({}));

    const pauta = payload.pauta || [];
    const notas = payload.notas || 'Revisão semanal completa';

    // insert alinhamento record
    const { data: alinhamento, error: alinErr } = await supabase.from('alinhamentos').insert([{
      workspace_id,
      data: now.toISOString().slice(0,10),
      tipo: 'revisao_solo',
      status: 'realizado',
      pauta: pauta,
      notas_livres: notas
    }]).select().single();

    if (alinErr) return NextResponse.json({ error: alinErr.message }, { status: 500 });

    // record gamification event
    const { error: evErr } = await supabase.from('gamification_eventos').insert([{
      workspace_id,
      user_id: user.id,
      tipo: 'revisao_semanal_completa',
      pontos: 25,
      descricao: 'Revisão semanal completada'
    }]);

    if (evErr) {
      // non-fatal
      console.warn('gamification event error', evErr.message);
    }

    return NextResponse.json({ ok: true, alinhamento_id: alinhamento.id, workspace_id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? String(err) }, { status: 500 });
  }
}
