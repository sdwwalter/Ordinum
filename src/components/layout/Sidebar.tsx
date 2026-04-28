import Link from 'next/link';
import { Home, Building2, Rocket, Kanban, FileText, Settings, LayoutDashboard } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-neutral-200 bg-white h-screen sticky top-0">
      <div className="p-6 border-b border-neutral-200">
        <h2 className="text-xl font-bold tracking-tight text-neutral-900">Ordinum</h2>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <Link href="/app/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-neutral-100 text-neutral-700">
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </Link>
        
        <div className="pt-4 pb-2">
          <p className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Módulos</p>
        </div>
        
        <Link href="/app/pessoal/lancamentos" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-50 text-indigo-700">
          <Home className="w-5 h-5" />
          Pessoal
        </Link>
        <Link href="/app/empresa/lancamentos" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-emerald-50 text-emerald-700">
          <Building2 className="w-5 h-5" />
          Empresa
        </Link>
        <Link href="/app/projetos" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-amber-50 text-amber-700">
          <Rocket className="w-5 h-5" />
          Projetos
        </Link>
        <Link href="/app/kanban" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-50 text-slate-700">
          <Kanban className="w-5 h-5" />
          Kanban
        </Link>
        <Link href="/app/alinhamento" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-violet-50 text-violet-700">
          <FileText className="w-5 h-5" />
          Alinhamento
        </Link>
      </nav>

      <div className="p-4 border-t border-neutral-200">
        <Link href="/app/configuracoes/workspace" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-neutral-100 text-neutral-700">
          <Settings className="w-5 h-5" />
          Configurações
        </Link>
      </div>
    </aside>
  );
}
