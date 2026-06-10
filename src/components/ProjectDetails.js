"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import styles from "@/app/(marketing)/projects/[id]/page.module.css";
import { useRef } from "react";

export default function ProjectDetails({ project }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const yImage = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <div className={styles.container} ref={containerRef}>
      
      {/* Hero */}
      <div className={styles.hero}>
        <motion.div style={{ y: yImage }} className={styles.heroImageWrapper}>
          <Image
            src={project.image}
            alt={project.title}
            fill
            priority
            className={styles.heroImage}
          />
          <div className={styles.heroOverlay} />
        </motion.div>
        
        <div className="container">
          <motion.div 
            className={styles.heroContent}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Link href="/portfolio" className={styles.backLink}>
              <ArrowLeft size={20} /> Back
            </Link>
            <h1 className={styles.title}>{project.title}</h1>
            <div className={styles.meta}>
              <span>{project.location}</span>
              <span className={styles.separator}>•</span>
              <span>{project.year}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className={styles.body}>
        <div className="container">
          <div className={styles.grid}>
            <div className={styles.description}>
              <p>{project.description}</p>
              <p>
                We approached this project with a focus on functionality and aesthetics. 
                By utilizing a neutral color palette and high-quality materials, we created a space that feels both timeless and modern.
              </p>
            </div>
            
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Client</span>
                <span className={styles.statValue}>{project.client}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Category</span>
                <span className={styles.statValue}>{project.category}</span>
              </div>
            </div>
          </div>

          {/* Gallery Stack */}
          <div className={styles.gallery}>
            {project.images.map((img, index) => (
              <motion.div 
                key={index}
                className={styles.galleryItem}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-10%" }} // trigger earlier on mobile
                transition={{ duration: 0.8 }}
              >
                <Image 
                  src={img} 
                  alt={`${project.title} detailed view ${index + 1}`} 
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
