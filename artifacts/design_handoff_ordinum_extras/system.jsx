/* Ordinum — System app artboard
   Interactive: sidebar nav, drag-and-drop kanban, project drill-down, GTD checkbox.
   Designed at 1440x960 to fit one artboard. */

const { useMemo: useMemoSys } = React;

/* ─── Sidebar ──────────────────────────────────────────── */
function AppSidebar({ active, onChange }) {
  const items = [
    { id: "visao",      icon: "home",            label: "Visão Geral" },
    { id: "empresa",    icon: "building-2",      label: "Empresa" },
    { id: "pessoal",    icon: "user",            label: "Pessoal" },
    { id: "projetos",   icon: "folder-kanban",   label: "Projetos" },
    { id: "kanban",     icon: "columns-3",       label: "Kanban Global" },
    { id: "alinhamento",icon: "compass",         label: "Alinhamento" },
    { id: "relatorios", icon: "bar-chart-3",     label: "Relatórios" },
    { id: "config",     icon: "settings",        label: "Configurações" },
  ];

  return (
    <aside style={{
      width: 240, height: "100%",
      background: "var(--sidebar)",
      borderRight: "1px solid var(--border)",
      padding: "22px 14px 18px",
      display: "flex", flexDirection: "column",
      boxShadow: "var(--shadow-sidebar)",
      flexShrink: 0,
    }}>
      <div style={{ padding: "4px 10px 22px" }}>
        <OrdinumLogo size={26}/>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <button key={item.id}
              onClick={() => onChange(item.id)}
              style={{
                display: "flex", alignItems: "center", gap: 11,
                padding: "10px 12px", borderRadius: 9,
                fontSize: 13.5,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? "#5EEAD4" : "var(--text-muted)",
                background: isActive ? "rgba(45,212,191,.10)" : "transparent",
                border: isActive ? "1px solid rgba(45,212,191,.20)" : "1px solid transparent",
                cursor: "pointer", textAlign: "left",
                transition: "all 150ms var(--ease-out)",
                position: "relative",
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,.03)"; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              <Icon name={item.icon} size={16} color={isActive ? "#5EEAD4" : "#94A3B8"} strokeWidth={isActive ? 2.2 : 1.8}/>
              <span>{item.label}</span>
              {isActive && <div style={{
                position: "absolute", left: 0, top: 8, bottom: 8, width: 2,
                background: "#2DD4BF", borderRadius: 999,
                marginLeft: -14,
              }}/>}
            </button>
          );
        })}
      </nav>

      {/* Plan card */}
      <div style={{
        padding: 14, borderRadius: 12,
        background: "linear-gradient(135deg, rgba(45,212,191,.10), rgba(45,212,191,.02))",
        border: "1px solid rgba(45,212,191,.18)",
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--teal-300)", letterSpacing: ".05em", marginBottom: 6 }}>
          PLANO PRO
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10, lineHeight: 1.4 }}>
          7 de 12 contextos usados
        </div>
        <div style={{ height: 4, background: "rgba(255,255,255,.06)", borderRadius: 999, overflow: "hidden" }}>
          <div style={{ width: "58%", height: "100%", background: "linear-gradient(90deg, #5EEAD4, #14B8A6)" }}/>
        </div>
      </div>
    </aside>
  );
}

/* ─── TopBar ──────────────────────────────────────────── */
function AppTopBar({ title, subtitle, action }) {
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", justifyContent: "space-between",
      padding: "22px 28px",
      borderBottom: "1px solid var(--border-subtle)",
      gap: 24,
    }}>
      <div>
        <h1 style={{ fontFamily: "var(--font-body)", fontSize: 22, fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "-0.015em" }}>
          {title}
        </h1>
        {subtitle && <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "4px 0 0" }}>{subtitle}</p>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {action}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button style={{
            width: 36, height: 36, borderRadius: 9, display: "flex",
            alignItems: "center", justifyContent: "center",
            background: "rgba(255,255,255,.03)", border: "1px solid var(--border)",
          }}>
            <Icon name="search" size={15} color="#94A3B8"/>
          </button>
          <button style={{
            width: 36, height: 36, borderRadius: 9, display: "flex",
            alignItems: "center", justifyContent: "center",
            background: "rgba(255,255,255,.03)", border: "1px solid var(--border)",
            position: "relative",
          }}>
            <Icon name="bell" size={15} color="#94A3B8"/>
            <span style={{
              position: "absolute", top: 7, right: 8,
              width: 6, height: 6, borderRadius: "50%", background: "#F87171",
            }}/>
          </button>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "5px 12px 5px 5px",
          borderRadius: 999, background: "rgba(255,255,255,.03)",
          border: "1px solid var(--border)",
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            background: "linear-gradient(135deg, #5EEAD4, #0F766E)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, color: "#06251F",
          }}>TM</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", lineHeight: 1.2 }}>Thiago Martins</div>
            <div style={{ fontSize: 10, color: "var(--text-faint)", lineHeight: 1.2 }}>Administrador</div>
          </div>
          <Icon name="chevron-down" size={13} color="#64748B" style={{ marginLeft: 4 }}/>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   VIEW 1 — Visão Geral
   ════════════════════════════════════════════════════════ */
