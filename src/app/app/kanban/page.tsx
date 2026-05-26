'use client';
import { useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, Filter, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/cn';

/* ── Types ──────────────────────────────────────────── */
type Contexto = 'empresa' | 'produto' | 'marketing' | 'pessoal' | 'dados';
type Prioridade = 'alta' | 'media' | 'baixa';

interface KanbanCardData {
  id: string;
  titulo: string;
  contexto: Contexto;
  prioridade: Prioridade;
  responsavel: string; // iniciais
  col: string;
}

type Colunas = Record<string, KanbanCardData[]>;

/* ── Seed data ──────────────────────────────────────── */
const SEED: Colunas = {
  fazer: [
    { id: 'k1', titulo: 'Mapear fluxo de onboarding v3',      contexto: 'produto',   prioridade: 'alta',  responsavel: 'WM', col: 'fazer' },
    { id: 'k2', titulo: 'Rascunhar proposta para cliente A',   contexto: 'empresa',   prioridade: 'media', responsavel: 'TM', col: 'fazer' },
    { id: 'k3', titulo: 'Definir KPIs de marketing Q3',        contexto: 'marketing', prioridade: 'baixa', responsavel: 'AL', col: 'fazer' },
    { id: 'k4', titulo: 'Revisar contrato de fornecedor',      contexto: 'empresa',   prioridade: 'alta',  responsavel: 'WM', col: 'fazer' },
  ],
  andamento: [
    { id: 'k5', titulo: 'Implementar auth SSO no dashboard',   contexto: 'produto',   prioridade: 'alta',  responsavel: 'WM', col: 'andamento' },
    { id: 'k6', titulo: 'Campanha de lançamento — Q2',         contexto: 'marketing', prioridade: 'media', responsavel: 'AL', col: 'andamento' },
    { id: 'k7', titulo: 'Pipeline de dados Analytics',         contexto: 'dados',     prioridade: 'media', responsavel: 'TM', col: 'andamento' },
  ],
  revisao: [
    { id: 'k8', titulo: 'Documentação técnica API v2',         contexto: 'produto',   prioridade: 'baixa', responsavel: 'TM', col: 'revisao' },
    { id: 'k9', titulo: 'Relatório mensal — Empresa',          contexto: 'empresa',   prioridade: 'media', responsavel: 'WM', col: 'revisao' },
  ],
  concluido: [
    { id: 'k10', titulo: 'Setup infra Kubernetes staging',     contexto: 'dados',     prioridade: 'alta',  responsavel: 'TM', col: 'concluido' },
    { id: 'k11', titulo: 'Sprint planning — Semana 20',        contexto: 'produto',   prioridade: 'baixa', responsavel: 'WM', col: 'concluido' },
  ],
};

const COL_META = [
  { id: 'fazer',     label: 'Fazer',     color: '#64748B', dotColor: 'bg-text-faint' },
  { id: 'andamento', label: 'Andamento', color: '#FBBF24', dotColor: 'bg-warning' },
  { id: 'revisao',   label: 'Revisão',   color: '#A78BFA', dotColor: 'bg-purple' },
  { id: 'concluido', label: 'Concluído', color: '#34D399', dotColor: 'bg-success' },
];

const PRIORIDADE_COLOR: Record<Prioridade, string> = {
  alta:  'bg-error',
  media: 'bg-warning',
  baixa: 'bg-white/20',
};

/* ── Avatar ─────────────────────────────────────────── */
function Avatar({ initials }: { initials: string }) {
  return (
    <div
      className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[9px] font-bold text-brand-fg flex-shrink-0"
      style={{ background: 'linear-gradient(135deg, var(--color-brand-300), var(--color-brand-600))' }}
    >
      {initials}
    </div>
  );
}

/* ── KanbanCard Component ────────────────────────────── */
function KanbanCardItem({
  card,
  isDragging = false,
}: {
  card: KanbanCardData;
  isDragging?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: card.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'rounded-[10px] border border-white/7 bg-surface-3 p-3 cursor-grab active:cursor-grabbing',
        'transition-all duration-150 select-none',
        'hover:border-white/11 hover:bg-surface-hover'
      )}
    >
      <p className="text-[13px] font-medium text-text mb-2.5 leading-snug">{card.titulo}</p>
      <div className="flex items-center justify-between gap-2">
        <Badge variant={card.contexto} className="capitalize">{card.contexto}</Badge>
        <div className="flex items-center gap-1.5">
          <div className={cn('w-[6px] h-[6px] rounded-full flex-shrink-0', PRIORIDADE_COLOR[card.prioridade])} />
          <Avatar initials={card.responsavel} />
        </div>
      </div>
    </div>
  );
}

