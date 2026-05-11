"use client";
import { useEffect, useState } from 'react';

export default function InboxListClient() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchItems() {
    setLoading(true);
    try {
      const res = await fetch('/api/gtd/listar');
      const json = await res.json();
      setItems(json.items || []);
    } finally { setLoading(false); }
  }

  useEffect(() => { fetchItems(); }, []);

  async function arquivar(id: string) {
    // open clarificar modal before archiving
    if (!confirm('Abrir modal de clarificação?')) {
      await fetch('/api/gtd/arquivar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      setItems((s) => s.filter((i) => i.id !== id));
      return;
    }
    // fallback: simple archive
    await fetch('/api/gtd/arquivar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setItems((s) => s.filter((i) => i.id !== id));
  }

  return (
    <div>
      {loading && <div>Carregando...</div>}
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it.id} className="p-3 bg-white border rounded-md flex justify-between items-start">
            <div>
              <div className="text-sm text-gray-700">{it.conteudo}</div>
              <div className="text-xs text-gray-400">{new Date(it.created_at).toLocaleString()}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => arquivar(it.id)} className="text-sm text-green-600">Arquivar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
