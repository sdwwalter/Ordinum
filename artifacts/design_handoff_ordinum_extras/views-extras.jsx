/* Ordinum — Extra views
   Auth pages (login, cadastro, convite) +
   Empresa (lista, lançamentos, DRE, pró-labore) +
   Alinhamento (lista, sessão ativa) +
   Configurações.
   All dark-themed, cyan-accent, matching the system shell. */

/* ════════════════════════════════════════════════════════
   AUTH — centered card layout
   ════════════════════════════════════════════════════════ */

function AuthShell({ children, title, subtitle, footerText, footerLink, footerCta }) {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "radial-gradient(ellipse 800px 500px at 50% 20%, rgba(34,211,238,.08), transparent 60%), var(--bg)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, position: "relative", overflow: "hidden",
    }} data-screen-label="Auth">
      {/* Decorative rings background */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)", opacity: .25,
        pointerEvents: "none",
      }}>
        <ConcentricRings size={620}/>
      </div>

      <div style={{
        position: "relative", width: 440, maxWidth: "100%",
      }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <OrdinumLogo size={36}/>
        </div>

        <Card padding={36} elevated style={{
          background: "linear-gradient(180deg, var(--surface-2) 0%, var(--surface) 100%)",
          border: "1px solid rgba(255,255,255,.08)",
          boxShadow: "0 30px 60px -20px rgba(0,0,0,.6), 0 0 80px -30px rgba(34,211,238,.15)",
        }}>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700,
            color: "#fff", margin: 0, letterSpacing: "-0.01em", lineHeight: 1.2,
          }}>{title}</h1>
          {subtitle && <p style={{
            fontSize: 14, color: "var(--text-muted)", margin: "8px 0 0", lineHeight: 1.5,
          }}>{subtitle}</p>}

          <div style={{ marginTop: 28 }}>{children}</div>
        </Card>

        {footerText && (
          <p style={{
            textAlign: "center", marginTop: 24, fontSize: 13, color: "var(--text-muted)",
          }}>
            {footerText}{" "}
            <a href="#" style={{ color: "var(--teal-300)", fontWeight: 600 }}>{footerLink}</a>
            {footerCta && <> · <a href="#" style={{ color: "var(--text-muted)" }}>{footerCta}</a></>}
          </p>
        )}
      </div>
    </div>
  );
}

function AuthField({ label, type = "text", placeholder, leftIcon, hint, value, onChange, autoFocus }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{
        display: "block", fontSize: 12, fontWeight: 600,
        color: "var(--text-muted)", marginBottom: 7, letterSpacing: ".02em",
      }}>{label}</label>
      <div style={{ position: "relative" }}>
        {leftIcon && (
          <span style={{
            position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
            color: focused ? "var(--teal-300)" : "var(--text-faint)",
            transition: "color 150ms ease",
          }}>
            <Icon name={leftIcon} size={16}/>
          </span>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoFocus={autoFocus}
          style={{
            width: "100%", height: 44,
            padding: leftIcon ? "0 14px 0 40px" : "0 14px",
            background: "var(--input)",
            border: `1px solid ${focused ? "rgba(34,211,238,.40)" : "var(--border)"}`,
            borderRadius: 10, color: "#fff", fontSize: 14,
            outline: "none",
            transition: "all 150ms ease",
            boxShadow: focused ? "0 0 0 3px rgba(34,211,238,.08)" : "none",
          }}
        />
      </div>
      {hint && <p style={{ fontSize: 11, color: "var(--text-faint)", margin: "6px 0 0" }}>{hint}</p>}
    </div>
  );
}

function LoginView() {
  return (
    <AuthShell
      title="Bem-vindo de volta."
      subtitle="Entre no seu workspace e continue de onde parou."
      footerText="Não tem conta ainda?"
      footerLink="Crie seu workspace"
    >
      <AuthField label="E-mail" type="email" leftIcon="mail" placeholder="voce@empresa.com" autoFocus/>
      <AuthField label="Senha" type="password" leftIcon="lock" placeholder="••••••••"/>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "var(--text-muted)" }}>
          <span style={{
            width: 16, height: 16, borderRadius: 4,
            border: "1.5px solid var(--border-strong)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}/>
          Manter conectado
        </label>
        <a href="#" style={{ fontSize: 13, color: "var(--teal-300)", fontWeight: 500 }}>Esqueci minha senha</a>
      </div>

      <Button size="lg" fullWidth rightIcon={<Icon name="arrow-right" size={15} color="#06251F"/>}>
        Entrar
      </Button>

      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0 18px" }}>
        <div style={{ flex: 1, height: 1, background: "var(--border)" }}/>
        <span style={{ fontSize: 11, color: "var(--text-faint)", letterSpacing: ".08em" }}>OU CONTINUE COM</span>
        <div style={{ flex: 1, height: 1, background: "var(--border)" }}/>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Button variant="secondary" size="md" leftIcon={<Icon name="chrome" size={14}/>}>Google</Button>
        <Button variant="secondary" size="md" leftIcon={<Icon name="circle" size={14}/>}>SSO</Button>
      </div>
    </AuthShell>
  );
}

