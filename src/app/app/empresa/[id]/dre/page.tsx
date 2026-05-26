'use client';

import { PainelDRE } from '@/components/empresa/PainelDRE';

export default function EmpresaDREPage() {
  // O layout ja lida com o carregamento dos dados da store usando useParams no useEffect,
  // e os dados ficam disponiveis no contexto global Zustand.

  return (
    <div className="p-7 animate-fade-in-up">
      <div className="max-w-3xl">
        <PainelDRE />
      </div>
    </div>
  );
}
