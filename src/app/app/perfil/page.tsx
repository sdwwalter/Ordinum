'use client';

import { useGamificationStore, BADGES_DISPONIVEIS } from '@/stores/gamificationStore';
import { createClient } from '@/lib/supabase/client';
import { Trophy, Star, ShieldAlert, Award } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function PerfilPage() {
  const { pontosTotais, badgesDesbloqueados, streakDias, carregarStatus } = useGamificationStore();
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);

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
        carregarStatus(membro.workspace_id);
      }
    };
    init();
  }, [carregarStatus]);

  if (!workspaceId) {
    return <div className="p-8 animate-pulse bg-neutral-100 h-64 rounded-xl m-8"></div>;
  }

  const badgesList = Object.values(BADGES_DISPONIVEIS);

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-2">
          <Award className="w-8 h-8 text-neutral-600" />
          Meu Perfil & Conquistas
        </h1>
        <p className="text-neutral-500 mt-1">
          Acompanhe seu progresso e evolução no uso do sistema.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg flex flex-col justify-center items-center">
          <Trophy className="w-12 h-12 text-yellow-300 mb-2" />
          <h3 className="text-indigo-100 font-medium">Pontuação Total</h3>
          <span className="text-5xl font-black mt-1 tracking-tight">{pontosTotais}</span>
          <p className="text-sm text-indigo-200 mt-4">Complete tarefas e feche os meses para subir no ranking.</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg flex flex-col justify-center items-center">
          <Star className="w-12 h-12 text-amber-200 mb-2" />
          <h3 className="text-amber-100 font-medium">Dias Consecutivos (Streak)</h3>
          <span className="text-5xl font-black mt-1 tracking-tight">{streakDias}</span>
          <p className="text-sm text-amber-200 mt-4">Mantenha a constância acessando e lançando dados.</p>
        </div>
      </div>

      <section className="bg-white border rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-neutral-800 mb-6 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-neutral-400" />
          Estante de Badges
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badgesList.map(badge => {
            const unlocked = badgesDesbloqueados.includes(badge.id);
            return (
              <div 
                key={badge.id}
                className={`border rounded-xl p-4 text-center transition-all ${
                  unlocked 
                    ? 'bg-amber-50 border-amber-200 shadow-sm' 
                    : 'bg-neutral-50 border-neutral-100 opacity-60 grayscale'
                }`}
              >
                <div className="text-4xl mb-3">{badge.icone}</div>
                <h4 className={`font-bold text-sm ${unlocked ? 'text-amber-900' : 'text-neutral-500'}`}>
                  {badge.nome}
                </h4>
                <p className="text-xs text-neutral-500 mt-1">
                  {badge.descricao}
                </p>
                {!unlocked && (
                  <div className="mt-3 text-[10px] uppercase font-bold text-neutral-400 bg-neutral-200 rounded-full inline-block px-2 py-0.5">
                    Bloqueado
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
