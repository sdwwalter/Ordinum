'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAlinhamentoStore } from '@/stores/alinhamentoStore';
import { PautaSection } from '@/components/alinhamento/PautaSection';
import { AdicionarAcao } from '@/components/alinhamento/AdicionarAcao';
import { CardAcao } from '@/components/alinhamento/CardAcao';
import { Button } from '@/components/ui/button';
import { CheckSquare } from 'lucide-react';

export default function SessaoAtivaPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { sessaoAtiva, acoesSessao, encerrarSessao } = useAlinhamentoStore();

  const [notas, setNotas] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirecionamento de seguranca se atualizar a pagina e perder o state memory
  useEffect(() => {
    if (!sessaoAtiva || sessaoAtiva.id !== id) {
      router.push('/app/alinhamento');
    }
  }, [sessaoAtiva, id, router]);

  if (!sessaoAtiva) return null;

  const handleEncerrar = async () => {
    setLoading(true);
    await encerrarSessao(notas, []);
    router.push('/app/alinhamento');
  };

  return (
    <div className="p-7 flex flex-col h-full animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-5 border-b border-white/8 shrink-0">
        <div>
          <h1 className="text-[22px] font-bold text-text">Sessao em Andamento</h1>
          <p className="text-[13px] text-text-muted mt-0.5">
            Siga a pauta, tome decisoes e crie planos de acao.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={handleEncerrar}
          disabled={loading}
        >
          <CheckSquare className="w-4 h-4" strokeWidth={2} />
          {loading ? 'Processando...' : 'Encerrar e Salvar'}
        </Button>
      </div>

      {/* Body — 2 cols */}
      <div className="flex-1 grid md:grid-cols-2 gap-6 overflow-y-auto min-h-0">

        {/* Left: Pauta + Notas */}
        <div className="flex flex-col gap-5">
          <div>
            <h3 className="text-[14px] font-semibold text-text-muted uppercase tracking-wider mb-3">
              Pauta Automatica
            </h3>
            <PautaSection />
          </div>

          <div>
            <h3 className="text-[14px] font-semibold text-text-muted uppercase tracking-wider mb-3">
              Anotacoes da Sessao
            </h3>
            <textarea
              className="w-full h-48 rounded-[14px] border border-white/10 bg-input px-4 py-3 text-[13px] text-text placeholder:text-text-faint resize-none focus:outline-none focus:border-brand-400/50 focus:ring-2 focus:ring-brand-400/15 transition-colors"
              placeholder="Anotacoes gerais, pautas extras, recados importantes..."
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
            />
          </div>
        </div>

        {/* Right: Plano de Acao */}
        <div className="rounded-[18px] border border-white/7 bg-surface p-5 flex flex-col gap-4">
          <div>
            <h3 className="text-[15px] font-semibold text-text">Plano de Acao</h3>
            <p className="text-[12px] text-text-muted mt-0.5">
              Estas acoesirao para o Kanban global automaticamente.
            </p>
          </div>

          <AdicionarAcao />

          <div className="flex flex-col gap-2 overflow-y-auto">
            {acoesSessao.length === 0 ? (
              <p className="text-[13px] text-text-faint text-center py-8">
                Nenhuma acao criada ainda.
              </p>
            ) : (
              acoesSessao.map((acao) => (
                <CardAcao key={acao.id} acao={acao} />
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
