import Link from "next/link";
import { Instagram, Smartphone, Mail, ArrowUpRight } from "lucide-react";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">


        <div className={styles.divider} />

        <div className={styles.bottomSection}>
          <div className={styles.left}>
            <p className={styles.address}>
              Studio II, Ravet<br />Pune, India
            </p>
            <div className={styles.socials}>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <Instagram size={20} />
              </a>
              <a href="mailto:2019studio2.0@gmail.com">
                <Mail size={20} />
              </a>
              <a href="tel:+919552662173">
                <Smartphone size={20} />
              </a>
            </div>
          </div>

          <div className={styles.right}>
            <Link href="/erp/login" className={styles.osButton}>
              <span className={styles.osPulse} />
              <span className={styles.osLabel}>Enter Studio OS</span>
              <span className={styles.osIcon}>
                <ArrowUpRight size={16} />
              </span>
            </Link>
            <Link href="/erp/login" className={styles.copyright}>
              &copy; 2026 Studio II
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
