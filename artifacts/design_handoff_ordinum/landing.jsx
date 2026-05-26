/* Ordinum — Landing page artboard
   Designed at 1440 wide; ~3000 tall.
   Sections: Nav · Hero · Logos · Como funciona · Preview · Pricing · CTA · Footer
*/

function NavBar({ scrolled = false }) {
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      padding: "20px 56px",
      background: scrolled ? "rgba(3,7,18,.75)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? "1px solid var(--border-subtle)" : "1px solid transparent",
      transition: "all 250ms var(--ease-out)",
    }}>
      <nav style={{
        maxWidth: 1280, margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32,
      }}>
        <OrdinumLogo size={30}/>
        <ul style={{ display: "flex", gap: 36, listStyle: "none", margin: 0, padding: 0 }}>
          {[
            ["Recursos", false],
            ["Soluções", true],
            ["Preços", false],
            ["Sobre", false],
            ["Contato", false],
          ].map(([label, hasCaret]) => (
            <li key={label}>
              <a href="#" style={{
                fontSize: 14, color: "var(--text-muted)", fontWeight: 500,
                display: "inline-flex", alignItems: "center", gap: 4,
                padding: "8px 0", transition: "color var(--dur)",
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#fff"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
              >
                {label}
                {hasCaret && <Icon name="chevron-down" size={14}/>}
              </a>
            </li>
          ))}
        </ul>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="#" style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 500 }}>Entrar</a>
          <Button size="md">Começar grátis</Button>
        </div>
      </nav>
    </header>
  );
}

