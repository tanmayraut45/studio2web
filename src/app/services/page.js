"use client";

import { motion } from "framer-motion";
import { PenTool, Layout, CheckCircle, Map, Trees, Building, FileText, Compass } from "lucide-react";
import styles from "./page.module.css";

const services = [
  {
    title: "Architectural Planning",
    description: "Comprehensive architectural services including floor plans, elevations, and structural considerations.",
    icon: <Building size={32} />
  },
  {
    title: "Liasoning",
    description: "Handling all necessary approvals and permissions from local authorities for smooth project execution.",
    icon: <FileText size={32} />
  },
  {
    title: "Interior Designing",
    description: "Creating functional and aesthetically pleasing interior spaces tailored to your lifestyle.",
    icon: <Layout size={32} />
  },
  {
    title: "Turnkey Projects",
    description: "Complete end-to-end project management, from initial concept to final handover.",
    icon: <PenTool size={32} />
  },
  {
    title: "Urban Designing",
    description: "Planning and designing urban spaces that are functional, sustainable, and attractive.",
    icon: <Map size={32} />
  },
  {
    title: "Landscaping",
    description: "Designing outdoor spaces that complement your architecture and enhance the natural environment.",
    icon: <Trees size={32} />
  },
  {
    title: "Land Plotting",
    description: "Efficient subdivision and layout planning for land development projects.",
    icon: <Map size={32} />
  },
  {
    title: "Vastu Consultation",
    description: "Ensuring your space aligns with Vastu Shastra principles for harmony and positivity.",
    icon: <Compass size={32} />
  }
];

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

        <div className={styles.servicesGrid}>
          {services.map((service, index) => (
            <motion.div 
              key={index}
              className={styles.serviceCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={styles.iconWrapper}>
                {service.icon}
              </div>
              <h3 className={styles.serviceTitle}>{service.title}</h3>
              <p className={styles.serviceDescription}>{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
