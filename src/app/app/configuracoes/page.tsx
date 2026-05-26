'use client';

import { useGamificationStore } from '@/stores/gamificationStore';
import { Settings, Gamepad2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Toggle } from '@/components/ui/toggle';
import { IconContainer } from '@/components/ui/icon-container';

export default function ConfiguracoesPage() {
  const { gamificacaoAtiva, setGamificacaoAtiva } = useGamificationStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="p-7 max-w-3xl mx-auto flex flex-col gap-6 animate-fade-in-up">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <IconContainer icon={Settings} color="neutral" size="md" />
        <div>
          <h1 className="text-[20px] font-semibold text-text">Configuracoes do Workspace</h1>
          <p className="text-[13px] text-text-muted mt-0.5">
            Ajuste as preferencias globais da sua experiencia de uso.
          </p>
        </div>
      </div>

      {/* Secao Gamificacao */}
      <section className="rounded-[20px] border border-white/7 bg-surface overflow-hidden">
        {/* Section header */}
        <div className="px-6 py-5 border-b border-white/6 flex items-center gap-3">
          <IconContainer icon={Gamepad2} color="purple" size="sm" />
          <div>
            <h2 className="text-[15px] font-semibold text-text">Gamificacao</h2>
            <p className="text-[12px] text-text-muted">Controle o sistema de pontuacoes e conquistas.</p>
          </div>
        </div>

        {/* Toggle row */}
        <div className="px-6 py-5">
          <label className="flex items-center justify-between gap-4 cursor-pointer rounded-[14px] border border-white/7 bg-surface-2 hover:bg-surface-hover px-5 py-4 transition-colors">
            <div>
              <span className="block text-[14px] font-semibold text-text">Ativar Gamificacao</span>
              <span className="text-[12px] text-text-muted mt-0.5 block">
                Exibe os pontos ganhos e modais de badges ao concluir acoes chave.
              </span>
            </div>
            <Toggle
              checked={gamificacaoAtiva}
              onChange={setGamificacaoAtiva}
            />
          </label>
        </div>
      </section>

      {/* Placeholder para proximas secoes */}
      <section className="rounded-[20px] border border-white/7 bg-surface overflow-hidden opacity-40 pointer-events-none">
        <div className="px-6 py-5 border-b border-white/6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-[8px] bg-surface-3" />
          <div>
            <div className="h-3.5 w-36 rounded bg-surface-3" />
            <div className="h-2.5 w-48 rounded bg-surface-3 mt-1.5" />
          </div>
        </div>
        <div className="px-6 py-5">
          <div className="h-14 rounded-[14px] bg-surface-2" />
        </div>
      </section>
    </div>
  );
}
