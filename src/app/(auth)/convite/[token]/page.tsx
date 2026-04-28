'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';

export default function ConvitePage() {
  const router = useRouter();
  const supabase = createClient();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const token = params.token as string;
  
  // NOTA: Em produção, use o token para verificar o convite via Supabase Auth
  
  const handleAceitarConvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Como é fase 2, vamos simular que o convite é aceito. 
    // Em produção, isso usaria o endpoint de verifyOtp para invite
    // const { error } = await supabase.auth.verifyOtp({ token_hash: params.token, type: 'invite' })

    setLoading(false);
    router.push('/app/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4">
      <Card className="w-full max-w-md">
        <form onSubmit={handleAceitarConvite}>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Aceitar Convite</CardTitle>
            <CardDescription>Para participar de um workspace no Ordinum.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <div className="text-sm font-medium text-red-500 bg-red-50 p-3 rounded-md">{error}</div>}
            
            <div className="bg-neutral-100 p-4 rounded-md text-sm text-center mb-4">
              Crie sua senha para acessar a plataforma.
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Sua Senha
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Entrando...' : 'Aceitar Convite'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
