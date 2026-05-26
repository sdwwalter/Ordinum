'use client';

import { useEffect, useState } from 'react';
import { usePessoalStore } from '@/stores/pessoalStore';
import { createClient } from '@/lib/supabase/client';
import { CardReserva } from '@/components/pessoal/CardReserva';
import { format } from 'date-fns';

export default function ReservasPessoalPage() {
  const { reservas, carregarDados } = usePessoalStore();
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  
  const currentMes = format(new Date(), 'yyyy-MM');

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
        carregarDados(membro.workspace_id, currentMes);
      }
    };
    init();
  }, [carregarDados, currentMes]);

  if (!workspaceId) return <div className="p-8 text-center text-neutral-500">Carregando...</div>;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Reservas e Metas</h1>
        <p className="text-neutral-500">Acompanhe seu progresso de economia</p>
      </div>

      {reservas.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-xl border border-neutral-200">
          <p className="text-neutral-500">Você ainda não tem reservas cadastradas.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {reservas.map(r => (
            <CardReserva key={r.id} reserva={r} />
          ))}
        </div>
      )}
    </div>
  );
}
