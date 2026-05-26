'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function EmpresaRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const redirect = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Descobre o workspace
      const { data: membro } = await supabase
        .from('membros_workspace')
        .select('workspace_id')
        .eq('user_id', user.id)
        .eq('ativo', true)
        .single();

      if (membro) {
        const cached = localStorage.getItem(`duetto_active_empresa_${membro.workspace_id}`);
        if (cached) {
          router.push(`/app/empresa/${cached}/lancamentos`);
          return;
        }

        // Se nao tem no cache, pega a primeira
        const { data: empresa } = await supabase
          .from('empresas')
          .select('id')
          .eq('workspace_id', membro.workspace_id)
          .eq('ativo', true)
          .limit(1)
          .single();

        if (empresa) {
          localStorage.setItem(`duetto_active_empresa_${membro.workspace_id}`, empresa.id);
          router.push(`/app/empresa/${empresa.id}/lancamentos`);
        } else {
          // Fallback, sem empresas.
          router.push('/app/dashboard');
        }
      }
    };
    redirect();
  }, [router]);

  return (
    <div className="flex items-center justify-center h-full p-8">
      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-brand-400 animate-dot-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
        <p className="text-[13px] text-text-faint">Carregando Empresa...</p>
      </div>
    </div>
  );
}
