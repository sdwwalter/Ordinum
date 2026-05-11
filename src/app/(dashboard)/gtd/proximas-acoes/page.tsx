import { createClient } from '@/lib/supabase/server';

export default async function ProximasAcoesPage() {
  const supabase = await createClient();
  const { data: items } = await supabase.from('v_kanban_items').select('*').eq('is_next_action', true).order('origem_nome', { ascending: true });

  const grouped: Record<string, any[]> = {};
  (items || []).forEach((it: any) => {
    const key = it.contexto || 'Sem Contexto';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(it);
  });

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Próximas Ações</h1>
      <div className="space-y-6">
        {Object.entries(grouped).map(([ctx, list]) => (
          <section key={ctx} className="bg-white border rounded p-4">
            <h2 className="text-lg font-medium mb-3">{ctx}</h2>
            <ul className="space-y-2">
              {list.map((it: any) => (
                <li key={it.id} className="p-3 border rounded flex justify-between">
                  <div>
                    <div className="font-medium">{it.titulo}</div>
                    <div className="text-xs text-gray-500">{it.origem_nome} • {it.data_prevista ? new Date(it.data_prevista).toLocaleDateString() : '—'}</div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
