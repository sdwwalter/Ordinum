'use client';

import { useEffect, useState } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { createClient } from '@/lib/supabase/client';
import { CardAlerta } from '@/components/dashboard/CardAlerta';
import { SemaforosSistema } from '@/components/dashboard/SemaforosSistema';
import { LayoutDashboard, FileText } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { alertas, semaforos, isLoading, fetchDashboardData } = useDashboardStore();
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  
  // Mês atual YYYY-MM
  const mesAtual = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data: membro } = await supabase
        .from('membros_workspace')
        .select('workspace_id')
        .eq('user_id', user.id)
        .eq('ativo', true)
        .single();

      if (membro) {
        setWorkspaceId(membro.workspace_id);
        fetchDashboardData(membro.workspace_id, mesAtual);
      }
    };
    init();
  }, [fetchDashboardData, mesAtual]);

  if (isLoading || !workspaceId) {
    return <div className="p-8"><div className="animate-pulse h-64 bg-neutral-100 rounded-xl"></div></div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-2">
            <LayoutDashboard className="w-8 h-8 text-neutral-600" />
            Visão Geral
          </h1>
          <p className="text-neutral-500 mt-1">Bem-vindo. Aqui está a saúde do seu ecossistema em tempo real.</p>
        </div>
        
        <Link 
          href="/app/relatorios/mensal" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
        >
          <FileText className="w-4 h-4" />
          Gerar Relatório PDF
        </Link>
      </div>

      <section>
        <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">Semáforos de Saúde</h2>
        <SemaforosSistema semaforos={semaforos} />
      </section>

      <section>
        <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          Central de Alertas
          <span className="bg-neutral-200 text-neutral-700 py-0.5 px-2 rounded-full text-xs">{alertas.length}</span>
        </h2>
        
        {alertas.length === 0 ? (
          <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-xl text-center">
            <h3 className="text-emerald-800 font-semibold mb-1">Tudo no verde!</h3>
            <p className="text-emerald-600 text-sm">Seu ecossistema está operando em perfeita harmonia. Nenhum alerta crítico no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {alertas.map(alerta => (
              <CardAlerta key={alerta.id} alerta={alerta} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
