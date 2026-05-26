'use client';
import { useState } from 'react';
import { MoreHorizontal, Plus, ExternalLink, Target, Calendar, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/cn';

/* ── Types ──────────────────────────────────────────── */
type Status = 'ativo' | 'revisao' | 'concluido';
type Contexto = 'empresa' | 'produto' | 'marketing' | 'pessoal' | 'dados';

interface Marco {
  id: string;
  label: string;
  data: string;
  done: boolean;
  active?: boolean;
}

interface Projeto {
  id: string;
  nome: string;
  descricao: string;
  contexto: Contexto;
  status: Status;
  progresso: number;
  tarefasConcluidas: number;
  tarefasTotal: number;
  prazo: string;
  responsaveis: string[];
  marcos: Marco[];
}

/* ── Seed ───────────────────────────────────────────── */
const PROJETOS: Projeto[] = [
  {
    id: 'p1', nome: 'Plataforma v2 — Auth & SSO', contexto: 'produto', status: 'ativo',
    descricao: 'Migração completa do sistema de autenticação para OAuth 2.0 com suporte a SSO corporativo.',
    progresso: 68, tarefasConcluidas: 17, tarefasTotal: 25, prazo: '15/06/2026',
    responsaveis: ['WM', 'TM', 'AL'],
    marcos: [
      { id: 'm1', label: 'Levantamento de requisitos', data: '01/04', done: true },
      { id: 'm2', label: 'Implementação OAuth 2.0',    data: '15/04', done: true },
      { id: 'm3', label: 'Integração SSO corporativo', data: '10/05', done: false, active: true },
      { id: 'm4', label: 'Testes e homologação',       data: '01/06', done: false },
      { id: 'm5', label: 'Deploy produção',             data: '15/06', done: false },
    ],
  },
  {
    id: 'p2', nome: 'Campanha Brand Q2', contexto: 'marketing', status: 'ativo',
    descricao: 'Campanha de posicionamento de marca para o segundo trimestre com foco em LinkedIn e eventos.',
    progresso: 45, tarefasConcluidas: 9, tarefasTotal: 20, prazo: '30/06/2026',
    responsaveis: ['AL', 'WM'],
    marcos: [
      { id: 'm1', label: 'Briefing de marca', data: '01/05', done: true },
      { id: 'm2', label: 'Criação de materiais', data: '20/05', done: false, active: true },
      { id: 'm3', label: 'Lançamento campanha', data: '01/06', done: false },
      { id: 'm4', label: 'Análise de resultados', data: '30/06', done: false },
    ],
  },
  {
    id: 'p3', nome: 'Pipeline de Dados Analytics', contexto: 'dados', status: 'ativo',
    descricao: 'Construção do pipeline de ingestão e transformação de dados para o módulo de analytics.',
    progresso: 30, tarefasConcluidas: 6, tarefasTotal: 20, prazo: '31/07/2026',
    responsaveis: ['TM'],
    marcos: [
      { id: 'm1', label: 'Arquitetura definida', data: '10/05', done: true },
      { id: 'm2', label: 'MVP do pipeline', data: '15/06', done: false, active: true },
      { id: 'm3', label: 'Integração com warehouse', data: '15/07', done: false },
    ],
  },
  {
    id: 'p4', nome: 'App Mobile MVP', contexto: 'produto', status: 'revisao',
    descricao: 'Versão mobile do Ordinum para iOS e Android com funcionalidades essenciais de captura e GTD.',
    progresso: 88, tarefasConcluidas: 22, tarefasTotal: 25, prazo: '01/06/2026',
    responsaveis: ['WM', 'TM'],
    marcos: [
      { id: 'm1', label: 'Wireframes aprovados',  data: '01/04', done: true },
      { id: 'm2', label: 'Desenvolvimento UI',     data: '15/05', done: true },
      { id: 'm3', label: 'Revisão e ajustes',      data: '25/05', done: false, active: true },
      { id: 'm4', label: 'Submissão às stores',    data: '01/06', done: false },
    ],
  },
  {
    id: 'p5', nome: 'DRE Automatizado', contexto: 'empresa', status: 'concluido',
    descricao: 'Módulo de DRE com consolidação automática de lançamentos e exportação em PDF.',
    progresso: 100, tarefasConcluidas: 18, tarefasTotal: 18, prazo: '30/04/2026',
    responsaveis: ['WM'],
    marcos: [
      { id: 'm1', label: 'Especificação',   data: '01/03', done: true },
      { id: 'm2', label: 'Desenvolvimento', data: '31/03', done: true },
      { id: 'm3', label: 'Deploy',          data: '30/04', done: true },
    ],
  },
];

const FILTROS = [
  { key: 'todos', label: 'Todos', count: PROJETOS.length },
  { key: 'ativo',    label: 'Ativos',    count: PROJETOS.filter(p => p.status === 'ativo').length },
  { key: 'revisao',  label: 'Em revisão', count: PROJETOS.filter(p => p.status === 'revisao').length },
  { key: 'concluido', label: 'Concluídos', count: PROJETOS.filter(p => p.status === 'concluido').length },
];

/* ── Avatar Stack ───────────────────────────────────── */
function AvatarStack({ initials }: { initials: string[] }) {
  return (
    <div className="flex items-center">
      {initials.map((i, idx) => (
        <div
          key={idx}
          className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-brand-fg border-2 border-surface"
          style={{
            background: 'linear-gradient(135deg, var(--color-brand-300), var(--color-brand-600))',
            marginLeft: idx > 0 ? -8 : 0,
            zIndex: initials.length - idx,
          }}
        >
          {i}
        </div>
      ))}
    </div>
  );
}

/* ── ProjetosPage ───────────────────────────────────── */
export default function ProjetosPage() {
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [selectedId, setSelectedId] = useState(PROJETOS[0].id);

  const filtered = filtroStatus === 'todos'
    ? PROJETOS
    : PROJETOS.filter((p) => p.status === filtroStatus);

  const selected = PROJETOS.find((p) => p.id === selectedId) ?? PROJETOS[0];

  return (
    <div className="p-7 grid gap-4 h-full animate-fade-in-up" style={{ gridTemplateColumns: '1.3fr 1fr' }}>
      {/* Left — project grid */}
      <div className="flex flex-col gap-4 min-h-0">
        {/* Filters */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 rounded-[10px] bg-surface border border-white/7">
            {FILTROS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFiltroStatus(f.key)}
                className={cn(
                  'px-3 py-1.5 rounded-[8px] text-[13px] font-medium transition-colors whitespace-nowrap',
                  filtroStatus === f.key
                    ? 'bg-brand-400/15 text-brand-300 border border-brand-400/25'
                    : 'text-text-muted hover:text-text'
                )}
              >
                {f.label} <span className="opacity-50 text-[11px]">{f.count}</span>
              </button>
            ))}
          </div>
          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4" strokeWidth={2.2} />
            Novo projeto
          </Button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-3 overflow-y-auto">
          {filtered.map((p) => {
            const isSelected = p.id === selectedId;
            const isConc = p.status === 'concluido';
            return (
              <button
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                className={cn(
                  'text-left rounded-[16px] border p-4 flex flex-col gap-3 transition-all duration-[250ms]',
                  'hover:-translate-y-px',
                  isSelected
                    ? 'border-brand-400/35 bg-surface-2'
                    : 'border-white/7 bg-surface hover:border-white/11 hover:bg-surface-2'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[14px] font-semibold text-text leading-snug">{p.nome}</span>
                  <MoreHorizontal className="w-4 h-4 text-text-faint flex-shrink-0 mt-0.5" strokeWidth={1.8} />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={p.contexto} className="capitalize">{p.contexto}</Badge>
                  <Badge variant={p.status === 'ativo' ? 'andamento' : p.status === 'revisao' ? 'novo' : 'concluido'} dot>
                    {p.status === 'ativo' ? 'Em andamento' : p.status === 'revisao' ? 'Em revisão' : 'Concluído'}
                  </Badge>
                </div>
                {/* Progress */}
                <div className="h-[5px] rounded-full bg-white/8 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${p.progresso}%`,
                      background: isConc
                        ? 'var(--color-success)'
                        : 'linear-gradient(90deg, var(--color-brand-300), var(--color-brand-500))',
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <AvatarStack initials={p.responsaveis} />
                  <span className="text-[11px] text-text-faint">
                    {p.tarefasConcluidas}/{p.tarefasTotal} tarefas · {p.prazo}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right — detail panel */}
      <div className="rounded-[18px] border border-white/7 bg-surface p-6 flex flex-col gap-5 overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <Badge variant={selected.contexto} className="capitalize">{selected.contexto}</Badge>
          <button className="text-text-faint hover:text-text transition-colors">
            <ExternalLink className="w-4 h-4" strokeWidth={1.8} />
          </button>
        </div>

        <div>
          <h2
            className="font-display text-[22px] font-bold text-text leading-tight mb-2"
          >
            {selected.nome}
          </h2>
          <p className="text-[13px] text-text-muted leading-relaxed">{selected.descricao}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: CheckSquare, label: 'Concluído', value: `${selected.progresso}%` },
            { icon: Target,      label: 'Total',     value: `${selected.tarefasTotal} tarefas` },
            { icon: Calendar,    label: 'Prazo',     value: selected.prazo },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-[10px] bg-surface-2 border border-white/6 p-3">
              <div className="flex items-center gap-1 mb-1.5">
                <Icon className="w-[11px] h-[11px] text-text-faint" strokeWidth={1.8} />
                <span className="text-[10px] text-text-faint uppercase tracking-wide">{label}</span>
              </div>
              <span className="text-[16px] font-bold text-text">{value}</span>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div>
          <h3 className="text-[13px] font-semibold text-text-muted uppercase tracking-wider mb-4">
            Marcos
          </h3>
          <div className="relative flex flex-col gap-0">
            {/* vertical line */}
            <div className="absolute left-[4px] top-2 bottom-2 w-px bg-white/10" />

            {selected.marcos.map((m) => (
              <div key={m.id} className="relative flex items-start gap-3 pb-4 last:pb-0">
                {/* dot */}
                <div
                  className={cn(
                    'w-[10px] h-[10px] rounded-full flex-shrink-0 mt-1 relative z-10 transition-all',
                    m.done
                      ? 'bg-success'
                      : m.active
                        ? 'bg-brand-300 ring-4 ring-brand-400/30 shadow-[0_0_8px_rgba(34,211,238,.25)]'
                        : 'bg-surface-3 border border-white/20'
                  )}
                />
                <div className="flex-1 min-w-0">
                  <span
                    className={cn(
                      'text-[13px] leading-snug block',
                      m.done
                        ? 'text-text-faint line-through'
                        : m.active
                          ? 'text-text font-semibold'
                          : 'text-text-muted'
                    )}
                  >
                    {m.label}
                  </span>
                  <span className="text-[11px] text-text-faint font-mono">{m.data}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
