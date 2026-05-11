import { createClient } from '@/lib/supabase/server';

export default async function ProjetosAtivosPage() {
  const supabase = await createClient();
  const { data: projetos } = await supabase.from('projetos').select('*').in('status', ['ativo','em_andamento']).order('created_at', { ascending: false });

  // for each project, check next action
  const projetosComNext = await Promise.all((projetos || []).map(async (p: any) => {
    const { data: next } = await supabase.from('tarefas_projeto').select('*').eq('projeto_id', p.id).eq('is_next_action', true).limit(1).single();
    return { projeto: p, nextAction: next || null };
  }));

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Projetos Ativos</h1>
      <ul className="space-y-3">
        {projetosComNext.map(({ projeto, nextAction }: any) => (
          <li key={projeto.id} className="p-3 bg-white border rounded flex justify-between items-center">
            <div>
              <div className="font-medium">{projeto.nome}</div>
              <div className="text-xs text-gray-500">{nextAction ? `Próxima: ${nextAction.titulo}` : 'Sem next action definida'}</div>
            </div>
            <div className="text-xs text-gray-400">{new Date(projeto.created_at).toLocaleDateString()}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}
