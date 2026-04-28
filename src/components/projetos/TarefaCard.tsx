'use client';

import { TarefaProjeto } from '@/types/projetos';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface TarefaCardProps {
  tarefa: TarefaProjeto;
}

export function TarefaCard({ tarefa }: TarefaCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tarefa.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isVencida = tarefa.data_prevista && new Date(tarefa.data_prevista) < new Date() && tarefa.status !== 'concluida';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white p-3 rounded-lg border border-neutral-200 shadow-sm flex gap-3 group relative z-10 ${isDragging ? 'opacity-50 ring-2 ring-amber-500' : ''}`}
    >
      <div 
        {...attributes} 
        {...listeners} 
        className="text-neutral-400 hover:text-neutral-600 cursor-grab active:cursor-grabbing pt-1"
      >
        <GripVertical className="w-4 h-4" />
      </div>
      
      <div className="flex-1">
        <h4 className={`text-sm font-medium ${tarefa.status === 'concluida' ? 'line-through text-neutral-400' : 'text-neutral-900'}`}>
          {tarefa.titulo}
        </h4>
        
        {(tarefa.descricao || isVencida) && (
          <div className="mt-2 flex items-center gap-3 text-xs">
            {isVencida && (
              <span className="flex items-center text-red-600 font-medium bg-red-50 px-1.5 py-0.5 rounded">
                <AlertCircle className="w-3 h-3 mr-1" /> Vencida
              </span>
            )}
            {tarefa.status === 'bloqueada' && (
              <span className="flex items-center text-amber-600 font-medium bg-amber-50 px-1.5 py-0.5 rounded">
                <Clock className="w-3 h-3 mr-1" /> Bloqueada
              </span>
            )}
            {tarefa.status === 'concluida' && (
              <span className="flex items-center text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Feito
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
