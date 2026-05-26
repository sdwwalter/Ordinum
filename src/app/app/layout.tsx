import { AppSidebar } from '@/components/layout/AppSidebar';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { RecurrenceEngine } from '@/components/RecurrenceEngine';
import { BadgeModalLazy } from '@/components/gamification/BadgeModalLazy';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      <AppSidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto relative pb-16 md:pb-0">
          <RecurrenceEngine />
          <BadgeModalLazy />
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
