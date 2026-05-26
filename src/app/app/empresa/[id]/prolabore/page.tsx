'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useEmpresaStore } from '@/stores/empresaStore';
import { createClient } from '@/lib/supabase/client';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Plus, CheckCircle2 } from 'lucide-react';
import { ProlaboreForm } from '@/components/empresa/ProlaboreForm';
import { formatarMoeda, formatarData } from '@/lib/utils/formatters';

export default function EmpresaProlaborePage() {
  const params = useParams();
  const id = params.id as string;
  const { prolabores } = useEmpresaStore();

  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data: membro } = await supabase
        .from('membros_workspace')
        .select('workspace_id')
        .eq('user_id', user.id)
        .eq('ativo', true)
        .single();

      if (membro) {
        setWorkspaceId(membro.workspace_id);
      }
    };
    init();
  }, []);

  return (
    <div className="p-7 flex flex-col gap-4 animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[18px] font-semibold text-text">Retiradas de Prolabore</h2>
          <p className="text-[13px] text-text-muted mt-0.5">Historico de retiradas para a conta pessoal</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" strokeWidth={2.2} />
          Registrar Retirada
        </Button>
      </div>

      {/* Empty state */}
      {prolabores.length === 0 ? (
        <div className="rounded-[18px] border border-white/7 bg-surface p-10 text-center flex flex-col items-center gap-4">
          <p className="text-[14px] text-text-muted">Nenhuma retirada registrada neste mes.</p>
          <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
            Registrar o primeiro Prolabore
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {prolabores.map((p) => (
            <div
              key={p.id}
              className="rounded-[16px] border border-white/7 bg-surface p-5 flex justify-between items-center"
            >
              <div>
                <p className="text-[12px] text-text-faint mb-1">
                  Pagamento: {p.data_pagamento ? formatarData(p.data_pagamento) : '-'}
                </p>
                <p className="text-[20px] font-bold text-text tabular">{formatarMoeda(p.valor)}</p>
              </div>
              <div className="flex items-center gap-1.5 text-[12px] font-semibold text-success bg-success/10 border border-success/20 px-3 py-1.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
                Pago
              </div>
            </div>
          ))}
        </div>
      )}

      {workspaceId && userId && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Retirada de Prolabore">
          <ProlaboreForm
            empresaId={id}
            workspaceId={workspaceId}
            userId={userId}
            onSuccess={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}