function CadastroView() {
  return (
    <AuthShell
      title="Crie seu workspace."
      subtitle="Em 60 segundos. Sem cartão de crédito. Comece organizando hoje."
      footerText="Já tem conta?"
      footerLink="Entrar"
    >
      <AuthField label="Seu nome" leftIcon="user" placeholder="Thiago Martins" autoFocus/>
      <AuthField label="E-mail corporativo" type="email" leftIcon="mail" placeholder="thiago@empresa.com"/>
      <AuthField label="Senha" type="password" leftIcon="lock" placeholder="Mínimo 8 caracteres" hint="Use letras, números e ao menos um símbolo."/>

      <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", fontSize: 13, color: "var(--text-muted)", marginBottom: 22, lineHeight: 1.5 }}>
        <span style={{
          width: 16, height: 16, borderRadius: 4, marginTop: 2,
          border: "1.5px solid var(--teal-300)",
          background: "rgba(34,211,238,.10)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <Icon name="check" size={11} color="#5EEAD4" strokeWidth={3}/>
        </span>
        <span>
          Concordo com os <a href="#" style={{ color: "var(--teal-300)" }}>Termos de uso</a> e a{" "}
          <a href="#" style={{ color: "var(--teal-300)" }}>Política de privacidade</a> da Ordinum.
        </span>
      </label>

      <Button size="lg" fullWidth rightIcon={<Icon name="arrow-right" size={15} color="#06251F"/>}>
        Criar workspace
      </Button>
    </AuthShell>
  );
}

function ConviteView() {
  return (
    <AuthShell footerText="Não é você?" footerLink="Recusar convite">
      <div style={{ textAlign: "center", marginBottom: 22 }}>
        <IconContainer icon="mail" color="teal" size="lg" style={{ margin: "0 auto" }}/>
      </div>

      <div style={{ textAlign: "center" }}>
        <span style={{
          display: "inline-block", padding: "4px 10px", borderRadius: 6,
          background: "rgba(34,211,238,.08)", border: "1px solid rgba(34,211,238,.22)",
          fontSize: 10, fontWeight: 600, color: "var(--teal-300)", letterSpacing: ".12em",
          marginBottom: 14,
        }}>VOCÊ FOI CONVIDADO</span>
        <h2 style={{
          fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700,
          color: "#fff", margin: 0, letterSpacing: "-0.01em", lineHeight: 1.3,
        }}>
          <em style={{ color: "var(--teal-300)", fontStyle: "italic", fontWeight: 500 }}>Marina Lopes</em>{" "}
          convidou você para o workspace
        </h2>
        <p style={{
          fontSize: 18, fontWeight: 600, color: "#fff", margin: "12px 0 0",
        }}>Northwind Estúdio</p>
        <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "10px 0 0", lineHeight: 1.5 }}>
          Como <span style={{ color: "#fff", fontWeight: 600 }}>Administrador</span>, você terá acesso completo a
          projetos, kanban global, alinhamentos e financeiro.
        </p>
      </div>

      <div style={{
        margin: "26px 0",
        padding: 16, borderRadius: 12,
        background: "var(--input)", border: "1px solid var(--border)",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          background: "linear-gradient(135deg, #67E8F9, #0E7490)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, fontWeight: 700, color: "#06251F",
        }}>ML</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>Marina Lopes</div>
          <div style={{ fontSize: 12, color: "var(--text-faint)" }}>marina@northwind.com.br</div>
        </div>
        <Badge variant="empresa" label="Admin"/>
      </div>

      <Button size="lg" fullWidth rightIcon={<Icon name="arrow-right" size={15} color="#06251F"/>}>
        Aceitar e entrar
      </Button>
    </AuthShell>
  );
}

/* ════════════════════════════════════════════════════════
   SHELL WRAPPER — reuses AppSidebar + AppTopBar from system.jsx
   ════════════════════════════════════════════════════════ */
