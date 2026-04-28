'use client';

import { useKanbanStore } from '@/stores/kanbanStore';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  TouchSensor,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { KanbanCard } from './KanbanCard';
import { StatusKanban } from '@/types/kanban';
import { useState } from 'react';
import { CheckCircle2, ChevronRight } from 'lucide-react';

const COLUNAS = [
  { id: 'a_fazer', label: 'A Fazer', cor: 'bg-neutral-100' },
  { id: 'em_andamento', label: 'Em Andamento', cor: 'bg-blue-50' },
  { id: 'bloqueado', label: 'Bloqueado', cor: 'bg-amber-50' },
  { id: 'concluido', label: 'Concluído', cor: 'bg-emerald-50' },
] as const;

export function KanbanBoard() {
  const { items, updateItemStatus, filtros } = useKanbanStore();
  const [concluidoExpandido, setConcluidoExpandido] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const isColumn = COLUNAS.some(c => c.id === overId);
    
    if (isColumn) {
      updateItemStatus(activeId, overId as StatusKanban);
      return;
    }

    const tarefaDestino = items.find(t => t.id === overId);
    if (tarefaDestino) {
      updateItemStatus(activeId, tarefaDestino.status_kanban, tarefaDestino.posicao);
    }
  };

  // Filtragem
  const itensFiltrados = items.filter(item => {
    if (filtros.projeto_id && item.origem_id !== filtros.projeto_id) return false;
    if (filtros.responsavel_id) {
      // Simplificado: 'me' ou match exato
      if (filtros.responsavel_id === 'me' && item.responsavel_id) return true; // Em multi-user, compararia com current userId
      if (filtros.responsavel_id !== 'me' && item.responsavel_id !== filtros.responsavel_id) return false;
    }
    return true;
  });

  return (
    <div className="flex-1 overflow-x-auto min-h-0 pb-4">
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 min-w-max h-full">
          {COLUNAS.map(coluna => {
            const isConcluido = coluna.id === 'concluido';
            const itensColuna = itensFiltrados.filter(t => t.status_kanban === coluna.id).sort((a,b) => a.posicao - b.posicao);
            
            if (isConcluido && !concluidoExpandido) {
              return (
                <div 
                  key={coluna.id} 
                  onClick={() => setConcluidoExpandido(true)}
                  className={`w-16 flex-shrink-0 cursor-pointer hover:bg-emerald-100 transition-colors p-3 rounded-xl border border-neutral-200 shadow-sm flex flex-col items-center justify-start ${coluna.cor}`}
                >
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mb-4 mt-2" />
                  <div className="writing-vertical-rl text-emerald-700 font-semibold tracking-widest rotate-180">
                    CONCLUÍDOS ({itensColuna.length})
                  </div>
                </div>
              );
            }

            return (
              <div key={coluna.id} className="w-80 flex-shrink-0 h-full flex flex-col">
                <div className={`p-3 rounded-xl border border-neutral-200 shadow-sm flex flex-col flex-1 max-h-[80vh] ${coluna.cor}`}>
                  <div className="flex justify-between items-center mb-4 px-1">
                    <div className="flex items-center gap-2">
                      {isConcluido && (
                        <button onClick={() => setConcluidoExpandido(false)} className="text-emerald-700 hover:bg-emerald-200 p-1 rounded">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                      <h3 className="font-semibold text-neutral-700 text-sm">{coluna.label}</h3>
                    </div>
                    <span className="text-xs bg-white px-2 py-0.5 rounded-full font-medium text-neutral-500 shadow-sm">
                      {itensColuna.length}
                    </span>
                  </div>
                  
                  <SortableContext items={itensColuna.map(i => i.id)} strategy={verticalListSortingStrategy}>
                    <div className="flex-1 overflow-y-auto space-y-3 min-h-[150px] p-1" id={coluna.id}>
                      {itensColuna.map(item => (
                        <KanbanCard key={item.id} item={item} />
                      ))}
                    </div>
                  </SortableContext>
                </div>
              </div>
            );
          })}
        </div>
      </DndContext>
    </div>
  );
}
