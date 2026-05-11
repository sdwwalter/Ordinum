import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { calcularStreakRevisao } from '@/lib/gamification/streak';
import { contarInboxPendente } from '@/lib/alinhamento/gerarPauta';

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes?.user;
    if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

    const { data: member } = await supabase.from('membros_workspace').select('workspace_id').eq('user_id', user.id).limit(1).single();
    const workspace_id = member?.workspace_id;

    const { data: eventos } = await supabase
      .from('gamification_eventos')
      .select('pontos, tipo')
      .eq('workspace_id', workspace_id)
      .eq('user_id', user.id);

    const pontos = (eventos || []).reduce((s: number, r: any) => s + (r.pontos || 0), 0);

    const revisao_streak = await calcularStreakRevisao(workspace_id, user.id);

    // count inbox zerado events
    const inbox_zerado_count = (eventos || []).filter((e: any) => e.tipo === 'inbox_zerado').length;

    // also provide pending inbox count via helper
    const inbox_pendente = await contarInboxPendente(workspace_id);

    return NextResponse.json({ pontos, revisao_streak, inbox_zerado_count, inbox_pendente });
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
