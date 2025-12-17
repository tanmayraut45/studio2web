"use client";

import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import styles from "./Navbar.module.css";
import { ArrowUpRight } from "lucide-react";

export default function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  return (
    <motion.header 
      className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="container">
        <div className={styles.navContent}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <span className={styles.studio}>Studio</span>
            <span className={styles.numeral}>II</span>
          </Link>
          
          {/* Aesthetics Action */}
          <Link href="/contact" className={styles.bookBtn}>
            <span className={styles.btnText}>Book Now</span>
            <div className={styles.btnIcon}>
              <ArrowUpRight size={18} />
            </div>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
