"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, User } from "lucide-react";
import { projects } from "@/data/projects";
import styles from "./page.module.css";

export default function ProjectPage({ params }) {
  // Unwrap params using React.use()
  const resolvedParams = use(params);
  const project = projects.find((p) => p.id === resolvedParams.id);

  if (!project) {
    notFound();
  }

  return (
    <div className={styles.container}>
      {/* Hero Image */}
      <div className={styles.heroImageWrapper}>
        <Image
          src={project.image}
          alt={project.title}
          fill
          priority
          className={styles.heroImage}
        />
        <div className={styles.overlay} />
        <div className="container">
          <div className={styles.heroContent}>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={styles.title}
            >
              {project.title}
            </motion.h1>
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={styles.category}
            >
              {project.category}
            </motion.span>
          </div>
        </div>
      </div>

      <div className="container">
        <Link href="/portfolio" className={styles.backLink}>
          <ArrowLeft size={20} /> Back to Portfolio
        </Link>

        <div className={styles.contentGrid}>
          <motion.div 
            className={styles.mainContent}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Project Overview</h2>
            <p className={styles.description}>{project.description}</p>
            
            <h3>Design Solution</h3>
            <p>
              We approached this project with a focus on functionality and aesthetics. 
              By utilizing a neutral color palette and high-quality materials, we created a space that feels both timeless and modern.
              Every detail was carefully considered to ensure the client's vision was brought to life.
            </p>
          </motion.div>

          <motion.div 
            className={styles.sidebar}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className={styles.infoCard}>
              <h3>Project Details</h3>
              <div className={styles.infoItem}>
                <User size={18} />
                <div>
                  <span className={styles.label}>Client</span>
                  <span className={styles.value}>{project.client}</span>
                </div>
              </div>
              <div className={styles.infoItem}>
                <MapPin size={18} />
                <div>
                  <span className={styles.label}>Location</span>
                  <span className={styles.value}>{project.location}</span>
                </div>
              </div>
              <div className={styles.infoItem}>
                <Calendar size={18} />
                <div>
                  <span className={styles.label}>Year</span>
                  <span className={styles.value}>{project.year}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Gallery */}
        <div className={styles.gallerySection}>
          <h2>Project Gallery</h2>
          <div className={styles.galleryGrid}>
            {project.images.map((img, index) => (
              <motion.div 
                key={index}
                className={styles.galleryItem}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Image 
                  src={img} 
                  alt={`${project.title} - View ${index + 1}`} 
                  fill 
                  className={styles.galleryImage}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
