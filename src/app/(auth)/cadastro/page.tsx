'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AuthShell } from '@/components/ui/auth-shell';
import { AuthField } from '@/components/ui/auth-field';
import { Button } from '@/components/ui/button';
import { InputMoeda } from '@/components/ui/input-moeda';
import { Select } from '@/components/ui/select';
import { ModoWorkspace } from '@/types/workspace';
import { TipoEmpresa } from '@/types/empresa';
import Link from 'next/link';
import { CheckCircle2, Users, User, Handshake } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

/* Step progress dots */
function StepDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-1.5 rounded-full transition-all duration-300',
            i < step ? 'bg-brand-400 w-6' : 'bg-white/12 w-3',
          )}
        />
      ))}
    </div>
  );
}

/* Mode card */
function ModeCard({
  selected,
  onClick,
  icon: Icon,
  title,
  description,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full text-left rounded-[14px] border p-4 flex items-start gap-3 transition-all duration-150',
        selected
          ? 'border-brand-400/40 bg-brand-400/8'
          : 'border-white/8 bg-surface-2 hover:border-white/14',
      )}
    >
      <div
        className={cn(
          'w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 mt-0.5',
          selected ? 'bg-brand-400/20 text-brand-300' : 'bg-surface-3 text-text-faint',
        )}
      >
        <Icon className="w-4.5 h-4.5" strokeWidth={1.8} />
      </div>
      <div>
        <div className="text-[14px] font-semibold text-text">{title}</div>
        <div className="text-[12px] text-text-faint mt-0.5">{description}</div>
      </div>
    </button>
  );
}

