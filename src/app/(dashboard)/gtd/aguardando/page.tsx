import { createClient } from '@/lib/supabase/server';

export default async function AguardandoPage() {
  const supabase = await createClient();
  const { data: items } = await supabase.from('tarefas_projeto').select('*').not('aguardando_de', 'is', null).neq('status', 'concluida').order('created_at', { ascending: false });

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Aguardando</h1>
      <ul className="space-y-3">
        {(items || []).map((t: any) => (
          <li key={t.id} className="p-3 bg-white border rounded flex justify-between">
            <div>
              <div className="font-medium">{t.titulo}</div>
              <div className="text-xs text-gray-500">Aguardando: {t.aguardando_de} • {t.data_prevista ? new Date(t.data_prevista).toLocaleDateString() : '—'}</div>
            </div>
            <div className="text-xs text-gray-400">{new Date(t.created_at).toLocaleDateString()}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}
