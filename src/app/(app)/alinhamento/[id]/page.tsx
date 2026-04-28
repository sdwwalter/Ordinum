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

  // Redirecionamento de segurança se atualizar a página e perder o state memory
  useEffect(() => {
    if (!sessaoAtiva || sessaoAtiva.id !== id) {
      router.push('/app/alinhamento');
    }
  }, [sessaoAtiva, id, router]);

  if (!sessaoAtiva) return null; // loading state bypass

  const handleEncerrar = async () => {
    setLoading(true);
    await encerrarSessao(notas, []);
    router.push('/app/alinhamento');
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto pb-24 h-screen flex flex-col">
      <div className="flex justify-between items-center mb-6 border-b border-neutral-200 pb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-violet-900">Sessão em Andamento</h1>
          <p className="text-neutral-500 text-sm">Siga a pauta, tome decisões e crie planos de ação.</p>
        </div>
        <Button 
          onClick={handleEncerrar} 
          disabled={loading}
          className="bg-violet-600 hover:bg-violet-700 text-white"
        >
          <CheckSquare className="w-4 h-4 mr-2" />
          {loading ? 'Processando...' : 'Encerrar e Salvar'}
        </Button>
      </div>

      <div className="flex-1 grid md:grid-cols-2 gap-8 overflow-y-auto min-h-0">
        
        {/* Lado Esquerdo: Pauta Automática */}
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-lg text-neutral-900 mb-3">Pauta Automática</h3>
            <PautaSection />
          </div>

          <div>
            <h3 className="font-bold text-lg text-neutral-900 mb-3">Anotações da Sessão</h3>
            <textarea
              className="w-full h-48 border border-neutral-200 rounded-lg p-4 text-neutral-700 focus:ring-violet-500 focus:border-violet-500 resize-none"
              placeholder="Anotações gerais, pautas extras, recados importantes..."
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
            />
          </div>
        </div>

        {/* Lado Direito: Ações (Kanban feed) */}
        <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200">
          <h3 className="font-bold text-lg text-neutral-900 mb-1">Plano de Ação</h3>
          <p className="text-sm text-neutral-500 mb-4">Estas ações irão para o Kanban global automaticamente.</p>
          
          <AdicionarAcao />
          
          <div className="space-y-2 mt-4">
            {acoesSessao.length === 0 ? (
              <p className="text-sm text-center text-neutral-400 py-8">Nenhuma ação criada ainda.</p>
            ) : (
              acoesSessao.map(acao => (
                <CardAcao key={acao.id} acao={acao} />
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
