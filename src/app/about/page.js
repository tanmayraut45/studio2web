"use client";

import { motion } from "framer-motion";
import styles from "./page.module.css";

// Animation Variants
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <div className="container">
        <motion.div 
          className={styles.header}
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <span className={styles.label}>About Studio II</span>
          <h1 className={styles.title}>
            We design for the<br />human experience.
          </h1>
        </motion.div>

        <div className={styles.content}>
          <motion.div 
            className={styles.section}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className={styles.sectionTitle}>Philosophy</h2>
            <p className={styles.text}>
              We believe that good design is invisible. It&apos;s felt in the way a room flows, the way light hits a wall, 
              and the way a space makes you feel at ease. Our approach is rooted in minimalism—stripping away the unnecessary to reveal the essential.
            </p>
          </motion.div>

          <motion.div 
            className={styles.section}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className={styles.sectionTitle}>Vision</h2>
            <p className={styles.text}>
              To redefine luxury as a state of mind, not just a price point. We aim to create environments that stand the test of time, 
              transcending trends to become true sanctuaries for our clients.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
