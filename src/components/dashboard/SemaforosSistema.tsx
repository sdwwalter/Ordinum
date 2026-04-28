'use client';

import { NivelAlerta } from '@/stores/dashboardStore';
import { Briefcase, Building2, KanbanSquare, Users } from 'lucide-react';

interface SemaforosSistemaProps {
  semaforos: {
    pessoal: NivelAlerta;
    empresa: NivelAlerta;
    projetos: NivelAlerta;
    alinhamento: NivelAlerta;
  }
}

export function SemaforosSistema({ semaforos }: SemaforosSistemaProps) {
  const getCorStatus = (nivel: NivelAlerta) => {
    switch(nivel) {
      case 'vermelho': return 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]';
      case 'amarelo': return 'bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]';
      case 'azul': return 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]'; // azul no estado significa OK/Emerald na UI para os semáforos globais, a menos que especificado
    }
  };

  const getIconeCor = (nivel: NivelAlerta) => {
    switch(nivel) {
      case 'vermelho': return 'text-red-700 bg-red-100';
      case 'amarelo': return 'text-amber-700 bg-amber-100';
      case 'azul': return 'text-emerald-700 bg-emerald-100'; 
    }
  };

  const modulos = [
    { id: 'pessoal', label: 'Vida Pessoal', Icon: Briefcase, status: semaforos.pessoal },
    { id: 'empresa', label: 'Sua Empresa', Icon: Building2, status: semaforos.empresa },
    { id: 'projetos', label: 'Projetos', Icon: KanbanSquare, status: semaforos.projetos },
    { id: 'alinhamento', label: 'Alinhamento', Icon: Users, status: semaforos.alinhamento },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {modulos.map((mod) => (
        <div key={mod.id} className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${getIconeCor(mod.status)}`}>
              <mod.Icon className="w-5 h-5" />
            </div>
            <span className="font-semibold text-sm text-neutral-700">{mod.label}</span>
          </div>
          <div className={`w-3 h-3 rounded-full ${getCorStatus(mod.status)}`} />
        </div>
      ))}
    </div>
  );
}
