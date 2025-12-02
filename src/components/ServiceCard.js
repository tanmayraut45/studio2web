"use client";

import { motion } from "framer-motion";
import styles from "./ServiceCard.module.css";

export default function ServiceCard({ icon, title, description }) {
  return (
    <motion.div 
      className={styles.serviceCard}
      whileHover={{ y: -10 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className={styles.iconWrapper}>{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </motion.div>
  );
}
