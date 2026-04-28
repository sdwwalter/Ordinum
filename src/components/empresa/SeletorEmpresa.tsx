'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useEmpresaStore } from '@/stores/empresaStore';

interface SeletorEmpresaProps {
  workspaceId: string;
}

export function SeletorEmpresa({ workspaceId }: SeletorEmpresaProps) {
  const router = useRouter();
  const params = useParams();
  const { empresas, carregarEmpresas } = useEmpresaStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    carregarEmpresas(workspaceId).then(() => setMounted(true));
  }, [workspaceId, carregarEmpresas]);

  if (!mounted || empresas.length === 0) return <div className="h-10"></div>;

  const handleSelect = (empresaId: string) => {
    localStorage.setItem(`duetto_active_empresa_${workspaceId}`, empresaId);
    
    // Manter na mesma "aba" (lancamentos, dre, ou prolabore), mas para a nova empresa
    const currentPath = window.location.pathname;
    const parts = currentPath.split('/');
    // ex: /app/empresa/[id]/lancamentos
    const aba = parts.pop() || 'lancamentos';
    router.push(`/app/empresa/${empresaId}/${aba}`);
  };

  const idAtual = params.id as string;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {empresas.map((emp) => (
        <button
          key={emp.id}
          onClick={() => handleSelect(emp.id)}
          className={`px-4 py-2 text-sm font-semibold rounded-full border whitespace-nowrap transition-colors ${
            idAtual === emp.id 
              ? 'bg-emerald-600 border-emerald-600 text-white' 
              : 'bg-white border-neutral-200 text-neutral-600 hover:border-emerald-300'
          }`}
        >
          {emp.nome}
        </button>
      ))}
    </div>
  );
}
