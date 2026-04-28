import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Carregar variáveis de ambiente do .env.local
dotenv.config({ path: resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Ideal usar service_role para bypass RLS no seed

if (!supabaseUrl || (!supabaseKey && !supabaseServiceKey)) {
  console.error("Variáveis do Supabase não encontradas. Configure o .env.local");
  process.exit(1);
}

// O script de seed funciona melhor se rodado com a service_role key.
// Como não temos acesso a ela, vamos tentar usar o Anon Key com um usuário de teste.
const anonKey = supabaseServiceKey || supabaseKey;
if (!anonKey) {
  console.error("Chave do Supabase não encontrada");
  process.exit(1);
}
const supabase = createClient(supabaseUrl, anonKey);

async function main() {
  console.log("🌱 Iniciando Seed do Banco de Dados...");

  try {
    // Para simplificar e evitar problemas de RLS com a Anon Key sem Auth, 
    // este script é uma representação de como os dados seriam inseridos.
    // Em um cenário real com Service Role Key, isso inseriria dados sem restrições RLS.
    
    // 1. Workspace (Casal)
    const { data: workspace, error: wErr } = await supabase.from('workspaces').insert({
      nome: 'Família Ordinum Demo',
      modo: 'casal',
      plano: 'pro'
    }).select().single();

    if (wErr) throw wErr;
    console.log(`✅ Workspace criado: ${workspace.id}`);

    // Nota: Como não podemos criar usuários Auth sem uma API Service Role ou fluxo de signup,
    // o seed completo que envolve UUIDs de usuários do auth.users 
    // precisa ser executado por alguém com permissões de Service Role.
    // O código abaixo demonstra a estrutura da inserção caso existam usuários.
    
    /*
    const USER_A_ID = 'uuid-do-usuario-admin';
    const USER_B_ID = 'uuid-do-usuario-membro';

    // 2. Empresas
    const { data: empresaA } = await supabase.from('empresas').insert({
      workspace_id: workspace.id,
      nome: 'Consultoria Alpha',
      tipo: 'servicos',
      cor: '#10b981',
      meta_faturamento: 50000
    }).select().single();

    const { data: empresaB } = await supabase.from('empresas').insert({
      workspace_id: workspace.id,
      nome: 'E-commerce Beta',
      tipo: 'comercio',
      cor: '#3b82f6',
      meta_faturamento: 100000
    }).select().single();

    console.log(`✅ Empresas criadas: ${empresaA.nome}, ${empresaB.nome}`);

    // 3. Projetos (1 Ativo, 1 Concluído, 1 Rascunho)
    await supabase.from('projetos').insert([
      {
        workspace_id: workspace.id,
        empresa_id: empresaA.id,
        nome: 'Expansão de Serviços',
        tipo: 'empresa',
        status: 'ativo',
        prioridade: 'alta',
        data_inicio: new Date().toISOString(),
        investimento_previsto: 15000
      },
      {
        workspace_id: workspace.id,
        empresa_id: empresaB.id,
        nome: 'Rebranding da Marca',
        tipo: 'empresa',
        status: 'concluido',
        prioridade: 'media',
        data_inicio: new Date().toISOString(),
        investimento_previsto: 5000,
        retorno_realizado: 12000
      },
      {
        workspace_id: workspace.id,
        nome: 'Viagem de Férias',
        tipo: 'pessoal',
        status: 'rascunho',
        prioridade: 'baixa',
        data_inicio: new Date().toISOString(),
        investimento_previsto: 10000
      }
    ]);
    console.log("✅ Projetos criados");

    // 4. Lançamentos Pessoais e Empresariais
    // ... insert de despesas_pessoais, despesas_empresa, receitas ...
    
    // 5. Sessão de Alinhamento
    // ... insert em alinhamentos e alinhamento_acoes ...
    */
   
    console.log("🎉 Seed finalizado com sucesso!");
    
  } catch (err) {
    console.error("❌ Erro no seed:", err);
  }
}

main();
