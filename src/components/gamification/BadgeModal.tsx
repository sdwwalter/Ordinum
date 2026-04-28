'use client';

import { useGamificationStore } from '@/stores/gamificationStore';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

export function BadgeModal() {
  const { novoBadge, fecharModalBadge } = useGamificationStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (novoBadge) {
      setIsVisible(true);
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.6 }
      });
      
      const timer = setTimeout(() => {
        fecharModalBadge();
        setIsVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [novoBadge, fecharModalBadge]);

  if (!novoBadge || !isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 relative flex flex-col items-center text-center shadow-2xl animate-in zoom-in-95 duration-500">
        <button 
          onClick={fecharModalBadge}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-200 to-amber-500 flex items-center justify-center text-5xl shadow-inner mb-6 animate-bounce">
          {novoBadge.icone}
        </div>

        <h3 className="text-sm font-bold tracking-widest text-amber-600 uppercase mb-1">
          Nova Conquista
        </h3>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">
          {novoBadge.nome}
        </h2>
        <p className="text-neutral-500">
          {novoBadge.descricao}
        </p>
      </div>
    </div>
  );
}
