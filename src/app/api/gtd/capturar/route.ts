import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { conteudo } = body;
    if (!conteudo || typeof conteudo !== 'string') {
      return NextResponse.json({ error: 'conteudo obrigatório' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase.from('gtd_inbox').insert([{ conteudo }]).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ item: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? String(err) }, { status: 500 });
  }
}
