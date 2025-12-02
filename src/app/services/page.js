"use client";

import { motion } from "framer-motion";
import { PenTool, Layout, CheckCircle } from "lucide-react";
import styles from "./page.module.css";

export default function ServicesPage() {
  return (
    <div className={styles.container}>
      <div className="container">
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className={styles.title}>Our Services</h1>
          <p className={styles.subtitle}>
            We offer comprehensive design solutions tailored to your unique needs and lifestyle.
          </p>
        </motion.div>

        <div className={styles.servicesList}>
          {/* Turnkey Projects */}
          <motion.div 
            className={styles.serviceRow}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className={styles.serviceContent}>
              <div className={styles.iconWrapper}>
                <Layout size={32} />
              </div>
              <h2>Turnkey Projects</h2>
              <p>
                Our turnkey service is a complete end-to-end solution where we take care of everything from the initial concept to the final handover. 
                We manage the entire process, including design, procurement, and construction, ensuring a stress-free experience for you.
              </p>
              <ul className={styles.featureList}>
                <li><CheckCircle size={16} /> Concept Development</li>
                <li><CheckCircle size={16} /> Project Management</li>
                <li><CheckCircle size={16} /> Material Selection & Procurement</li>
                <li><CheckCircle size={16} /> Construction & Installation</li>
                <li><CheckCircle size={16} /> Final Styling & Handover</li>
              </ul>
            </div>
            <div className={styles.serviceImage}>
              {/* Placeholder for service image */}
              <div className={styles.placeholderImage} style={{ background: "var(--color-light-grey)" }} />
            </div>
          </motion.div>

          {/* Design Consultation */}
          <motion.div 
            className={`${styles.serviceRow} ${styles.reversed}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className={styles.serviceContent}>
              <div className={styles.iconWrapper}>
                <PenTool size={32} />
              </div>
              <h2>Design & Drawing Consultation</h2>
              <p>
                Perfect for clients who need professional guidance but prefer to manage the execution themselves. 
                We provide detailed drawings, 3D visualizations, and material specifications to help you bring your vision to life.
              </p>
              <ul className={styles.featureList}>
                <li><CheckCircle size={16} /> Space Planning</li>
                <li><CheckCircle size={16} /> 2D Layouts & Elevations</li>
                <li><CheckCircle size={16} /> 3D Renderings</li>
                <li><CheckCircle size={16} /> Lighting & Electrical Plans</li>
                <li><CheckCircle size={16} /> Material & Furniture Selection</li>
              </ul>
            </div>
            <div className={styles.serviceImage}>
              {/* Placeholder for service image */}
              <div className={styles.placeholderImage} style={{ background: "var(--color-light-grey)" }} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
