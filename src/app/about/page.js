"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./page.module.css";

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <div className="container">
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className={styles.title}>About Studio 2</h1>
          <p className={styles.subtitle}>
            We are a multidisciplinary design studio committed to creating spaces that tell a story.
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <section className={styles.section}>
          <div className={styles.grid}>
            <motion.div 
              className={styles.card}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2>Our Mission</h2>
              <p>
                To deliver exceptional interior design solutions that enhance the quality of life for our clients. 
                We strive to create spaces that are not only visually stunning but also functional, sustainable, and reflective of the people who inhabit them.
              </p>
            </motion.div>
            <motion.div 
              className={styles.card}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h2>Our Vision</h2>
              <p>
                To be a leading interior design firm known for innovation, creativity, and excellence. 
                We aim to set new standards in the industry by continuously pushing the boundaries of design and delivering unparalleled value to our clients.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Philosophy */}
        <section className={styles.philosophySection}>
          <motion.div 
            className={styles.philosophyContent}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2>Design Philosophy</h2>
            <p>
              At Studio 2, we believe that design is a collaborative process. We listen closely to our clients' needs and aspirations, translating them into tangible realities. 
              Our aesthetic is grounded in minimalism, yet warm and inviting. We prioritize natural light, honest materials, and thoughtful details.
            </p>
          </motion.div>
        </section>

        {/* Founders */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Meet the Founders</h2>
          <div className={styles.foundersGrid}>
            <motion.div 
              className={styles.founderCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className={styles.founderImage}>
                {/* Placeholder */}
                <div style={{ width: "100%", height: "100%", background: "#ccc" }} />
              </div>
              <h3>Jane Doe</h3>
              <span>Principal Architect</span>
              <p>
                With over 15 years of experience, Jane brings a wealth of knowledge and a keen eye for detail to every project.
              </p>
            </motion.div>
            <motion.div 
              className={styles.founderCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className={styles.founderImage}>
                {/* Placeholder */}
                <div style={{ width: "100%", height: "100%", background: "#ccc" }} />
              </div>
              <h3>John Smith</h3>
              <span>Creative Director</span>
              <p>
                John is known for his innovative approach and ability to blend different styles seamlessly.
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
