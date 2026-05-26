'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AuthShell } from '@/components/ui/auth-shell';
import { AuthField } from '@/components/ui/auth-field';
import { Button } from '@/components/ui/button';

export default function ConvitePage() {
  const router = useRouter();
  const supabase = createClient();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const token = params.token as string;

  // NOTA: Em producao, use o token para verificar o convite via Supabase Auth

  const handleAceitarConvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Como e fase 2, vamos simular que o convite e aceito.
    // Em producao, isso usaria o endpoint de verifyOtp para invite
    // const { error } = await supabase.auth.verifyOtp({ token_hash: params.token, type: 'invite' })

    setLoading(false);
    router.push('/app/dashboard');
  };

  return (
    <AuthShell title="Aceitar Convite" description="Crie sua senha para acessar o workspace no Ordinum.">
      <form onSubmit={handleAceitarConvite} className="flex flex-col gap-5">
        {error && (
          <div className="rounded-[10px] border border-error/25 bg-error/8 px-4 py-3 text-[13px] text-error">
            {error}
          </div>
        )}

        <div className="rounded-[12px] border border-brand-400/15 bg-brand-400/6 px-4 py-3 text-[13px] text-text-muted text-center">
          Crie sua senha para acessar a plataforma.
        </div>

        <AuthField
          label="Sua Senha"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full mt-1"
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Aceitar Convite'}
        </Button>
      </form>
    </AuthShell>
  );
}
