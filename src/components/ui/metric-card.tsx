import * as React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Sparkline } from './sparkline';

interface MetricCardProps {
  titulo: string;
  valor: string | number;
  delta?: number;
  deltaPositivo?: boolean;
  sparkPoints?: number[];
  sparkColor?: string;
  className?: string;
}

export function MetricCard({
  titulo,
  valor,
  delta,
  deltaPositivo = true,
  sparkPoints,
  sparkColor = '#22D3EE',
  className,
}: MetricCardProps) {
  const isPositive = deltaPositivo;
  const deltaColor = isPositive ? 'text-success' : 'text-error';

  return (
    <div
      className={cn(
        'rounded-[18px] border border-white/7 bg-surface p-5 flex flex-col gap-3',
        'animate-fade-in-up',
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-[13px] text-text-muted font-medium leading-tight">{titulo}</span>
        {sparkPoints && (
          <Sparkline points={sparkPoints} color={sparkColor} width={72} height={28} />
        )}
      </div>

      <div className="flex items-end justify-between gap-2">
        <span
          className="text-[32px] font-bold tabular text-text leading-none"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {valor}
        </span>

        {delta !== undefined && (
          <div className={cn('flex items-center gap-1 text-[13px] font-medium pb-0.5', deltaColor)}>
            {isPositive ? (
              <TrendingUp className="w-3.5 h-3.5" strokeWidth={2.2} />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" strokeWidth={2.2} />
            )}
            <span>{Math.abs(delta)}%</span>
          </div>
        )}
      </div>

      {delta !== undefined && (
        <span className="text-[11px] text-text-faint">vs mês anterior</span>
      )}
    </div>
  );
}
