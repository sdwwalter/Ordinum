import * as React from 'react';
import { cn } from '@/lib/utils/cn';

interface InputMoedaProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: number;
  onChange: (value: number) => void;
}

export const InputMoeda = React.forwardRef<HTMLInputElement, InputMoedaProps>(
  ({ className, value, onChange, ...props }, ref) => {
    
    const formatValue = (val: number) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(val);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let inputValue = e.target.value;
      inputValue = inputValue.replace(/\D/g, ''); // Remove não números
      if (!inputValue) {
        onChange(0);
        return;
      }
      const numValue = Number(inputValue) / 100;
      onChange(numValue);
    };

    return (
      <input
        ref={ref}
        type="text"
        inputMode="numeric"
        className={cn(
          'flex h-12 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 min-h-[48px]',
          className
        )}
        value={formatValue(value)}
        onChange={handleChange}
        {...props}
      />
    );
  }
);
InputMoeda.displayName = 'InputMoeda';
