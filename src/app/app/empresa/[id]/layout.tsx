'use client';

import { useEffect, useState } from 'react';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { SeletorEmpresa } from '@/components/empresa/SeletorEmpresa';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils/cn';

export default function EmpresaLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const id = params.id as string;
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
      }
    };
    init();
  }, []);

  const TAB_LINKS = [
    { href: '/lancamentos', label: 'Lancamentos' },
    { href: '/dre',         label: 'DRE Mensal' },
    { href: '/prolabore',   label: 'Prolabores' },
  ];

  if (!workspaceId) {
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
          <p className="text-[13px] text-text-faint">Carregando contexto empresarial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-7 pt-5 pb-24 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-5 flex flex-col md:flex-row gap-4 justify-between items-start md:items-end">
        <div>
          <h1 className="font-display text-[26px] font-bold text-text mb-1.5">Empresa</h1>
          <SeletorEmpresa workspaceId={workspaceId} />
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex items-center gap-1 border-b border-white/8 mb-6">
        {TAB_LINKS.map(({ href, label }) => {
          const isActive = pathname.includes(href);
          return (
            <Link
              key={href}
              href={`/app/empresa/${id}${href}`}
              className={cn(
                'pb-3 px-4 border-b-2 text-[14px] font-medium transition-colors -mb-px',
                isActive
                  ? 'border-brand-400 text-brand-300'
                  : 'border-transparent text-text-faint hover:text-text-muted hover:border-white/20',
              )}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {children}
    </div>
  );
}
