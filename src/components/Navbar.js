"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <motion.header 
      className={styles.navbar}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="container">
        <div className={styles.navContent}>
          <Link href="/" className={styles.logo}>
            <span className={styles.studio}>Studio</span>
            <span className={styles.numeral}>II</span>
          </Link>
          
          {/* Optional: Add a simple action button like 'Book' */}
          <Link href="/contact" className={styles.bookBtn}>
            Book Now
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
