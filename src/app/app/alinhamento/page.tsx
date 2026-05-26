'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAlinhamentoStore } from '@/stores/alinhamentoStore';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { PlayCircle, Users, User } from 'lucide-react';
import { formatarData } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils/cn';

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

    // Se ja existe uma sessao ativa (em andamento), redireciona pra ela
    const emAndamento = historico.find((h) => h.status === 'em_andamento');
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
  const temSessaoAtiva = historico.some((h) => h.status === 'em_andamento');

  return (
    <div className="p-7 max-w-4xl mx-auto flex flex-col gap-6 animate-fade-in-up">
      {/* Hero card */}
      <div
        className="rounded-[20px] border border-purple/20 p-7 flex flex-col md:flex-row justify-between items-start md:items-center gap-5"
        style={{ background: 'linear-gradient(135deg, rgba(167,139,250,.10), rgba(167,139,250,.02))' }}
      >
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0"
            style={{ background: 'rgba(167,139,250,.18)' }}
          >
            {isSolo
              ? <User className="w-6 h-6 text-purple" strokeWidth={1.8} />
              : <Users className="w-6 h-6 text-purple" strokeWidth={1.8} />
            }
          </div>
          <div>
            <h1 className="text-[22px] font-bold text-text">
              {isSolo ? 'Revisao Semanal' : 'Reuniao de Alinhamento'}
            </h1>
            <p className="text-[14px] text-text-muted mt-1">
              {isSolo
                ? 'Sua pausa estrategica para organizar a casa.'
                : 'O momento de sincronizar a visao de longo prazo.'}
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={handleIniciar}
          className="w-full md:w-auto shrink-0"
        >
          <PlayCircle className="w-4 h-4" strokeWidth={2} />
          {temSessaoAtiva ? 'Continuar Sessao Ativa' : 'Iniciar Sessao Agora'}
        </Button>
      </div>

      {/* Historico */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-[15px] font-semibold text-text">Historico de Sessoes</h2>
          <div className="h-px flex-1 bg-white/7" />
        </div>

        {historico.length === 0 ? (
          <div className="rounded-[18px] border border-white/7 bg-surface p-8 text-center text-[14px] text-text-muted">
            Nenhuma sessao registrada. A constancia e a chave!
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {historico.map((sessao) => (
              <div
                key={sessao.id}
                className="rounded-[14px] border border-white/7 bg-surface px-5 py-4 flex justify-between items-center hover:border-white/11 hover:bg-surface-2 transition-all duration-150"
              >
                <div>
                  <h4 className="text-[14px] font-semibold text-text">
                    Sessao {sessao.tipo === 'revisao_solo' ? 'Individual' : 'em Conjunto'}
                  </h4>
                  <p className="text-[12px] text-text-faint mt-0.5">{formatarData(sessao.data)}</p>
                </div>
                {sessao.status === 'em_andamento' ? (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-warning bg-warning/10 border border-warning/20 px-3 py-1 rounded-full uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-warning animate-dot-pulse" />
                    Em Andamento
                  </span>
                ) : (
                  <span className="text-[11px] font-bold tracking-wide text-purple bg-purple/10 border border-purple/20 px-3 py-1 rounded-full uppercase">
                    Realizada
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
