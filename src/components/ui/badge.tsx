import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

// Contexto — cor fixa por espaço operacional
// Status   — com dot quando andamento
const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-[6px] border px-2 py-0.5 text-[11px] font-medium tracking-wide transition-colors',
  {
    variants: {
      variant: {
        // ── Contextos ──────────────────────────────────
        empresa:    'bg-brand-400/10   text-brand-300  border-brand-400/30',
        produto:    'bg-warning/10     text-warning     border-warning/30',
        marketing:  'bg-pink/10        text-pink        border-pink/30',
        dados:      'bg-info/10        text-info        border-info/30',
        pessoal:    'bg-rose/10        text-rose        border-rose/30',
        cliente:    'bg-purple/10      text-purple      border-purple/30',

        // ── Status ─────────────────────────────────────
        novo:       'bg-brand-300/10   text-brand-300   border-brand-300/30',
        andamento:  'bg-warning/10     text-warning     border-warning/30',
        concluido:  'bg-success/10     text-success     border-success/30',
        bloqueado:  'bg-error/10       text-error       border-error/30',

        // ── Legacy / compatibilidade ───────────────────
        default:     'bg-brand-400/10   text-brand-300  border-brand-400/30',
        secondary:   'bg-white/6        text-text-muted  border-white/10',
        destructive: 'bg-error/10       text-error       border-error/30',
        outline:     'bg-transparent    text-text        border-white/11',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, dot = false, children, ...props }: BadgeProps) {
  const isAndamento = variant === 'andamento';
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {(dot || isAndamento) && (
        <span
          className={cn(
            'inline-block w-[6px] h-[6px] rounded-full flex-shrink-0',
            isAndamento ? 'bg-warning animate-dot-pulse' : 'bg-current opacity-70'
          )}
        />
      )}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
