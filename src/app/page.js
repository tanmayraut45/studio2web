"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import styles from "./page.module.css";
import ServiceCard from "@/components/ServiceCard";
import ProjectCard from "@/components/ProjectCard";

// Stagger variants for text
const stagger = {
  animate: {
    transition: { staggerChildren: 0.1 }
  }
};

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function HomePage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  // Parallax effect for hero text
  const yHero = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div className={styles.container} ref={containerRef}>
      
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <Image
            src="/images/hero.png" // We might want to switch this to a video later or better image
            alt="Luxury Interior"
            fill
            className={styles.heroImage}
            priority
            quality={100}
          />
          <div className={styles.heroOverlay} />
        </div>
        
        <motion.div 
          className={styles.heroContent}
          initial="initial"
          animate="animate"
          variants={stagger}
          style={{ y: yHero, opacity: opacityHero }}
        >
          <motion.div variants={fadeInUp} className={styles.label}>
            Est. 2019
          </motion.div>
          <motion.h1 variants={fadeInUp} className={styles.title}>
            Spaces that<br />
            <span className={styles.italic}>Transcend</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className={styles.subtitle}>
            A synergy of minimalism and luxury.<br />
            Designed for the modern visionary.
          </motion.p>
        </motion.div>
      </section>

      {/* Intro / Philosophy */}
      <section className={styles.intro}>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className={styles.introTitle}>
              We craft environments that aren&apos;t just seen,<br />
              <span className={styles.textHighlight}>but deeply felt.</span>
            </h2>
            <Link href="/about" className={styles.link}>
              Our Philosophy <ArrowUpRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects - Horizontal Scroll Hint */}
      <section className={styles.projects}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionLabel}>Selected Works</h3>
            <Link href="/portfolio" className={styles.viewAllBtn}>View All</Link>
          </div>
        </div>
        
        {/* Horizontal Scroll Container */}
        <div className={styles.horizontalScroll}>
          <div className={styles.scrollTrack}>
            <div className={styles.projectCardWrapper}>
              <ProjectCard 
                image="/images/project1.png"
                title="The Private Residence"
                category="Pune, India"
                id="1"
              />
            </div>
            <div className={styles.projectCardWrapper}>
              <ProjectCard 
                image="/images/project2.png"
                title="Vertex Office"
                category="Mumbai, India"
                id="2"
              />
            </div>
            <div className={styles.projectCardWrapper}>
              <ProjectCard 
                image="/images/project3.png"
                title="Serenity Villa"
                category="Lonavala, India"
                id="3"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services List - Modern Stack */}
      <section className={styles.services}>
        <div className="container">
          <h3 className={styles.sectionLabel}>Expertise</h3>
          <div className={styles.serviceStack}>
             <ServiceCard 
              icon={null} // Minimalist, maybe no icons or small ones
              title="Architectural Planning"
              description="Blueprints for legacy."
            />
            <ServiceCard 
              icon={null}
              title="Interior Design"
              description="Curated for comfort and style."
            />
            <ServiceCard 
              icon={null}
              title="Vastu Consultation"
              description="Harmony with nature."
            />
          </div>
        </div>
      </section>

    </div>
  );
}
