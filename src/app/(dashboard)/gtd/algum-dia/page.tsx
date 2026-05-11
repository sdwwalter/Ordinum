import { createClient } from '@/lib/supabase/server';

export default async function AlgumDiaPage() {
  const supabase = await createClient();
  const { data: projetos } = await supabase.from('projetos').select('*').eq('status', 'algum_dia').order('created_at', { ascending: false });

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Algum Dia / Talvez</h1>
      <ul className="space-y-3">
        {(projetos || []).map((p: any) => (
          <li key={p.id} className="p-3 bg-white border rounded flex justify-between">
            <div>
              <div className="font-medium">{p.nome}</div>
              <div className="text-xs text-gray-500">{p.descricao || '—'}</div>
            </div>
            <div className="text-xs text-gray-400">{new Date(p.created_at).toLocaleDateString()}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}
