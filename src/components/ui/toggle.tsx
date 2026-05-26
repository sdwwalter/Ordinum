'use client';

import { cn } from '@/lib/utils/cn';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export function Toggle({ checked, onChange, id, disabled, size = 'md' }: ToggleProps) {
  const isSm = size === 'sm';
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      id={id}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent',
        'transition-colors duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/50',
        isSm ? 'h-5 w-9' : 'h-6 w-11',
        checked ? 'bg-brand-500' : 'bg-surface-3',
        disabled && 'opacity-40 cursor-not-allowed',
      )}
    >
      <span
        className={cn(
          'pointer-events-none block rounded-full bg-white shadow-sm transition-transform duration-200 ease-out',
          isSm ? 'h-4 w-4' : 'h-5 w-5',
          checked
            ? isSm ? 'translate-x-4' : 'translate-x-5'
            : 'translate-x-0',
        )}
      />
    </button>
  );
}
