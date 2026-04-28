import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
}

export function formatarData(dataIso: string): string {
  if (!dataIso) return '';
  const data = dataIso.includes('T') ? parseISO(dataIso) : parseISO(`${dataIso}T12:00:00`);
  return format(data, 'dd/MM/yyyy', { locale: ptBR });
}

export function formatarMesRef(mesRef: string): string {
  // mesRef format: YYYY-MM
  if (!mesRef || mesRef.length !== 7) return mesRef;
  const [ano, mes] = mesRef.split('-');
  const date = new Date(parseInt(ano), parseInt(mes) - 1);
  const mesExtenso = format(date, 'MMMM', { locale: ptBR });
  return `${mesExtenso.charAt(0).toUpperCase() + mesExtenso.slice(1)} ${ano}`;
}

export function formatarPercentual(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(valor / 100);
}
