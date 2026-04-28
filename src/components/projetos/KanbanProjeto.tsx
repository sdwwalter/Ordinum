'use client';

import { useProjetosStore } from '@/stores/projetosStore';
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
import { TarefaCard } from './TarefaCard';

const COLUNAS = [
  { id: 'pendente', label: 'A Fazer', cor: 'bg-neutral-100' },
  { id: 'em_andamento', label: 'Em Andamento', cor: 'bg-blue-50' },
  { id: 'bloqueada', label: 'Bloqueado', cor: 'bg-amber-50' },
  { id: 'concluida', label: 'Concluído', cor: 'bg-emerald-50' },
] as const;

export function KanbanProjeto() {
  const { tarefas, updateTarefaStatus } = useProjetosStore();

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

    // Se dropou em uma coluna (overId === nome da coluna)
    const isColumn = COLUNAS.some(c => c.id === overId);
    
    if (isColumn) {
      updateTarefaStatus(activeId, overId as any);
      return;
    }

    // Se dropou em cima de outra tarefa
    const tarefaDestino = tarefas.find(t => t.id === overId);
    if (tarefaDestino) {
      updateTarefaStatus(activeId, tarefaDestino.status, tarefaDestino.posicao);
    }
  };

  return (
    <div className="overflow-x-auto pb-4">
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 min-w-max">
          {COLUNAS.map(coluna => {
            const items = tarefas.filter(t => t.status === coluna.id).sort((a,b) => a.posicao - b.posicao);
            
            return (
              <div key={coluna.id} className="w-80 flex-shrink-0">
                <div className={`p-3 rounded-xl border border-neutral-200 shadow-sm flex flex-col max-h-[70vh] ${coluna.cor}`}>
                  <div className="flex justify-between items-center mb-4 px-1">
                    <h3 className="font-semibold text-neutral-700 text-sm">{coluna.label}</h3>
                    <span className="text-xs bg-white px-2 py-0.5 rounded-full font-medium text-neutral-500 shadow-sm">
                      {items.length}
                    </span>
                  </div>
                  
                  {/* Drop zone invisível que também é SortableContext */}
                  <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                    <div className="flex-1 overflow-y-auto space-y-3 min-h-[150px] p-1" id={coluna.id}>
                      {items.map(tarefa => (
                        <TarefaCard key={tarefa.id} tarefa={tarefa} />
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
