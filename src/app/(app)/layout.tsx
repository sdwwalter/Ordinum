import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { RecurrenceEngine } from '@/components/RecurrenceEngine';
import { BadgeModal } from '@/components/gamification/BadgeModal';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-neutral-50 pb-16 md:pb-0">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative">
        <RecurrenceEngine />
        <BadgeModal />
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
