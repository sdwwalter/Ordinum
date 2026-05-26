import { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface AuthFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

export const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(
  ({ label, hint, error, className, id, ...props }, ref) => {
    const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={fieldId} className="text-[13px] font-medium text-text-muted">
          {label}
        </label>
        <input
          ref={ref}
          id={fieldId}
          className={cn(
            'h-[42px] w-full rounded-[10px] border border-white/10 bg-input px-4',
            'text-[14px] text-text placeholder:text-text-faint',
            'transition-colors duration-150',
            'focus:outline-none focus:border-brand-400/50 focus:ring-2 focus:ring-brand-400/15',
            error && 'border-error/50 focus:border-error/60 focus:ring-error/15',
            className,
          )}
          {...props}
        />
        {hint && !error && <p className="text-[12px] text-text-faint">{hint}</p>}
        {error && <p className="text-[12px] text-error">{error}</p>}
      </div>
    );
  }
);
AuthField.displayName = 'AuthField';
