'use client';

import { useEmpresaStore } from '@/stores/empresaStore';
import { calcularDRE, saudeEmpresa } from '@/lib/utils/calculators';
import { formatarMoeda, formatarPercentual } from '@/lib/utils/formatters';
import { Semaforo } from '@/components/ui/semaforo';
import { Card, CardContent } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';

interface IndicadoresEmpresaProps {
  empresaId: string;
}

export function IndicadoresEmpresa({ empresaId }: IndicadoresEmpresaProps) {
  const { empresas, receitas, despesas, prolabores } = useEmpresaStore();

  const empresa = empresas.find(e => e.id === empresaId);
  
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

  const percentualMeta = empresa?.meta_faturamento && empresa.meta_faturamento > 0 
    ? (receitaBruta / empresa.meta_faturamento) * 100 
    : 100; // se não tem meta, não prejudica saude

  const corSaude = saudeEmpresa(dre.resultadoLiquido, dre.margemLiquida, percentualMeta);

  return (
    <div className="grid sm:grid-cols-3 gap-4 mb-8">
      <Card>
        <CardContent className="p-6">
          <p className="text-sm font-medium text-neutral-500 mb-1">Faturamento Mês</p>
          <h3 className="text-2xl font-bold text-neutral-900 mb-2">{formatarMoeda(receitaBruta)}</h3>
          {empresa?.meta_faturamento && (
            <>
              <ProgressBar progresso={percentualMeta} cor="bg-emerald-500" />
              <p className="text-xs text-neutral-500 mt-1 text-right">{formatarPercentual(percentualMeta)} da meta</p>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <p className="text-sm font-medium text-neutral-500 mb-1">Margem Líquida</p>
          <h3 className={`text-2xl font-bold ${dre.margemLiquida >= 20 ? 'text-emerald-600' : 'text-amber-600'}`}>
            {formatarPercentual(dre.margemLiquida)}
          </h3>
          <p className="text-xs text-neutral-500 mt-1">Ideal: {'>'} 20%</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6 flex flex-col justify-center h-full">
          <p className="text-sm font-medium text-neutral-500 mb-1">Resultado Líquido</p>
          <div className="flex items-center justify-between">
            <h3 className={`text-2xl font-bold ${dre.resultadoLiquido >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {formatarMoeda(dre.resultadoLiquido)}
            </h3>
            <Semaforo cor={corSaude} texto={corSaude === 'verde' ? 'Saudável' : corSaude === 'amarelo' ? 'Atenção' : 'Crítico'} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
