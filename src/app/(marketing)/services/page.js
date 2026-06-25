"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import styles from "./page.module.css";

const services = [
  {
    title: "Architectural Planning",
    description: "Holistic blueprints that blend structural integrity with aesthetic vision. We handle permissions, elevations, and spatial optimization.",
    id: "01"
  },
  {
    title: "Interior Design",
    description: "Curating bespoke environments. From material selection to lighting design, we craft spaces that resonate with your identity.",
    id: "02"
  },
  {
    title: "Vastu Consultation",
    description: "Ancient wisdom for modern living. We align your space with cosmic principles to enhance positivity and flow.",
    id: "03"
  },
  {
    title: "Liasoning",
    description: "Navigating complexity. We manage all regulatory approvals and local authority interactions for a seamless process.",
    id: "04"
  },
  {
    title: "Turnkey Projects",
    description: "End-to-end execution. We take full responsibility from the first sketch to the final handover keys.",
    id: "05"
  },
  {
    title: "Landscaping",
    description: "Bringing the outdoors in. We design sustainable and lush outdoor spaces that complement the architecture.",
    id: "06"
  },
];

export default function ServicesPage() {
  const [expanded, setExpanded] = useState(null);

  const toggle = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <div className={styles.container}>
      <div className="container">
        <motion.header 
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className={styles.title}>Expertise</h1>
        </motion.header>

        <div className={styles.list}>
          {services.map((service, index) => {
            const isOpen = expanded === service.id;
            return (
              <motion.div
                key={service.id}
                className={`${styles.item} ${isOpen ? styles.itemOpen : ""}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => toggle(service.id)}
              >
                <div className={styles.itemHeader}>
                  <span className={styles.id}>{service.id}</span>
                  <h3 className={styles.itemTitle}>{service.title}</h3>
                  <span className={styles.icon}>
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                  </span>
                </div>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      className={styles.content}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className={styles.description}>{service.description}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
