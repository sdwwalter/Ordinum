import { createClient } from '@/lib/supabase/client';

export async function gerarRecorrenciasDoMes(
  workspace_id: string
): Promise<number> {
  const hoje = new Date();
  if (hoje.getDate() !== 1) return 0; // só roda no dia 1

  const mesAtual = hoje.toISOString().slice(0, 7); // 'YYYY-MM'

  const supabase = createClient();
  const { data, error } = await supabase.rpc('gerar_recorrencias', {
    p_workspace_id: workspace_id,
    p_mes_atual: mesAtual,
  });

  if (error) {
    console.error('Erro ao gerar recorrências:', error);
    return 0;
  }
  
  return (data as number) || 0;
}