function ScreenShell({ active, title, subtitle, action, children, label }) {
  useLucide([active, title]);
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "240px 1fr",
      width: "100%", height: "100%",
      background: "var(--bg)", color: "var(--text)",
      overflow: "hidden",
    }} data-screen-label={label || `Sistema · ${title}`}>
      <AppSidebar active={active} onChange={() => {}}/>
      <div style={{ display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}>
        <AppTopBar title={title} subtitle={subtitle} action={action}/>
        <div style={{ flex: 1, overflow: "auto", minHeight: 0 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   EMPRESA — Lista de empresas
   ════════════════════════════════════════════════════════ */
function EmpresaListaView() {
  const empresas = [
    { id: "e1", nome: "Northwind Estúdio", cnpj: "12.345.678/0001-99",
      faturamento: 142000, meta: 180000, margem: 24.5, saude: "verde", logo: "N" },
    { id: "e2", nome: "Pellucid Marketing", cnpj: "98.765.432/0001-11",
      faturamento: 78000, meta: 100000, margem: 18.2, saude: "amarelo", logo: "P" },
    { id: "e3", nome: "Roseira Consultoria", cnpj: "55.432.198/0001-22",
      faturamento: 32000, meta: 60000, margem: -3.1, saude: "vermelho", logo: "R" },
    { id: "e4", nome: "Lattice Design", cnpj: "11.222.333/0001-44",
      faturamento: 215000, meta: 200000, margem: 31.8, saude: "verde", logo: "L" },
  ];
  const saudeColor = { verde: "#34D399", amarelo: "#FBBF24", vermelho: "#F87171" };
  const saudeLabel = { verde: "Saudável", amarelo: "Atenção", vermelho: "Crítico" };

  return (
    <ScreenShell
      active="empresa"
      title="Empresas"
      subtitle="Gestão financeira das empresas do seu workspace."
      action={<Button size="sm" leftIcon={<Icon name="plus" size={14} color="#06251F"/>}>Nova empresa</Button>}
      label="Sistema · Empresas (lista)"
    >
      <div style={{ padding: 28 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {empresas.map((e) => {
            const cor = saudeColor[e.saude];
            const pctMeta = Math.min(100, (e.faturamento / e.meta) * 100);
            return (
              <Card key={e.id} hoverable padding={22} style={{ cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18, gap: 14 }}>
                  <div style={{ display: "flex", gap: 14 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 12,
                      background: "linear-gradient(135deg, rgba(34,211,238,.15), rgba(34,211,238,.04))",
                      border: "1px solid rgba(34,211,238,.22)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--teal-300)",
                    }}>{e.logo}</div>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff", margin: "2px 0 4px" }}>{e.nome}</h3>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-faint)" }}>{e.cnpj}</div>
                    </div>
                  </div>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "4px 10px", borderRadius: 999,
                    background: cor + "1A", border: `1px solid ${cor}33`,
                    fontSize: 11, fontWeight: 600, color: cor,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: cor }}/>
                    {saudeLabel[e.saude]}
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                  <div style={{ padding: 12, borderRadius: 10, background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: 11, color: "var(--text-faint)", marginBottom: 4 }}>Faturamento mês</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", fontVariantNumeric: "tabular-nums" }}>
                      {fmtBRL(e.faturamento)}
                    </div>
                  </div>
                  <div style={{ padding: 12, borderRadius: 10, background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: 11, color: "var(--text-faint)", marginBottom: 4 }}>Margem líquida</div>
                    <div style={{ fontSize: 18, fontWeight: 700, fontVariantNumeric: "tabular-nums",
                      color: e.margem >= 20 ? "#34D399" : e.margem >= 0 ? "#FBBF24" : "#F87171" }}>
                      {e.margem.toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: 4 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-muted)", marginBottom: 5 }}>
                    <span>Meta {fmtBRL(e.meta)}</span>
                    <span style={{ color: "#fff", fontWeight: 600 }}>{pctMeta.toFixed(0)}%</span>
                  </div>
                  <div style={{ height: 4, background: "rgba(255,255,255,.06)", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{
                      width: `${pctMeta}%`, height: "100%",
                      background: pctMeta >= 100 ? "linear-gradient(90deg, #34D399, #10B981)" : "linear-gradient(90deg, #5EEAD4, #14B8A6)",
                    }}/>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </ScreenShell>
  );
}

/* ════════════════════════════════════════════════════════
   EMPRESA — Lançamentos
   ════════════════════════════════════════════════════════ */
function EmpresaLancamentosView() {
  const [tab, setTab] = React.useState("receitas");
  const dataByTab = {
    receitas: [
      { id: 1, data: "23/05", desc: "Projeto Pellucid — parcela 2/3", cat: "servicos", valor: 18500, pago: true },
      { id: 2, data: "20/05", desc: "Retainer Lattice — Maio", cat: "retainer", valor: 12000, pago: true },
      { id: 3, data: "15/05", desc: "Workshop Roseira — UX research", cat: "treinamento", valor: 4800, pago: true },
      { id: 4, data: "10/05", desc: "Projeto Northwind — sprint 4", cat: "servicos", valor: 22000, pago: false },
      { id: 5, data: "05/05", desc: "Licença template Ordinum", cat: "produto", valor: 2400, pago: true },
    ],
    despesas: [
      { id: 1, data: "22/05", desc: "Software (Figma, Slack, Linear)", cat: "operacional", valor: 1800, pago: true },
      { id: 2, data: "20/05", desc: "Contador — honorários mês", cat: "operacional", valor: 980, pago: true },
      { id: 3, data: "15/05", desc: "Simples Nacional", cat: "impostos", valor: 5200, pago: false },
      { id: 4, data: "10/05", desc: "Designer freelance — projeto Pellucid", cat: "custos_diretos", valor: 4500, pago: true },
    ],
    prolabore: [
      { id: 1, data: "01/05", desc: "Pró-labore — Thiago Martins", cat: "prolabore", valor: 12000, pago: true },
      { id: 2, data: "01/05", desc: "Pró-labore — Ana Bessa", cat: "prolabore", valor: 8000, pago: true },
    ],
  };
  const catColor = {
    servicos: "#5EEAD4", retainer: "#34D399", treinamento: "#A78BFA", produto: "#FBBF24",
    operacional: "#94A3B8", impostos: "#F87171", custos_diretos: "#FB7185", prolabore: "#60A5FA",
  };
  const catLabel = {
    servicos: "Serviços", retainer: "Retainer", treinamento: "Treinamento", produto: "Produto",
    operacional: "Operacional", impostos: "Impostos", custos_diretos: "Custos diretos", prolabore: "Pró-labore",
  };
  const total = dataByTab[tab].reduce((acc, r) => acc + r.valor, 0);

  return (
    <ScreenShell
      active="empresa"
      title="Northwind Estúdio · Lançamentos"
      subtitle="Receitas, despesas e pró-labore do mês corrente."
      action={
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="secondary" size="sm" leftIcon={<Icon name="download" size={14}/>}>Exportar</Button>
          <Button size="sm" leftIcon={<Icon name="plus" size={14} color="#06251F"/>}>Novo lançamento</Button>
        </div>
      }
      label="Sistema · Empresa · Lançamentos"
    >
      <div style={{ padding: 28 }}>
        {/* Empresa selector + month picker */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 20, gap: 16,
        }}>
          {/* Sub-nav */}
          <div style={{ display: "flex", gap: 4 }}>
            {[
              ["lancamentos", "Lançamentos", true],
              ["dre", "DRE", false],
              ["prolabore", "Pró-labore", false],
              ["historico", "Histórico", false],
            ].map(([k, l, a]) => (
              <button key={k} style={{
                padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                background: a ? "rgba(34,211,238,.10)" : "transparent",
                color: a ? "var(--teal-300)" : "var(--text-muted)",
                border: a ? "1px solid rgba(34,211,238,.20)" : "1px solid transparent",
              }}>{l}</button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10,
            padding: "6px 12px", borderRadius: 9,
            background: "var(--surface)", border: "1px solid var(--border)" }}>
            <Icon name="calendar" size={14} color="#94A3B8"/>
            <span style={{ fontSize: 13, color: "#fff", fontWeight: 500 }}>Maio · 2026</span>
            <Icon name="chevron-down" size={14} color="#64748B"/>
          </div>
        </div>

        {/* Tabs receita/despesa */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          {[
            ["receitas", "Receitas", "#34D399"],
            ["despesas", "Despesas", "#F87171"],
            ["prolabore", "Pró-labore", "#60A5FA"],
          ].map(([k, l, c]) => (
            <button key={k} onClick={() => setTab(k)}
              style={{
                padding: "8px 14px", borderRadius: 7, fontSize: 13, fontWeight: 600,
                background: tab === k ? c + "1A" : "transparent",
                color: tab === k ? c : "var(--text-muted)",
                border: tab === k ? `1px solid ${c}40` : "1px solid var(--border)",
                display: "inline-flex", alignItems: "center", gap: 8,
              }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: c, opacity: tab === k ? 1 : .5 }}/>
              {l}
            </button>
          ))}
        </div>

        {/* Table */}
        <Card padding={0} style={{ overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--surface-2)" }}>
                {["Data", "Descrição", "Categoria", "Status", "Valor", ""].map((h, i) => (
                  <th key={i} style={{
                    textAlign: i === 4 ? "right" : "left",
                    padding: "12px 18px", fontSize: 11, fontWeight: 700,
                    color: "var(--text-muted)", letterSpacing: ".08em",
                    borderBottom: "1px solid var(--border)",
                  }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataByTab[tab].map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td style={{ padding: "14px 18px", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)" }}>{r.data}</td>
                  <td style={{ padding: "14px 18px", fontSize: 13.5, color: "#fff" }}>{r.desc}</td>
                  <td style={{ padding: "14px 18px" }}>
                    <span style={{
                      display: "inline-flex", padding: "3px 9px", borderRadius: 6,
                      background: catColor[r.cat] + "1A",
                      color: catColor[r.cat],
                      border: `1px solid ${catColor[r.cat]}30`,
                      fontSize: 11, fontWeight: 500,
                    }}>{catLabel[r.cat]}</span>
                  </td>
                  <td style={{ padding: "14px 18px" }}>
                    {r.pago ? (
                      <Badge variant="concluido" label="Pago" dot/>
                    ) : (
                      <Badge variant="andamento" label="A receber" dot/>
                    )}
                  </td>
                  <td style={{
                    padding: "14px 18px", textAlign: "right",
                    fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 600,
                    color: tab === "despesas" ? "#F87171" : "#fff", fontVariantNumeric: "tabular-nums",
                  }}>
                    {tab === "despesas" ? "−" : ""}{fmtBRL(r.valor)}
                  </td>
                  <td style={{ padding: "14px 18px", textAlign: "right" }}>
                    <Icon name="more-horizontal" size={16} color="#64748B"/>
                  </td>
                </tr>
              ))}
              <tr style={{ background: "var(--surface-2)" }}>
                <td colSpan={4} style={{ padding: "14px 18px", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", letterSpacing: ".05em" }}>
                  TOTAL · {dataByTab[tab].length} lançamentos
                </td>
                <td style={{
                  padding: "14px 18px", textAlign: "right",
                  fontFamily: "var(--font-mono)", fontSize: 15, fontWeight: 700,
                  color: tab === "despesas" ? "#F87171" : "var(--teal-300)",
                  fontVariantNumeric: "tabular-nums",
                }}>
                  {tab === "despesas" ? "−" : ""}{fmtBRL(total)}
                </td>
                <td/>
              </tr>
            </tbody>
          </table>
        </Card>
      </div>
    </ScreenShell>
  );
}

/* ════════════════════════════════════════════════════════
   EMPRESA — DRE (P&L)
   ════════════════════════════════════════════════════════ */
function EmpresaDREView() {
  const receitaBruta = 142000;
  const impostos = 11360;
  const custosDiretos = 18500;
  const lucroBruto = receitaBruta - impostos - custosDiretos;
  const despesasOp = 14200;
  const lucroOp = lucroBruto - despesasOp;
  const prolabore = 20000;
  const resultadoLiquido = lucroOp - prolabore;
  const margemLiquida = (resultadoLiquido / receitaBruta) * 100;

  const Row = ({ label, valor, bold, indent, color, op, big }) => (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: big ? "16px 4px" : "11px 4px",
      borderBottom: "1px solid var(--border-subtle)",
      paddingLeft: indent ? 22 : 4,
    }}>
      <span style={{
        fontSize: bold ? 14 : 13,
        fontWeight: bold ? 700 : 400,
        color: bold ? "#fff" : "var(--text-muted)",
        letterSpacing: bold ? ".02em" : "0",
        textTransform: bold && !indent ? "uppercase" : "none",
      }}>
        {op && <span style={{ color: "var(--text-faint)", marginRight: 4 }}>{op}</span>}
        {label}
      </span>
      <span style={{
        fontFamily: "var(--font-mono)",
        fontSize: big ? 22 : (bold ? 15 : 13),
        fontWeight: bold ? 700 : 500,
        color: color || (bold ? "#fff" : "var(--text)"),
        fontVariantNumeric: "tabular-nums",
      }}>{valor < 0 ? "−" : ""}{fmtBRL(Math.abs(valor))}</span>
    </div>
  );

  return (
    <ScreenShell
      active="empresa"
      title="Northwind Estúdio · DRE"
      subtitle="Demonstração de Resultado simplificada — maio de 2026."
      action={
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="secondary" size="sm" leftIcon={<Icon name="calendar" size={14}/>}>Maio · 2026</Button>
          <Button variant="secondary" size="sm" leftIcon={<Icon name="download" size={14}/>}>PDF</Button>
        </div>
      }
      label="Sistema · Empresa · DRE"
    >
      <div style={{ padding: 28, display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 18, height: "100%", minHeight: 0 }}>
        {/* Left: DRE breakdown */}
        <Card padding={26} style={{ overflowY: "auto" }}>
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "#fff", margin: 0 }}>DRE Mensal</h3>
            <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "4px 0 0" }}>Receitas, custos e resultado da operação.</p>
          </div>

          <Row label="Receita bruta" valor={receitaBruta} bold/>
          <Row label="Impostos (Simples Nacional)" valor={impostos} indent op="(−)"/>
          <Row label="Custos diretos (freelas, materiais)" valor={custosDiretos} indent op="(−)"/>
          <Row label="Lucro bruto" valor={lucroBruto} bold color="#5EEAD4"/>
          <Row label="Despesas operacionais (software, contador)" valor={despesasOp} indent op="(−)"/>
          <Row label="Lucro operacional" valor={lucroOp} bold color="#5EEAD4"/>
          <Row label="Pró-labore dos sócios" valor={prolabore} indent op="(−)"/>
          <div style={{ marginTop: 6 }}/>
          <Row label="Resultado líquido" valor={resultadoLiquido} bold big
            color={resultadoLiquido >= 0 ? "#34D399" : "#F87171"}/>
        </Card>

        {/* Right: KPIs + insight */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, overflowY: "auto" }}>
          <Card padding={22}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <IconContainer icon="trending-up" color="emerald" size="sm"/>
              <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, letterSpacing: ".05em" }}>MARGEM LÍQUIDA</span>
            </div>
            <div style={{
              fontFamily: "var(--font-display)", fontSize: 48, fontWeight: 700,
              color: "#34D399", lineHeight: 1, letterSpacing: "-0.02em",
              fontVariantNumeric: "tabular-nums",
            }}>{margemLiquida.toFixed(1)}%</div>
            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "10px 0 0", lineHeight: 1.5 }}>
              Ideal acima de <strong style={{ color: "#fff" }}>20%</strong>. Você está em uma faixa saudável.
            </p>
            <div style={{ marginTop: 14, height: 4, background: "rgba(255,255,255,.06)", borderRadius: 999, overflow: "hidden" }}>
              <div style={{ width: `${Math.min(100, margemLiquida * 2)}%`, height: "100%", background: "linear-gradient(90deg, #FBBF24, #34D399)" }}/>
            </div>
          </Card>

          <Card padding={22}>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: "#fff", margin: "0 0 14px" }}>Comparativo · últimos 6 meses</h4>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 120 }}>
              {[
                ["Dez", 0.42, 0.58],
                ["Jan", 0.55, 0.45],
                ["Fev", 0.62, 0.38],
                ["Mar", 0.58, 0.42],
                ["Abr", 0.71, 0.29],
                ["Mai", 0.78, 0.22],
              ].map(([m, rec, des], i) => {
                const last = i === 5;
                return (
                  <div key={m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <div style={{ flex: 1, width: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 2 }}>
                      <div style={{ height: `${rec * 100}%`, background: last ? "#5EEAD4" : "rgba(94,234,212,.4)", borderRadius: "3px 3px 0 0" }}/>
                      <div style={{ height: `${des * 100}%`, background: last ? "#F87171" : "rgba(248,113,113,.4)", borderRadius: "0 0 3px 3px" }}/>
                    </div>
                    <span style={{ fontSize: 10, color: last ? "#fff" : "var(--text-faint)", fontWeight: last ? 600 : 400 }}>{m}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 14, marginTop: 12, fontSize: 11, color: "var(--text-muted)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: "#5EEAD4" }}/> Receita</span>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: "#F87171" }}/> Despesa</span>
            </div>
          </Card>

          <Card padding={20} style={{
            background: "linear-gradient(135deg, rgba(34,211,238,.08), rgba(34,211,238,.02))",
            border: "1px solid rgba(34,211,238,.18)",
          }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <IconContainer icon="lightbulb" color="teal" size="sm"/>
              <div>
                <h4 style={{ fontSize: 13, fontWeight: 600, color: "#fff", margin: 0, marginBottom: 4 }}>Insight do mês</h4>
                <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>
                  Despesas caíram <strong style={{ color: "#34D399" }}>12%</strong> vs abril enquanto a receita
                  cresceu <strong style={{ color: "#34D399" }}>8%</strong>. Continue assim.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ScreenShell>
  );
}

/* ════════════════════════════════════════════════════════
   EMPRESA — Pró-labore
   ════════════════════════════════════════════════════════ */
function EmpresaProlaboreView() {
  const socios = [
    { nome: "Thiago Martins", role: "CEO", percent: 60, valor: 12000, foto: "TM",
      cor: "linear-gradient(135deg, #67E8F9, #0E7490)" },
    { nome: "Ana Bessa", role: "CFO", percent: 40, valor: 8000, foto: "AB",
      cor: "linear-gradient(135deg, #A78BFA, #6366F1)" },
  ];
  const totalProlabore = socios.reduce((s, x) => s + x.valor, 0);
  const historico = [
    { mes: "Maio · 2026", valor: 20000, pago: true },
    { mes: "Abril · 2026", valor: 20000, pago: true },
    { mes: "Março · 2026", valor: 18000, pago: true },
    { mes: "Fevereiro · 2026", valor: 18000, pago: true },
    { mes: "Janeiro · 2026", valor: 15000, pago: true },
  ];

  return (
    <ScreenShell
      active="empresa"
      title="Northwind Estúdio · Pró-labore"
      subtitle="Distribuição entre sócios e histórico."
      action={<Button size="sm" leftIcon={<Icon name="plus" size={14} color="#06251F"/>}>Registrar pró-labore</Button>}
      label="Sistema · Empresa · Pró-labore"
    >
      <div style={{ padding: 28, display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 18, height: "100%", minHeight: 0 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, overflowY: "auto" }}>
          {/* Distribution card */}
          <Card padding={26}>
            <div style={{ marginBottom: 18 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff", margin: 0 }}>Distribuição vigente</h3>
              <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "4px 0 0" }}>
                Total mensal: <span style={{ color: "#fff", fontWeight: 600, fontFamily: "var(--font-mono)" }}>{fmtBRL(totalProlabore)}</span>
              </p>
            </div>

            {/* Stacked bar */}
            <div style={{
              display: "flex", height: 14, borderRadius: 999, overflow: "hidden",
              border: "1px solid var(--border)", marginBottom: 22,
            }}>
              <div style={{ width: "60%", background: "linear-gradient(90deg, #67E8F9, #0E7490)" }}/>
              <div style={{ width: "40%", background: "linear-gradient(90deg, #A78BFA, #6366F1)" }}/>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {socios.map((s) => (
                <div key={s.nome} style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: 14, borderRadius: 12,
                  background: "var(--surface-2)", border: "1px solid var(--border)",
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: s.cor,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 15, fontWeight: 700, color: "#fff",
                  }}>{s.foto}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{s.nome}</div>
                    <div style={{ fontSize: 12, color: "var(--text-faint)" }}>{s.role} · {s.percent}% das cotas</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{
                      fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700, color: "#fff",
                      fontVariantNumeric: "tabular-nums",
                    }}>{fmtBRL(s.valor)}</div>
                    <div style={{ fontSize: 11, color: "var(--text-faint)" }}>mensal</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Form preview */}
          <Card padding={26}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: "#fff", margin: "0 0 18px" }}>Registrar pró-labore</h3>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>Sócio</label>
                <div style={{
                  padding: "10px 14px", borderRadius: 10,
                  background: "var(--input)", border: "1px solid var(--border)",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  fontSize: 13.5, color: "#fff",
                }}>
                  Thiago Martins
                  <Icon name="chevron-down" size={14} color="#64748B"/>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>Valor</label>
                <div style={{
                  padding: "10px 14px", borderRadius: 10,
                  background: "var(--input)", border: "1px solid var(--border)",
                  fontSize: 14, color: "#fff", fontFamily: "var(--font-mono)",
                }}>R$ 12.000,00</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>Data</label>
                <div style={{
                  padding: "10px 14px", borderRadius: 10,
                  background: "var(--input)", border: "1px solid var(--border)",
                  fontSize: 14, color: "#fff", fontFamily: "var(--font-mono)",
                }}>01/06/2026</div>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>Observação</label>
                <div style={{
                  padding: "10px 14px", borderRadius: 10,
                  background: "var(--input)", border: "1px solid var(--border)",
                  fontSize: 14, color: "var(--text-faint)",
                }}>Ref. junho</div>
              </div>
            </div>
            <Button size="md" style={{ marginTop: 18 }}>Salvar lançamento</Button>
          </Card>
        </div>

        {/* History */}
        <Card padding={22} style={{ overflowY: "auto" }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "#fff", margin: "0 0 14px" }}>Histórico</h3>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {historico.map((h, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "13px 4px",
                borderBottom: i < historico.length - 1 ? "1px solid var(--border-subtle)" : "none",
              }}>
                <div>
                  <div style={{ fontSize: 13.5, color: "#fff", fontWeight: 500 }}>{h.mes}</div>
                  <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 2 }}>2 sócios</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{
                    fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 600, color: "#fff",
                    fontVariantNumeric: "tabular-nums",
                  }}>{fmtBRL(h.valor)}</div>
                  <Badge variant="concluido" label="Pago" dot/>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </ScreenShell>
  );
}

