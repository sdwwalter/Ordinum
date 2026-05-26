import * as React from 'react';
import { cn } from '@/lib/utils/cn';

interface OrdinumLogoProps {
  size?: number;
  withWordmark?: boolean;
  color?: 'default' | 'white';
  className?: string;
}

export function OrdinumLogo({
  size = 28,
  withWordmark = true,
  color = 'default',
  className,
}: OrdinumLogoProps) {
  const gradId = 'ordinum-logo-grad';

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 28 28"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#67E8F9" />
            <stop offset="100%" stopColor="#0E7490" />
          </linearGradient>
        </defs>
        {/* Outer ring */}
        <circle cx="14" cy="14" r="13" stroke={`url(#${gradId})`} strokeWidth="1.5" fill="none" opacity="0.4" />
        {/* Mid ring */}
        <circle cx="14" cy="14" r="9" stroke={`url(#${gradId})`} strokeWidth="1.5" fill="none" opacity="0.65" />
        {/* Inner ring */}
        <circle cx="14" cy="14" r="5" stroke={`url(#${gradId})`} strokeWidth="1.5" fill="none" opacity="0.9" />
        {/* Center dot */}
        <circle cx="14" cy="14" r="2.5" fill={`url(#${gradId})`} />
      </svg>

      {withWordmark && (
        <span
          className={cn(
            'font-semibold text-[19px] leading-none tracking-[-0.01em]',
            color === 'white' ? 'text-white' : 'text-text'
          )}
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Ordinum
        </span>
      )}
    </div>
  );
}
