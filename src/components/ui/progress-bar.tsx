import * as React from 'react';
import { cn } from '@/lib/utils/cn';

interface ProgressBarProps {
  progresso: number; // 0 to 100
  cor?: string; // Tailwind class like bg-indigo-500
  className?: string;
}

export function ProgressBar({ progresso, cor = 'bg-primary', className }: ProgressBarProps) {
  const percentual = Math.min(Math.max(progresso, 0), 100);
  
  return (
    <div className={cn("w-full bg-neutral-200 rounded-full h-2.5 overflow-hidden", className)}>
      <div 
        className={cn("h-2.5 rounded-full transition-all duration-300", cor)} 
        style={{ width: `${percentual}%` }}
      />
    </div>
  );
}
