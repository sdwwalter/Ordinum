"use client";
import { useEffect, useState } from 'react';
import { useGamificationStore } from '@/stores/gamificationStore';

async function confettiBurst() {
  try {
    const confetti = (await import('canvas-confetti')).default;
    confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
  } catch (e) {
    console.warn('confetti not available', e);
  }
}

type Bloco = {
  id: string;
  titulo: string;
  descricao: string;
  verificacao?: boolean | null; // null = manual
  acaoCta?: string;
  ctaHref?: string;
};

export default function RevisaoSemanalGTD({ className }: { className?: string }) {
  const [stats, setStats] = useState({ inboxCount: 0, semNextAction: 0, aguardandoAntigos: 0 });
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  useEffect(() => { fetchStats(); }, []);

  async function fetchStats() {
    try {
      const res = await fetch('/api/gtd/stats');
      const j = await res.json();
      setStats({ inboxCount: j.inboxCount || 0, semNextAction: j.semNextAction || 0, aguardandoAntigos: j.aguardandoAntigos || 0 });
      setCompleted((c) => ({ ...c, inbox: (j.inboxCount || 0) === 0, projetos: (j.semNextAction || 0) === 0 }));
    } catch (e) {
      console.error(e);
    }
  }

  const CHECKLIST: Bloco[] = [
    { id: 'inbox', titulo: '1. Inbox Zerado', descricao: 'Processar todos os itens capturados', verificacao: null, acaoCta: 'Ir para o Inbox', ctaHref: '/inbox' },
    { id: 'proximas_acoes', titulo: '2. Revisar Próximas Ações', descricao: 'As next actions de cada projeto ainda fazem sentido?', verificacao: null },
    { id: 'aguardando', titulo: '3. Revisar Aguardando', descricao: 'Cobrar ou registrar o que recebeu de volta', verificacao: null },
    { id: 'projetos', titulo: '4. Revisar Projetos Ativos', descricao: 'Cada projeto tem uma próxima ação definida?', verificacao: null, acaoCta: 'Ver projetos', ctaHref: '/gtd/projetos-ativos' },
    { id: 'algum_dia', titulo: '5. Algum Dia / Talvez', descricao: 'Alguma ideia virou prioridade? Alguma deve ser descartada?', verificacao: null },
    { id: 'agenda', titulo: '6. Agenda da Semana', descricao: 'Revisar tarefas com data prevista para os próximos 7 dias', verificacao: null },
  ];

  function toggleDone(id: string) {
    setCompleted((c) => ({ ...c, [id]: !c[id] }));
  }

  const doneCount = CHECKLIST.reduce((acc, b) => acc + (completed[b.id] ? 1 : 0), 0);

  useEffect(() => {
    if (doneCount === CHECKLIST.length) {
      // finaliza revisão: call server and trigger gamification + confetti
      (async () => {
        try {
          const res = await fetch('/api/gtd/revisao/complete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pauta: [], notas: 'Revisão completa via UI' }) });
          const j = await res.json();
          // update gamification store
          if (j.workspace_id) {
            useGamificationStore.getState().carregarStatus(j.workspace_id);
          }
          // show confetti and toast via gamification store
          confettiBurst();
        } catch (e) {
          console.error(e);
        }
      })();
    }
  }, [doneCount]);

  return (
    <div className={className}>
      <div className="p-4 bg-white border rounded mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Revisão Semanal (GTD)</h3>
            <div className="text-sm text-gray-500">Progresso: {doneCount}/6</div>
          </div>
          <div className="text-sm text-gray-700">{Math.round((doneCount / 6) * 100)}%</div>
        </div>
      </div>

      <div className="space-y-3">
        {CHECKLIST.map((b) => (
          <div key={b.id} className="p-3 bg-white border rounded flex items-start justify-between">
            <div>
              <div className="font-medium">{b.titulo}</div>
              <div className="text-sm text-gray-500">{b.descricao}</div>
            </div>
            <div className="flex items-center gap-3">
              {b.acaoCta && <a href={b.ctaHref} className="text-sm text-slate-700">{b.acaoCta}</a>}
              <button onClick={() => toggleDone(b.id)} className={`px-3 py-1 rounded ${completed[b.id] ? 'bg-emerald-600 text-white' : 'border'}`}>
                {completed[b.id] ? 'Concluído' : 'Marcar'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
