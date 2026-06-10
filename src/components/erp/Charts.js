"use client";

import { motion } from "framer-motion";
import styles from "./Charts.module.css";

const COLORS = {
  gold: "var(--erp-gold)",
  success: "var(--erp-success)",
  warn: "var(--erp-warn)",
  danger: "var(--erp-danger)",
  info: "var(--erp-info)",
  purple: "var(--erp-purple)",
  text3: "var(--erp-text-3)",
};
const col = (c) => COLORS[c] || c || COLORS.gold;

/* --------------------------- Sparkline --------------------------------- */
export function Sparkline({ data = [], color = "gold", height = 36 }) {
  if (!data.length) return null;
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const step = 100 / (data.length - 1 || 1);
  const pts = data.map((d, i) => `${(i * step).toFixed(2)},${(28 - ((d - min) / range) * 24).toFixed(2)}`);
  const line = `M${pts.join(" L")}`;
  const area = `${line} L100,30 L0,30 Z`;
  const id = `sp-${color}-${data.join("-").slice(0, 12)}`;
  return (
    <svg className={styles.spark} viewBox="0 0 100 32" height={height} preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={col(color)} stopOpacity="0.28" />
          <stop offset="100%" stopColor={col(color)} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={col(color)} strokeWidth="1.6" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/* ----------------------------- Area / Line ----------------------------- */
export function AreaChart({ data = [], color = "gold", height = 220, labels = [] }) {
  if (!data.length) return null;
  const W = 600, H = 200, pad = 8;
  const max = Math.max(...data) * 1.1, min = Math.min(...data, 0);
  const range = max - min || 1;
  const step = (W - pad * 2) / (data.length - 1 || 1);
  const pts = data.map((d, i) => [pad + i * step, H - ((d - min) / range) * (H - pad * 2) - pad]);
  const line = `M${pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" L")}`;
  const area = `${line} L${pts[pts.length - 1][0]},${H} L${pts[0][0]},${H} Z`;
  const id = `area-${color}`;
  return (
    <div className={styles.chartWrap} style={{ height }}>
      <svg className={styles.fill} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={col(color)} stopOpacity="0.32" />
            <stop offset="100%" stopColor={col(color)} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} stroke="var(--erp-border)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        ))}
        <path d={area} fill={`url(#${id})`} />
        <motion.path d={line} fill="none" stroke={col(color)} strokeWidth="2.4" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, ease: "easeInOut" }} />
        {pts.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="var(--erp-surface)" stroke={col(color)} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      {labels.length > 0 && (
        <div className={styles.xLabels}>
          {labels.map((l, i) => <span key={i}>{l}</span>)}
        </div>
      )}
    </div>
  );
}

/* ----------------------- Grouped bars (cash flow) ----------------------- */
export function DualBars({ data = [], height = 220, keys = ["inflow", "outflow"], colors = ["success", "danger"] }) {
  const max = Math.max(...data.flatMap((d) => keys.map((k) => d[k]))) * 1.15 || 1;
  return (
    <div className={styles.chartWrap} style={{ height }}>
      <div className={styles.bars}>
        {data.map((d, i) => (
          <div className={styles.barGroup} key={i}>
            <div className={styles.barPair}>
              {keys.map((k, ki) => (
                <motion.div
                  key={k}
                  className={styles.bar}
                  style={{ background: col(colors[ki]), opacity: d.projected ? 0.5 : 1 }}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${(d[k] / max) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.04 + ki * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  title={`${k}: ${d[k]}`}
                />
              ))}
            </div>
            <span className={styles.barLabel}>{d.month || d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------- Donut --------------------------------- */
export function Donut({ segments = [], size = 150, thickness = 16, label, sub }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  // Pure cumulative offsets (no in-render mutation, React-Compiler safe).
  const lens = segments.map((s) => (s.value / total) * c);
  const offsets = lens.map((_, i) => lens.slice(0, i).reduce((a, b) => a + b, 0));
  return (
    <div className={styles.donutWrap} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--erp-border)" strokeWidth={thickness} />
        {segments.map((s, i) => (
          <motion.circle
            key={i}
            cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke={col(s.color)} strokeWidth={thickness}
            strokeDasharray={`${lens[i]} ${c - lens[i]}`}
            strokeDashoffset={-offsets[i]}
            strokeLinecap="butt"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
          />
        ))}
      </svg>
      {(label || sub) && (
        <div className={styles.donutCenter}>
          {label && <strong>{label}</strong>}
          {sub && <span>{sub}</span>}
        </div>
      )}
    </div>
  );
}

/* ----------------------------- Progress ring --------------------------- */
export function Ring({ value = 0, size = 64, thickness = 6, color = "gold", showLabel = true }) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const len = (Math.min(value, 100) / 100) * c;
  return (
    <div className={styles.ringWrap} style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--erp-border)" strokeWidth={thickness} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={col(color)} strokeWidth={thickness} strokeLinecap="round"
          strokeDasharray={c} transform={`rotate(-90 ${size / 2} ${size / 2})`}
          initial={{ strokeDashoffset: c }} whileInView={{ strokeDashoffset: c - len }} viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      {showLabel && <span className={styles.ringLabel} style={{ fontSize: size * 0.24 }}>{Math.round(value)}%</span>}
    </div>
  );
}

/* --------------------------- Horizontal meter -------------------------- */
export function Meter({ value = 0, max = 100, color = "gold", height = 8 }) {
  const pctVal = Math.min((value / (max || 1)) * 100, 100);
  return (
    <div className={styles.meter} style={{ height }}>
      <motion.div
        className={styles.meterFill}
        style={{ background: col(color) }}
        initial={{ width: 0 }}
        whileInView={{ width: `${pctVal}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}
