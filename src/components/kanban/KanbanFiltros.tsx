'use client';

import { useKanbanStore } from '@/stores/kanbanStore';
import { useProjetosStore } from '@/stores/projetosStore';
import { useEffect, useState } from 'react';
import { Select } from '@/components/ui/select';

interface KanbanFiltrosProps {
  workspaceId: string;
}

export function KanbanFiltros({ workspaceId }: KanbanFiltrosProps) {
  const { filtros, setFiltro, carregarFiltros } = useKanbanStore();
  const { projetos, carregarProjetos } = useProjetosStore();

  useEffect(() => {
    carregarFiltros(workspaceId);
    carregarProjetos(workspaceId);
  }, [workspaceId, carregarFiltros, carregarProjetos]);

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="w-full md:w-64">
        <label className="text-xs font-semibold text-neutral-500 uppercase mb-1 block">Filtrar por Projeto</label>
        <Select 
          value={filtros.projeto_id || ''} 
          onChange={(e) => setFiltro('projeto_id', e.target.value || null, workspaceId)}
          options={[
            { label: 'Todos os Projetos & Ações', value: '' },
            ...projetos.map(p => ({ label: p.nome, value: p.id }))
          ]}
        />
      </div>
      
      {/* Aqui em um ambiente multiusuário colocaríamos o Filtro por Responsável buscando de membros_workspace */}
      <div className="w-full md:w-64">
        <label className="text-xs font-semibold text-neutral-500 uppercase mb-1 block">Filtrar por Responsável</label>
        <Select 
          value={filtros.responsavel_id || ''} 
          onChange={(e) => setFiltro('responsavel_id', e.target.value || null, workspaceId)}
          options={[
            { label: 'Qualquer responsável', value: '' },
            { label: 'Minhas tarefas', value: 'me' } // Placeholder simulando ID do usuário atual
          ]}
        />
      </div>
    </div>
  );
}
