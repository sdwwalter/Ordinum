// src/components/gamification/BadgeModalLazy.tsx
'use client';

import dynamic from 'next/dynamic';

const BadgeModal = dynamic(
  () => import('@/components/gamification/BadgeModal').then((mod) => ({ default: mod.BadgeModal })),
  {
    ssr: false,
    loading: () => null,
  }
);

export function BadgeModalLazy() {
  return <BadgeModal />;
}
