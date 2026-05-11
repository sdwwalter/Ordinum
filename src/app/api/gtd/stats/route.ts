import { NextResponse } from 'next/server';
import { contarInboxPendente, contarProjetosSemNextAction, listarAguardandoAntigos } from '@/lib/alinhamento/gerarPauta';

export async function GET() {
  try {
    const inbox = await contarInboxPendente();
    const semNext = await contarProjetosSemNextAction();
    const aguardando = await listarAguardandoAntigos(undefined, 7);
    return NextResponse.json({ inboxCount: inbox, semNextAction: semNext, aguardandoAntigos: aguardando.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? String(err) }, { status: 500 });
  }
}
