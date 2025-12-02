import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Linkedin, MapPin, Phone, Mail } from "lucide-react";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <div className={styles.logoWrapper}>
                <Image 
                  src="/images/logo.jpeg" 
                  alt="Studio 2 Logo" 
                  width={60} 
                  height={60} 
                  className={styles.logoImage}
                />
                <span>Studio<span className={styles.logoHighlight}>2</span></span>
              </div>
            </Link>
            <p className={styles.tagline}>
              Designing spaces that inspire and elevate your lifestyle.
            </p>
          </div>

          <div className={styles.links}>
            <h4 className={styles.columnTitle}>Quick Links</h4>
            <Link href="/portfolio">Portfolio</Link>
            <Link href="/services">Services</Link>
            <Link href="/about">About Us</Link>
            <Link href="/contact">Contact</Link>
          </div>

          <div className={styles.contact}>
            <h4 className={styles.columnTitle}>Contact Us</h4>
            <div className={styles.contactItem}>
              <MapPin size={18} />
              <span>123 Design Avenue, Creative City, ST 12345</span>
            </div>
            <div className={styles.contactItem}>
              <Phone size={18} />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className={styles.contactItem}>
              <Mail size={18} />
              <span>hello@studio2.com</span>
            </div>
          </div>

          <div className={styles.social}>
            <h4 className={styles.columnTitle}>Follow Us</h4>
            <div className={styles.socialIcons}>
              <a href="#" aria-label="Instagram"><Instagram /></a>
              <a href="#" aria-label="Facebook"><Facebook /></a>
              <a href="#" aria-label="LinkedIn"><Linkedin /></a>
            </div>
          </div>
        </div>

        <div className={styles.copyright}>
          <p>&copy; {new Date().getFullYear()} Studio 2 Interior Design. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