/* ════════════════════════════════════════════════════════
   ALINHAMENTO — Lista de sessões + início
   ════════════════════════════════════════════════════════ */
function AlinhamentoListaView() {
  const sessoes = [
    { d: "23/05", t: "Revisão semanal · Sprint 21", dur: "47min", a: 8, p: "concluida" },
    { d: "16/05", t: "Revisão semanal · Sprint 20", dur: "52min", a: 6, p: "concluida" },
    { d: "09/05", t: "Sessão estratégica Q3", dur: "1h12min", a: 11, p: "concluida" },
    { d: "02/05", t: "Revisão mensal · Abril", dur: "38min", a: 5, p: "concluida" },
  ];
  return (
    <ScreenShell
      active="alinhamento"
      title="Alinhamento"
      subtitle="Pautas, decisões e ações compartilhadas com clareza."
      label="Sistema · Alinhamento (lista)"
    >
      <div style={{ padding: 28, display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 20, height: "100%", minHeight: 0 }}>
        {/* Left: start new session */}
        <Card padding={32} style={{
          background: "linear-gradient(180deg, var(--surface-2) 0%, var(--surface) 100%)",
          border: "1px solid rgba(34,211,238,.18)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", right: -60, top: -60, opacity: .4, pointerEvents: "none" }}>
            <ConcentricRings size={320}/>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{
              display: "inline-flex", padding: "4px 10px", borderRadius: 6,
              background: "rgba(34,211,238,.10)", border: "1px solid rgba(34,211,238,.22)",
              fontSize: 10, fontWeight: 600, color: "var(--teal-300)", letterSpacing: ".12em",
              marginBottom: 18,
            }}>NOVA SESSÃO</div>
            <h2 style={{
              fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700,
              color: "#fff", margin: 0, letterSpacing: "-0.01em", lineHeight: 1.15,
            }}>
              Iniciar <em style={{ color: "var(--teal-300)", fontStyle: "italic", fontWeight: 500 }}>alinhamento</em> agora
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-muted)", margin: "12px 0 26px", lineHeight: 1.55 }}>
              Capture pauta, decisões e plano de ação. Tudo flui pro Kanban global automaticamente.
            </p>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 10, display: "block" }}>
                Modo do alinhamento
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {[
                  { v: "solo", l: "Solo", icon: "user", desc: "Sua revisão semanal" },
                  { v: "casal", l: "Casal", icon: "heart", desc: "Você + parceiro(a)" },
                  { v: "socios", l: "Sócios", icon: "users", desc: "Reunião com sócios", active: true },
                ].map((m) => (
                  <button key={m.v} style={{
                    padding: 14, borderRadius: 12,
                    background: m.active ? "rgba(34,211,238,.10)" : "var(--surface)",
                    border: m.active ? "1px solid rgba(34,211,238,.35)" : "1px solid var(--border)",
                    textAlign: "left", cursor: "pointer",
                  }}>
                    <Icon name={m.icon} size={18} color={m.active ? "#5EEAD4" : "#94A3B8"}/>
                    <div style={{ fontSize: 13, fontWeight: 600, color: m.active ? "#5EEAD4" : "#fff", marginTop: 8 }}>{m.l}</div>
                    <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 2 }}>{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <Button size="lg" leftIcon={<Icon name="play-circle" size={16} color="#06251F"/>}>
              Iniciar sessão
            </Button>
          </div>
        </Card>

        {/* Right: history */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: "#fff", margin: 0 }}>Histórico de sessões</h3>
            <a href="#" style={{ fontSize: 12, color: "var(--teal-300)", fontWeight: 500 }}>Ver tudo</a>
          </div>

          {sessoes.map((s, i) => (
            <Card key={i} hoverable padding={18}>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 11,
                  background: "var(--surface-2)", border: "1px solid var(--border)",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <div style={{ fontSize: 9, color: "var(--text-faint)", letterSpacing: ".05em" }}>{s.d.split('/')[1]}</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{s.d.split('/')[0]}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{s.t}</div>
                  <div style={{ display: "flex", gap: 10, fontSize: 11, color: "var(--text-muted)" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <Icon name="clock" size={11} color="#94A3B8"/>
                      {s.dur}
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <Icon name="check-square" size={11} color="#94A3B8"/>
                      {s.a} ações
                    </span>
                  </div>
                </div>
                <Icon name="chevron-right" size={16} color="#64748B"/>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </ScreenShell>
  );
}

/* ════════════════════════════════════════════════════════
   ALINHAMENTO — Sessão ativa
   ════════════════════════════════════════════════════════ */
function AlinhamentoSessaoView() {
  const pauta = [
    { ok: true,  t: "Como estamos vs metas do trimestre?",   resp: "Q3 em risco — buffer de tempo erodido em 2 frentes." },
    { ok: true,  t: "Decisões pendentes",                    resp: "Aprovar contratação · Definir stack v2" },
    { ok: false, t: "Bloqueios da semana", active: true },
    { ok: false, t: "Compromissos para próxima semana" },
    { ok: false, t: "Riscos identificados" },
  ];
  const acoes = [
    { t: "Aprovar contratação designer pleno", q: "TM", d: "Ter, 27/05", p: "alta" },
    { t: "Documentar stack v2 do produto", q: "RL", d: "Sex, 30/05", p: "media" },
    { t: "Renegociar SLA com fornecedor X", q: "AB", d: "Seg, 02/06", p: "alta" },
    { t: "Workshop discovery Q3", q: "TM", d: "Sem 23/06", p: "baixa" },
  ];
  const prioColor = { alta: "#F87171", media: "#FBBF24", baixa: "#94A3B8" };

  return (
    <ScreenShell
      active="alinhamento"
      title="Sessão em andamento · Sócios"
      subtitle="00:18:42 · 3 ações criadas até agora"
      action={
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="secondary" size="sm" leftIcon={<Icon name="pause" size={14}/>}>Pausar</Button>
          <Button size="sm" leftIcon={<Icon name="check-square" size={14} color="#06251F"/>}>Encerrar e salvar</Button>
        </div>
      }
      label="Sistema · Alinhamento · Sessão ativa"
    >
      <div style={{ padding: 28, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, height: "100%", minHeight: 0 }}>
        {/* Left: Pauta + notas */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, overflowY: "auto" }}>
          <Card padding={22}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "#fff", margin: 0 }}>Pauta automática</h3>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>2 de 5 cobertos</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {pauta.map((p, i) => (
                <div key={i} style={{
                  padding: "12px 14px", borderRadius: 10,
                  background: p.active ? "rgba(34,211,238,.06)" : "var(--surface-2)",
                  border: p.active ? "1px solid rgba(34,211,238,.30)" : "1px solid var(--border)",
                  display: "flex", gap: 12, alignItems: "flex-start",
                }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: 6, flexShrink: 0, marginTop: 1,
                    border: p.ok ? "1px solid #34D399" : (p.active ? "1.5px solid #5EEAD4" : "1.5px solid var(--border-strong)"),
                    background: p.ok ? "#34D399" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {p.ok && <Icon name="check" size={11} color="#03060E" strokeWidth={3}/>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: 13.5, fontWeight: p.active ? 600 : 500,
                      color: p.ok ? "var(--text-faint)" : "#fff",
                      lineHeight: 1.4,
                    }}>{p.t}</div>
                    {p.resp && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6, lineHeight: 1.5, paddingLeft: 0 }}>{p.resp}</div>}
                    {p.active && (
                      <div style={{
                        marginTop: 8, fontSize: 11, color: "var(--teal-300)",
                        fontWeight: 600, letterSpacing: ".08em",
                      }}>EM DISCUSSÃO ›</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card padding={22}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: "#fff", margin: "0 0 14px" }}>Anotações da sessão</h3>
            <div style={{
              minHeight: 130,
              padding: 14, borderRadius: 10,
              background: "var(--input)", border: "1px solid var(--border)",
              fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6,
            }}>
              <p style={{ margin: 0 }}>
                • Time produto está em risco de não bater entrega no fim do trimestre. <br/>
                • Combinamos: reforçar com freelance até fim de junho.<br/>
                • Decisão de stack ficou pendente até próxima — RL traz proposta documentada.
              </p>
            </div>
          </Card>
        </div>

        {/* Right: Plano de ação */}
        <Card padding={22} style={{
          background: "var(--surface-2)",
          display: "flex", flexDirection: "column", minHeight: 0,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: "#fff", margin: 0 }}>Plano de ação</h3>
            <Badge variant="empresa" label={`${acoes.length} ações`}/>
          </div>
          <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "4px 0 16px" }}>
            Estas ações irão para o Kanban global automaticamente.
          </p>

          {/* Quick add */}
          <div style={{
            display: "flex", gap: 8, marginBottom: 14,
            padding: 10, borderRadius: 10,
            background: "var(--surface)", border: "1px dashed var(--border-strong)",
          }}>
            <Icon name="plus" size={16} color="#5EEAD4"/>
            <span style={{ fontSize: 13, color: "var(--text-muted)", flex: 1 }}>Adicionar nova ação...</span>
            <span style={{ fontSize: 10, color: "var(--text-faint)", fontFamily: "var(--font-mono)" }}>⌘ + N</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, overflowY: "auto", flex: 1, minHeight: 0 }}>
            {acoes.map((a, i) => (
              <div key={i} style={{
                padding: 14, borderRadius: 10,
                background: "var(--surface)", border: "1px solid var(--border)",
              }}>
                <div style={{ fontSize: 13.5, color: "#fff", lineHeight: 1.4, marginBottom: 10 }}>{a.t}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: "50%",
                      background: "linear-gradient(135deg, #475569, #1E293B)",
                      border: "1px solid var(--border)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 9, fontWeight: 700, color: "#fff",
                    }}>{a.q}</div>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{a.d}</span>
                  </div>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    fontSize: 11, color: prioColor[a.p], fontWeight: 600,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: prioColor[a.p] }}/>
                    {a.p}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </ScreenShell>
  );
}

