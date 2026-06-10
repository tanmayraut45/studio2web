"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";
import styles from "./KanbanBoard.module.css";

// Presentational kanban — columns + cards. renderCard receives the item.
export default function KanbanBoard({ columns = [], items = [], groupKey, renderCard, columnMeta = {} }) {
  return (
    <div className={styles.board}>
      {columns.map((col) => {
        const cards = items.filter((it) => it[groupKey] === col);
        const meta = columnMeta[col] || {};
        return (
          <div className={styles.column} key={col}>
            <div className={styles.colHead}>
              <span className={styles.colTitle}>
                {meta.dot && <span className={clsx(styles.dot, styles[`dot_${meta.tone}`])} />}
                {col}
              </span>
              <span className={styles.colCount}>{cards.length}</span>
            </div>
            <div className={styles.colBody}>
              {cards.map((it, i) => (
                <motion.div
                  key={it.id || i}
                  className={styles.card}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.03 }}
                  whileHover={{ y: -2 }}
                >
                  {renderCard(it)}
                </motion.div>
              ))}
              {cards.length === 0 && <div className={styles.emptyCol}>Drop zone</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
