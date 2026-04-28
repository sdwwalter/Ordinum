'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { InputMoeda } from '@/components/ui/input-moeda';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ModoWorkspace } from '@/types/workspace';
import { TipoEmpresa } from '@/types/empresa';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export default function CadastroPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [modo, setModo] = useState<ModoWorkspace>('solo');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nomeWorkspace, setNomeWorkspace] = useState('');
  const [emailConvite, setEmailConvite] = useState('');
  
  const [nomeEmpresa, setNomeEmpresa] = useState('');
  const [tipoEmpresa, setTipoEmpresa] = useState<TipoEmpresa | ''>('');
  const [corEmpresa, setCorEmpresa] = useState('#10B981');
  
  const [prolabore, setProlabore] = useState(0);

  // Aux state for created entities
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [empresaId, setEmpresaId] = useState<string | null>(null);

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Cadastrar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError || !authData.user) {
      setError(authError?.message || 'Erro ao criar conta');
      setLoading(false);
      return;
    }

    // 2. Criar Workspace
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .insert({ nome: nomeWorkspace || 'Meu Workspace', modo })
      .select()
      .single();

    if (workspaceError || !workspace) {
      setError('Conta criada, mas erro ao criar workspace.');
      setLoading(false);
      return;
    }

    setWorkspaceId(workspace.id);

    // 3. Criar Membro Admin
    const { error: membroError } = await supabase
      .from('membros_workspace')
      .insert({
        workspace_id: workspace.id,
        user_id: authData.user.id,
        papel: 'admin',
      });

    if (membroError) {
      setError('Erro ao vincular membro ao workspace.');
      setLoading(false);
      return;
    }

    // Enviar convite se aplicável
    if (modo !== 'solo' && emailConvite) {
      // Simples inserção de membro pendente ou convite via edge function
      // Para a fase 2, vamos assumir que o convite foi agendado
      console.log('Enviando convite para', emailConvite);
    }

    setLoading(false);
    setStep(3);
  };

  const handleCreateEmpresa = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!workspaceId) {
      setError('Workspace não encontrado.');
      setLoading(false);
      return;
    }

    const { data: empresa, error: empresaError } = await supabase
      .from('empresas')
      .insert({
        workspace_id: workspaceId,
        nome: nomeEmpresa,
        tipo: tipoEmpresa as string,
        cor: corEmpresa
      })
      .select()
      .single();

    if (empresaError || !empresa) {
      setError('Erro ao criar empresa.');
      setLoading(false);
      return;
    }

    setEmpresaId(empresa.id);
    setLoading(false);
    setStep(4);
  };

  const handleDefineProlabore = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Na fase 2, apenas avançamos. A lógica profunda de prolabore será no Módulo Empresa (Fase 4)
    // Aqui poderíamos salvar o valor como meta ou configuração inicial
    
    setLoading(false);
    setStep(5);
  };

  const handleSkipProlabore = () => {
    setStep(5);
  };

  const finishOnboarding = () => {
    router.push('/app/dashboard');
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4">
      <Card className="w-full max-w-md">
        {step === 1 && (
          <form onSubmit={() => setStep(2)}>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Modo de Operação</CardTitle>
              <CardDescription>Como você vai usar o Ordinum?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div 
                  className={`border p-4 rounded-md cursor-pointer ${modo === 'casal' ? 'border-primary bg-primary/5' : 'border-neutral-200'}`}
                  onClick={() => setModo('casal')}
                >
                  <h3 className="font-semibold">👫 Casal empreendedor</h3>
                  <p className="text-sm text-neutral-500">Separar dinheiro de casa e empresa juntos.</p>
                </div>
                <div 
                  className={`border p-4 rounded-md cursor-pointer ${modo === 'solo' ? 'border-primary bg-primary/5' : 'border-neutral-200'}`}
                  onClick={() => setModo('solo')}
                >
                  <h3 className="font-semibold">🧑 Empreendedor solo</h3>
                  <p className="text-sm text-neutral-500">Organizar finanças pessoais e negócios sozinho.</p>
                </div>
                <div 
                  className={`border p-4 rounded-md cursor-pointer ${modo === 'socios' ? 'border-primary bg-primary/5' : 'border-neutral-200'}`}
                  onClick={() => setModo('socios')}
                >
                  <h3 className="font-semibold">🤝 Sócios de negócio</h3>
                  <p className="text-sm text-neutral-500">Gestão empresarial sem misturar contas pessoais.</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button type="button" className="w-full" onClick={() => setStep(2)}>Continuar</Button>
              <div className="text-center text-sm">
                Já tem uma conta?{' '}
                <Link href="/login" className="font-semibold text-neutral-950 underline hover:text-neutral-700">
                  Entrar
                </Link>
              </div>
            </CardFooter>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleCreateWorkspace}>
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Criar conta</CardTitle>
              <CardDescription>Configure seu acesso inicial</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && <div className="text-sm font-medium text-red-500 bg-red-50 p-3 rounded-md">{error}</div>}
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome do Workspace</label>
                <Input
                  placeholder="Ex: Família Silva"
                  value={nomeWorkspace}
                  onChange={(e) => setNomeWorkspace(e.target.value)}
                  required
                />
              </div>

              {modo !== 'solo' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Convidar Parceiro (Opcional)</label>
                  <Input
                    type="email"
                    placeholder="email@parceiro.com"
                    value={emailConvite}
                    onChange={(e) => setEmailConvite(e.target.value)}
                  />
                  <p className="text-xs text-neutral-500">Eles receberão um convite por email.</p>
                </div>
              )}

              <hr className="my-4" />

              <div className="space-y-2">
                <label className="text-sm font-medium">Seu Email</label>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sua Senha</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button type="button" variant="outline" className="w-1/3" onClick={() => setStep(1)} disabled={loading}>
                Voltar
              </Button>
              <Button type="submit" className="w-2/3" disabled={loading}>
                {loading ? 'Criando...' : 'Criar Conta'}
              </Button>
            </CardFooter>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleCreateEmpresa}>
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Primeira Empresa</CardTitle>
              <CardDescription>Cadastre o seu negócio principal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && <div className="text-sm font-medium text-red-500 bg-red-50 p-3 rounded-md">{error}</div>}
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome da Empresa</label>
                <Input
                  placeholder="Ex: Consultoria Silva"
                  value={nomeEmpresa}
                  onChange={(e) => setNomeEmpresa(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo</label>
                <Select
                  value={tipoEmpresa}
                  onChange={(e) => setTipoEmpresa(e.target.value as TipoEmpresa)}
                  required
                  options={[
                    { label: 'Serviços', value: 'servicos' },
                    { label: 'Produto Físico', value: 'produto' },
                    { label: 'Tecnologia / SaaS', value: 'tech' },
                    { label: 'Comércio', value: 'comercio' },
                    { label: 'Outro', value: 'outro' },
                  ]}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Cor de Identificação</label>
                <div className="flex gap-2">
                  {['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'].map(cor => (
                    <div 
                      key={cor}
                      className={`w-8 h-8 rounded-full cursor-pointer border-2 ${corEmpresa === cor ? 'border-neutral-900' : 'border-transparent'}`}
                      style={{ backgroundColor: cor }}
                      onClick={() => setCorEmpresa(cor)}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Empresa'}
              </Button>
            </CardFooter>
          </form>
        )}

        {step === 4 && (
          <form onSubmit={handleDefineProlabore}>
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Prolabore Base</CardTitle>
              <CardDescription>Quanto você retira da empresa mensalmente?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-neutral-100 p-4 rounded-md text-sm text-neutral-600 mb-4">
                Defina um valor estimado para o seu ganho mensal da empresa.
                O Ordinum conecta automaticamente a retirada da sua empresa com as suas receitas pessoais.
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Valor do Prolabore Mensal</label>
                <InputMoeda
                  value={prolabore}
                  onChange={setProlabore}
                />
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button type="button" variant="outline" className="w-1/3" onClick={handleSkipProlabore}>
                Pular
              </Button>
              <Button type="submit" className="w-2/3" disabled={loading}>
                Definir Prolabore
              </Button>
            </CardFooter>
          </form>
        )}

        {step === 5 && (
          <div className="text-center py-8">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 flex items-center justify-center rounded-full mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl font-bold">Tudo pronto!</CardTitle>
              <CardDescription>Seu workspace está configurado.</CardDescription>
            </CardHeader>
            <CardContent className="text-left bg-neutral-50 m-6 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-sm uppercase tracking-wider text-neutral-500">Seus Primeiros Passos:</h4>
              <ul className="space-y-2 text-sm text-neutral-700">
                <li className="flex items-center gap-2"><div className="w-4 h-4 rounded-full border border-neutral-300" /> Registrar sua primeira despesa pessoal</li>
                <li className="flex items-center gap-2"><div className="w-4 h-4 rounded-full border border-neutral-300" /> Criar um projeto</li>
                {modo !== 'solo' && <li className="flex items-center gap-2"><div className="w-4 h-4 rounded-full border border-neutral-300" /> Fazer o primeiro alinhamento</li>}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={finishOnboarding}>
                Ir para o Dashboard
              </Button>
            </CardFooter>
          </div>
        )}
      </Card>
    </div>
  );
}
