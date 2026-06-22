"use client";

import { motion } from "framer-motion";
import ReelsShowcase from "@/components/ReelsShowcase";
import styles from "./page.module.css";

export default function PortfolioPage() {
  return (
    <div className={styles.container}>
      <div className={styles.headerWrap}>
        <div className="container">
          <motion.header
            className={styles.header}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
            }}
          >
            <motion.span
              className={styles.eyebrow}
              variants={{
                hidden: { opacity: 0, y: 14 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              <span className={styles.eyebrowLine} aria-hidden />
              Studio II · On Site
            </motion.span>

            <motion.h1
              className={styles.title}
              variants={{
                hidden: { opacity: 0, y: 28 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              The <span className={styles.titleItalic}>Work</span>,
              <br />
              filmed where it lives.
            </motion.h1>

            <motion.p
              className={styles.subtitle}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              No renders. No moodboards. Each walkthrough is a completed space
              <br className={styles.brDesktop} />
              shot on site — the way the room actually feels.
            </motion.p>

            <motion.div
              className={styles.markersRow}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { duration: 0.8, delay: 0.3 },
                },
              }}
              aria-hidden
            >
              <span className={styles.markerDot} />
              <span className={styles.markerLine} />
              <span className={styles.markerLabel}>Scroll to view</span>
            </motion.div>
          </motion.header>
        </div>
      </div>

      <div className="container">
        <ReelsShowcase />
      </div>
    </div>
  );
}
