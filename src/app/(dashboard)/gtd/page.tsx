'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';

const GtdProgressCard = dynamic(() => import('@/components/dashboard/GtdProgressCard'), { ssr: false });

export default function GtdPage() {
  return (
    <main className="p-6">
      <div className="flex items-start justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold">GTD — Painel</h1>
        <div className="w-72">
          <GtdProgressCard />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/gtd/proximas-acoes" className="p-4 bg-white border rounded hover:shadow">Próximas Ações</Link>
        <Link href="/gtd/aguardando" className="p-4 bg-white border rounded hover:shadow">Aguardando</Link>
        <Link href="/gtd/algum-dia" className="p-4 bg-white border rounded hover:shadow">Algum Dia</Link>
        <Link href="/gtd/projetos-ativos" className="p-4 bg-white border rounded hover:shadow">Projetos Ativos</Link>
        <Link href="/gtd/referencia" className="p-4 bg-white border rounded hover:shadow">Referência</Link>
      </div>
    </main>
  );
}
