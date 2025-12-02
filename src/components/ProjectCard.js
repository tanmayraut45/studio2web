"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./ProjectCard.module.css";

export default function ProjectCard({ image, title, category, id }) {
  return (
    <motion.div 
      className={styles.projectCard}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <Link href={`/projects/${id}`}>
        <div className={styles.projectImageWrapper}>
          <Image 
            src={image} 
            alt={title} 
            fill 
            className={styles.projectImage}
          />
          <div className={styles.projectOverlay}>
            <span>View Project</span>
          </div>
        </div>
        <div className={styles.projectInfo}>
          <h3>{title}</h3>
          <span>{category}</span>
        </div>
      </Link>
    </motion.div>
  );
}
