"use client";
import { useEffect, useState } from 'react';
import { GTD_BADGES } from '@/lib/gamification/badges';
import type { GamificationStats } from '@/lib/gamification/types';

export default function GtdProgressCard() {
  const [stats, setStats] = useState<GamificationStats | null>(null);
  const [unlocked, setUnlocked] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/gamification/status');
        const j = await res.json();
        setStats(j);
        const unlockedIds = GTD_BADGES.filter((b) => b.condicao(j)).map((b) => b.id);
        setUnlocked(unlockedIds);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  if (!stats) return <div className="p-4 bg-card rounded">Carregando progresso GTD...</div>;

  return (
    <div className="p-4 bg-card rounded">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground">Pontos GTD</div>
          <div className="text-2xl font-semibold">{stats.pontos ?? 0}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Streak de Revisões</div>
          <div className="text-lg font-medium">{stats.revisao_streak ?? 0} semanas</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-sm text-muted-foreground">Badges desbloqueados</div>
        <div className="flex gap-2 mt-2 flex-wrap">
          {GTD_BADGES.map((b) => (
            <div key={b.id} className={`px-2 py-1 rounded border ${unlocked.includes(b.id) ? 'bg-green-100 border-green-300' : 'bg-gray-50 border-gray-200'}`}>
              <div className="text-sm">{b.icone} {b.nome}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
