"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, PenTool, Home, Layout } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import ServiceCard from "@/components/ServiceCard";
import styles from "./page.module.css";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function HomePage() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroImageWrapper}>
          <Image
            src="/images/hero.png"
            alt="Luxury Interior Design"
            fill
            priority
            className={styles.heroImage}
            quality={100}
          />
          <div className={styles.overlay} />
        </div>
        
        <div className="container">
          <motion.div 
            className={styles.heroContent}
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.h1 variants={fadeInUp} className={styles.heroTitle}>
              Designing Spaces That <span className={styles.highlight}>Inspire</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className={styles.heroSubtitle}>
              Studio 2 brings your vision to life with modern, minimalistic, and functional interior design solutions.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link href="/portfolio" className="btn btn-primary">
                View Portfolio
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="section">
        <div className="container">
          <div className={styles.introGrid}>
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className={styles.sectionTitle}>Welcome to Studio 2</h2>
              <p className={styles.introText}>
                We are a team of passionate designers dedicated to creating exceptional environments. 
                Our philosophy is rooted in the belief that good design should be accessible, functional, and beautiful.
                With a focus on clean lines, natural light, and premium materials, we transform ordinary spaces into extraordinary experiences.
              </p>
              <Link href="/about" className={styles.textLink}>
                Read More About Us <ArrowRight size={16} />
              </Link>
            </motion.div>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>50+</span>
                <span className={styles.statLabel}>Projects Completed</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>10+</span>
                <span className={styles.statLabel}>Years Experience</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>100%</span>
                <span className={styles.statLabel}>Client Satisfaction</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className={`${styles.servicesSection} section`}>
        <div className="container">
          <motion.div 
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={styles.sectionTitle}>Our Services</h2>
            <p className={styles.sectionSubtitle}>Comprehensive design solutions tailored to your needs.</p>
          </motion.div>

          <div className={styles.servicesGrid}>
            <ServiceCard 
              icon={<Home size={32} />}
              title="Residential Design"
              description="Creating warm, inviting homes that reflect your personal style and needs."
            />
            <ServiceCard 
              icon={<Layout size={32} />}
              title="Commercial Spaces"
              description="Designing productive and professional environments for businesses."
            />
            <ServiceCard 
              icon={<PenTool size={32} />}
              title="Turnkey Projects"
              description="End-to-end project management from concept to final handover."
            />
          </div>
        </div>
      </section>

      {/* Latest Projects */}
      <section className="section">
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Latest Projects</h2>
            <Link href="/portfolio" className="btn btn-outline">View All Projects</Link>
          </div>

          <div className={styles.projectsGrid}>
            <ProjectCard 
              image="/images/project1.png"
              title="Modern Residence"
              category="Residential"
              id="1"
            />
            <ProjectCard 
              image="/images/project2.png"
              title="Tech Hub Office"
              category="Commercial"
              id="2"
            />
            <ProjectCard 
              image="/images/project3.png"
              title="Luxury Kitchen"
              category="Residential"
              id="3"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2>Ready to Transform Your Space?</h2>
            <p>Let's discuss your project and bring your ideas to reality.</p>
            <Link href="/contact" className="btn btn-primary">
              Book a Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
