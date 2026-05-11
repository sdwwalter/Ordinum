"use client";
import { useState } from 'react';

type ClarificacaoStep = 'acionavel' | 'dois_minutos' | 'tipo_acao' | 'concluido';

export default function ClarificarModal({ item, onClose, onProcessed }: { item: any; onClose: () => void; onProcessed?: () => void }) {
  const [step, setStep] = useState<ClarificacaoStep>('acionavel');
  const [destino, setDestino] = useState<string>('');
  const [comentario, setComentario] = useState('');

  async function finish() {
    // Call server API to process according to selected destino
    await fetch('/api/gtd/processar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: item.id, destino, payload: { notas: comentario } }) });
    onProcessed?.();
    onClose();
  }

  return (
    <div className="p-4 bg-white border rounded-md max-w-xl">
      <h3 className="text-lg font-medium mb-2">Clarificar</h3>
      <div className="mb-3 text-sm text-gray-700">{item.conteudo}</div>

      {step === 'acionavel' && (
        <div className="space-y-2">
          <p>É acionável?</p>
          <div className="flex gap-2">
            <button onClick={() => setStep('dois_minutos')} className="px-3 py-1 bg-slate-700 text-white rounded">Sim</button>
            <button onClick={() => { setDestino('referencia'); setStep('concluido'); }} className="px-3 py-1 border rounded">Não — Referência</button>
            <button onClick={() => { setDestino('algum_dia'); setStep('concluido'); }} className="px-3 py-1 border rounded">Não — Algum Dia</button>
          </div>
        </div>
      )}

      {step === 'dois_minutos' && (
        <div className="space-y-2">
          <p>Leva menos de 2 minutos?</p>
          <div className="flex gap-2">
            <button onClick={() => { setDestino('feito'); setStep('concluido'); }} className="px-3 py-1 bg-slate-700 text-white rounded">Sim</button>
            <button onClick={() => setStep('tipo_acao')} className="px-3 py-1 border rounded">Não</button>
          </div>
        </div>
      )}

      {step === 'tipo_acao' && (
        <div className="space-y-2">
          <p>É só sua ou depende de mais passos?</p>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => { setDestino('acao_unica'); setStep('concluido'); }} className="px-3 py-1 border rounded">Ação única</button>
            <button onClick={() => { setDestino('projeto'); setStep('concluido'); }} className="px-3 py-1 border rounded">Projeto</button>
            <button onClick={() => { setDestino('aguardando'); setStep('concluido'); }} className="px-3 py-1 border rounded">Aguardando</button>
            <button onClick={() => { setDestino('referencia'); setStep('concluido'); }} className="px-3 py-1 border rounded">Referência</button>
          </div>
        </div>
      )}

      {step === 'concluido' && (
        <div className="space-y-2">
          <p className="text-sm">Destino: <strong>{destino}</strong></p>
          <textarea value={comentario} onChange={(e) => setComentario(e.target.value)} className="w-full border p-2 rounded" placeholder="Comentário opcional" />
          <div className="flex gap-2 justify-end">
            <button onClick={onClose} className="px-3 py-1 border rounded">Cancelar</button>
            <button onClick={finish} className="px-3 py-1 bg-slate-700 text-white rounded">Confirmar</button>
          </div>
        </div>
      )}
    </div>
  );
}
