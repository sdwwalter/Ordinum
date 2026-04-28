'use client';

import { PainelDRE } from '@/components/empresa/PainelDRE';

export default function EmpresaDREPage() {
  // O layout já lida com o carregamento dos dados da store usando useParams no useEffect, 
  // e os dados ficam disponíveis no contexto global Zustand.
  
  return (
    <div className="max-w-3xl">
      <PainelDRE />
    </div>
  );
}
