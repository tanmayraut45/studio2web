"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";
import styles from "./Gantt.module.css";

// Deterministic "today" anchored to the sample data window (keeps SSR/client
// in sync and avoids impure Date.now() in render).
const TODAY = new Date("2026-06-09").getTime();

const toneFor = (h) =>
  h === "delayed" ? "danger" : h === "at-risk" ? "warn" : "success";

export default function Gantt({ items = [] }) {
  if (!items.length) return null;
  const starts = items.map((i) => new Date(i.start).getTime());
  const ends = items.map((i) => new Date(i.due).getTime());
  const min = Math.min(...starts);
  const max = Math.max(...ends);
  const span = max - min || 1;

  // month gridlines
  const months = [];
  const d = new Date(min);
  d.setDate(1);
  while (d.getTime() <= max) {
    months.push(new Date(d));
    d.setMonth(d.getMonth() + 1);
  }

  const nowPct = ((TODAY - min) / span) * 100;

  return (
    <div className={styles.gantt}>
      <div className={styles.scroll}>
        <div className={styles.inner}>
          <div className={styles.axis}>
            {months.map((m, i) => (
              <span key={i} className={styles.month} style={{ left: `${((m.getTime() - min) / span) * 100}%` }}>
                {m.toLocaleDateString("en-IN", { month: "short", year: "2-digit" })}
              </span>
            ))}
          </div>

          <div className={styles.rows}>
            {nowPct >= 0 && nowPct <= 100 && (
              <div className={styles.today} style={{ left: `${nowPct}%` }}><span>Today</span></div>
            )}
            {items.map((it, idx) => {
              const s = new Date(it.start).getTime();
              const e = new Date(it.due).getTime();
              const left = ((s - min) / span) * 100;
              const width = ((e - s) / span) * 100;
              const tone = toneFor(it.health);
              return (
                <div className={styles.row} key={it.id || idx}>
                  <div className={styles.rowLabel} title={it.name}>{it.name}</div>
                  <div className={styles.track}>
                    <motion.div
                      className={clsx(styles.bar, styles[`bar_${tone}`])}
                      style={{ left: `${left}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${width}%` }}
                      transition={{ duration: 0.7, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className={styles.progress} style={{ width: `${it.progress}%` }} />
                      <span className={styles.barText}>{it.progress}%</span>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
