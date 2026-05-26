'use client';

import InboxCaptura from '@/components/gtd/InboxCaptura';
import InboxListClient from '@/components/gtd/InboxList.client';
import RevisaoSemanalGTD from '@/components/alinhamento/RevisaoSemanalGTD';

export default function InboxPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Inbox</h1>
      <section className="mb-6">
        <InboxCaptura onCaptured={() => { /* client handles refresh via refetch in real app */ }} />
      </section>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h2 className="text-lg font-medium mb-3">Últimas capturas</h2>
            <InboxListClient />
          </div>
          <aside>
            <RevisaoSemanalGTD />
          </aside>
        </div>
      </section>
    </main>
  );
}
