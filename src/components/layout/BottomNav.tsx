import Link from 'next/link';
import { Home, Building2, Rocket, FileText, LayoutDashboard } from 'lucide-react';

export function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-neutral-200 bg-white pb-safe z-50 flex justify-around items-center h-16">
      <Link href="/app/dashboard" className="flex flex-col items-center justify-center w-full h-full text-neutral-500 hover:text-neutral-900">
        <LayoutDashboard className="w-6 h-6" />
        <span className="text-[10px] mt-1 font-medium">Início</span>
      </Link>
      <Link href="/app/pessoal/lancamentos" className="flex flex-col items-center justify-center w-full h-full text-neutral-500 hover:text-indigo-600">
        <Home className="w-6 h-6" />
        <span className="text-[10px] mt-1 font-medium">Pessoal</span>
      </Link>
      <Link href="/app/empresa/lancamentos" className="flex flex-col items-center justify-center w-full h-full text-neutral-500 hover:text-emerald-600">
        <Building2 className="w-6 h-6" />
        <span className="text-[10px] mt-1 font-medium">Empresa</span>
      </Link>
      <Link href="/app/projetos" className="flex flex-col items-center justify-center w-full h-full text-neutral-500 hover:text-amber-600">
        <Rocket className="w-6 h-6" />
        <span className="text-[10px] mt-1 font-medium">Projetos</span>
      </Link>
      <Link href="/app/alinhamento" className="flex flex-col items-center justify-center w-full h-full text-neutral-500 hover:text-violet-600">
        <FileText className="w-6 h-6" />
        <span className="text-[10px] mt-1 font-medium">Reunião</span>
      </Link>
    </nav>
  );
}
