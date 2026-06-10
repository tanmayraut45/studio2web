"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Sparkline } from "./Charts";
import styles from "./ui.module.css";
import { clsx } from "clsx";

/* ------------------------------- Avatar -------------------------------- */
export function Avatar({ name = "", initials, size = 32, tone = "gold" }) {
  const text = initials || name.split(" ").map((w) => w[0]).slice(0, 2).join("");
  return (
    <span
      className={clsx(styles.avatar, styles[`tone_${tone}`])}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      title={name}
    >
      {text.toUpperCase()}
    </span>
  );
}

export function AvatarStack({ people = [], max = 4, size = 28 }) {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  return (
    <div className={styles.stack}>
      {shown.map((p, i) => (
        <span key={i} style={{ marginLeft: i ? -size * 0.32 : 0, zIndex: max - i }}>
          <Avatar name={p.name} initials={p.initials} size={size} tone={["gold", "info", "purple", "success"][i % 4]} />
        </span>
      ))}
      {extra > 0 && (
        <span className={styles.extra} style={{ width: size, height: size, marginLeft: -size * 0.32 }}>
          +{extra}
        </span>
      )}
    </div>
  );
}

/* ----------------------------- StatusBadge ----------------------------- */
const TONE_MAP = {
  // status -> tone
  paid: "success", cleared: "success", approved: "success", done: "success", active: "success", won: "success", filed: "success", delivered: "success", closed: "success", "on-track": "success", preferred: "success",
  pending: "warn", "under review": "warn", "in review": "warn", "in progress": "warn", "in transit": "warn", sent: "warn", draft: "warn", "on hold": "warn", revision: "warn", confirmed: "warn", watch: "warn", "at-risk": "warn", "rfq sent": "warn", "partially paid": "warn", "pending approval": "warn", upcoming: "warn",
  overdue: "danger", delayed: "danger", blocked: "danger", lost: "danger", open: "danger", critical: "danger", high: "danger", urgent: "danger",
  new: "info", contacted: "info", negotiation: "info", "meeting scheduled": "info", proposal: "info", "proposal sent": "info", medium: "info", major: "info",
  low: "neutral", minor: "neutral", paused: "neutral",
};

export function Badge({ children, tone, dot = false }) {
  const t = tone || TONE_MAP[String(children).toLowerCase()] || "neutral";
  return (
    <span className={clsx(styles.badge, styles[`badge_${t}`])}>
      {dot && <span className={styles.badgeDot} />}
      {children}
    </span>
  );
}

export function Tag({ children }) {
  return <span className={styles.tag}>{children}</span>;
}

/* ------------------------------- Panel --------------------------------- */
export function Panel({ title, subtitle, action, children, className, padded = true, span }) {
  return (
    <section className={clsx(styles.panel, className)} style={span ? { gridColumn: `span ${span}` } : undefined}>
      {(title || action) && (
        <header className={styles.panelHead}>
          <div>
            {title && <h3 className={styles.panelTitle}>{title}</h3>}
            {subtitle && <p className={styles.panelSub}>{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={padded ? styles.panelBody : undefined}>{children}</div>
    </section>
  );
}

/* ------------------------------ KpiCard -------------------------------- */
export function KpiCard({ label, value, delta, deltaUp, sub, icon: Icon, accent = "gold", spark, index = 0 }) {
  return (
    <motion.div
      className={styles.kpi}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.kpiTop}>
        <span className={styles.kpiLabel}>{label}</span>
        {Icon && (
          <span className={clsx(styles.kpiIcon, styles[`tone_${accent}`])}>
            <Icon size={16} />
          </span>
        )}
      </div>
      <div className={styles.kpiValue}>{value}</div>
      <div className={styles.kpiFoot}>
        {delta != null && (
          <span className={clsx(styles.kpiDelta, deltaUp ? styles.up : styles.down)}>
            {deltaUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {delta}
          </span>
        )}
        {sub && <span className={styles.kpiSub}>{sub}</span>}
      </div>
      {spark && (
        <div className={styles.kpiSpark}>
          <Sparkline data={spark} color={accent} height={34} />
        </div>
      )}
    </motion.div>
  );
}

/* --------------------------- PageHeader -------------------------------- */
export function PageHeader({ title, subtitle, children, icon: Icon }) {
  return (
    <div className={styles.pageHead}>
      <div className={styles.pageHeadLeft}>
        {Icon && <span className={styles.pageIcon}><Icon size={20} /></span>}
        <div>
          <h1 className={styles.pageTitle}>{title}</h1>
          {subtitle && <p className={styles.pageSub}>{subtitle}</p>}
        </div>
      </div>
      {children && <div className={styles.pageActions}>{children}</div>}
    </div>
  );
}

/* ---------------------------- misc bits -------------------------------- */
export function Stat({ label, value, tone }) {
  return (
    <div className={styles.stat}>
      <span className={styles.statLabel}>{label}</span>
      <span className={clsx(styles.statValue, tone && styles[`text_${tone}`])}>{value}</span>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, body }) {
  return (
    <div className={styles.empty}>
      {Icon && <Icon size={26} />}
      <strong>{title}</strong>
      {body && <p>{body}</p>}
    </div>
  );
}

export function ComingSoon({ title }) {
  return (
    <div className={styles.empty}>
      <strong>{title}</strong>
      <p>Deeper workflows for this module are mapped and ready to wire to the backend.</p>
    </div>
  );
}

export function Btn({ children, variant = "primary", icon: Icon, ...rest }) {
  return (
    <button className={clsx(styles.btn, styles[`btn_${variant}`])} {...rest}>
      {Icon && <Icon size={15} />}
      {children}
    </button>
  );
}
