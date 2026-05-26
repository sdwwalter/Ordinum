import { OrdinumLogo } from '@/components/ui/ordinum-logo';

interface AuthShellProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function AuthShell({ children, title, description }: AuthShellProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-4" style={{ backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(6,182,212,.12), transparent)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <OrdinumLogo size={44} withWordmark />
        </div>

        {/* Card */}
        <div className="rounded-[20px] border border-white/8 bg-surface shadow-[0_24px_64px_rgba(0,0,0,.5)]">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b border-white/6 text-center">
            <h1 className="font-display text-[24px] font-bold text-text">{title}</h1>
            {description && (
              <p className="mt-1.5 text-[14px] text-text-muted">{description}</p>
            )}
          </div>

          {/* Body */}
          <div className="px-8 py-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
