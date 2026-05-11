import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { GtdInboxItem } from '@/types';

interface GtdState {
  inbox: GtdInboxItem[];
  inboxCount: number;
  setInbox: (items: GtdInboxItem[]) => void;
  decrementInbox: () => void;
}

export const useGtdStore = create<GtdState>()(
  immer((set) => ({
    inbox: [],
    inboxCount: 0,
    setInbox: (items) => set((s: any) => {
      s.inbox = items;
      s.inboxCount = items.filter((i: GtdInboxItem) => !i.processado).length;
    }),
    decrementInbox: () => set((s: any) => { s.inboxCount -= 1; }),
  }))
);
