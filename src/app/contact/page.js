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
                  <p>Studio II, Office No.13, La-Casita, <br />Plot No. LC 1/1, Sector 32 A , Ravet, Pradhikaran, Pune - 412101</p>
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
                <div className={styles.iconWrapper}>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="currentColor" 
                    stroke="none"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471.148-.67.396-.199.247-.774.966-.949 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.231-.298.33-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
                <div>
                  <h3>WhatsApp</h3>
                  <a 
                    href="https://wa.me/919552662173" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: 'inherit', textDecoration: 'none' }}
                  >
                    +91 9552662173
                  </a>
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
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d258.73801577372706!2d73.75605374767164!3d18.643028926930892!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b90057edc171%3A0xa48c39eee104743f!2sStudio%202!5e1!3m2!1sen!2sus!4v1765879564865!5m2!1sen!2sus"
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
