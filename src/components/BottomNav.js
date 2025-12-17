"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Grid, Lightbulb, User, Mail } from "lucide-react";
import styles from "./BottomNav.module.css";

const navItems = [
  { name: "Home", href: "/", icon: <Home size={20} /> },
  { name: "Work", href: "/portfolio", icon: <Grid size={20} /> },
  { name: "Services", href: "/services", icon: <Lightbulb size={20} /> },
  { name: "About", href: "/about", icon: <User size={20} /> },
  { name: "Contact", href: "/contact", icon: <Mail size={20} /> },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className={styles.dockContainer}>
      <motion.nav 
        className={styles.dock}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link key={item.name} href={item.href} className={styles.dockItem}>
              {isActive && (
                <motion.div 
                  layoutId="dockHighlight"
                  className={styles.activeHighlight}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className={`${styles.icon} ${isActive ? styles.activeIcon : ""}`}>
                {item.icon}
              </span>
              {/* Optional: Show label only on active or just keep icons for minimal look */}
            </Link>
          );
        })}
      </motion.nav>
    </div>
  );
}