/* ── Column ──────────────────────────────────────────── */
function KanbanColumn({
  colId,
  label,
  color,
  dotColor,
  cards,
  isOver,
}: {
  colId: string;
  label: string;
  color: string;
  dotColor: string;
  cards: KanbanCardData[];
  isOver: boolean;
}) {
  return (
    <div
      className={cn(
        'flex flex-col rounded-[14px] border bg-surface p-3 transition-all duration-150',
        isOver ? 'border-brand-400/40 bg-surface-2' : 'border-white/7'
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className={cn('w-2 h-2 rounded-full flex-shrink-0', dotColor)} />
        <span className="text-[13px] font-semibold text-text flex-1">{label}</span>
        <span className="text-[12px] text-text-faint font-mono">{cards.length}</span>
        <button className="w-5 h-5 flex items-center justify-center text-text-faint hover:text-text transition-colors">
          <Plus className="w-3.5 h-3.5" strokeWidth={2.2} />
        </button>
      </div>

      {/* Cards */}
      <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2 flex-1 min-h-[48px]">
          {cards.map((card) => (
            <KanbanCardItem key={card.id} card={card} />
          ))}
          {isOver && (
            <div className="rounded-[8px] border border-dashed border-brand-400/50 px-3 py-4 text-center text-[12px] font-medium text-brand-300">
              Solte aqui
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

/* ── KanbanPage ─────────────────────────────────────── */
const CONTEXTOS = ['Todos', 'Empresa', 'Produto', 'Marketing', 'Pessoal'] as const;

export default function KanbanPage() {
  const [colunas, setColunas] = useState<Colunas>(SEED);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overColId, setOverColId] = useState<string | null>(null);
  const [filtroCtx, setFiltroCtx] = useState<string>('Todos');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const findCard = useCallback(
    (id: string): KanbanCardData | undefined =>
      Object.values(colunas).flat().find((c) => c.id === id),
    [colunas]
  );

  const findColOfCard = useCallback(
    (id: string): string | undefined =>
      Object.entries(colunas).find(([, cards]) => cards.some((c) => c.id === id))?.[0],
    [colunas]
  );

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active.id as string);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null);
    setOverColId(null);
    if (!over) return;

    const fromCol = findColOfCard(active.id as string);
    // over.id might be a card id or a col id
    const toCol = COL_META.find((c) => c.id === over.id)?.id
      ?? findColOfCard(over.id as string);

    if (!fromCol || !toCol || fromCol === toCol) return;

    setColunas((prev) => {
      const card = prev[fromCol].find((c) => c.id === active.id)!;
      return {
        ...prev,
        [fromCol]: prev[fromCol].filter((c) => c.id !== active.id),
        [toCol]: [...prev[toCol], { ...card, col: toCol }],
      };
    });
  }

  const activeCard = activeId ? findCard(activeId) : null;

  // Filter
  const filteredColunas: Colunas = Object.fromEntries(
    Object.entries(colunas).map(([colId, cards]) => [
      colId,
      filtroCtx === 'Todos'
        ? cards
        : cards.filter((c) => c.contexto === filtroCtx.toLowerCase()),
    ])
  );

  return (
    <div className="p-7 h-full flex flex-col gap-4 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        {/* Context filter */}
        <div className="flex items-center gap-1 p-1 rounded-[10px] bg-surface border border-white/7">
          {CONTEXTOS.map((ctx) => (
            <button
              key={ctx}
              onClick={() => setFiltroCtx(ctx)}
              className={cn(
                'px-3 py-1.5 rounded-[8px] text-[13px] font-medium transition-colors',
                filtroCtx === ctx
                  ? 'bg-brand-400/15 text-brand-300 border border-brand-400/25'
                  : 'text-text-muted hover:text-text'
              )}
            >
              {ctx}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <SlidersHorizontal className="w-4 h-4" strokeWidth={1.8} />
            Filtros
          </Button>
          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4" strokeWidth={2.2} />
            Novo card
          </Button>
        </div>
      </div>

      {/* Kanban board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={({ over }) => {
          if (!over) { setOverColId(null); return; }
          const colId = COL_META.find((c) => c.id === over.id)?.id
            ?? findColOfCard(over.id as string);
          setOverColId(colId ?? null);
        }}
      >
        <div className="grid grid-cols-4 gap-3.5 flex-1 min-h-0">
          {COL_META.map((col) => (
            <KanbanColumn
              key={col.id}
              colId={col.id}
              label={col.label}
              color={col.color}
              dotColor={col.dotColor}
              cards={filteredColunas[col.id] ?? []}
              isOver={overColId === col.id && activeId !== null}
            />
          ))}
        </div>

        <DragOverlay>
          {activeCard && (
            <div className="rounded-[10px] border border-brand-400/40 bg-surface-3 p-3 shadow-xl rotate-1">
              <p className="text-[13px] font-medium text-text mb-2.5">{activeCard.titulo}</p>
              <div className="flex items-center justify-between gap-2">
                <Badge variant={activeCard.contexto} className="capitalize">{activeCard.contexto}</Badge>
                <Avatar initials={activeCard.responsavel} />
              </div>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
