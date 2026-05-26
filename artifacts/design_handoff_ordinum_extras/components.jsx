/* Ordinum components — primitives for the landing page + system app.
   Loaded as <script type="text/babel" src="components.jsx">.
   Exports to window so other Babel scripts can pick them up. */

const { useState, useEffect, useRef, useId } = React;

/* ─── Icon helper (Lucide) ──────────────────────────────── */
function Icon({ name, size = 16, color, strokeWidth = 1.8, style = {} }) {
  return (
    <i
      data-lucide={name}
      style={{
        width: size, height: size, color, strokeWidth,
        display: "inline-flex", verticalAlign: "middle",
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

/* Hook: re-mount lucide icons whenever a component renders. */
function useLucide(deps = []) {
  useEffect(() => {
    const t = setTimeout(() => window.lucide && window.lucide.createIcons(), 30);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/* ─── Logo: concentric rings + dot in teal ──────────── */
function OrdinumLogo({ size = 28, withWordmark = true, color = "#fff" }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <defs>
          <linearGradient id="ord-grad" x1="0" y1="0" x2="40" y2="40">
            <stop offset="0%" stopColor="#5EEAD4"/>
            <stop offset="100%" stopColor="#0D9488"/>
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="18" stroke="url(#ord-grad)" strokeWidth="1.2" opacity=".35"/>
        <circle cx="20" cy="20" r="13" stroke="url(#ord-grad)" strokeWidth="1.6" opacity=".55"/>
        <circle cx="20" cy="20" r="8"  stroke="url(#ord-grad)" strokeWidth="2.2"/>
        <circle cx="20" cy="20" r="3"  fill="url(#ord-grad)"/>
      </svg>
      {withWordmark && (
        <span style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 600,
          fontSize: 19,
          letterSpacing: '-0.01em',
          color,
        }}>Ordinum</span>
      )}
    </div>
  );
}

/* ─── Button ──────────────────────────────────────────── */
function Button({ variant = "primary", size = "md", leftIcon, rightIcon, children, onClick, disabled, fullWidth, style = {} }) {
  const [hover, setHover] = useState(false);
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    fontFamily: "var(--font-body)", fontWeight: 600,
    borderRadius: 10, transition: "all 180ms var(--ease-out)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1, whiteSpace: "nowrap",
    width: fullWidth ? "100%" : undefined,
    letterSpacing: '-0.005em',
  };
  const sizes = {
    sm: { height: 34, padding: "0 14px", fontSize: 13 },
    md: { height: 42, padding: "0 18px", fontSize: 14 },
    lg: { height: 52, padding: "0 24px", fontSize: 15 },
  };
  const variants = {
    primary: {
      background: hover ? "#5EEAD4" : "#2DD4BF",
      color: "#06251F",
      boxShadow: hover ? "0 8px 28px -8px rgba(45,212,191,.55)" : "0 4px 16px -6px rgba(45,212,191,.35)",
    },
    secondary: {
      background: hover ? "rgba(255,255,255,.08)" : "rgba(255,255,255,.04)",
      color: "#F8FAFC",
      border: "1px solid rgba(255,255,255,.10)",
    },
    ghost: {
      background: hover ? "rgba(255,255,255,.04)" : "transparent",
      color: hover ? "#fff" : "#94A3B8",
    },
    outline: {
      background: hover ? "rgba(45,212,191,.10)" : "transparent",
      color: "#5EEAD4",
      border: "1px solid rgba(45,212,191,.30)",
    },
    danger: {
      background: hover ? "rgba(248,113,113,.18)" : "rgba(248,113,113,.10)",
      color: "#F87171",
      border: "1px solid rgba(248,113,113,.25)",
    },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}

/* ─── Card ─────────────────────────────────────────────── */
function Card({ children, hoverable, elevated, padding = 20, style = {}, onClick, className = "" }) {
  return (
    <div
      onClick={onClick}
      className={`ocard ${hoverable ? "hoverable" : ""} ${elevated ? "ocard-elevated" : ""} ${className}`}
      style={{ padding, ...style }}
    >
      {children}
    </div>
  );
}

/* ─── Badge / chip ──────────────────────────────────────── */
const BADGE_COLORS = {
  teal:    "#2DD4BF",
  empresa: "#2DD4BF",
  produto: "#FBBF24",
  marketing: "#F472B6",
  dados:   "#60A5FA",
  pessoal: "#FB7185",
  cliente: "#A78BFA",
  success: "#34D399",
  warning: "#FBBF24",
  error:   "#F87171",
  info:    "#60A5FA",
  purple:  "#A78BFA",
  neutral: "#94A3B8",
  novo:    "#5EEAD4",
  andamento: "#FBBF24",
  concluido: "#34D399",
  bloqueado: "#F87171",
  prioridade: "#F472B6",
};
const PULSING = new Set(["andamento", "em_andamento"]);
function Badge({ variant = "neutral", label, dot = false, size = "sm", style = {} }) {
  const color = BADGE_COLORS[variant] ?? "#94A3B8";
  const sizeStyle = size === "md"
    ? { fontSize: 12, padding: "4px 11px" }
    : { fontSize: 11, padding: "3px 9px" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontWeight: 500, borderRadius: 6,
      background: color + "1A", color, border: `1px solid ${color}30`,
      letterSpacing: '.01em',
      ...sizeStyle, ...style,
    }}>
      {dot && (
        <span
          className={PULSING.has(variant) ? "dot-pulse" : ""}
          style={{ width: 6, height: 6, borderRadius: "50%", background: color }}
        />
      )}
      {label}
    </span>
  );
}

/* ─── IconContainer — soft rounded square with tinted bg ──── */
const ICON_COLORS = {
  teal:    { bg: "rgba(45,212,191,.10)", color: "#5EEAD4", border: "rgba(45,212,191,.18)" },
  emerald: { bg: "rgba(52,211,153,.10)", color: "#6EE7B7", border: "rgba(52,211,153,.18)" },
  blue:    { bg: "rgba(96,165,250,.10)", color: "#93C5FD", border: "rgba(96,165,250,.18)" },
  purple:  { bg: "rgba(167,139,250,.10)", color: "#C4B5FD", border: "rgba(167,139,250,.18)" },
  amber:   { bg: "rgba(251,191,36,.10)", color: "#FCD34D", border: "rgba(251,191,36,.18)" },
  rose:    { bg: "rgba(251,113,133,.10)", color: "#FDA4AF", border: "rgba(251,113,133,.18)" },
  pink:    { bg: "rgba(244,114,182,.10)", color: "#F9A8D4", border: "rgba(244,114,182,.18)" },
  neutral: { bg: "rgba(255,255,255,.05)",  color: "#CBD5E1", border: "rgba(255,255,255,.08)" },
};
function IconContainer({ icon, color = "teal", size = "md", style = {} }) {
  const c = ICON_COLORS[color];
  const dims = { sm: 32, md: 44, lg: 56 }[size];
  const iconSize = { sm: 16, md: 22, lg: 28 }[size];
  const r = { sm: 8, md: 12, lg: 14 }[size];
  return (
    <div style={{
      width: dims, height: dims, borderRadius: r,
      background: c.bg, border: `1px solid ${c.border}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
      ...style,
    }}>
      <Icon name={icon} size={iconSize} color={c.color} strokeWidth={1.8} />
    </div>
  );
}

/* ─── KPI / MetricCard with sparkline ──────────────── */
function Sparkline({ points, color = "#2DD4BF", width = 120, height = 40 }) {
  const n = points.length;
  const min = Math.min(...points), max = Math.max(...points);
  const range = max - min || 1;
  const step = width / (n - 1);
  const path = points.map((p, i) => {
    const x = i * step;
    const y = height - ((p - min) / range) * (height - 6) - 3;
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const areaPath = path + ` L${width},${height} L0,${height} Z`;
  const id = useId().replace(/:/g, '');
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`sp-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity=".30"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#sp-${id})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function MetricCard({ titulo, valor, delta, deltaPositivo = true, sparkPoints, sparkColor = "#2DD4BF" }) {
  return (
    <Card padding={18} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>{titulo}</span>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8 }}>
        <p style={{
          fontSize: 32, fontWeight: 700,
          fontVariantNumeric: "tabular-nums", lineHeight: 1, margin: 0,
          color: "#fff", letterSpacing: "-0.02em",
        }}>{valor}</p>
        {sparkPoints && <Sparkline points={sparkPoints} color={sparkColor} width={100} height={36}/>}
      </div>
      {delta && (
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          fontSize: 12,
        }}>
          <span style={{
            color: deltaPositivo ? "var(--success)" : "var(--error)",
            fontWeight: 600,
          }}>{delta}</span>
          <span style={{ color: "var(--text-faint)" }}>vs mês anterior</span>
        </div>
      )}
    </Card>
  );
}

/* ─── Decorative concentric rings (for hero) ──────────── */
function ConcentricRings({ size = 480 }) {
  const rings = [220, 175, 130, 85];
  return (
    <div style={{ position: "relative", width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Soft glow */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(circle at 50% 50%, rgba(45,212,191,.18) 0%, transparent 55%)",
        filter: "blur(20px)",
      }}/>
      {rings.map((r, i) => (
        <svg key={i} width={size} height={size} viewBox={`0 0 ${size} ${size}`}
          style={{ position: "absolute", inset: 0, opacity: 0.15 + i * 0.12 }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none"
            stroke="url(#hero-ring)" strokeWidth={i === 0 ? 1 : 1.2}/>
          <defs>
            <linearGradient id="hero-ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#5EEAD4"/>
              <stop offset="100%" stopColor="#0E8479"/>
            </linearGradient>
          </defs>
        </svg>
      ))}
      {/* Inner logo */}
      <svg width="160" height="160" viewBox="0 0 160 160" style={{ position: "relative", zIndex: 1 }}>
        <defs>
          <linearGradient id="inner-ring" x1="0" y1="0" x2="160" y2="160">
            <stop offset="0%" stopColor="#5EEAD4"/>
            <stop offset="100%" stopColor="#0F766E"/>
          </linearGradient>
        </defs>
        <circle cx="80" cy="80" r="50" fill="none" stroke="url(#inner-ring)" strokeWidth="3"/>
        <circle cx="80" cy="80" r="18" fill="url(#inner-ring)"/>
      </svg>
    </div>
  );
}

/* ─── Helpers ──────────────────────────────────────────── */
function fmtNum(n) {
  return new Intl.NumberFormat('pt-BR').format(n);
}
function fmtBRL(n) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

// Export to window so other Babel scripts can use them
Object.assign(window, {
  Icon, useLucide, OrdinumLogo,
  Button, Card, Badge, IconContainer, MetricCard,
  Sparkline, ConcentricRings,
  BADGE_COLORS, ICON_COLORS,
  fmtNum, fmtBRL,
});
