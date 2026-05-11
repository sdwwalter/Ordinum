import { NextResponse } from 'next/server';
import { processarItem } from '@/app/actions/gtd-inbox.actions';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { id, destino, payload } = body;
    if (!id || !destino) return NextResponse.json({ error: 'missing id or destino' }, { status: 400 });

    await processarItem(id, destino, payload || {});

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? String(err) }, { status: 500 });
  }
}
