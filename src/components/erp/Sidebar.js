"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PanelLeftClose, PanelLeft, X } from "lucide-react";
import { clsx } from "clsx";
import { navGroups } from "./nav";
import { useUI } from "@/erp/stores/useUI";
import styles from "./Shell.module.css";

export default function Sidebar() {
  const pathname = usePathname();
  const collapsed = useUI((s) => s.sidebarCollapsed);
  const toggle = useUI((s) => s.toggleSidebar);
  const mobileOpen = useUI((s) => s.mobileNavOpen);
  const setMobileNav = useUI((s) => s.setMobileNav);

  const isActive = (href) => (href === "/erp" ? pathname === "/erp" : pathname.startsWith(href));

  const content = (mobile) => (
    <>
      <div className={styles.brand}>
        <Link href="/erp" className={styles.brandMark} onClick={() => setMobileNav(false)}>
          <span className={styles.brandDot} />
          {(!collapsed || mobile) && (
            <span className={styles.brandText}>Studio<strong>OS</strong></span>
          )}
        </Link>
        {mobile ? (
          <button className={styles.iconBtn} onClick={() => setMobileNav(false)} aria-label="Close menu"><X size={18} /></button>
        ) : (
          <button className={styles.iconBtn} onClick={toggle} aria-label="Toggle sidebar">
            {collapsed ? <PanelLeft size={17} /> : <PanelLeftClose size={17} />}
          </button>
        )}
      </div>

      <nav className={styles.nav}>
        {navGroups.map((group) => (
          <div className={styles.navGroup} key={group.label}>
            {(!collapsed || mobile) && <span className={styles.navLabel}>{group.label}</span>}
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(styles.navItem, active && styles.navActive)}
                  onClick={() => setMobileNav(false)}
                  title={collapsed && !mobile ? item.name : undefined}
                >
                  {active && <motion.span layoutId={mobile ? undefined : "navGlow"} className={styles.navGlow} transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                  <Icon size={18} className={styles.navIcon} />
                  {(!collapsed || mobile) && <span className={styles.navText}>{item.name}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {(!collapsed || mobile) && (
        <div className={styles.sideFoot}>
          <Link href="/" className={styles.backSite}>← Back to studio2.in</Link>
        </div>
      )}
    </>
  );

  return (
    <>
      <aside className={clsx(styles.sidebar, collapsed && styles.collapsed)}>{content(false)}</aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div className={styles.mobileBackdrop} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileNav(false)} />
            <motion.aside
              className={clsx(styles.sidebar, styles.mobileSidebar)}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              {content(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
