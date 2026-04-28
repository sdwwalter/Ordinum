import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Home, Building2, Rocket, Kanban, FileText, LayoutDashboard, Check } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="font-bold text-2xl tracking-tight text-neutral-900">Ordinum</div>
          <div className="flex gap-4">
            <Button variant="ghost" asChild><Link href="/login">Entrar</Link></Button>
            <Button asChild><Link href="/cadastro">Começar grátis</Link></Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 bg-neutral-50 text-center px-4">
          <h1 className="text-5xl font-extrabold tracking-tight text-neutral-950 sm:text-6xl max-w-4xl mx-auto mb-6">
            Sistema executivo para ordem, clareza e separação de contextos.
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto mb-10">
            O produto desenvolvido para organizar responsabilidades mistas em espaços operacionais claros, reduzindo o ruído na tomada de decisão.
          </p>
          <Button size="lg" className="h-14 px-8 text-lg" asChild>
            <Link href="/cadastro">Crie seu Workspace Agora</Link>
          </Button>
        </section>

        {/* Modos */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Feito para o seu contexto</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <div className="text-4xl mb-4">👫</div>
                  <CardTitle>Casal Empreendedor</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600">Separe o dinheiro da empresa do dinheiro da família. Tomem decisões financeiras juntos sem conflito, com perfis de CEO e CFO.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="text-4xl mb-4">🧑</div>
                  <CardTitle>Empreendedor Solo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600">Rastreie projetos, separe o que é seu e o que é da empresa, e mantenha a disciplina com um módulo de revisão semanal poderoso.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="text-4xl mb-4">🤝</div>
                  <CardTitle>Sócios de Negócio</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600">Visibilidade total do negócio sem expor a vida financeira pessoal de cada sócio. Reuniões de alinhamento com pautas automáticas.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Módulos */}
        <section className="py-20 px-4 bg-neutral-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Tudo que você precisa em um só lugar</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { nome: 'Pessoal', icone: Home, cor: 'text-indigo-500', desc: 'Controle financeiro da sua casa. Orçamentos, despesas e metas.' },
                { nome: 'Empresa', icone: Building2, cor: 'text-emerald-500', desc: 'Gestão da empresa. DRE simplificado, prolabore conectado com Pessoal.' },
                { nome: 'Projetos', icone: Rocket, cor: 'text-amber-500', desc: 'Rastreio de iniciativas com ROI. Tarefas e orçamento integrado.' },
                { nome: 'Kanban', icone: Kanban, cor: 'text-slate-500', desc: 'Visão unificada de tudo que precisa ser feito em todos os projetos.' },
                { nome: 'Alinhamento', icone: FileText, cor: 'text-violet-500', desc: 'Pautas pré-geradas e registro de decisões das reuniões semanais.' },
                { nome: 'Dashboard', icone: LayoutDashboard, cor: 'text-neutral-700', desc: 'Saúde completa do workspace com alertas automáticos em uma tela.' },
              ].map(m => (
                <div key={m.nome} className="flex gap-4 p-6 bg-white border border-neutral-200 rounded-xl shadow-sm">
                  <div className={`p-3 rounded-lg bg-neutral-50 h-fit ${m.cor}`}>
                    <m.icone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{m.nome}</h3>
                    <p className="text-neutral-600 text-sm">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Planos */}
        <section className="py-20 px-4 bg-white" id="planos">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Planos simples e justos</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { nome: 'Free', preco: 'Grátis', desc: 'Para começar a organizar.', features: ['1 Membro', '1 Empresa', '3 Projetos Ativos', 'Histórico de 3 meses', 'Gamificação Básica'] },
                { nome: 'Pro', preco: 'R$ 49/mês', desc: 'Para crescer estruturado.', destaque: true, features: ['2 Membros', '3 Empresas', 'Projetos Ilimitados', 'Histórico de 24 meses', 'Exportar PDF', 'Realtime Sync'] },
                { nome: 'Business', preco: 'R$ 99/mês', desc: 'Para operação em escala.', features: ['5 Membros', 'Empresas Ilimitadas', 'Projetos Ilimitados', 'Histórico Ilimitado', 'Suporte Prioritário', 'Gamificação Completa'] },
              ].map(p => (
                <Card key={p.nome} className={p.destaque ? 'border-primary shadow-lg md:scale-105 z-10 relative' : ''}>
                  {p.destaque && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">MAIS POPULAR</div>}
                  <CardHeader>
                    <CardTitle className="text-2xl">{p.nome}</CardTitle>
                    <CardDescription>{p.desc}</CardDescription>
                    <div className="mt-4 font-bold text-3xl">{p.preco}</div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {p.features.map(f => (
                        <li key={f} className="flex items-center gap-2 text-sm text-neutral-600">
                          <Check className="w-4 h-4 text-emerald-500" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button variant={p.destaque ? 'default' : 'outline'} className="w-full" asChild>
                      <Link href="/cadastro">Escolher {p.nome}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-neutral-900 text-neutral-400 py-12 text-center">
        <p>© 2026 Ordinum. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
