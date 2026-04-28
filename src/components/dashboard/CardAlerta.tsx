'use client';

import { Alerta } from '@/stores/dashboardStore';
import Link from 'next/link';
import { AlertTriangle, AlertCircle, Info, ChevronRight } from 'lucide-react';

interface CardAlertaProps {
  alerta: Alerta;
}

export function CardAlerta({ alerta }: CardAlertaProps) {
  const isRed = alerta.nivel === 'vermelho';
  const isYellow = alerta.nivel === 'amarelo';
  const isBlue = alerta.nivel === 'azul';

  const bg = isRed ? 'bg-red-50 border-red-200' : isYellow ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200';
  const textTitle = isRed ? 'text-red-900' : isYellow ? 'text-amber-900' : 'text-blue-900';
  const textDesc = isRed ? 'text-red-700' : isYellow ? 'text-amber-700' : 'text-blue-700';
  const Icon = isRed ? AlertCircle : isYellow ? AlertTriangle : Info;
  const iconColor = isRed ? 'text-red-600' : isYellow ? 'text-amber-600' : 'text-blue-600';

  return (
    <Link href={alerta.link} className={`block border rounded-xl p-4 transition-all hover:shadow-md ${bg}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
          <div>
            <h4 className={`font-semibold text-sm ${textTitle}`}>{alerta.titulo}</h4>
            <p className={`text-sm mt-1 ${textDesc}`}>{alerta.descricao}</p>
          </div>
        </div>
        <ChevronRight className={`w-5 h-5 shrink-0 ${iconColor} opacity-50`} />
      </div>
    </Link>
  );
}
