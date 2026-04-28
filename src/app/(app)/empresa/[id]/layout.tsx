'use client';

import { useEffect, useState } from 'react';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { SeletorEmpresa } from '@/components/empresa/SeletorEmpresa';
import { createClient } from '@/lib/supabase/client';

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

  const TabItem = ({ href, label }: { href: string, label: string }) => {
    const isActive = pathname.includes(href);
    return (
      <Link 
        href={`/app/empresa/${id}${href}`}
        className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
          isActive 
            ? 'border-emerald-600 text-emerald-600' 
            : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
        }`}
      >
        {label}
      </Link>
    );
  };

  if (!workspaceId) return <div className="p-8 text-center">Carregando contexto empresarial...</div>;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto pb-24">
      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-end">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Empresa</h1>
          <SeletorEmpresa workspaceId={workspaceId} />
        </div>
      </div>

      <div className="border-b border-neutral-200 mb-6 flex gap-6">
        <TabItem href="/lancamentos" label="Lançamentos" />
        <TabItem href="/dre" label="DRE Mensal" />
        <TabItem href="/prolabore" label="Prolabores" />
      </div>

      <div>
        {children}
      </div>
    </div>
  );
}
