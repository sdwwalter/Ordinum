import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Check } from 'lucide-react';

export default function PrecosPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-neutral-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-2xl tracking-tight text-neutral-900">Ordinum</Link>
          <div className="flex gap-4">
            <Button variant="ghost" asChild><Link href="/login">Entrar</Link></Button>
            <Button asChild><Link href="/cadastro">Começar grátis</Link></Button>
          </div>
        </div>
      </header>

      <main className="flex-1 py-20 px-4 bg-neutral-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold tracking-tight text-neutral-950 mb-4">Escolha o plano ideal para você</h1>
            <p className="text-lg text-neutral-600">Simples, transparente e sem surpresas.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { nome: 'Free', preco: 'Grátis', desc: 'Para começar a organizar.', features: ['1 Membro', '1 Empresa', '3 Projetos Ativos', 'Histórico de 3 meses', 'Gamificação Básica'] },
              { nome: 'Pro', preco: 'R$ 49/mês', desc: 'Para crescer estruturado.', destaque: true, features: ['2 Membros', '3 Empresas', 'Projetos Ilimitados', 'Histórico de 24 meses', 'Exportar PDF', 'Realtime Sync'] },
              { nome: 'Business', preco: 'R$ 99/mês', desc: 'Para operação em escala.', features: ['5 Membros', 'Empresas Ilimitadas', 'Projetos Ilimitados', 'Histórico Ilimitado', 'Suporte Prioritário', 'Gamificação Completa'] },
            ].map(p => (
              <Card key={p.nome} className={p.destaque ? 'border-primary shadow-lg md:scale-105 z-10 relative bg-white' : 'bg-white'}>
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
      </main>

      <footer className="bg-neutral-900 text-neutral-400 py-12 text-center">
        <p>© 2026 Ordinum. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
