'use client';

import { useGamificationStore } from '@/stores/gamificationStore';
import { Settings, Gamepad2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ConfiguracoesPage() {
  const { gamificacaoAtiva, setGamificacaoAtiva } = useGamificationStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-2">
          <Settings className="w-8 h-8 text-neutral-600" />
          Configurações do Workspace
        </h1>
        <p className="text-neutral-500 mt-1">
          Ajuste as preferências globais da sua experiência de uso.
        </p>
      </div>

      <section className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-neutral-100 flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-800">Gamificação</h2>
            <p className="text-sm text-neutral-500">Controle o sistema de pontuações e conquistas.</p>
          </div>
        </div>

        <div className="p-6">
          <label className="flex items-center justify-between cursor-pointer p-4 border rounded-xl hover:bg-neutral-50 transition-colors">
            <div>
              <span className="block font-semibold text-neutral-800">Ativar Gamificação</span>
              <span className="text-sm text-neutral-500">Exibe os pontos ganhos e modais de badges ao concluir ações chave.</span>
            </div>
            <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
              <input 
                type="checkbox" 
                name="toggle" 
                id="toggle" 
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                checked={gamificacaoAtiva}
                onChange={(e) => setGamificacaoAtiva(e.target.checked)}
                style={{
                  right: gamificacaoAtiva ? '0' : '1.5rem',
                  borderColor: gamificacaoAtiva ? '#4f46e5' : '#e5e7eb',
                }}
              />
              <label 
                htmlFor="toggle" 
                className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${gamificacaoAtiva ? 'bg-indigo-600' : 'bg-neutral-200'}`}
              ></label>
            </div>
          </label>
        </div>
      </section>
    </div>
  );
}
