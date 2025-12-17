import { Instagram, Smartphone, Mail } from "lucide-react"; // Changed Phone to Smartphone for modern vibe
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
          
          <div className={styles.copyright}>
            &copy; {new Date().getFullYear()} Studio II<br />
            <span className={styles.subtle}>Designed for Mobile</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
