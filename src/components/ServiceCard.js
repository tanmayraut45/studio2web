"use client";

import { motion } from "framer-motion";
import styles from "./ServiceCard.module.css";

export default function ServiceCard({ icon, title, description }) {
  return (
    <motion.div
      className={styles.serviceCard}
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {icon && <div className={styles.iconWrapper}>{icon}</div>}
      <h3>{title}</h3>
      <p>{description}</p>
    </motion.div>
  );
}