/* ─── Hero ─────────────────────────────────────────────── */
function Hero({ variant = "sans" }) {
  const isPlayfair = variant === "playfair";
  return (
    <section style={{
      padding: "80px 56px 100px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background ambient glow */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 1100px 700px at 65% 30%, rgba(45,212,191,.08), transparent 60%)",
        pointerEvents: "none",
      }}/>

      <div style={{
        maxWidth: 1280, margin: "0 auto",
        display: "grid", gridTemplateColumns: "1.05fr .95fr", gap: 60, alignItems: "center",
        position: "relative",
      }}>
        {/* Left: copy */}
        <div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "7px 14px", borderRadius: 8,
            background: "rgba(45,212,191,.08)",
            border: "1px solid rgba(45,212,191,.22)",
            color: "var(--teal-300)",
            fontSize: 11, fontWeight: 600, letterSpacing: ".12em",
            marginBottom: 32,
          }}>
            <Icon name="square-stack" size={14} color="#5EEAD4"/>
            ORGANIZE. PRIORIZE. EXECUTE.
          </div>

          {isPlayfair ? (
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: 76, fontWeight: 700, lineHeight: 1.05,
              letterSpacing: "-0.02em", color: "#fff", margin: 0,
              textWrap: "balance",
            }}>
              Sistema executivo para{" "}
              <em style={{
                fontStyle: "italic", fontWeight: 500,
                color: "var(--teal-300)",
              }}>ordem, clareza e separação</em>{" "}
              de contextos.
            </h1>
          ) : (
            <h1 style={{
              fontFamily: "var(--font-body)",
              fontSize: 72, fontWeight: 800, lineHeight: 1.04,
              letterSpacing: "-0.035em", color: "#fff", margin: 0,
              textWrap: "balance",
            }}>
              Sistema executivo para{" "}
              <span style={{ color: "var(--teal-300)" }}>
                ordem, clareza e separação
              </span>{" "}
              de contextos.
            </h1>
          )}

          <p style={{
            fontSize: 17, lineHeight: 1.55, color: "var(--text-muted)",
            marginTop: 28, marginBottom: 40, maxWidth: 520,
          }}>
            O produto desenvolvido para organizar responsabilidades mistas em espaços
            operacionais claros, reduzindo o ruído na tomada de decisão.
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <Button size="lg" rightIcon={<Icon name="arrow-right" size={16} color="#06251F"/>}>
              Crie seu Workspace Agora
            </Button>
            <a href="#" style={{
              display: "inline-flex", alignItems: "center", gap: 12,
              color: "var(--text-muted)", fontSize: 14, fontWeight: 500,
            }}>
              <span style={{
                width: 38, height: 38, borderRadius: "50%",
                background: "rgba(255,255,255,.04)",
                border: "1px solid rgba(255,255,255,.10)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon name="play" size={14} color="#fff" style={{ marginLeft: 2 }}/>
              </span>
              Ver como funciona
            </a>
          </div>
        </div>

        {/* Right: visual + feature pills */}
        <div style={{ position: "relative", height: 480 }}>
          {/* Concentric rings centered */}
          <div style={{ position: "absolute", left: -40, top: 0 }}>
            <ConcentricRings size={460}/>
          </div>

          {/* Floating feature cards */}
          <div style={{
            position: "absolute", right: -10, top: 0,
            display: "flex", flexDirection: "column", gap: 32, width: 320,
          }}>
            {[
              { icon: "layout-grid",   color: "teal",   title: "Espaços organizados",
                desc: "Separação clara entre áreas e responsabilidades" },
              { icon: "layers",       color: "emerald",  title: "Visão estratégica",
                desc: "Dashboards e métricas que apoiam decisões melhores" },
              { icon: "git-fork",     color: "purple", title: "Execução com foco",
                desc: "Fluxos e rotinas que tiram o plano do papel" },
            ].map((f) => (
              <div key={f.title} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <IconContainer icon={f.icon} color={f.color} size="md"/>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Embedded dashboard preview */}
      <div style={{
        maxWidth: 1280, margin: "100px auto 0",
        borderRadius: 20, overflow: "hidden",
        border: "1px solid rgba(255,255,255,.08)",
        background: "linear-gradient(180deg, var(--surface) 0%, var(--bg-alt) 100%)",
        boxShadow: "0 40px 80px -20px rgba(0,0,0,.6), 0 0 80px -20px rgba(45,212,191,.15)",
      }}>
        <DashboardPreviewMini/>
      </div>
    </section>
  );
}

/* Compressed dashboard preview shown inside the hero section */
function DashboardPreviewMini() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: 440 }}>
      {/* mini sidebar */}
      <aside style={{
        padding: "20px 14px", background: "var(--sidebar)",
        borderRight: "1px solid var(--border)",
      }}>
        <div style={{ padding: "4px 8px 18px" }}><OrdinumLogo size={22}/></div>
        {[
          ["home", "Visão Geral", true],
          ["building-2", "Empresa", false],
          ["user", "Pessoal", false],
          ["folder-kanban", "Projetos", false],
          ["columns-3", "Kanban Global", false],
          ["compass", "Alinhamento", false],
          ["bar-chart-3", "Relatórios", false],
          ["settings", "Configurações", false],
        ].map(([icon, label, active]) => (
          <div key={label} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "9px 10px", borderRadius: 8,
            fontSize: 13, fontWeight: active ? 600 : 500,
            color: active ? "#5EEAD4" : "var(--text-muted)",
            background: active ? "rgba(45,212,191,.08)" : "transparent",
            marginBottom: 2, cursor: "pointer",
          }}>
            <Icon name={icon} size={15} color={active ? "#5EEAD4" : "#94A3B8"}/>
            {label}
          </div>
        ))}
      </aside>

      {/* mini content */}
      <main style={{ padding: 22 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <h3 style={{ fontFamily: "var(--font-body)", fontSize: 18, fontWeight: 700, color: "#fff", margin: 0 }}>Visão Geral</h3>
            <p style={{ fontSize: 12, color: "var(--text-faint)", margin: 0 }}>Acompanhe o que importa em todos os seus contextos.</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Icon name="search" size={16} color="#94A3B8"/>
            <Icon name="bell" size={16} color="#94A3B8"/>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "5px 12px 5px 5px",
              borderRadius: 999, background: "rgba(255,255,255,.03)",
              border: "1px solid var(--border)",
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: "50%",
                background: "linear-gradient(135deg, #5EEAD4, #0F766E)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, color: "#06251F",
              }}>TM</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>Thiago Martins</div>
                <div style={{ fontSize: 9, color: "var(--text-faint)" }}>Administrador</div>
              </div>
            </div>
          </div>
        </div>

        {/* KPI grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 14 }}>
          {[
            { t: "Projetos ativos", v: "24", d: "+12%", up: true, c: "#5EEAD4", p: [12,14,11,16,14,18,15,19,17,22,24] },
            { t: "Tarefas em andamento", v: "87", d: "+8%", up: true, c: "#60A5FA", p: [70,72,68,74,76,73,80,78,82,85,87] },
            { t: "Concluídas", v: "142", d: "+18%", up: true, c: "#34D399", p: [110,115,118,122,128,131,135,138,140,141,142] },
            { t: "Pendências", v: "15", d: "-5%", up: false, c: "#FBBF24", p: [22,20,21,19,18,18,17,16,16,15,15] },
          ].map((k) => (
            <div key={k.t} style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              borderRadius: 12, padding: 12,
            }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>{k.t}</div>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{k.v}</div>
                <Sparkline points={k.p} color={k.c} width={70} height={28}/>
              </div>
              <div style={{ marginTop: 4, fontSize: 10 }}>
                <span style={{ color: k.up ? "#34D399" : "#F87171", fontWeight: 600 }}>{k.d}</span>{" "}
                <span style={{ color: "var(--text-faint)" }}>vs mês anterior</span>
              </div>
            </div>
          ))}
        </div>

        {/* mini kanban + next actions */}
        <div style={{ display: "grid", gridTemplateColumns: "3fr 1.2fr", gap: 12 }}>
          <div style={{
            background: "var(--surface-2)", border: "1px solid var(--border)",
            borderRadius: 12, padding: 12,
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", marginBottom: 10 }}>Kanban Global</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {[
                { title: "A fazer", count: 8, items: [["Revisar proposta comercial","empresa"],["Planejar campanha Q2","marketing"]] },
                { title: "Em andamento", count: 5, items: [["Desenvolver dashboard","produto"],["Reunião com stakeholders","empresa"]] },
                { title: "Concluído", count: 12, items: [["Análise de métricas","dados"],["Treinamento equipe","pessoal"]] },
              ].map((col) => (
                <div key={col.title}>
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    fontSize: 10, color: "var(--text-muted)",
                    padding: "6px 8px", marginBottom: 6,
                    background: "rgba(255,255,255,.02)", borderRadius: 6,
                  }}>
                    <span style={{ fontWeight: 600, color: "#CBD5E1" }}>{col.title}</span>
                    <span>{col.count}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {col.items.map(([title, tag]) => (
                      <div key={title} style={{
                        background: "var(--surface-3)",
                        border: "1px solid var(--border)",
                        padding: "8px 10px", borderRadius: 8,
                      }}>
                        <div style={{ fontSize: 11, color: "#fff", marginBottom: 5, lineHeight: 1.3 }}>{title}</div>
                        <Badge variant={tag} label={tag[0].toUpperCase() + tag.slice(1)} size="sm"/>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: "var(--surface-2)", border: "1px solid var(--border)",
            borderRadius: 12, padding: 12,
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", marginBottom: 10 }}>Próximas ações</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                ["1:1 com time de produto", "Hoje, 10:00", "users"],
                ["Entregar relatório mensal", "Amanhã, 09:00", "file-text"],
                ["Planejamento estratégico", "Sex, 14:00", "compass"],
              ].map(([t, when, icon]) => (
                <div key={t} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 4px", borderBottom: "1px solid var(--border-subtle)",
                }}>
                  <Icon name={icon} size={12} color="#5EEAD4"/>
                  <div style={{ flex: 1, fontSize: 11, color: "#fff" }}>{t}</div>
                  <div style={{ fontSize: 10, color: "var(--text-faint)" }}>{when}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ─── Logos / social proof ────────────────────────────── */
function LogoCloud() {
  const logos = ["LATTICE", "Northwind", "ARCANE", "Pellucid", "Vellovy", "QUANTA", "Roseira"];
  return (
    <section style={{ padding: "60px 56px", borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 12, color: "var(--text-faint)", letterSpacing: ".18em", fontWeight: 600, marginBottom: 32 }}>
          ORGANIZAÇÕES QUE EXECUTAM COM ORDINUM
        </div>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          gap: 24, flexWrap: "wrap",
        }}>
          {logos.map((l) => (
            <span key={l} style={{
              fontFamily: l === "LATTICE" || l === "ARCANE" || l === "QUANTA" ? "var(--font-body)" : "var(--font-display)",
              fontWeight: l === "Vellovy" ? 700 : (l === "LATTICE" || l === "ARCANE" || l === "QUANTA" ? 700 : 500),
              fontSize: l === "Vellovy" ? 22 : 20,
              fontStyle: l === "Pellucid" || l === "Roseira" ? "italic" : "normal",
              letterSpacing: l === "LATTICE" || l === "ARCANE" || l === "QUANTA" ? ".15em" : "-0.01em",
              color: "var(--text-faint)",
              opacity: .6,
            }}>{l}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Como funciona — 4 steps ────────────────────────── */
function ComoFunciona() {
  const steps = [
    {
      n: "01",
      icon: "compass",
      title: "Defina seus contextos",
      desc: "Empresa, Pessoal, Projetos, Time. Cada esfera ganha seu próprio espaço sem se misturar.",
    },
    {
      n: "02",
      icon: "list-todo",
      title: "Capture tudo num só lugar",
      desc: "Tarefas, decisões, alinhamentos, métricas. Ordinum organiza por contexto automaticamente.",
    },
    {
      n: "03",
      icon: "git-fork",
      title: "Priorize com clareza",
      desc: "Kanban global cruzando contextos. Veja onde está parado e o que move o ponteiro hoje.",
    },
    {
      n: "04",
      icon: "trending-up",
      title: "Execute e acompanhe",
      desc: "Dashboards executivos por contexto. Foco no que importa, sem ruído.",
    },
  ];
  return (
    <section style={{ padding: "120px 56px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 56, gap: 40 }}>
          <div>
            <div style={{
              display: "inline-flex", padding: "5px 12px", borderRadius: 6,
              background: "rgba(45,212,191,.08)", border: "1px solid rgba(45,212,191,.22)",
              color: "var(--teal-300)", fontSize: 11, fontWeight: 600, letterSpacing: ".12em",
              marginBottom: 20,
            }}>COMO FUNCIONA</div>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: 52, fontWeight: 700, lineHeight: 1.1,
              color: "#fff", margin: 0, letterSpacing: "-0.02em",
              maxWidth: 720,
            }}>
              Quatro passos do <em style={{ color: "var(--teal-300)", fontStyle: "italic", fontWeight: 500 }}>caos disperso</em> para a operação executada.
            </h2>
          </div>
          <p style={{ fontSize: 15, color: "var(--text-muted)", maxWidth: 360, lineHeight: 1.6, margin: 0 }}>
            Ordinum não é mais uma ferramenta de tarefas. É a arquitetura de decisão que separa
            o que precisa estar separado e une o que precisa estar unido.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, position: "relative" }}>
          {/* Connector line */}
          <div style={{
            position: "absolute", top: 28, left: 80, right: 80,
            height: 1, background: "linear-gradient(90deg, transparent, rgba(45,212,191,.30), rgba(45,212,191,.30), transparent)",
          }}/>
          {steps.map((s) => (
            <div key={s.n} style={{
              padding: 24, borderRadius: 16,
              background: "var(--surface)", border: "1px solid var(--border)",
              position: "relative",
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: "var(--bg)", border: "1px solid rgba(45,212,191,.30)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 20,
              }}>
                <Icon name={s.icon} size={26} color="#5EEAD4" strokeWidth={1.6}/>
              </div>
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--teal-300)",
                fontWeight: 600, letterSpacing: ".05em", marginBottom: 8,
              }}>{s.n}</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: "#fff", margin: 0, marginBottom: 8, letterSpacing: "-0.01em" }}>{s.title}</h3>
              <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.55, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Pricing ───────────────────────────────────────── */
function Pricing() {
  const tiers = [
    {
      name: "Starter",
      price: "Grátis",
      sub: "Para começar a organizar",
      cta: "Começar grátis",
      ctaVariant: "secondary",
      features: ["1 workspace", "Até 3 contextos", "Kanban global", "100 tarefas/mês"],
    },
    {
      name: "Pro",
      price: "R$ 49",
      per: "/mês por usuário",
      sub: "Para times executivos",
      cta: "Iniciar Pro",
      ctaVariant: "primary",
      featured: true,
      features: [
        "Workspaces ilimitados",
        "Contextos ilimitados",
        "Dashboards executivos",
        "Alinhamento estratégico",
        "Integrações (Slack, Google)",
        "Suporte prioritário",
      ],
    },
    {
      name: "Empresa",
      price: "Sob medida",
      sub: "Para organizações",
      cta: "Falar com vendas",
      ctaVariant: "outline",
      features: ["Tudo do Pro", "SSO + SCIM", "Logs de auditoria", "SLA dedicado", "CSM dedicado"],
    },
  ];
  return (
    <section style={{ padding: "120px 56px", background: "linear-gradient(180deg, var(--bg) 0%, var(--bg-alt) 100%)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{
            display: "inline-flex", padding: "5px 12px", borderRadius: 6,
            background: "rgba(45,212,191,.08)", border: "1px solid rgba(45,212,191,.22)",
            color: "var(--teal-300)", fontSize: 11, fontWeight: 600, letterSpacing: ".12em",
            marginBottom: 20,
          }}>PREÇOS</div>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: 52, fontWeight: 700, lineHeight: 1.1,
            color: "#fff", margin: 0, letterSpacing: "-0.02em",
          }}>
            Eleve seu padrão de execução.
          </h2>
          <p style={{ fontSize: 15, color: "var(--text-muted)", marginTop: 16, maxWidth: 540, margin: "16px auto 0", lineHeight: 1.6 }}>
            Comece grátis. Cresça quando fizer sentido. Sem pegadinhas, sem cobranças surpresa.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, maxWidth: 1080, margin: "0 auto" }}>
          {tiers.map((t) => (
            <div key={t.name} style={{
              padding: 32, borderRadius: 18,
              background: t.featured ? "linear-gradient(180deg, var(--surface-2) 0%, var(--surface) 100%)" : "var(--surface)",
              border: t.featured ? "1px solid rgba(45,212,191,.32)" : "1px solid var(--border)",
              boxShadow: t.featured ? "0 0 60px -20px rgba(45,212,191,.30)" : "none",
              position: "relative",
            }}>
              {t.featured && (
                <div style={{
                  position: "absolute", top: -10, right: 20,
                  padding: "4px 10px", borderRadius: 6,
                  background: "#2DD4BF", color: "#06251F",
                  fontSize: 10, fontWeight: 700, letterSpacing: ".08em",
                }}>RECOMENDADO</div>
              )}
              <div style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 4 }}>{t.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
                <span style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 44, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1,
                }}>{t.price}</span>
                {t.per && <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{t.per}</span>}
              </div>
              <p style={{ fontSize: 13, color: "var(--text-faint)", marginTop: 0, marginBottom: 24 }}>{t.sub}</p>
              <Button variant={t.ctaVariant} fullWidth size="md">{t.cta}</Button>

              <ul style={{
                listStyle: "none", padding: 0, marginTop: 24, marginBottom: 0,
                display: "flex", flexDirection: "column", gap: 10,
              }}>
                {t.features.map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--text-muted)" }}>
                    <Icon name="check" size={15} color="#5EEAD4" strokeWidth={2.4}/>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Final CTA ────────────────────────────────────── */
function FinalCta() {
  return (
    <section style={{ padding: "120px 56px" }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto",
        padding: "72px 60px", borderRadius: 24,
        background: "linear-gradient(135deg, rgba(45,212,191,.12) 0%, rgba(13,148,136,.04) 60%, transparent 100%), var(--surface)",
        border: "1px solid rgba(45,212,191,.22)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Decorative ring */}
        <div style={{ position: "absolute", right: -100, top: -100, opacity: .5 }}>
          <ConcentricRings size={400}/>
        </div>

        <div style={{ position: "relative", maxWidth: 560 }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: 44, fontWeight: 700, lineHeight: 1.1,
            color: "#fff", margin: 0, letterSpacing: "-0.02em",
          }}>
            Pronto para <em style={{ color: "var(--teal-300)", fontStyle: "italic", fontWeight: 500 }}>elevar seu padrão</em>?
          </h2>
          <p style={{ fontSize: 16, color: "var(--text-muted)", marginTop: 16, marginBottom: 36, lineHeight: 1.6 }}>
            Crie seu workspace gratuito em menos de 60 segundos. Sem cartão de crédito.
          </p>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <Button size="lg" rightIcon={<Icon name="arrow-right" size={16} color="#06251F"/>}>
              Crie seu Workspace Agora
            </Button>
            <Button variant="ghost" size="lg">Agendar demo</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ────────────────────────────────────────── */
function Footer() {
  const cols = [
    { title: "Produto", links: ["Recursos", "Soluções", "Preços", "Integrações", "Mudanças"] },
    { title: "Empresa", links: ["Sobre", "Manifesto", "Carreiras", "Imprensa", "Contato"] },
    { title: "Recursos", links: ["Blog", "Central de ajuda", "Status", "Comunidade", "API"] },
    { title: "Legal", links: ["Privacidade", "Termos", "Segurança", "LGPD", "DPO"] },
  ];
  return (
    <footer style={{
      padding: "80px 56px 40px",
      borderTop: "1px solid var(--border)",
      background: "var(--bg-alt)",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr repeat(4, 1fr)", gap: 40, marginBottom: 60 }}>
          <div>
            <OrdinumLogo size={28}/>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 16, lineHeight: 1.55, maxWidth: 280 }}>
              Sistema executivo para organizações que precisam de ordem, clareza e separação de contextos.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              {["linkedin", "instagram", "youtube"].map((s) => (
                <div key={s} style={{
                  width: 34, height: 34, borderRadius: 8,
                  background: "rgba(255,255,255,.03)",
                  border: "1px solid var(--border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                }}>
                  <Icon name={s} size={15} color="#94A3B8"/>
                </div>
              ))}
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".1em", color: "#fff", marginBottom: 16 }}>
                {c.title.toUpperCase()}
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {c.links.map((l) => (
                  <li key={l}><a href="#" style={{ fontSize: 13, color: "var(--text-muted)" }}>{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "24px 0 0", borderTop: "1px solid var(--border-subtle)",
        }}>
          <div style={{ fontSize: 12, color: "var(--text-faint)" }}>© 2026 Ordinum. Todos os direitos reservados.</div>
          <div style={{ fontSize: 12, color: "var(--text-faint)" }}>Feito com clareza no Brasil.</div>
        </div>
      </div>
    </footer>
  );
}

/* ─── Composed landing ──────────────────────────────── */
function Landing({ heroVariant = "sans" }) {
  return (
    <div className="bg-radial-teal" style={{ minHeight: "100%", color: "var(--text)" }} data-screen-label="Landing">
      <NavBar/>
      <Hero variant={heroVariant}/>
      <LogoCloud/>
      <ComoFunciona/>
      <Pricing/>
      <FinalCta/>
      <Footer/>
    </div>
  );
}

Object.assign(window, { Landing, NavBar, Hero, ComoFunciona, Pricing, FinalCta, Footer, DashboardPreviewMini });
