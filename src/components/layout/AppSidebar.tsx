'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, Building2, User, FolderKanban, Columns3,
  BarChart3, Settings, AlignLeft,
} from 'lucide-react';
import { OrdinumLogo } from '@/components/ui/ordinum-logo';
import { cn } from '@/lib/utils/cn';

const navItems = [
  { href: '/app/visao-geral', label: 'Visão Geral',    icon: Home },
  { href: '/app/empresa',     label: 'Empresa',         icon: Building2 },
  { href: '/app/pessoal',     label: 'Pessoal',         icon: User },
  { href: '/app/projetos',    label: 'Projetos',        icon: FolderKanban },
  { href: '/app/kanban',      label: 'Kanban Global',   icon: Columns3 },
  { href: '/app/alinhamento', label: 'Alinhamento',     icon: AlignLeft },
  { href: '/app/relatorios',  label: 'Relatórios',      icon: BarChart3 },
  { href: '/app/configuracoes', label: 'Configurações', icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex flex-col h-screen sticky top-0 flex-shrink-0 border-r border-white/7"
      style={{
        width: 240,
        background: 'var(--color-sidebar)',
        boxShadow: '4px 0 24px rgba(0,0,0,.5)',
      }}
    >
      {/* Logo */}
      <div className="px-[14px] pt-[22px] pb-[22px]">
        <Link href="/app/visao-geral" className="px-[10px]">
          <OrdinumLogo size={26} withWordmark />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-[14px] flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'relative flex items-center gap-3 px-3 py-[10px] rounded-[9px] text-[14px] font-medium transition-all duration-200',
                active
                  ? 'text-brand-300 font-semibold bg-brand-400/10 border border-brand-400/20'
                  : 'text-text-muted hover:bg-white/3 hover:text-text border border-transparent'
              )}
            >
              {active && (
                <span
                  className="absolute left-0 top-[6px] bottom-[6px] w-[2px] rounded-r-full bg-brand-400"
                  aria-hidden="true"
                />
              )}
              <Icon
                className="w-5 h-5 flex-shrink-0"
                strokeWidth={active ? 2.2 : 1.8}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* PlanCard */}
      <div className="px-[14px] pb-[22px]">
        <div
          className="rounded-[12px] border border-brand-400/18 p-[14px]"
          style={{ background: 'linear-gradient(135deg, rgba(34,211,238,.10), rgba(34,211,238,.02))' }}
        >
          <div className="text-[11px] font-semibold text-brand-300 tracking-[.06em] mb-1">PLANO PRO</div>
          <div className="text-[12px] text-text-muted mb-3">7 de 12 contextos usados</div>
          <div className="h-1 rounded-full bg-white/8 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: '58%',
                background: 'linear-gradient(90deg, var(--color-brand-300), var(--color-brand-500))',
              }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