/* ════════════════════════════════════════════════════════
   CONFIGURAÇÕES
   ════════════════════════════════════════════════════════ */
function Toggle({ on, onChange }) {
  return (
    <button
      onClick={onChange}
      style={{
        width: 40, height: 22, borderRadius: 999,
        background: on ? "var(--teal-400)" : "rgba(255,255,255,.08)",
        border: on ? "1px solid var(--teal-300)" : "1px solid var(--border-strong)",
        position: "relative", cursor: "pointer", flexShrink: 0,
        transition: "all 150ms ease",
      }}>
      <span style={{
        position: "absolute", top: 2, left: on ? 19 : 2,
        width: 16, height: 16, borderRadius: "50%",
        background: on ? "#06251F" : "#fff",
        transition: "all 150ms var(--ease-out)",
      }}/>
    </button>
  );
}

function ConfiguracoesView() {
  const [gamif, setGamif] = React.useState(true);
  const [notif, setNotif] = React.useState(true);
  const [weekly, setWeekly] = React.useState(false);

  return (
    <ScreenShell
      active="config"
      title="Configurações"
      subtitle="Workspace, integrações, plano e preferências globais."
      label="Sistema · Configurações"
    >
      <div style={{ padding: 28, display: "grid", gridTemplateColumns: "220px 1fr", gap: 24, height: "100%", minHeight: 0 }}>
        {/* Sub nav */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {[
            ["workspace", "Workspace", "building", true],
            ["membros", "Membros", "users", false],
            ["plano", "Plano e faturamento", "credit-card", false],
            ["integracoes", "Integrações", "plug", false],
            ["gamificacao", "Gamificação", "gamepad-2", false],
            ["notificacoes", "Notificações", "bell", false],
            ["aparencia", "Aparência", "palette", false],
            ["seguranca", "Segurança", "shield", false],
            ["lgpd", "Privacidade", "scale", false],
          ].map(([k, l, ic, active]) => (
            <button key={k} style={{
              padding: "9px 12px", borderRadius: 8,
              fontSize: 13, fontWeight: active ? 600 : 500,
              color: active ? "var(--teal-300)" : "var(--text-muted)",
              background: active ? "rgba(34,211,238,.08)" : "transparent",
              display: "flex", alignItems: "center", gap: 10,
              textAlign: "left", cursor: "pointer",
            }}>
              <Icon name={ic} size={15} color={active ? "#5EEAD4" : "#94A3B8"}/>
              {l}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Workspace identity */}
          <Card padding={26}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff", margin: "0 0 4px" }}>Identidade do workspace</h3>
            <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 22px" }}>Nome, logo e fuso horário que todo o time vê.</p>

            <div style={{ display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 22 }}>
              <div style={{
                width: 72, height: 72, borderRadius: 16,
                background: "linear-gradient(135deg, rgba(34,211,238,.18), rgba(34,211,238,.04))",
                border: "1px solid rgba(34,211,238,.22)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 700, color: "var(--teal-300)",
              }}>N</div>
              <div>
                <Button variant="secondary" size="sm" leftIcon={<Icon name="upload" size={13}/>}>Trocar logo</Button>
                <p style={{ fontSize: 11, color: "var(--text-faint)", margin: "10px 0 0" }}>PNG ou SVG · mín 256×256 · max 2MB</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                ["Nome do workspace", "Northwind Estúdio"],
                ["Slug / URL", "northwind", "northwind.ordinum.app"],
                ["Fuso horário", "America/Sao_Paulo"],
                ["Moeda padrão", "BRL — Real (R$)"],
              ].map(([l, v, sub]) => (
                <div key={l}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>{l}</label>
                  <div style={{
                    padding: "10px 14px", borderRadius: 10,
                    background: "var(--input)", border: "1px solid var(--border)",
                    fontSize: 13.5, color: "#fff",
                  }}>{v}</div>
                  {sub && <p style={{ fontSize: 11, color: "var(--text-faint)", margin: "5px 0 0", fontFamily: "var(--font-mono)" }}>{sub}</p>}
                </div>
              ))}
            </div>
          </Card>

          {/* Preferências */}
          <Card padding={26}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff", margin: "0 0 4px" }}>Preferências</h3>
            <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 22px" }}>Comportamentos do produto que valem pra todo o workspace.</p>

            {[
              {
                icon: "gamepad-2", c: "purple",
                t: "Gamificação", d: "Pontos, streaks e badges ao completar ações. Reconhece trabalho real — nunca pune.",
                on: gamif, set: setGamif,
              },
              {
                icon: "bell", c: "amber",
                t: "Notificações por e-mail", d: "Resumo diário das ações pendentes, decisões e alinhamentos do dia.",
                on: notif, set: setNotif,
              },
              {
                icon: "send", c: "teal",
                t: "Relatório semanal automático", d: "Envia toda segunda 8h: progresso por contexto + KPIs do workspace.",
                on: weekly, set: setWeekly,
              },
            ].map((row, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 16,
                padding: "16px 0",
                borderTop: i === 0 ? "none" : "1px solid var(--border-subtle)",
              }}>
                <IconContainer icon={row.icon} color={row.c} size="md"/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{row.t}</div>
                  <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 2, lineHeight: 1.5 }}>{row.d}</div>
                </div>
                <Toggle on={row.on} onChange={() => row.set(!row.on)}/>
              </div>
            ))}
          </Card>

          {/* Plano */}
          <Card padding={26} style={{
            background: "linear-gradient(135deg, rgba(34,211,238,.08), rgba(34,211,238,.02))",
            border: "1px solid rgba(34,211,238,.18)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
              <div>
                <div style={{
                  display: "inline-flex", padding: "3px 9px", borderRadius: 5,
                  background: "rgba(34,211,238,.12)", color: "var(--teal-300)",
                  fontSize: 10, fontWeight: 700, letterSpacing: ".1em", marginBottom: 10,
                }}>PLANO ATUAL</div>
                <h3 style={{
                  fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700,
                  color: "#fff", margin: 0, letterSpacing: "-0.01em",
                }}>Pro · 5 usuários</h3>
                <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "6px 0 0" }}>
                  Renova em <strong style={{ color: "#fff" }}>30 de junho</strong> · <span style={{ fontFamily: "var(--font-mono)" }}>{fmtBRL(245)}/mês</span>
                </p>
              </div>
              <Button variant="outline" size="md">Gerenciar plano</Button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginTop: 22 }}>
              {[
                ["Workspaces", "1 / ilimitados"],
                ["Membros", "5 / ilimitados"],
                ["Contextos", "7 / ilimitados"],
              ].map(([l, v]) => (
                <div key={l} style={{
                  padding: 12, borderRadius: 10,
                  background: "rgba(255,255,255,.03)", border: "1px solid var(--border)",
                }}>
                  <div style={{ fontSize: 11, color: "var(--text-faint)" }}>{l}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginTop: 4 }}>{v}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </ScreenShell>
  );
}

Object.assign(window, {
  LoginView, CadastroView, ConviteView,
  EmpresaListaView, EmpresaLancamentosView, EmpresaDREView, EmpresaProlaboreView,
  AlinhamentoListaView, AlinhamentoSessaoView,
  ConfiguracoesView,
  ScreenShell,
});
