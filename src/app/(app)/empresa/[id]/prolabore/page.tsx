'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useEmpresaStore } from '@/stores/empresaStore';
import { createClient } from '@/lib/supabase/client';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Plus, CheckCircle2, Clock } from 'lucide-react';
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Retiradas de Prolabore</h2>
          <p className="text-sm text-neutral-500">Histórico de retiradas para a conta pessoal</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-5 h-5 mr-2" />
          Registrar Retirada
        </Button>
      </div>

      {prolabores.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-neutral-200 text-center">
          <p className="text-neutral-500 mb-4">Nenhuma retirada registrada neste mês.</p>
          <Button variant="outline" onClick={() => setIsModalOpen(true)}>
            Registrar o primeiro Prolabore
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {prolabores.map(p => (
            <div key={p.id} className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex justify-between items-center">
              <div>
                <p className="text-sm text-neutral-500 mb-1">Pagamento: {p.data_pagamento ? formatarData(p.data_pagamento) : '-'}</p>
                <p className="text-xl font-bold text-emerald-700">{formatarMoeda(p.valor)}</p>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                <CheckCircle2 className="w-4 h-4" /> Pago
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
