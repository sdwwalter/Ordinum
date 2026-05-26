'use client';
import { usePathname } from 'next/navigation';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const VIEW_META: Record<string, { title: string; subtitle: string }> = {
  '/app/visao-geral': {
    title: 'Visão Geral',
    subtitle: 'Acompanhe o que importa em todos os seus contextos.',
  },
  '/app/kanban': {
    title: 'Kanban Global',
    subtitle: 'Visão única de execução cruzando todos os contextos.',
  },
  '/app/projetos': {
    title: 'Projetos',
    subtitle: '6 ativos · 1 em revisão · 1 concluído este mês.',
  },
  '/app/pessoal': {
    title: 'Pessoal · GTD',
    subtitle: 'Foco hoje, claro amanhã. Captura tudo sem perder a cabeça.',
  },
  '/app/empresa': {
    title: 'Empresa',
    subtitle: 'Gestão financeira e operacional da sua empresa.',
  },
  '/app/alinhamento': {
    title: 'Alinhamento',
    subtitle: 'Pautas e decisões das suas sessões de alinhamento.',
  },
  '/app/relatorios': {
    title: 'Relatórios',
    subtitle: 'Análises e relatórios consolidados do workspace.',
  },
  '/app/configuracoes': {
    title: 'Configurações',
    subtitle: 'Preferências e integrações do workspace.',
  },
};

function getViewMeta(pathname: string) {
  for (const [key, meta] of Object.entries(VIEW_META)) {
    if (pathname === key || pathname.startsWith(key + '/')) return meta;
  }
  return { title: 'Ordinum', subtitle: 'Sistema executivo.' };
}

interface TopBarProps {
  actionSlot?: React.ReactNode;
}

export function TopBar({ actionSlot }: TopBarProps) {
  const pathname = usePathname();
  const { title, subtitle } = getViewMeta(pathname);

  return (
    <header className="flex items-center justify-between px-7 py-[22px] border-b border-white/4 bg-bg flex-shrink-0">
      {/* Left */}
      <div>
        <h1 className="text-[22px] font-bold text-text leading-tight">{title}</h1>
        <p className="text-[13px] text-text-muted mt-0.5">{subtitle}</p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {actionSlot}

        {/* Search */}
        <button
          className="w-[42px] h-[42px] rounded-[10px] flex items-center justify-center text-text-muted hover:bg-white/4 hover:text-text transition-colors"
          aria-label="Buscar"
        >
          <Search className="w-5 h-5" strokeWidth={1.8} />
        </button>

        {/* Bell */}
        <button
          className="relative w-[42px] h-[42px] rounded-[10px] flex items-center justify-center text-text-muted hover:bg-white/4 hover:text-text transition-colors"
          aria-label="Notificações"
        >
          <Bell className="w-5 h-5" strokeWidth={1.8} />
          <span
            className="absolute top-2 right-2 w-[6px] h-[6px] rounded-full bg-error"
            aria-hidden="true"
          />
        </button>

        {/* User pill */}
        <button className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-[10px] hover:bg-white/4 transition-colors">
          <div
            className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[11px] font-bold text-brand-fg flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--color-brand-300), var(--color-brand-600))' }}
          >
            WM
          </div>
          <div className="text-left hidden lg:block">
            <div className="text-[13px] font-medium text-text leading-tight">Walter Miranda</div>
            <div className="text-[11px] text-text-faint">Admin</div>
          </div>
          <ChevronDown className="w-4 h-4 text-text-faint" strokeWidth={1.8} />
        </button>
      </div>
    </header>
  );
}
