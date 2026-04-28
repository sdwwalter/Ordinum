export function calcularROI(investimentoRealizado: number, retornoRealizado: number): number {
  if (investimentoRealizado <= 0) return 0;
  return ((retornoRealizado - investimentoRealizado) / investimentoRealizado) * 100;
}

export type DREParams = {
  receitaBruta: number;
  impostos: number;
  custosDiretos: number;
  despesasOperacionais: number;
  prolabore: number;
};

export function calcularDRE(params: DREParams) {
  const receitaLiquida = params.receitaBruta - params.impostos;
  const lucroBruto = receitaLiquida - params.custosDiretos;
  const ebitda = lucroBruto - params.despesasOperacionais;
  const resultadoLiquido = ebitda - params.prolabore;
  
  const margemLiquida = params.receitaBruta > 0 ? (resultadoLiquido / params.receitaBruta) * 100 : 0;

  return {
    receitaLiquida,
    lucroBruto,
    ebitda,
    resultadoLiquido,
    margemLiquida
  };
}

export function calcularProgresso(atual: number, meta: number): number {
  if (meta <= 0) return 0;
  const percentual = (atual / meta) * 100;
  return Math.min(percentual, 100); // Caps at 100%
}

export type CorSaude = 'verde' | 'amarelo' | 'vermelho';

export function saudePessoal(saldo: number, categoriasAcima: number, percentualReserva: number): CorSaude {
  if (saldo < 0) return 'vermelho';
  if (categoriasAcima >= 2 || percentualReserva < 10) return 'amarelo';
  return 'verde';
}

export function saudeEmpresa(resultadoLiquido: number, margemLiquida: number, percentualMeta: number): CorSaude {
  if (resultadoLiquido < 0) return 'vermelho';
  if (margemLiquida < 20 || percentualMeta < 50) return 'amarelo';
  return 'verde';
}