/* Color dot picker */
const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#22D3EE'];

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

    // 1. Cadastrar usuario no Supabase Auth
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

    // Enviar convite se aplicavel
    if (modo !== 'solo' && emailConvite) {
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
      setError('Workspace nao encontrado.');
      setLoading(false);
      return;
    }

    const { data: empresa, error: empresaError } = await supabase
      .from('empresas')
      .insert({
        workspace_id: workspaceId,
        nome: nomeEmpresa,
        tipo: tipoEmpresa as string,
        cor: corEmpresa,
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

  /* ---- Step titles ---- */
  const STEP_META: Record<number, { title: string; description: string }> = {
    1: { title: 'Modo de Operacao', description: 'Como voce vai usar o Ordinum?' },
    2: { title: 'Criar conta', description: 'Configure seu acesso inicial' },
    3: { title: 'Primeira Empresa', description: 'Cadastre o seu negocio principal' },
    4: { title: 'Prolabore Base', description: 'Quanto voce retira da empresa mensalmente?' },
    5: { title: 'Tudo pronto!', description: 'Seu workspace esta configurado.' },
  };

  return (
    <AuthShell
      title={STEP_META[step].title}
      description={STEP_META[step].description}
    >
      <StepDots step={step} total={5} />

      {/* ---- STEP 1: Modo ---- */}
      {step === 1 && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2.5">
            <ModeCard
              selected={modo === 'casal'}
              onClick={() => setModo('casal')}
              icon={Users}
              title="Casal empreendedor"
              description="Separar dinheiro de casa e empresa juntos."
            />
            <ModeCard
              selected={modo === 'solo'}
              onClick={() => setModo('solo')}
              icon={User}
              title="Empreendedor solo"
              description="Organizar financas pessoais e negocios sozinho."
            />
            <ModeCard
              selected={modo === 'socios'}
              onClick={() => setModo('socios')}
              icon={Handshake}
              title="Socios de negocio"
              description="Gestao empresarial sem misturar contas pessoais."
            />
          </div>
          <Button variant="primary" size="md" className="w-full mt-1" onClick={() => setStep(2)}>
            Continuar
          </Button>
          <p className="text-center text-[13px] text-text-faint">
            Ja tem uma conta?{' '}
            <Link href="/login" className="font-semibold text-brand-300 hover:text-brand-400 transition-colors">
              Entrar
            </Link>
          </p>
        </div>
      )}

      {/* ---- STEP 2: Criar conta ---- */}
      {step === 2 && (
        <form onSubmit={handleCreateWorkspace} className="flex flex-col gap-4">
          {error && (
            <div className="rounded-[10px] border border-error/25 bg-error/8 px-4 py-3 text-[13px] text-error">
              {error}
            </div>
          )}

          <AuthField
            label="Nome do Workspace"
            placeholder="Ex: Familia Silva"
            value={nomeWorkspace}
            onChange={(e) => setNomeWorkspace(e.target.value)}
            required
          />

          {modo !== 'solo' && (
            <AuthField
              label="Convidar Parceiro (Opcional)"
              type="email"
              placeholder="email@parceiro.com"
              value={emailConvite}
              onChange={(e) => setEmailConvite(e.target.value)}
              hint="Eles receberao um convite por email."
            />
          )}

          <div className="border-t border-white/6 pt-4 flex flex-col gap-4">
            <AuthField
              label="Seu Email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
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
          </div>

          <div className="flex gap-2 mt-1">
            <Button type="button" variant="outline" size="md" className="w-1/3" onClick={() => setStep(1)} disabled={loading}>
              Voltar
            </Button>
            <Button type="submit" variant="primary" size="md" className="w-2/3" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Conta'}
            </Button>
          </div>
        </form>
      )}

      {/* ---- STEP 3: Empresa ---- */}
      {step === 3 && (
        <form onSubmit={handleCreateEmpresa} className="flex flex-col gap-4">
          {error && (
            <div className="rounded-[10px] border border-error/25 bg-error/8 px-4 py-3 text-[13px] text-error">
              {error}
            </div>
          )}

          <AuthField
            label="Nome da Empresa"
            placeholder="Ex: Consultoria Silva"
            value={nomeEmpresa}
            onChange={(e) => setNomeEmpresa(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-text-muted">Tipo</label>
            <Select
              value={tipoEmpresa}
              onChange={(e) => setTipoEmpresa(e.target.value as TipoEmpresa)}
              required
              options={[
                { label: 'Servicos', value: 'servicos' },
                { label: 'Produto Fisico', value: 'produto' },
                { label: 'Tecnologia / SaaS', value: 'tech' },
                { label: 'Comercio', value: 'comercio' },
                { label: 'Outro', value: 'outro' },
              ]}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-text-muted">Cor de Identificacao</label>
            <div className="flex items-center gap-2">
              {COLORS.map((cor) => (
                <button
                  type="button"
                  key={cor}
                  onClick={() => setCorEmpresa(cor)}
                  className={cn(
                    'w-8 h-8 rounded-full border-2 transition-all',
                    corEmpresa === cor ? 'border-white scale-110' : 'border-transparent opacity-70 hover:opacity-100',
                  )}
                  style={{ backgroundColor: cor }}
                />
              ))}
            </div>
          </div>

          <Button type="submit" variant="primary" size="md" className="w-full mt-1" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Empresa'}
          </Button>
        </form>
      )}

      {/* ---- STEP 4: Prolabore ---- */}
      {step === 4 && (
        <form onSubmit={handleDefineProlabore} className="flex flex-col gap-4">
          <div className="rounded-[12px] border border-brand-400/15 bg-brand-400/6 px-4 py-3 text-[13px] text-text-muted">
            Defina um valor estimado para o seu ganho mensal da empresa.
            O Ordinum conecta automaticamente a retirada da sua empresa com as suas receitas pessoais.
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-text-muted">Valor do Prolabore Mensal</label>
            <InputMoeda value={prolabore} onChange={setProlabore} />
          </div>

          <div className="flex gap-2 mt-1">
            <Button type="button" variant="outline" size="md" className="w-1/3" onClick={handleSkipProlabore}>
              Pular
            </Button>
            <Button type="submit" variant="primary" size="md" className="w-2/3" disabled={loading}>
              Definir Prolabore
            </Button>
          </div>
        </form>
      )}

      {/* ---- STEP 5: Sucesso ---- */}
      {step === 5 && (
        <div className="flex flex-col items-center gap-6 text-center">
          <div
            className="w-16 h-16 rounded-[20px] flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(52,211,153,.20), rgba(52,211,153,.06))' }}
          >
            <CheckCircle2 className="w-8 h-8 text-success" strokeWidth={1.8} />
          </div>

          <div className="w-full rounded-[14px] border border-white/7 bg-surface-2 p-5 text-left">
            <h4 className="text-[11px] font-bold tracking-[.1em] text-text-faint uppercase mb-3">
              Seus Primeiros Passos:
            </h4>
            <ul className="flex flex-col gap-2.5">
              {[
                'Registrar sua primeira despesa pessoal',
                'Criar um projeto',
                ...(modo !== 'solo' ? ['Fazer o primeiro alinhamento'] : []),
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-[13px] text-text-muted">
                  <div className="w-4 h-4 rounded-full border border-white/20 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <Button variant="primary" size="md" className="w-full" onClick={finishOnboarding}>
            Ir para o Dashboard
          </Button>
        </div>
      )}
    </AuthShell>
  );
}
