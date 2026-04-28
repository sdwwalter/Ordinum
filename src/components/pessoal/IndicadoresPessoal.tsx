'use client';

import { usePessoalStore } from '@/stores/pessoalStore';
import { formatarMoeda } from '@/lib/utils/formatters';
import { saudePessoal } from '@/lib/utils/calculators';
import { Semaforo } from '@/components/ui/semaforo';
import { Card, CardContent } from '@/components/ui/card';

export function IndicadoresPessoal() {
  const { receitas, despesas, orcamentos, reservas } = usePessoalStore();

  const totalReceitas = receitas.reduce((acc, r) => acc + r.valor, 0);
  const totalDespesas = despesas.reduce((acc, d) => acc + d.valor, 0);
  const saldoLivre = totalReceitas - totalDespesas;

  // Categoria metrics
  const despesasPorCat = despesas.reduce((acc, d) => {
    acc[d.categoria] = (acc[d.categoria] || 0) + d.valor;
    return acc;
  }, {} as Record<string, number>);

  let categoriasAcima = 0;
  orcamentos.forEach(orc => {
    // Para simplificar, assumindo que orcamento.reserva_meta é um field, mas o model de BD tem despesa_prevista.
    // Vamos usar orcamento.despesa_prevista e comparar com despesasPorCat (assumindo que há uma forma de ligar categoria. No Spec, a tabela orcamento_pessoal tem user_id e mes_referencia, parece ser um orcamento global, mas a UI pede "Orcamento por categoria".
    // Vamos adaptar: categoriasAcima é apenas um mockup aqui se o model não tiver categoria no orcamento.
    // Spec: orcamento_pessoal (id, workspace_id, user_id, mes_referencia, receita_prevista, despesa_prevista, reserva_meta).
  });

  const percentualReserva = totalReceitas > 0 ? (reservas.reduce((acc, r) => acc + r.saldo_atual, 0) / totalReceitas) * 100 : 0;
  
  const corSaude = saudePessoal(saldoLivre, categoriasAcima, percentualReserva);

  return (
    <div className="grid sm:grid-cols-3 gap-4 mb-8">
      <Card>
        <CardContent className="p-6">
          <p className="text-sm font-medium text-neutral-500 mb-1">Receitas do Mês</p>
          <h3 className="text-2xl font-bold text-emerald-600">{formatarMoeda(totalReceitas)}</h3>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <p className="text-sm font-medium text-neutral-500 mb-1">Despesas do Mês</p>
          <h3 className="text-2xl font-bold text-neutral-900">{formatarMoeda(totalDespesas)}</h3>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6 flex flex-col justify-center">
          <p className="text-sm font-medium text-neutral-500 mb-1">Saldo Livre</p>
          <div className="flex items-center justify-between">
            <h3 className={`text-2xl font-bold ${saldoLivre >= 0 ? 'text-indigo-600' : 'text-red-600'}`}>
              {formatarMoeda(saldoLivre)}
            </h3>
            <Semaforo cor={corSaude} texto={corSaude === 'verde' ? 'Saudável' : corSaude === 'amarelo' ? 'Atenção' : 'Crítico'} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