function VisaoGeralView() {
  return (
    <div style={{ padding: 28 }} data-screen-label="Sistema · Visão Geral">
      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
        <MetricCard titulo="Projetos ativos" valor="24" delta="+12%" deltaPositivo
          sparkPoints={[12,14,11,16,14,18,15,19,17,22,24]} sparkColor="#5EEAD4"/>
        <MetricCard titulo="Tarefas em andamento" valor="87" delta="+8%" deltaPositivo
          sparkPoints={[70,72,68,74,76,73,80,78,82,85,87]} sparkColor="#60A5FA"/>
        <MetricCard titulo="Concluídas" valor="142" delta="+18%" deltaPositivo
          sparkPoints={[110,115,118,122,128,131,135,138,140,141,142]} sparkColor="#34D399"/>
        <MetricCard titulo="Pendências" valor="15" delta="-5%" deltaPositivo={false}
          sparkPoints={[22,20,21,19,18,18,17,16,16,15,15]} sparkColor="#FBBF24"/>
      </div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
        {/* Velocidade do mês (area chart) */}
        <Card padding={22}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "#fff", margin: 0 }}>Velocidade de execução</h3>
              <p style={{ fontSize: 12, color: "var(--text-faint)", margin: "2px 0 0" }}>Últimos 30 dias por contexto</p>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {["7d", "30d", "90d"].map((p, i) => (
                <button key={p} style={{
                  fontSize: 11, padding: "5px 12px", borderRadius: 6,
                  background: i === 1 ? "rgba(45,212,191,.10)" : "transparent",
                  color: i === 1 ? "#5EEAD4" : "var(--text-muted)",
                  border: i === 1 ? "1px solid rgba(45,212,191,.22)" : "1px solid var(--border)",
                  fontWeight: 600,
                }}>{p}</button>
              ))}
            </div>
          </div>

          <AreaChart/>

          <div style={{ display: "flex", gap: 20, marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border-subtle)" }}>
            {[
              ["Empresa", "#5EEAD4"],
              ["Produto", "#FBBF24"],
              ["Pessoal", "#FB7185"],
              ["Marketing", "#F472B6"],
            ].map(([n, c]) => (
              <div key={n} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "var(--text-muted)" }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: c }}/>
                {n}
              </div>
            ))}
          </div>
        </Card>

        {/* Próximas ações + Decisões */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card padding={20}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "#fff", margin: 0 }}>Próximas ações</h3>
              <a href="#" style={{ fontSize: 12, color: "var(--teal-300)" }}>Ver tudo</a>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {[
                { n: 1, t: "1:1 com time de produto", w: "Hoje, 10:00", c: "empresa" },
                { n: 2, t: "Entregar relatório mensal", w: "Amanhã, 09:00", c: "produto", icon: "file-text" },
                { n: 3, t: "Planejamento estratégico", w: "Sex, 14:00", c: "empresa", icon: "compass" },
                { n: 4, t: "Revisar OKRs do Q2", w: "Seg, 11:00", c: "empresa", icon: "target" },
              ].map((a) => (
                <div key={a.n} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 4px",
                  borderBottom: a.n < 4 ? "1px solid var(--border-subtle)" : "none",
                }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: 6,
                    background: "rgba(45,212,191,.08)",
                    border: "1px solid rgba(45,212,191,.18)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 600, color: "#5EEAD4",
                  }}>{a.n}</div>
                  <div style={{ flex: 1, fontSize: 13, color: "#fff", lineHeight: 1.35 }}>{a.t}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{a.w}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card padding={20}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "#fff", margin: 0 }}>Decisões pendentes</h3>
              <Badge variant="warning" label="3" size="sm"/>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                ["Aprovar orçamento Q2 marketing", "empresa"],
                ["Definir stack do novo módulo", "produto"],
                ["Contratar designer pleno?", "pessoal"],
              ].map(([t, c]) => (
                <div key={t} style={{
                  padding: 12, borderRadius: 10,
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                }}>
                  <div style={{ fontSize: 13, color: "#fff", flex: 1 }}>{t}</div>
                  <Badge variant={c} label={c[0].toUpperCase() + c.slice(1)}/>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* Simple SVG area chart for Velocidade */
function AreaChart() {
  const series = [
    { color: "#5EEAD4", points: [3,5,4,7,6,8,7,9,8,10,11,9,12,11,13] },
    { color: "#FBBF24", points: [2,3,3,4,5,4,6,5,7,6,8,7,8,9,9]      },
    { color: "#FB7185", points: [1,2,2,3,2,4,3,4,5,4,6,5,7,6,8]      },
    { color: "#F472B6", points: [1,1,2,2,3,3,4,3,5,4,5,4,6,5,7]      },
  ];
  const w = 660, h = 160, pad = 8;
  const n = series[0].points.length;
  const allMax = Math.max(...series.flatMap(s => s.points));
  const step = (w - pad * 2) / (n - 1);
  const yScale = (v) => h - pad - (v / allMax) * (h - pad * 2);

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <defs>
        {series.map((s, i) => (
          <linearGradient key={i} id={`area-${i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={s.color} stopOpacity=".25"/>
            <stop offset="100%" stopColor={s.color} stopOpacity="0"/>
          </linearGradient>
        ))}
      </defs>
      {/* horizontal grid */}
      {[0.25, 0.5, 0.75].map((p) => (
        <line key={p} x1={pad} x2={w-pad} y1={h*p} y2={h*p}
          stroke="rgba(255,255,255,.04)" strokeDasharray="2,4"/>
      ))}
      {series.map((s, i) => {
        const line = s.points.map((v, j) => `${j === 0 ? 'M' : 'L'}${pad + j*step},${yScale(v)}`).join(' ');
        const area = line + ` L${pad + (n-1)*step},${h-pad} L${pad},${h-pad} Z`;
        return (
          <g key={i}>
            <path d={area} fill={`url(#area-${i})`}/>
            <path d={line} fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
        );
      })}
    </svg>
  );
}

/* ════════════════════════════════════════════════════════
   VIEW 2 — Kanban Global (drag and drop)
   ════════════════════════════════════════════════════════ */
const INITIAL_BOARD = {
  fazer: {
    title: "A fazer",
    cards: [
      { id: "c1", title: "Revisar proposta comercial", tag: "empresa", prio: "alta", who: "TM" },
      { id: "c2", title: "Planejar campanha Q2", tag: "marketing", prio: "media", who: "AB" },
      { id: "c3", title: "Onboarding nova designer", tag: "pessoal", prio: "media", who: "TM" },
      { id: "c4", title: "Documentar arquitetura v2", tag: "produto", prio: "baixa", who: "RL" },
    ],
  },
  andamento: {
    title: "Em andamento",
    cards: [
      { id: "c5", title: "Desenvolver dashboard executivo", tag: "produto", prio: "alta", who: "RL" },
      { id: "c6", title: "Reunião com stakeholders", tag: "empresa", prio: "alta", who: "TM" },
      { id: "c7", title: "Auditoria de processos comerciais", tag: "dados", prio: "media", who: "AB" },
    ],
  },
  revisao: {
    title: "Em revisão",
    cards: [
      { id: "c8", title: "Pricing v3 — sugestão", tag: "empresa", prio: "media", who: "TM" },
      { id: "c9", title: "Landing nova /precos", tag: "marketing", prio: "media", who: "AB" },
    ],
  },
  concluido: {
    title: "Concluído",
    cards: [
      { id: "c10", title: "Análise de métricas mensais", tag: "dados", prio: "baixa", who: "RL" },
      { id: "c11", title: "Treinamento da equipe", tag: "pessoal", prio: "baixa", who: "TM" },
      { id: "c12", title: "Roadmap Q2 publicado", tag: "produto", prio: "alta", who: "RL" },
    ],
  },
};

function KanbanView() {
  const [board, setBoard] = React.useState(INITIAL_BOARD);
  const [dragged, setDragged] = React.useState(null); // { cardId, fromCol }
  const [hoverCol, setHoverCol] = React.useState(null);

  const onDragStart = (cardId, fromCol) => (e) => {
    setDragged({ cardId, fromCol });
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragOver = (col) => (e) => {
    e.preventDefault();
    setHoverCol(col);
  };
  const onDrop = (toCol) => (e) => {
    e.preventDefault();
    setHoverCol(null);
    if (!dragged) return;
    const { cardId, fromCol } = dragged;
    if (fromCol === toCol) { setDragged(null); return; }
    setBoard((prev) => {
      const card = prev[fromCol].cards.find((c) => c.id === cardId);
      if (!card) return prev;
      return {
        ...prev,
        [fromCol]: { ...prev[fromCol], cards: prev[fromCol].cards.filter((c) => c.id !== cardId) },
        [toCol]: { ...prev[toCol], cards: [...prev[toCol].cards, card] },
      };
    });
    setDragged(null);
  };

  return (
    <div style={{ padding: 28, height: "100%", display: "flex", flexDirection: "column" }} data-screen-label="Sistema · Kanban Global">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", gap: 6 }}>
            {[
              ["Todos contextos", true],
              ["Empresa", false],
              ["Produto", false],
              ["Marketing", false],
              ["Pessoal", false],
            ].map(([l, active]) => (
              <button key={l} style={{
                fontSize: 12, padding: "6px 12px", borderRadius: 7,
                background: active ? "rgba(45,212,191,.10)" : "var(--surface)",
                color: active ? "#5EEAD4" : "var(--text-muted)",
                border: active ? "1px solid rgba(45,212,191,.22)" : "1px solid var(--border)",
                fontWeight: 600,
              }}>{l}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="secondary" size="sm" leftIcon={<Icon name="filter" size={14}/>}>Filtros</Button>
          <Button size="sm" leftIcon={<Icon name="plus" size={14} color="#06251F"/>}>Novo card</Button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, flex: 1, minHeight: 0 }}>
        {Object.entries(board).map(([colId, col]) => {
          const isHover = hoverCol === colId;
          return (
            <div key={colId}
              onDragOver={onDragOver(colId)}
              onDragLeave={() => setHoverCol(null)}
              onDrop={onDrop(colId)}
              style={{
                background: "var(--surface)",
                border: isHover ? "1px solid rgba(45,212,191,.40)" : "1px solid var(--border)",
                borderRadius: 14, padding: 12,
                display: "flex", flexDirection: "column",
                transition: "border-color 150ms ease, background 150ms ease",
                backgroundColor: isHover ? "var(--surface-2)" : "var(--surface)",
                minHeight: 0,
              }}>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "4px 6px 12px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: 2,
                    background: { fazer: "#94A3B8", andamento: "#FBBF24", revisao: "#A78BFA", concluido: "#34D399" }[colId],
                  }}/>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{col.title}</span>
                  <span style={{ fontSize: 11, color: "var(--text-faint)" }}>{col.cards.length}</span>
                </div>
                <button style={{
                  width: 24, height: 24, borderRadius: 6,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--text-faint)",
                }}>
                  <Icon name="plus" size={14}/>
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, overflowY: "auto", paddingRight: 2 }}>
                {col.cards.map((card) => (
                  <KanbanCard key={card.id} card={card}
                    onDragStart={onDragStart(card.id, colId)}
                    isDragging={dragged?.cardId === card.id}
                  />
                ))}
                {/* drop hint */}
                {isHover && dragged?.fromCol !== colId && (
                  <div style={{
                    border: "1.5px dashed rgba(45,212,191,.5)",
                    borderRadius: 10, padding: "16px 12px",
                    color: "var(--teal-300)", fontSize: 12, textAlign: "center",
                    fontWeight: 500,
                  }}>Solte aqui</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function KanbanCard({ card, onDragStart, isDragging }) {
  const prioColor = { alta: "#F87171", media: "#FBBF24", baixa: "#94A3B8" }[card.prio];
  return (
    <div
      draggable
      onDragStart={onDragStart}
      style={{
        background: "var(--surface-3)",
        border: "1px solid var(--border)",
        borderRadius: 10, padding: 12,
        cursor: "grab",
        opacity: isDragging ? 0.4 : 1,
        transition: "opacity 150ms ease",
        userSelect: "none",
      }}
    >
      <div style={{ fontSize: 13, color: "#fff", lineHeight: 1.35, marginBottom: 10, fontWeight: 500 }}>
        {card.title}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <Badge variant={card.tag} label={card.tag[0].toUpperCase() + card.tag.slice(1)}/>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%", background: prioColor,
          }} title={`Prioridade ${card.prio}`}/>
          <div style={{
            width: 22, height: 22, borderRadius: "50%",
            background: "linear-gradient(135deg, #475569, #1E293B)",
            border: "1px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 9, fontWeight: 700, color: "#fff",
          }}>{card.who}</div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   VIEW 3 — Projetos
   ════════════════════════════════════════════════════════ */
function ProjetosView() {
  const projects = [
    { id: "p1", name: "Lançamento Ordinum Pro", ctx: "produto", progress: 72, status: "andamento",
      due: "30/06", team: ["TM","RL","AB"], tasks: { total: 24, done: 17 } },
    { id: "p2", name: "Campanha aquisição Q2", ctx: "marketing", progress: 45, status: "andamento",
      due: "15/07", team: ["AB","JM"], tasks: { total: 18, done: 8 } },
    { id: "p3", name: "Reestruturação comercial", ctx: "empresa", progress: 30, status: "andamento",
      due: "30/08", team: ["TM","RL"], tasks: { total: 32, done: 10 } },
    { id: "p4", name: "Documentação API pública", ctx: "produto", progress: 90, status: "revisao",
      due: "10/06", team: ["RL"], tasks: { total: 14, done: 13 } },
    { id: "p5", name: "Treinamento liderança", ctx: "pessoal", progress: 100, status: "concluido",
      due: "Concluído", team: ["TM","JM"], tasks: { total: 8, done: 8 } },
    { id: "p6", name: "Pesquisa NPS clientes", ctx: "dados", progress: 15, status: "novo",
      due: "30/09", team: ["AB"], tasks: { total: 12, done: 2 } },
  ];

  const [selected, setSelected] = React.useState("p1");
  const sel = projects.find((p) => p.id === selected);

  return (
    <div style={{ padding: 28, display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 18, height: "100%", minHeight: 0 }}
      data-screen-label="Sistema · Projetos">
      {/* Project grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <div style={{ display: "flex", gap: 6 }}>
            {[
              ["Todos", true, 6],
              ["Ativos", false, 4],
              ["Em revisão", false, 1],
              ["Concluídos", false, 1],
            ].map(([l, a, n]) => (
              <button key={l} style={{
                fontSize: 12, padding: "6px 12px", borderRadius: 7,
                background: a ? "rgba(45,212,191,.10)" : "var(--surface)",
                color: a ? "#5EEAD4" : "var(--text-muted)",
                border: a ? "1px solid rgba(45,212,191,.22)" : "1px solid var(--border)",
                fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6,
              }}>{l}<span style={{ fontSize: 10, opacity: .7 }}>{n}</span></button>
            ))}
          </div>
          <Button size="sm" leftIcon={<Icon name="plus" size={14} color="#06251F"/>}>Novo projeto</Button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {projects.map((p) => {
            const isActive = p.id === selected;
            return (
              <Card key={p.id}
                onClick={() => setSelected(p.id)}
                hoverable
                padding={18}
                style={{
                  borderColor: isActive ? "rgba(45,212,191,.35)" : undefined,
                  background: isActive ? "var(--surface-2)" : undefined,
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: "#fff", margin: 0, lineHeight: 1.35 }}>{p.name}</h3>
                  <Icon name="more-horizontal" size={16} color="#64748B"/>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <Badge variant={p.ctx} label={p.ctx[0].toUpperCase() + p.ctx.slice(1)}/>
                  <Badge variant={p.status} label={
                    { novo: "Novo", andamento: "Em andamento", revisao: "Em revisão", concluido: "Concluído" }[p.status]
                  } dot/>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>
                    <span>Progresso</span>
                    <span style={{ color: "#fff", fontWeight: 600 }}>{p.progress}%</span>
                  </div>
                  <div style={{ height: 5, background: "rgba(255,255,255,.06)", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{
                      width: `${p.progress}%`, height: "100%",
                      background: p.status === "concluido"
                        ? "linear-gradient(90deg, #34D399, #14B8A6)"
                        : "linear-gradient(90deg, #5EEAD4, #14B8A6)",
                      transition: "width 400ms var(--ease-out)",
                    }}/>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", marginLeft: 0 }}>
                    {p.team.map((m, i) => (
                      <div key={m} style={{
                        width: 24, height: 24, borderRadius: "50%",
                        background: ["linear-gradient(135deg, #5EEAD4, #0F766E)",
                                     "linear-gradient(135deg, #A78BFA, #6366F1)",
                                     "linear-gradient(135deg, #FB7185, #BE185D)",
                                     "linear-gradient(135deg, #FBBF24, #B45309)"][i % 4],
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10, fontWeight: 700, color: "#fff",
                        border: "2px solid var(--surface)",
                        marginLeft: i === 0 ? 0 : -8,
                      }}>{m}</div>
                    ))}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-faint)" }}>{p.tasks.done}/{p.tasks.total} tarefas · {p.due}</div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Detail panel */}
      <ProjectDetail project={sel}/>
    </div>
  );
}

function ProjectDetail({ project }) {
  if (!project) return null;
  const milestones = [
    { t: "Kickoff + discovery", done: true,  date: "01/04" },
    { t: "Wireframes aprovados", done: true,  date: "15/04" },
    { t: "Backend v2 deploy",    done: true,  date: "02/05" },
    { t: "Onboarding refatorado", done: false, date: "18/05", active: true },
    { t: "Beta com 50 clientes",   done: false, date: "10/06" },
    { t: "Lançamento público",     done: false, date: "30/06" },
  ];
  return (
    <Card padding={22} style={{ overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4, gap: 12 }}>
        <Badge variant={project.ctx} label={project.ctx[0].toUpperCase() + project.ctx.slice(1)}/>
        <Icon name="external-link" size={15} color="#94A3B8"/>
      </div>
      <h2 style={{
        fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700,
        color: "#fff", margin: "10px 0 6px", letterSpacing: "-0.01em",
      }}>{project.name}</h2>
      <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>
        Marco principal: lançamento público com onboarding novo, paywall integrado e analytics granular.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, margin: "20px 0" }}>
        {[
          ["Concluído", `${project.tasks.done}`, "check"],
          ["Total", `${project.tasks.total}`, "list"],
          ["Prazo", project.due, "calendar"],
        ].map(([l, v, i]) => (
          <div key={l} style={{
            padding: 12, borderRadius: 10,
            background: "var(--surface-2)", border: "1px solid var(--border)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--text-faint)", marginBottom: 4 }}>
              <Icon name={i} size={11} color="#5EEAD4"/>
              {l}
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
        <h4 style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", letterSpacing: ".08em", margin: "0 0 12px" }}>
          MARCOS DO PROJETO
        </h4>
        <div style={{ position: "relative", paddingLeft: 8 }}>
          {/* Vertical line */}
          <div style={{
            position: "absolute", left: 13, top: 8, bottom: 8,
            width: 1, background: "var(--border)",
          }}/>
          {milestones.map((m, i) => (
            <div key={i} style={{
              display: "flex", gap: 12, alignItems: "center",
              padding: "10px 0", position: "relative",
            }}>
              <div style={{
                width: 10, height: 10, borderRadius: "50%",
                background: m.done ? "#34D399" : (m.active ? "#5EEAD4" : "var(--surface-3)"),
                border: m.active ? "2px solid rgba(45,212,191,.30)" : "1px solid var(--border)",
                marginLeft: -2,
                boxShadow: m.active ? "0 0 0 4px rgba(45,212,191,.10)" : "none",
                zIndex: 1,
              }}/>
              <div style={{ flex: 1, fontSize: 13,
                color: m.done ? "var(--text-faint)" : "#fff",
                textDecoration: m.done ? "line-through" : "none",
                fontWeight: m.active ? 600 : 500,
              }}>{m.t}</div>
              <div style={{ fontSize: 11, color: "var(--text-faint)" }}>{m.date}</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════
   VIEW 4 — Pessoal (GTD)
   ════════════════════════════════════════════════════════ */
function PessoalView() {
  const initialTasks = [
    { id: "t1", t: "Responder e-mail do CFO sobre orçamento", c: "empresa", time: "10min", done: false, today: true },
    { id: "t2", t: "Preparar slides para 1:1 com diretor", c: "empresa", time: "30min", done: false, today: true },
    { id: "t3", t: "Revisar PR do dashboard novo", c: "produto", time: "20min", done: true, today: true },
    { id: "t4", t: "Ligar para o contador (fechamento)", c: "empresa", time: "15min", done: false, today: true },
    { id: "t5", t: "Estudar capítulo 4 do livro de liderança", c: "pessoal", time: "1h", done: false, today: false },
    { id: "t6", t: "Planejar próximo trimestre — rascunho", c: "empresa", time: "45min", done: false, today: false },
    { id: "t7", t: "Renovar plano de academia", c: "pessoal", time: "5min", done: false, today: false },
    { id: "t8", t: "Comprar presente aniversário Ana", c: "pessoal", time: "10min", done: true, today: false },
  ];
  const [tasks, setTasks] = React.useState(initialTasks);
  const toggle = (id) => setTasks((prev) => prev.map((t) => t.id === id ? { ...t, done: !t.done } : t));

  const today = tasks.filter((t) => t.today);
  const upcoming = tasks.filter((t) => !t.today);
  const doneCount = today.filter((t) => t.done).length;

  return (
    <div style={{ padding: 28, display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18, height: "100%", minHeight: 0 }}
      data-screen-label="Sistema · Pessoal">
      {/* Today + Upcoming */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, overflowY: "auto" }}>
        {/* Today */}
        <Card padding={22}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <h3 style={{
              fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700,
              color: "#fff", margin: 0, letterSpacing: "-0.01em",
            }}>
              Hoje, <em style={{ color: "var(--teal-300)", fontStyle: "italic", fontWeight: 500 }}>terça-feira</em>
            </h3>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
              <span style={{ color: "#fff", fontWeight: 600 }}>{doneCount}</span> de {today.length} concluídas
            </div>
          </div>
          <div style={{ height: 4, background: "rgba(255,255,255,.06)", borderRadius: 999, overflow: "hidden", marginBottom: 16 }}>
            <div style={{
              width: `${(doneCount / today.length) * 100}%`, height: "100%",
              background: "linear-gradient(90deg, #5EEAD4, #14B8A6)",
              transition: "width 350ms var(--ease-out)",
            }}/>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {today.map((t) => <GtdRow key={t.id} task={t} onToggle={toggle}/>)}
          </div>

          <button style={{
            marginTop: 14, padding: "10px 14px", borderRadius: 9,
            background: "var(--surface-2)", border: "1px dashed var(--border-strong)",
            color: "var(--text-muted)", fontSize: 13, fontWeight: 500,
            display: "flex", alignItems: "center", gap: 8, width: "100%",
          }}>
            <Icon name="plus" size={14}/>
            Adicionar tarefa
          </button>
        </Card>

        {/* Upcoming */}
        <Card padding={22}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "#fff", margin: "0 0 14px" }}>Próximos dias</h3>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {upcoming.map((t) => <GtdRow key={t.id} task={t} onToggle={toggle}/>)}
          </div>
        </Card>
      </div>

      {/* Right column: focus + stats */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, overflowY: "auto" }}>
        <Card padding={0} style={{ overflow: "hidden", padding: 0 }}>
          <div style={{
            padding: "22px 22px 18px",
            background: "linear-gradient(135deg, rgba(45,212,191,.10), rgba(45,212,191,.02))",
            borderBottom: "1px solid var(--border)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: "var(--teal-300)", fontWeight: 600, letterSpacing: ".08em" }}>FOCO AGORA</span>
              <Icon name="zap" size={14} color="#5EEAD4"/>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "#fff", margin: "0 0 6px", lineHeight: 1.3 }}>
              Preparar slides para 1:1 com diretor
            </h3>
            <Badge variant="empresa" label="Empresa"/>
          </div>
          <div style={{ padding: 22, textAlign: "center" }}>
            <div style={{
              fontFamily: "var(--font-mono)", fontSize: 56, fontWeight: 600,
              color: "#fff", lineHeight: 1, marginBottom: 8, letterSpacing: "-0.02em",
            }}>
              <span className="tabular">23:47</span>
            </div>
            <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 18px" }}>Pomodoro em andamento</p>
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              <Button variant="secondary" size="sm" leftIcon={<Icon name="pause" size={13}/>}>Pausar</Button>
              <Button variant="outline" size="sm" leftIcon={<Icon name="square" size={13}/>}>Encerrar</Button>
            </div>
          </div>
        </Card>

        <Card padding={22}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "#fff", margin: "0 0 18px" }}>Distribuição por contexto</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              ["Empresa", 12, "#5EEAD4"],
              ["Produto", 8, "#FBBF24"],
              ["Pessoal", 6, "#FB7185"],
              ["Marketing", 4, "#F472B6"],
              ["Dados", 3, "#60A5FA"],
            ].map(([n, v, c]) => (
              <div key={n}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                  <span style={{ color: "#fff" }}>{n}</span>
                  <span style={{ color: "var(--text-muted)" }}>{v} tarefas</span>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,.04)", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ width: `${(v / 12) * 100}%`, height: "100%", background: c, transition: "width 400ms var(--ease-out)" }}/>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card padding={22}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "#fff", margin: "0 0 14px" }}>Streak</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 60, height: 60, borderRadius: 16,
              background: "linear-gradient(135deg, rgba(251,191,36,.15), rgba(251,191,36,.04))",
              border: "1px solid rgba(251,191,36,.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon name="flame" size={28} color="#FBBF24"/>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#fff", lineHeight: 1 }}>14 dias</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>Cumprindo as 3 tarefas-chave</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function GtdRow({ task, onToggle }) {
  return (
    <div
      onClick={() => onToggle(task.id)}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "12px 4px",
        borderBottom: "1px solid var(--border-subtle)",
        cursor: "pointer",
        transition: "background 150ms ease",
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,.02)"}
      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
    >
      <div style={{
        width: 18, height: 18, borderRadius: 6,
        border: task.done ? "1px solid #2DD4BF" : "1.5px solid var(--border-strong)",
        background: task.done ? "#2DD4BF" : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 150ms ease", flexShrink: 0,
      }}>
        {task.done && <Icon name="check" size={11} color="#06251F" strokeWidth={3}/>}
      </div>
      <div style={{
        flex: 1, fontSize: 13.5,
        color: task.done ? "var(--text-faint)" : "#fff",
        textDecoration: task.done ? "line-through" : "none",
        lineHeight: 1.4,
      }}>{task.t}</div>
      <Badge variant={task.c} label={task.c[0].toUpperCase() + task.c.slice(1)}/>
      <span style={{
        fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)",
        background: "rgba(255,255,255,.03)",
        padding: "2px 7px", borderRadius: 4,
        minWidth: 38, textAlign: "center",
      }}>{task.time}</span>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   System shell — composes everything
   ════════════════════════════════════════════════════════ */
function SystemApp() {
  const [active, setActive] = React.useState("visao");
  useLucide([active]);

  const titles = {
    visao:      { t: "Visão Geral",     s: "Acompanhe o que importa em todos os seus contextos." },
    kanban:     { t: "Kanban Global",   s: "Visão única de execução cruzando todos os contextos." },
    projetos:   { t: "Projetos",        s: "6 ativos · 1 em revisão · 1 concluído este mês." },
    pessoal:    { t: "Pessoal · GTD",   s: "Foco hoje, claro amanhã. Captura tudo sem perder a cabeça." },
    empresa:    { t: "Empresa",         s: "Visão estratégica do negócio." },
    alinhamento:{ t: "Alinhamento",     s: "OKRs, decisões e marcos compartilhados." },
    relatorios: { t: "Relatórios",      s: "Métricas operacionais e executivas." },
    config:     { t: "Configurações",   s: "Workspace, integrações, plano." },
  };
  const meta = titles[active];

  let Body = null;
  if (active === "visao") Body = <VisaoGeralView/>;
  else if (active === "kanban") Body = <KanbanView/>;
  else if (active === "projetos") Body = <ProjetosView/>;
  else if (active === "pessoal") Body = <PessoalView/>;
  else Body = (
    <div style={{ padding: 60, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center" }}>
      <IconContainer icon="construction" color="teal" size="lg"/>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "#fff", marginTop: 18, marginBottom: 6 }}>
        {meta.t} — em construção
      </h3>
      <p style={{ fontSize: 13, color: "var(--text-muted)", maxWidth: 400 }}>
        Esta tela vive na navegação mas ainda não está mockada. Navegue para Visão Geral, Kanban, Projetos ou Pessoal para ver as views interativas.
      </p>
    </div>
  );

  const action = active === "visao"
    ? <Button variant="secondary" size="sm" leftIcon={<Icon name="sliders-horizontal" size={14}/>}>Personalizar visão</Button>
    : null;

  return (
    <div style={{
      display: "grid", gridTemplateColumns: "240px 1fr",
      width: "100%", height: "100%",
      background: "var(--bg)", color: "var(--text)",
      overflow: "hidden",
    }} data-screen-label="Sistema · Ordinum">
      <AppSidebar active={active} onChange={setActive}/>
      <div style={{ display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}>
        <AppTopBar title={meta.t} subtitle={meta.s} action={action}/>
        <div style={{ flex: 1, overflow: "auto", minHeight: 0 }}>
          {Body}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  SystemApp, AppSidebar, AppTopBar,
  VisaoGeralView, KanbanView, ProjetosView, PessoalView,
});
