"use client";
import { useState } from 'react';

export default function InboxCaptura({ onCaptured }: { onCaptured?: () => void }) {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/gtd/capturar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conteudo: value.trim() }),
      });
      if (res.ok) {
        setValue('');
        onCaptured?.();
      } else {
        console.error('Erro ao capturar', await res.text());
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="w-full">
      <div className="flex gap-2 items-center">
        <input
          className="flex-1 px-3 py-2 rounded-md border border-gray-200 bg-white"
          placeholder="Capturar rapidamente... (Enter para enviar)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          type="submit"
          className="px-3 py-2 rounded-md bg-slate-700 text-white"
          disabled={loading}
        >
          {loading ? '...' : 'Capturar'}
        </button>
      </div>
    </form>
  );
}
