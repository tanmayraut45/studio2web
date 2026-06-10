"use client";

import { motion } from "framer-motion";
import ProjectCard from "@/components/ProjectCard"; // We might need to tweak this component too or use it as is
import { projects } from "@/data/projects";
import styles from "./page.module.css";

export default function PortfolioPage() {
  return (
    <div className={styles.container}>
      <div className="container">
        <motion.header 
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className={styles.title}>Work</h1>
          <p className={styles.subtitle}>
            A curation of spaces defined by<br/>precision and emotion.
          </p>
        </motion.header>

        <div className={styles.feed}>
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className={styles.feedItem}
            >
              <ProjectCard {...project} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
