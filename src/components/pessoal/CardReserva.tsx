'use client';

import { ReservaMeta } from '@/types/pessoal';
import { formatarMoeda, formatarData } from '@/lib/utils/formatters';
import { ProgressBar } from '@/components/ui/progress-bar';

interface CardReservaProps {
  reserva: ReservaMeta;
}

export function CardReserva({ reserva }: CardReservaProps) {
  const percentual = reserva.meta > 0 ? (reserva.saldo_atual / reserva.meta) * 100 : 0;

  return (
    <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg text-neutral-900">{reserva.nome}</h3>
          {reserva.prazo && (
            <p className="text-sm text-neutral-500 mt-1">Prazo: {formatarData(reserva.prazo)}</p>
          )}
        </div>
        <div className={`px-2 py-1 text-xs font-semibold rounded-full ${reserva.ativo ? 'bg-indigo-100 text-indigo-700' : 'bg-neutral-100 text-neutral-600'}`}>
          {reserva.ativo ? 'Ativa' : 'Pausada'}
        </div>
      </div>

      <div className="mb-2 flex justify-between items-end">
        <div>
          <p className="text-xs text-neutral-500 uppercase font-semibold">Guardado</p>
          <p className="text-xl font-bold text-indigo-600">{formatarMoeda(reserva.saldo_atual)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-neutral-500 uppercase font-semibold">Meta</p>
          <p className="text-sm font-medium text-neutral-900">{formatarMoeda(reserva.meta)}</p>
        </div>
      </div>

      <ProgressBar progresso={percentual} cor="bg-indigo-500" />
    </div>
  );
}
