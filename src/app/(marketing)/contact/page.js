"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Mail, Phone, MapPin, ArrowRight, FileText } from "lucide-react";
import styles from "./page.module.css";

export default function ContactPage() {
  return (
    <div className={styles.container}>
      <div className="container">
        
        {/* Header with Logo */}
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className={styles.logoWrapper}>
            <Image 
              src="/images/logo.jpeg" 
              alt="Studio II Logo" 
              width={80} 
              height={80} 
              className={styles.logoImage}
            />
          </div>
          <span className={styles.label}>Get in Touch</span>
          <h1 className={styles.title}>Let&apos;s start a<br/>conversation.</h1>
        </motion.div>

        {/* Contact Actions */}
        <div className={styles.actions}>
          <a href="mailto:2019studio2.0@gmail.com" className={styles.actionItem}>
            <div className={styles.iconBox}><Mail size={24} /></div>
            <div className={styles.actionText}>
              <span className={styles.actionLabel}>Email Us</span>
              <span className={styles.actionValue}>2019studio2.0@gmail.com</span>
            </div>
          </a>
          
          <a href="https://wa.me/919552662173" target="_blank" rel="noopener noreferrer" className={styles.actionItem}>
            <div className={styles.iconBox}><Phone size={24} /></div>
            <div className={styles.actionText}>
              <span className={styles.actionLabel}>WhatsApp</span>
              <span className={styles.actionValue}>+91 95526 62173</span>
            </div>
          </a>

          <div className={styles.actionItem}>
             <div className={styles.iconBox}><MapPin size={24} /></div>
             <div className={styles.actionText}>
              <span className={styles.actionLabel}>Visit Us</span>
              <span className={styles.actionValue}>
                Studio II, Office No.13, La-Casita,<br/>
                Plot No. LC 1/1, Sector 32 A,<br/>
                Ravet, Pradhikaran, Pune - 412101
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Inquiry Forms */}
        <div className={styles.formsSection}>
          <h2 className={styles.sectionTitle}>Project Inquiry</h2>
          <p className={styles.sectionSubtitle}>Select the service you are interested in.</p>
          
          <div className={styles.formGrid}>
            <a href="https://forms.gle/mkyxWARpQYC9D4Qw7" target="_blank" rel="noopener noreferrer" className={`${styles.formCard} ${styles.interiorCard}`}>
              <div className={styles.cardHeader}>
                <h3>Interior Design</h3>
                <ArrowRight size={20} />
              </div>
              <p>For residential and commercial interior styling and execution.</p>
              <span className={styles.fakeBtn}>Fill Form</span>
            </a>

            <a href="https://forms.gle/UwFU2c3b6kLQAaxS6" target="_blank" rel="noopener noreferrer" className={`${styles.formCard} ${styles.archCard}`}>
              <div className={styles.cardHeader}>
                <h3>Architecture</h3>
                <ArrowRight size={20} />
              </div>
              <p>For architectural planning, layout design, and structural work.</p>
              <span className={styles.fakeBtn}>Fill Form</span>
            </a>
          </div>
        </div>

        {/* Google Map */}
        <div className={styles.mapSection}>
          <h2 className={styles.sectionTitle}>Find Us</h2>
          <div className={styles.mapWrapper}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d258.73801577372706!2d73.75605374767164!3d18.643028926930892!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b90057edc171%3A0xa48c39eee104743f!2sStudio%202!5e1!3m2!1sen!2sus!4v1765879564865!5m2!1sen!2sus" 
              width="100%" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

      </div>
    </div>
  );
}
