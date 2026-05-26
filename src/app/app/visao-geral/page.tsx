'use client';
import { MetricCard } from '@/components/ui/metric-card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/cn';

/* ── Area Chart SVG ─────────────────────────────────── */
function AreaChart() {
  const W = 560;
  const H = 180;
  const padX = 20;
  const padY = 16;
  const innerW = W - padX * 2;
  const innerH = H - padY * 2;

  const series = [
    { name: 'Empresa',    color: '#22D3EE', data: [30, 45, 38, 55, 42, 60, 52, 68, 58, 75, 62, 80] },
    { name: 'Produto',    color: '#F59E0B', data: [20, 28, 25, 35, 30, 42, 38, 48, 44, 55, 50, 62] },
    { name: 'Pessoal',   color: '#FB7185', data: [15, 22, 18, 28, 24, 32, 28, 38, 34, 42, 38, 48] },
    { name: 'Marketing', color: '#F472B6', data: [10, 15, 12, 20, 16, 24, 20, 28, 24, 32, 28, 36] },
  ];

  const globalMax = Math.max(...series.flatMap((s) => s.data));
  const cols = series[0].data.length;

  function toPath(data: number[]) {
    return data.map((v, i) => {
      const x = padX + (i / (cols - 1)) * innerW;
      const y = padY + innerH - (v / globalMax) * innerH;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  }

  const gridYs = [0.25, 0.5, 0.75].map((r) => padY + innerH * (1 - r));

  return (
    <div>
      {/* Segment buttons */}
      <div className="flex items-center gap-1 mb-4">
        {['7d', '30d', '90d'].map((t) => (
          <button
            key={t}
            className={cn(
              'px-3 py-1 rounded-[7px] text-[12px] font-medium transition-colors',
              t === '30d'
                ? 'bg-brand-400/15 text-brand-300 border border-brand-400/25'
                : 'text-text-faint hover:text-text-muted'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ height: 180 }}>
        <defs>
          {series.map((s) => (
            <linearGradient key={s.name} id={`area-${s.name}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={s.color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>

        {/* Grid lines */}
        {gridYs.map((y, i) => (
          <line
            key={i}
            x1={padX} y1={y} x2={W - padX} y2={y}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}

        {/* Series */}
        {series.map((s) => {
          const linePath = toPath(s.data);
          const last = s.data[s.data.length - 1];
          const first = s.data[0];
          const areaPath = [
            linePath,
            `L${(padX + innerW).toFixed(1)},${(padY + innerH).toFixed(1)}`,
            `L${padX},${(padY + innerH).toFixed(1)}`,
            'Z',
          ].join(' ');

          return (
            <g key={s.name}>
              <path d={areaPath} fill={`url(#area-${s.name})`} />
              <path
                d={linePath}
                fill="none"
                stroke={s.color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/7">
        {series.map((s) => (
          <div key={s.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: s.color }} />
            <span className="text-[12px] text-text-muted">{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── VisaoGeralView ─────────────────────────────────── */
const kpis = [
  { titulo: 'Projetos ativos',     valor: '24',  delta: 12, deltaPositivo: true,  sparkPoints: [10,14,12,18,15,20,16,24], sparkColor: '#22D3EE' },
  { titulo: 'Tarefas em andamento', valor: '87', delta: 8,  deltaPositivo: true,  sparkPoints: [60,68,64,72,70,78,74,87], sparkColor: '#60A5FA' },
  { titulo: 'Concluídas',          valor: '142', delta: 18, deltaPositivo: true,  sparkPoints: [80,95,88,110,102,120,132,142], sparkColor: '#34D399' },
  { titulo: 'Pendências',          valor: '15',  delta: 5,  deltaPositivo: false, sparkPoints: [22,20,24,19,21,18,16,15], sparkColor: '#F59E0B' },
];

const proximasAcoes = [
  { id: 1, titulo: 'Preparar slides para 1:1 com diretor', prazo: '25/05' },
  { id: 2, titulo: 'Revisar proposta comercial - cliente B', prazo: '26/05' },
  { id: 3, titulo: 'Sync com time de produto — Sprint 12',  prazo: '27/05' },
  { id: 4, titulo: 'Validar orçamento Q3 com CFO',          prazo: '28/05' },
];

const decisoesPendentes = [
  { id: 1, titulo: 'Escolher provedor de pagamentos para v2', contexto: 'produto' as const },
  { id: 2, titulo: 'Definir política de home office 2026',    contexto: 'empresa' as const },
  { id: 3, titulo: 'Prioridade do roadmap: mobile vs API',    contexto: 'produto' as const },
];

export default function VisaoGeralPage() {
  return (
    <div className="p-7 flex flex-col gap-4 animate-fade-in-up">
      {/* KPI row */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map((k) => (
          <MetricCard key={k.titulo} {...k} />
        ))}
      </div>

      {/* Main grid */}
      <div className="grid gap-4" style={{ gridTemplateColumns: '1.4fr 1fr' }}>
        {/* Velocidade de execução */}
        <div className="rounded-[18px] border border-white/7 bg-surface p-5">
          <div className="mb-4">
            <h3 className="text-[15px] font-semibold text-text">Velocidade de execução</h3>
            <p className="text-[13px] text-text-muted mt-0.5">Tarefas concluídas por contexto no período.</p>
          </div>
          <AreaChart />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Próximas ações */}
          <div className="rounded-[18px] border border-white/7 bg-surface p-5 flex-1">
            <h3 className="text-[15px] font-semibold text-text mb-4">Próximas ações</h3>
            <div className="flex flex-col gap-2.5">
              {proximasAcoes.map((a, i) => (
                <div key={a.id} className="flex items-center gap-3">
                  <div
                    className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[10px] font-bold text-brand-fg flex-shrink-0"
                    style={{ background: 'var(--color-brand-400)' }}
                  >
                    {i + 1}
                  </div>
                  <span className="text-[13px] text-text flex-1 min-w-0 truncate">{a.titulo}</span>
                  <span className="text-[12px] text-text-faint flex-shrink-0 font-mono">{a.prazo}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Decisões pendentes */}
          <div className="rounded-[18px] border border-white/7 bg-surface p-5">
            <h3 className="text-[15px] font-semibold text-text mb-4">Decisões pendentes</h3>
            <div className="flex flex-col gap-2">
              {decisoesPendentes.map((d) => (
                <div key={d.id} className="rounded-[10px] bg-surface-2 border border-white/6 px-3 py-2.5 flex items-center justify-between gap-2">
                  <span className="text-[13px] text-text leading-snug flex-1">{d.titulo}</span>
                  <Badge variant={d.contexto} className="flex-shrink-0">{d.contexto}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
