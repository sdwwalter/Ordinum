'use client';
import { useEffect, useRef } from 'react';
import { Zap, Flame, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePessoalGtdStore, type GtdTask, type Contexto } from '@/stores/pessoalGtdStore';
import { cn } from '@/lib/utils/cn';

/* ── Helpers ─────────────────────────────────────────── */
function getDayName() {
  const days = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
  return days[new Date().getDay()];
}

function formatTimer(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

/* ── GtdRow ──────────────────────────────────────────── */
function GtdRow({ task }: { task: GtdTask }) {
  const toggleTask = usePessoalGtdStore((s) => s.toggleTask);

  return (
    <div
      className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0 cursor-pointer group"
      onClick={() => toggleTask(task.id)}
    >
      {/* Checkbox */}
      <div
        className={cn(
          'w-[18px] h-[18px] rounded-[6px] border flex items-center justify-center flex-shrink-0 transition-all duration-150',
          task.done
            ? 'bg-brand-400 border-brand-400'
            : 'border-white/11 group-hover:border-white/25'
        )}
      >
        {task.done && (
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M2 5.5L4.5 8L9 3" stroke="var(--color-brand-fg)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      {/* Text */}
      <span className={cn('text-[13px] flex-1 leading-snug transition-colors', task.done ? 'line-through text-text-faint' : 'text-text')}>
        {task.titulo}
      </span>

      {/* Right */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Badge variant={task.contexto} className="capitalize">{task.contexto}</Badge>
        {task.hora && (
          <span className="font-mono text-[11px] text-text-faint bg-white/4 rounded-[5px] px-1.5 py-0.5 min-w-[38px] text-center">
            {task.hora}
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Context distribution bar ────────────────────────── */
const CTX_BARS: { ctx: Contexto; label: string; count: number; color: string }[] = [
  { ctx: 'empresa',   label: 'Empresa',   count: 12, color: 'var(--color-brand-400)' },
  { ctx: 'produto',   label: 'Produto',   count: 8,  color: 'var(--color-warning)' },
  { ctx: 'pessoal',   label: 'Pessoal',   count: 6,  color: 'var(--color-rose)' },
  { ctx: 'marketing', label: 'Marketing', count: 4,  color: 'var(--color-pink)' },
  { ctx: 'dados',     label: 'Dados',     count: 3,  color: 'var(--color-info)' },
];
const maxCount = Math.max(...CTX_BARS.map((b) => b.count));

/* ── PessoalPage ─────────────────────────────────────── */
export default function PessoalPage() {
  const { tasks, pomodoro, toggleTask, pausePomodoro, startPomodoro, resetPomodoro, tickPomodoro } =
    usePessoalGtdStore();

  const dayName = getDayName();
  const todayTasks = tasks.filter((t) => t.dia === 'hoje');
  const nextTasks  = tasks.filter((t) => t.dia === 'proximos');
  const doneTodayCount = todayTasks.filter((t) => t.done).length;
  const progressPct = todayTasks.length > 0 ? (doneTodayCount / todayTasks.length) * 100 : 0;

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (pomodoro.running) {
      intervalRef.current = setInterval(tickPomodoro, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [pomodoro.running, tickPomodoro]);

  const focoTask = tasks.find((t) => t.id === pomodoro.tarefaFocoId);

  return (
    <div className="p-7 grid gap-4 animate-fade-in-up" style={{ gridTemplateColumns: '1.4fr 1fr' }}>
      {/* ── Left column ── */}
      <div className="flex flex-col gap-4 min-h-0">
        {/* Card Hoje */}
        <div className="rounded-[18px] border border-white/7 bg-surface p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[18px] font-semibold text-text">
              Hoje,{' '}
              <em className="font-display italic text-brand-300">{dayName}</em>
            </h3>
            <span className="text-[13px] text-text-muted">
              {doneTodayCount} de {todayTasks.length} concluídas
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1 rounded-full bg-white/8 mb-4 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPct}%`,
                background: 'linear-gradient(90deg, var(--color-brand-300), var(--color-brand-500))',
              }}
            />
          </div>

          {/* Tasks */}
          <div>
            {todayTasks.map((t) => <GtdRow key={t.id} task={t} />)}
          </div>

          <button
            className="w-full mt-3 py-2.5 rounded-[10px] border border-dashed border-white/14 text-[13px] font-medium text-text-faint hover:text-text-muted hover:border-white/20 transition-colors"
          >
            <Plus className="w-4 h-4 inline mr-1.5" strokeWidth={2} />
            Adicionar tarefa
          </button>
        </div>

        {/* Card Próximos dias */}
        <div className="rounded-[18px] border border-white/7 bg-surface p-5">
          <h3 className="text-[15px] font-semibold text-text mb-4">Próximos dias</h3>
          {nextTasks.map((t) => <GtdRow key={t.id} task={t} />)}
        </div>
      </div>

      {/* ── Right column ── */}
      <div className="flex flex-col gap-4">
        {/* Foco Agora — Pomodoro */}
        <div
          className="rounded-[18px] border border-brand-400/20 p-5"
          style={{ background: 'linear-gradient(135deg, rgba(34,211,238,.10), rgba(34,211,238,.02))' }}
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-brand-300" strokeWidth={2} />
            <span className="text-[11px] font-bold tracking-[.1em] text-brand-300">FOCO AGORA</span>
          </div>

          <h3 className="text-[15px] font-semibold text-text leading-snug mb-2">
            {focoTask?.titulo ?? 'Nenhuma tarefa em foco'}
          </h3>
          {focoTask && <Badge variant={focoTask.contexto} className="capitalize mb-4">{focoTask.contexto}</Badge>}

          {/* Timer */}
          <div className="text-center py-4">
            <div
              className="text-[56px] font-bold text-text leading-none tabular"
              style={{
                fontFamily: 'var(--font-mono)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {formatTimer(pomodoro.seconds)}
            </div>
            <p className="text-[12px] text-text-muted mt-2">
              {pomodoro.running ? 'Pomodoro em andamento' : 'Pomodoro pausado'}
            </p>
          </div>

          <div className="flex gap-2 mt-2">
            <Button
              variant="secondary"
              size="sm"
              className="flex-1"
              onClick={pomodoro.running ? pausePomodoro : () => focoTask && startPomodoro(focoTask.id)}
            >
              {pomodoro.running ? 'Pausar' : 'Retomar'}
            </Button>
            <Button variant="outline" size="sm" className="flex-1" onClick={resetPomodoro}>
              Encerrar
            </Button>
          </div>
        </div>

        {/* Distribuição por contexto */}
        <div className="rounded-[18px] border border-white/7 bg-surface p-5">
          <h3 className="text-[15px] font-semibold text-text mb-4">Distribuição por contexto</h3>
          <div className="flex flex-col gap-3">
            {CTX_BARS.map((b) => (
              <div key={b.ctx}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[13px] text-text-muted capitalize">{b.label}</span>
                  <span className="text-[12px] text-text-faint font-mono">{b.count}</span>
                </div>
                <div className="h-[6px] rounded-full bg-white/8 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${(b.count / maxCount) * 100}%`, background: b.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Streak */}
        <div className="rounded-[18px] border border-white/7 bg-surface p-5">
          <div className="flex items-center gap-4">
            <div
              className="w-[60px] h-[60px] rounded-[16px] flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, rgba(245,158,11,.20), rgba(245,158,11,.06))' }}
            >
              <Flame className="w-7 h-7 text-amber" strokeWidth={1.8} />
            </div>
            <div>
              <div className="text-[28px] font-bold text-text leading-none tabular">14 dias</div>
              <div className="text-[12px] text-text-muted mt-1">Cumprindo as 3 tarefas-chave</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
