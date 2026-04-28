'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { gerarRecorrenciasDoMes } from '@/lib/supabase/queries/recorrencias';
import { formatarMesRef } from '@/lib/utils/formatters';
import { toast } from 'sonner';

export function RecurrenceEngine() {
  useEffect(() => {
    const runRecurrences = async () => {
      // 1. Checa se é dia 1
      const hoje = new Date();
      if (hoje.getDate() !== 1) return;

      // 2. Descobre o workspace_id ativo do usuário
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data: membro } = await supabase
        .from('membros_workspace')
        .select('workspace_id')
        .eq('user_id', user.id)
        .eq('ativo', true)
        .single();
        
      if (!membro) return;

      // 3. Roda a função do banco
      const criados = await gerarRecorrenciasDoMes(membro.workspace_id);
      if (criados > 0) {
        const mesAtual = hoje.toISOString().slice(0, 7);
        toast.info(`${criados} lançamentos recorrentes gerados para ${formatarMesRef(mesAtual)}`);
      }
    };

    runRecurrences();
  }, []);

  // Componente sem renderização visual
  return null;
}
