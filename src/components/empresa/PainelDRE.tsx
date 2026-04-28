'use client';

import { useEmpresaStore } from '@/stores/empresaStore';
import { calcularDRE } from '@/lib/utils/calculators';
import { formatarMoeda, formatarPercentual } from '@/lib/utils/formatters';

export function PainelDRE() {
  const { receitas, despesas, prolabores } = useEmpresaStore();

  const receitaBruta = receitas.reduce((acc, r) => acc + r.valor, 0);
  
  const impostos = despesas.filter(d => d.categoria === 'impostos').reduce((acc, d) => acc + d.valor, 0);
  const custosDiretos = despesas.filter(d => d.categoria === 'custos_diretos').reduce((acc, d) => acc + d.valor, 0);
  const despesasOperacionais = despesas.filter(d => d.categoria === 'operacional').reduce((acc, d) => acc + d.valor, 0);
  const prolaboreSum = prolabores.reduce((acc, p) => acc + p.valor, 0);

  const dre = calcularDRE({
    receitaBruta,
    impostos,
    custosDiretos,
    despesasOperacionais,
    prolabore: prolaboreSum
  });

  const Row = ({ label, value, isBold = false, indent = false }: { label: string, value: number, isBold?: boolean, indent?: boolean }) => (
    <div className={`flex justify-between py-3 border-b border-neutral-100 ${isBold ? 'font-bold text-neutral-900' : 'text-neutral-600'} ${indent ? 'pl-4 text-sm' : ''}`}>
      <span>{label}</span>
      <span>{formatarMoeda(value)}</span>
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
      <div className="p-4 bg-neutral-50 border-b border-neutral-200">
        <h3 className="font-bold text-lg text-neutral-900">DRE Mensal</h3>
        <p className="text-sm text-neutral-500">Demonstração Simplificada</p>
      </div>
      <div className="p-6">
        <Row label="RECEITA BRUTA" value={receitaBruta} isBold />
        <Row label="(-) Impostos" value={impostos} indent />
        <Row label="= RECEITA LÍQUIDA" value={dre.receitaLiquida} isBold />
        <Row label="(-) Custos Diretos" value={custosDiretos} indent />
        <Row label="= LUCRO BRUTO" value={dre.lucroBruto} isBold />
        <Row label="(-) Despesas Operacionais" value={despesasOperacionais} indent />
        <Row label="= EBITDA" value={dre.ebitda} isBold />
        <Row label="(-) Prolabore" value={prolaboreSum} indent />
        
        <div className="mt-4 pt-4 border-t-2 border-neutral-200 flex justify-between items-end">
          <div>
            <h4 className="font-bold text-lg text-neutral-900">RESULTADO LÍQUIDO</h4>
            <p className="text-sm text-neutral-500">Margem: {formatarPercentual(dre.margemLiquida)}</p>
          </div>
          <span className={`text-2xl font-bold ${dre.resultadoLiquido >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {formatarMoeda(dre.resultadoLiquido)}
          </span>
        </div>
      </div>
    </div>
  );
}
