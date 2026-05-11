import { createClient } from '@/lib/supabase/server';

export default async function ReferenciaPage() {
  const supabase = await createClient();
  const { data: alinhamentos } = await supabase.from('alinhamentos').select('id, data, notas_livres').order('data', { ascending: false }).limit(200);

  const notas: { id: string; data: string; nota: string }[] = [];
  (alinhamentos || []).forEach((a: any) => {
    if (a.notas_livres) notas.push({ id: a.id, data: a.data, nota: a.notas_livres });
  });

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Referência</h1>
      <ul className="space-y-3">
        {notas.map((n) => (
          <li key={n.id} className="p-3 bg-white border rounded">
            <div className="text-sm text-gray-700">{n.nota}</div>
            <div className="text-xs text-gray-400">{new Date(n.data).toLocaleDateString()}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}
