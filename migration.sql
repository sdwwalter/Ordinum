-- WORKSPACE (raiz de tudo)
CREATE TABLE workspaces (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome        TEXT NOT NULL,
  modo        TEXT CHECK (modo IN ('casal','solo','socios')) NOT NULL,
  plano       TEXT CHECK (plano IN ('free','pro','business')) DEFAULT 'free',
  criado_em   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE membros_workspace (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id       UUID REFERENCES auth.users(id),
  papel         TEXT CHECK (papel IN ('admin','membro')) DEFAULT 'membro',
  apelido       TEXT,
  ativo         BOOLEAN DEFAULT TRUE,
  UNIQUE(workspace_id, user_id)
);

-- PESSOAL
CREATE TABLE receitas_pessoais (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id       UUID REFERENCES auth.users(id),
  descricao     TEXT NOT NULL,
  valor         DECIMAL(12,2) NOT NULL,
  origem        TEXT NOT NULL,
  data          DATE NOT NULL,
  mes_referencia TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE despesas_pessoais (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id       UUID REFERENCES auth.users(id),
  descricao     TEXT NOT NULL,
  valor         DECIMAL(12,2) NOT NULL,
  categoria     TEXT NOT NULL,
  tipo          TEXT CHECK (tipo IN ('fixa','variavel','eventual')) NOT NULL,
  data          DATE NOT NULL,
  recorrente    BOOLEAN DEFAULT FALSE,
  mes_referencia TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE orcamento_pessoal (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES auth.users(id),
  mes_referencia  TEXT NOT NULL,
  receita_prevista DECIMAL(12,2) DEFAULT 0,
  despesa_prevista DECIMAL(12,2) DEFAULT 0,
  reserva_meta     DECIMAL(12,2) DEFAULT 0,
  UNIQUE(workspace_id, user_id, mes_referencia)
);

CREATE TABLE reservas_metas (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id       UUID REFERENCES auth.users(id),
  nome          TEXT NOT NULL,
  meta          DECIMAL(12,2) NOT NULL,
  saldo_atual   DECIMAL(12,2) DEFAULT 0,
  prazo         DATE,
  ativo         BOOLEAN DEFAULT TRUE
);

-- EMPRESA
CREATE TABLE empresas (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  nome          TEXT NOT NULL,
  tipo          TEXT NOT NULL,
  cnpj          TEXT,
  cor           TEXT DEFAULT '#10B981',
  meta_faturamento DECIMAL(12,2),
  ativo         BOOLEAN DEFAULT TRUE
);

CREATE TABLE receitas_empresa (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id    UUID REFERENCES empresas(id) ON DELETE CASCADE,
  descricao     TEXT NOT NULL,
  valor         DECIMAL(12,2) NOT NULL,
  categoria     TEXT NOT NULL,
  data          DATE NOT NULL,
  cliente       TEXT,
  projeto_id    UUID,                   -- FK adicionada após criar projetos
  mes_referencia TEXT NOT NULL,
  criado_por    UUID REFERENCES auth.users(id),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE despesas_empresa (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id    UUID REFERENCES empresas(id) ON DELETE CASCADE,
  descricao     TEXT NOT NULL,
  valor         DECIMAL(12,2) NOT NULL,
  categoria     TEXT NOT NULL,
  data          DATE NOT NULL,
  fornecedor    TEXT,
  projeto_id    UUID,
  recorrente    BOOLEAN DEFAULT FALSE,
  mes_referencia TEXT NOT NULL,
  criado_por    UUID REFERENCES auth.users(id),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE prolabores (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id        UUID REFERENCES empresas(id) ON DELETE CASCADE,
  destinatario_id   UUID REFERENCES auth.users(id),
  valor             DECIMAL(12,2) NOT NULL,
  mes_referencia    TEXT NOT NULL,
  pago              BOOLEAN DEFAULT FALSE,
  data_pagamento    DATE,
  receita_pessoal_id UUID REFERENCES receitas_pessoais(id)
);

-- PROJETOS
CREATE TABLE projetos (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id                UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  empresa_id                  UUID REFERENCES empresas(id),
  nome                        TEXT NOT NULL,
  descricao                   TEXT,
  tipo                        TEXT CHECK (tipo IN ('empresa','pessoal')) NOT NULL,
  status                      TEXT CHECK (status IN ('rascunho','ativo','pausado','concluido','cancelado')) DEFAULT 'rascunho',
  prioridade                  TEXT CHECK (prioridade IN ('alta','media','baixa')) DEFAULT 'media',
  responsavel_id              UUID REFERENCES auth.users(id),
  data_inicio                 DATE NOT NULL,
  data_prevista_conclusao     DATE,
  investimento_previsto       DECIMAL(12,2) DEFAULT 0,
  retorno_previsto            DECIMAL(12,2),
  retorno_realizado           DECIMAL(12,2),
  cor                         TEXT DEFAULT '#F59E0B',
  created_at                  TIMESTAMPTZ DEFAULT NOW()
);

-- FK dos lançamentos para projetos (adicionada após criar tabelas)
ALTER TABLE receitas_empresa ADD CONSTRAINT fk_receita_projeto
  FOREIGN KEY (projeto_id) REFERENCES projetos(id);
ALTER TABLE despesas_empresa ADD CONSTRAINT fk_despesa_projeto
  FOREIGN KEY (projeto_id) REFERENCES projetos(id);

CREATE TABLE tarefas_projeto (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  projeto_id      UUID REFERENCES projetos(id) ON DELETE CASCADE,
  titulo          TEXT NOT NULL,
  descricao       TEXT,
  responsavel_id  UUID REFERENCES auth.users(id),
  status          TEXT CHECK (status IN ('pendente','em_andamento','concluida','bloqueada')) DEFAULT 'pendente',
  data_prevista   DATE,
  data_conclusao  DATE,
  posicao         INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ALINHAMENTO
CREATE TABLE alinhamentos (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id      UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  data              DATE NOT NULL,
  tipo              TEXT CHECK (tipo IN ('semanal','revisao_solo')) NOT NULL,
  status            TEXT CHECK (status IN ('agendado','realizado','cancelado')) DEFAULT 'agendado',
  pauta             JSONB DEFAULT '[]',
  decisoes          JSONB DEFAULT '[]',
  notas_livres      TEXT,
  duracao_minutos   INTEGER,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE alinhamento_acoes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alinhamento_id  UUID REFERENCES alinhamentos(id) ON DELETE CASCADE,
  descricao       TEXT NOT NULL,
  responsavel_id  UUID REFERENCES auth.users(id),
  prazo           DATE,
  status          TEXT CHECK (status IN ('pendente','em_andamento','bloqueado','concluido')) DEFAULT 'pendente',
  posicao         INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- GAMIFICAÇÃO
CREATE TABLE gamification_eventos (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id       UUID REFERENCES auth.users(id),
  tipo          TEXT NOT NULL,
  pontos        INTEGER NOT NULL,
  descricao     TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE gamification_badges (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id       UUID REFERENCES auth.users(id),
  badge_id      TEXT NOT NULL,
  desbloqueado_em TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, user_id, badge_id)
);


-- RLS — Row-Level Security

-- Função auxiliar (usada em todas as policies)
CREATE OR REPLACE FUNCTION workspace_do_usuario()
RETURNS UUID AS $$
  SELECT workspace_id FROM membros_workspace
  WHERE user_id = auth.uid() AND ativo = TRUE
  LIMIT 1
$$ LANGUAGE sql SECURITY DEFINER;

-- Aplicar em todas as tabelas com workspace_id:
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE membros_workspace ENABLE ROW LEVEL SECURITY;
ALTER TABLE receitas_pessoais ENABLE ROW LEVEL SECURITY;
ALTER TABLE despesas_pessoais ENABLE ROW LEVEL SECURITY;
ALTER TABLE orcamento_pessoal ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservas_metas ENABLE ROW LEVEL SECURITY;
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE projetos ENABLE ROW LEVEL SECURITY;
ALTER TABLE alinhamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE gamification_eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE gamification_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workspace_proprio" ON workspaces USING (id = workspace_do_usuario());
CREATE POLICY "workspace_insert" ON workspaces FOR INSERT WITH CHECK (true);

CREATE POLICY "membros_proprio" ON membros_workspace USING (workspace_id = workspace_do_usuario());
CREATE POLICY "membros_insert" ON membros_workspace FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "empresas_proprio" ON empresas USING (workspace_id = workspace_do_usuario());
CREATE POLICY "projetos_proprio" ON projetos USING (workspace_id = workspace_do_usuario());
CREATE POLICY "alinhamentos_proprio" ON alinhamentos USING (workspace_id = workspace_do_usuario());
CREATE POLICY "gamification_eventos_proprio" ON gamification_eventos USING (workspace_id = workspace_do_usuario());
CREATE POLICY "gamification_badges_proprio" ON gamification_badges USING (workspace_id = workspace_do_usuario());

-- Tabelas filhas indiretas (que linkam com outras tabelas em vez de workspace_id direto)
ALTER TABLE receitas_empresa ENABLE ROW LEVEL SECURITY;
ALTER TABLE despesas_empresa ENABLE ROW LEVEL SECURITY;
ALTER TABLE prolabores ENABLE ROW LEVEL SECURITY;
ALTER TABLE tarefas_projeto ENABLE ROW LEVEL SECURITY;
ALTER TABLE alinhamento_acoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "receitas_empresa_proprio" ON receitas_empresa 
  USING (empresa_id IN (SELECT id FROM empresas WHERE workspace_id = workspace_do_usuario()));
CREATE POLICY "despesas_empresa_proprio" ON despesas_empresa 
  USING (empresa_id IN (SELECT id FROM empresas WHERE workspace_id = workspace_do_usuario()));
CREATE POLICY "prolabores_proprio" ON prolabores 
  USING (empresa_id IN (SELECT id FROM empresas WHERE workspace_id = workspace_do_usuario()));
CREATE POLICY "tarefas_projeto_proprio" ON tarefas_projeto 
  USING (projeto_id IN (SELECT id FROM projetos WHERE workspace_id = workspace_do_usuario()));
CREATE POLICY "alinhamento_acoes_proprio" ON alinhamento_acoes 
  USING (alinhamento_id IN (SELECT id FROM alinhamentos WHERE workspace_id = workspace_do_usuario()));

-- Tabelas com user_id (dados pessoais):
-- Membro vê apenas os próprios; admin vê todos do workspace
CREATE POLICY "pessoal_proprio" ON despesas_pessoais
  USING (
    user_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM membros_workspace
      WHERE user_id = auth.uid()
      AND workspace_id = despesas_pessoais.workspace_id
      AND papel = 'admin'
    )
  );

CREATE POLICY "receitas_pessoais_proprio" ON receitas_pessoais
  USING (
    user_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM membros_workspace
      WHERE user_id = auth.uid()
      AND workspace_id = receitas_pessoais.workspace_id
      AND papel = 'admin'
    )
  );

CREATE POLICY "orcamento_pessoal_proprio" ON orcamento_pessoal
  USING (
    user_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM membros_workspace
      WHERE user_id = auth.uid()
      AND workspace_id = orcamento_pessoal.workspace_id
      AND papel = 'admin'
    )
  );

CREATE POLICY "reservas_metas_proprio" ON reservas_metas
  USING (
    user_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM membros_workspace
      WHERE user_id = auth.uid()
      AND workspace_id = reservas_metas.workspace_id
      AND papel = 'admin'
    )
  );


-- View Unificada do Kanban
CREATE OR REPLACE VIEW v_kanban_items AS
  -- Tarefas de projetos ativos
  SELECT
    tp.id,
    tp.titulo,
    tp.descricao,
    'tarefa_projeto'            AS origem,
    p.id                        AS origem_id,
    p.nome                      AS origem_nome,
    COALESCE(p.cor, '#F59E0B')  AS origem_cor,
    CASE tp.status
      WHEN 'pendente'     THEN 'a_fazer'
      WHEN 'em_andamento' THEN 'em_andamento'
      WHEN 'bloqueada'    THEN 'bloqueado'
      WHEN 'concluida'    THEN 'concluido'
    END                         AS status_kanban,
    tp.responsavel_id,
    tp.data_prevista,
    tp.data_prevista < CURRENT_DATE
      AND tp.status != 'concluida' AS vencido,
    tp.posicao,
    p.workspace_id
  FROM tarefas_projeto tp
  JOIN projetos p ON tp.projeto_id = p.id
  WHERE p.status IN ('ativo', 'em_andamento')

  UNION ALL

  -- Ações de alinhamentos (não concluídas)
  SELECT
    aa.id,
    aa.descricao                AS titulo,
    NULL                        AS descricao,
    'proximo_passo'             AS origem,
    a.id                        AS origem_id,
    'Alinhamento ' || TO_CHAR(a.data, 'DD/MM') AS origem_nome,
    '#8B5CF6'                   AS origem_cor,
    aa.status                   AS status_kanban,
    aa.responsavel_id,
    aa.prazo                    AS data_prevista,
    aa.prazo < CURRENT_DATE
      AND aa.status != 'concluido' AS vencido,
    aa.posicao,
    a.workspace_id
  FROM alinhamento_acoes aa
  JOIN alinhamentos a ON aa.alinhamento_id = a.id
  WHERE aa.status != 'concluido';


-- ==========================================
-- FASE 9: Recorrências
-- ==========================================

-- Adicionar às tabelas de despesa
ALTER TABLE despesas_pessoais
  ADD COLUMN recorrencia_origem_id UUID REFERENCES despesas_pessoais(id),
  ADD CONSTRAINT uq_recorrencia_pessoal
    UNIQUE (recorrencia_origem_id, mes_referencia);

ALTER TABLE despesas_empresa
  ADD COLUMN recorrencia_origem_id UUID REFERENCES despesas_empresa(id),
  ADD CONSTRAINT uq_recorrencia_empresa
    UNIQUE (recorrencia_origem_id, mes_referencia);

-- RPC no Supabase (função SQL) para gerar recorrências do mês
CREATE OR REPLACE FUNCTION gerar_recorrencias(
  p_workspace_id UUID,
  p_mes_atual    TEXT   -- 'YYYY-MM'
)
RETURNS INTEGER         -- retorna quantos lançamentos foram criados
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_mes_anterior TEXT;
  v_criados INTEGER := 0;
  v_linhas_afetadas INTEGER := 0; -- Variável auxiliar para capturar o ROW_COUNT temporário
BEGIN
  -- Calcular mês anterior
  v_mes_anterior := TO_CHAR(
    TO_DATE(p_mes_atual, 'YYYY-MM') - INTERVAL '1 month',
    'YYYY-MM'
  );

  -- Despesas pessoais recorrentes
  INSERT INTO despesas_pessoais
    (workspace_id, user_id, descricao, valor, categoria,
     tipo, data, recorrente, mes_referencia, recorrencia_origem_id)
  SELECT
    workspace_id, user_id, descricao, valor, categoria,
    tipo,
    DATE_TRUNC('month', NOW())::DATE,  -- dia 1 do mês atual
    TRUE,
    p_mes_atual,
    id                                  -- origem = a despesa do mês anterior
  FROM despesas_pessoais
  WHERE workspace_id    = p_workspace_id
    AND mes_referencia  = v_mes_anterior
    AND recorrente      = TRUE
  ON CONFLICT (recorrencia_origem_id, mes_referencia) DO NOTHING;

  -- 1. Captura as linhas inseridas e soma
  GET DIAGNOSTICS v_linhas_afetadas = ROW_COUNT;
  v_criados := v_criados + v_linhas_afetadas;

  -- Despesas de empresa recorrentes
  INSERT INTO despesas_empresa
    (empresa_id, descricao, valor, categoria, data,
     recorrente, mes_referencia, recorrencia_origem_id, criado_por)
  SELECT
    de.empresa_id, de.descricao, de.valor, de.categoria,
    DATE_TRUNC('month', NOW())::DATE,
    TRUE,
    p_mes_atual,
    de.id,
    de.criado_por
  FROM despesas_empresa de
  JOIN empresas e ON de.empresa_id = e.id
  WHERE e.workspace_id   = p_workspace_id
    AND de.mes_referencia = v_mes_anterior
    AND de.recorrente     = TRUE
  ON CONFLICT (recorrencia_origem_id, mes_referencia) DO NOTHING;

  -- 2. Captura as novas linhas inseridas e soma novamente
  GET DIAGNOSTICS v_linhas_afetadas = ROW_COUNT;
  v_criados := v_criados + v_linhas_afetadas;

  RETURN v_criados;
END;
$$;
