import * as React from 'react';
import { cn } from '@/lib/utils/cn';

interface SemaforoProps {
  cor: 'verde' | 'amarelo' | 'vermelho';
  texto?: string;
  className?: string;
}

export function Semaforo({ cor, texto, className }: SemaforoProps) {
  const bgColor = {
    verde: 'bg-green-500',
    amarelo: 'bg-yellow-500',
    vermelho: 'bg-red-500',
  }[cor];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("w-3 h-3 rounded-full", bgColor)} />
      {texto && <span className="text-sm font-medium text-neutral-700">{texto}</span>}
    </div>
  );
}
