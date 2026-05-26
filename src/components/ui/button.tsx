'use client';
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px]',
    'text-sm font-semibold transition-all duration-200',
    'focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40',
    'select-none cursor-pointer',
  ].join(' '),
  {
    variants: {
      variant: {
        primary: [
          'bg-brand-400 text-brand-fg',
          'hover:bg-brand-300 hover:shadow-[0_0_0_8px_rgba(34,211,238,0.12)]',
          'active:bg-brand-500',
        ].join(' '),
        secondary: [
          'bg-white/4 text-text border border-white/10',
          'hover:bg-white/7 hover:border-white/16',
        ].join(' '),
        ghost: [
          'bg-transparent text-text-muted',
          'hover:bg-white/4 hover:text-text',
        ].join(' '),
        outline: [
          'bg-transparent text-brand-300 border border-brand-400/30',
          'hover:bg-brand-400/8 hover:border-brand-400/50',
        ].join(' '),
        danger: [
          'bg-error/10 text-error border border-error/30',
          'hover:bg-error/20 hover:border-error/50',
        ].join(' '),
        // legacy alias — mantém compatibilidade durante migração
        default: [
          'bg-brand-400 text-brand-fg',
          'hover:bg-brand-300 hover:shadow-[0_0_0_8px_rgba(34,211,238,0.12)]',
        ].join(' '),
        destructive: [
          'bg-error/10 text-error border border-error/30',
          'hover:bg-error/20 hover:border-error/50',
        ].join(' '),
        link: 'bg-transparent text-brand-300 underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-[34px] px-3 text-xs',
        md: 'h-[42px] px-4 text-sm',
        default: 'h-[42px] px-4 text-sm',
        lg: 'h-[52px] px-6 text-base',
        icon: 'h-[42px] w-[42px]',
        'icon-sm': 'h-[34px] w-[34px]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref as React.Ref<HTMLButtonElement>}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
