"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import styles from "./page.module.css";

export default function ContactPage() {
  return (
    <div className={styles.container}>
      <div className="container">
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className={styles.title}>Get in Touch</h1>
          <p className={styles.subtitle}>
            Ready to start your project? Contact us today for a consultation.
          </p>
        </motion.div>

        <div className={styles.grid}>
          {/* Contact Info */}
          <motion.div 
            className={styles.infoSection}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2>Contact Information</h2>
            <p className={styles.infoText}>
              Fill out the form or reach out to us directly. We look forward to hearing from you.
            </p>

            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <div className={styles.iconWrapper}><MapPin size={20} /></div>
                <div>
                  <h3>Our Office</h3>
                  <p>Studio II, Office No.13, La-Casita, Plot No. LC 1/1, Sector 32 A , Ravet, Pradhikaran, Pune - 412101</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.iconWrapper}><Phone size={20} /></div>
                <div>
                  <h3>Phone</h3>
                  <p>+91 9552662173</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.iconWrapper}><Mail size={20} /></div>
                <div>
                  <h3>Email</h3>
                  <p>2019studio2.0@gmail.com</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.iconWrapper}><Clock size={20} /></div>
                <div>
                  <h3>Business Hours</h3>
                  <p>Mon - Sat: 10:00 AM - 7:00 PM</p>
                </div>
              </div>
            </div>

            {/* Map Integration */}
            <div className={styles.mapContainer}>
              <iframe 
                src="https://www.google.com/maps?q=La-Casita,Ravet,Pune&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              <a 
                href="https://maps.app.goo.gl/YpvfGpmyPHJE1jd99" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.directionsBtn}
              >
                <MapPin size={16} /> Get Directions
              </a>
            </div>
          </motion.div>

          {/* Contact Form CTA */}
          <motion.div 
            id="inquiry"
            className={styles.formSection}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className={styles.googleFormCta}>
              <h2>Start Your Project</h2>
              <p>Ready to transform your space? Choose the service you need and fill out the inquiry form.</p>
              
              <div className={styles.formOptions}>
                <div className={styles.formOption}>
                  <h3>Interior Design</h3>
                  <p>For furniture layout, color consultation, false ceiling, and decorative finishes.</p>
                  <a 
                    href="https://forms.gle/mkyxWARpQYC9D4Qw7" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-primary"
                  >
                    Interior Inquiry Form
                  </a>
                </div>

                <div className={styles.formOption}>
                  <h3>Architectural Planning</h3>
                  <p>For structural design, civil work, beams, columns, and foundation planning.</p>
                  <a 
                    href="https://forms.gle/UwFU2c3b6kLQAaxS6" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-primary"
                  >
                    Architecture Inquiry Form
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
