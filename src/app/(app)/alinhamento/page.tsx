'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAlinhamentoStore } from '@/stores/alinhamentoStore';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { PlayCircle, Users, User } from 'lucide-react';
import { formatarData } from '@/lib/utils/formatters';

export default function AlinhamentoPage() {
  const router = useRouter();
  const { historico, carregarHistorico, iniciarSessao, sessaoAtiva } = useAlinhamentoStore();
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [modo, setModo] = useState<'solo' | 'casal' | 'socios'>('solo');

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data: membro } = await supabase
        .from('membros_workspace')
        .select('workspace_id, workspaces(modo)')
        .eq('user_id', user.id)
        .eq('ativo', true)
        .single();

      if (membro) {
        setWorkspaceId(membro.workspace_id);
        const ws = Array.isArray(membro.workspaces) ? membro.workspaces[0] : membro.workspaces;
        const wsModo = ws?.modo as 'solo' | 'casal' | 'socios';
        setModo(wsModo || 'solo');
        carregarHistorico(membro.workspace_id);
      }
    };
    init();
  }, [carregarHistorico]);

  const handleIniciar = async () => {
    if (!workspaceId) return;
    
    // Se já existe uma sessão ativa (em andamento), redireciona pra ela
    const emAndamento = historico.find(h => h.status === 'em_andamento');
    if (emAndamento) {
      router.push(`/app/alinhamento/${emAndamento.id}`);
      return;
    }

    // Inicia nova
    const tipo = modo === 'solo' ? 'revisao_solo' : 'semanal';
    await iniciarSessao(workspaceId, tipo);
    const { sessaoAtiva: nova } = useAlinhamentoStore.getState();
    if (nova) {
      router.push(`/app/alinhamento/${nova.id}`);
    }
  };

  const isSolo = modo === 'solo';

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-2">
            {isSolo ? <User className="w-8 h-8 text-violet-600" /> : <Users className="w-8 h-8 text-violet-600" />}
            {isSolo ? 'Revisão Semanal' : 'Reunião de Alinhamento'}
          </h1>
          <p className="text-neutral-500 mt-1">
            {isSolo ? 'Sua pausa estratégica para organizar a casa.' : 'O momento de sincronizar a visão de longo prazo.'}
          </p>
        </div>
        <Button onClick={handleIniciar} className="bg-violet-600 hover:bg-violet-700 text-white w-full md:w-auto text-base h-12 px-6">
          <PlayCircle className="w-5 h-5 mr-2" />
          {historico.some(h => h.status === 'em_andamento') ? 'Continuar Sessão Ativa' : 'Iniciar Sessão Agora'}
        </Button>
      </div>

      <div>
        <h2 className="text-xl font-bold text-neutral-900 mb-4 border-b border-neutral-200 pb-2">Histórico de Sessões</h2>
        
        {historico.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-neutral-200 text-center text-neutral-500">
            Nenhuma sessão registrada. A constância é a chave!
          </div>
        ) : (
          <div className="space-y-3">
            {historico.map(sessao => (
              <div key={sessao.id} className="bg-white p-4 rounded-xl border border-neutral-200 flex justify-between items-center hover:shadow-sm transition-shadow">
                <div>
                  <h4 className="font-semibold text-neutral-900">Sessão {sessao.tipo === 'revisao_solo' ? 'Individual' : 'em Conjunto'}</h4>
                  <p className="text-sm text-neutral-500">{formatarData(sessao.data)}</p>
                </div>
                <div>
                  {sessao.status === 'em_andamento' ? (
                    <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded font-semibold uppercase">Em Andamento</span>
                  ) : (
                    <span className="bg-violet-100 text-violet-700 text-xs px-2 py-1 rounded font-semibold uppercase">Realizada</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
