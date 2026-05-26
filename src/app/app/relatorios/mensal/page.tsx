'use client';

import { useState } from 'react';
import { FileText, Download, Loader2, Eye } from 'lucide-react';

export default function RelatorioMensalPage() {
  const hoje = new Date();
  const mesAtual = hoje.toISOString().slice(0, 7);
  const [mes] = useState(mesAtual);
  const [downloading, setDownloading] = useState(false);
  const [previewing, setPreviewing] = useState(false);

  const apiUrl = `/api/relatorios/mensal?mes=${mes}`;

  // Formatar mês por extenso (client-side)
  const [ano, mesNum] = mes.split('-');
  const date = new Date(parseInt(ano), parseInt(mesNum) - 1);
  const mesExtenso = date.toLocaleDateString('pt-BR', { month: 'long' });
  const mesFormatado = `${mesExtenso.charAt(0).toUpperCase() + mesExtenso.slice(1)} ${ano}`;

  async function handleDownload() {
    setDownloading(true);
    try {
      const res = await fetch(apiUrl);
      if (!res.ok) {
        const erro = await res.json().catch(() => ({ erro: 'Erro ao gerar PDF' }));
        throw new Error(erro.erro || 'Erro ao gerar PDF');
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio_${mes}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      // Tratamento de erro — poderia usar toast/sonner
      console.error('Erro ao baixar PDF:', err);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
      <div className="shrink-0 flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-2">
            <FileText className="w-8 h-8 text-neutral-600" />
            Relatório de Fechamento
          </h1>
          <p className="text-neutral-500 mt-1">Geração de PDF com os indicadores do mês {mesFormatado}.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setPreviewing(true)}
            className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-5 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
          >
            <Eye className="w-4 h-4" /> Visualizar
          </button>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50"
          >
            {downloading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Gerando...</>
            ) : (
              <><Download className="w-4 h-4" /> Baixar PDF</>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 bg-neutral-200 rounded-xl overflow-hidden border border-neutral-300 shadow-inner">
        {previewing ? (
          <iframe
            src={apiUrl}
            className="w-full h-full border-none"
            title="Preview do relatório PDF"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400">
            <div className="text-center">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Clique em &quot;Visualizar&quot; para pré-visualizar o PDF</p>
              <p className="text-xs mt-1">ou &quot;Baixar PDF&quot; para download direto</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
