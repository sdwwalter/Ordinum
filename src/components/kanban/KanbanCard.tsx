'use client';

import { ItemKanban } from '@/types/kanban';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, AlertCircle, Calendar } from 'lucide-react';
import { formatarData } from '@/lib/utils/formatters';

interface KanbanCardProps {
  item: ItemKanban;
}

export function KanbanCard({ item }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isProximoPasso = item.origem === 'proximo_passo';

  return (
    <div
      ref={setNodeRef}
      className={`bg-white p-3 rounded-lg border-y border-r border-l-4 shadow-sm flex gap-3 group relative z-10 
        ${isDragging ? 'opacity-50 ring-2 ring-blue-500' : ''}
      `}
      style={{
        ...style,
        borderLeftColor: isProximoPasso ? '#8B5CF6' : (item.origem_cor || '#F59E0B') // violeta para ação, cor do projeto para tarefa
      }}
    >
      <div 
        {...attributes} 
        {...listeners} 
        className="text-neutral-400 hover:text-neutral-600 cursor-grab active:cursor-grabbing pt-1"
      >
        <GripVertical className="w-4 h-4" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span 
            className="text-[10px] font-bold px-1.5 py-0.5 rounded truncate uppercase"
            style={{ 
              backgroundColor: isProximoPasso ? '#F5F3FF' : `${item.origem_cor}15`, 
              color: isProximoPasso ? '#7C3AED' : item.origem_cor 
            }}
          >
            {item.origem_nome}
          </span>
          {isProximoPasso && <span className="text-[10px] text-violet-500 bg-violet-50 px-1 rounded">AÇÃO</span>}
        </div>

        <h4 className={`text-sm font-medium ${item.status_kanban === 'concluido' ? 'line-through text-neutral-400' : 'text-neutral-900'}`}>
          {item.titulo}
        </h4>
        
        {item.data_prevista && (
          <div className="mt-2 flex items-center gap-3 text-xs">
            <span className={`flex items-center font-medium px-1.5 py-0.5 rounded ${item.vencido ? 'text-red-600 bg-red-50' : 'text-neutral-500 bg-neutral-100'}`}>
              {item.vencido ? <AlertCircle className="w-3 h-3 mr-1" /> : <Calendar className="w-3 h-3 mr-1" />}
              {formatarData(item.data_prevista)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
