'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AuthShell } from '@/components/ui/auth-shell';
import { AuthField } from '@/components/ui/auth-field';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push('/app/dashboard');
    router.refresh();
  };

  return (
    <AuthShell title="Bem-vindo de volta" description="Sistema executivo para ordem e clareza.">
      <form onSubmit={handleLogin} className="flex flex-col gap-5">
        {error && (
          <div className="rounded-[10px] border border-error/25 bg-error/8 px-4 py-3 text-[13px] text-error">
            {error}
          </div>
        )}

        <AuthField
          label="Email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <AuthField
          label="Senha"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full mt-1"
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>

        <p className="text-center text-[13px] text-text-faint">
          Não tem uma conta?{' '}
          <Link
            href="/cadastro"
            className="font-semibold text-brand-300 hover:text-brand-400 transition-colors"
          >
            Cadastre-se
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
