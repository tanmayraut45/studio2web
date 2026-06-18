"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PanelLeftClose, PanelLeft, X, Globe, ChevronDown } from "lucide-react";
import { clsx } from "clsx";
import { navItems } from "./nav";
import { useUI } from "@/erp/stores/useUI";
import { useSession, isClient } from "@/erp/stores/useSession";
import styles from "./Shell.module.css";

const CLIENT_NAV = [{ name: "Client Portal", href: "/erp/portal", icon: Globe }];

export default function Sidebar() {
  const pathname = usePathname();
  const collapsed = useUI((s) => s.sidebarCollapsed);
  const toggle = useUI((s) => s.toggleSidebar);
  const mobileOpen = useUI((s) => s.mobileNavOpen);
  const setMobileNav = useUI((s) => s.setMobileNav);
  const user = useSession((s) => s.user);
  const clientMode = isClient(user?.id);

  const isActive = (href) =>
    href === "/erp" ? pathname === "/erp" : pathname.startsWith(href);

  const activeParentHref =
    navItems.find((item) => item.children?.some((c) => isActive(c.href)))?.href ?? null;

  const [expanded, setExpanded] = useState(() =>
    activeParentHref ? [activeParentHref] : []
  );
  const [flyout, setFlyout] = useState(null);
  const flyoutTimer = useRef(null);

  useEffect(() => {
    if (activeParentHref && !expanded.includes(activeParentHref)) {
      setExpanded((prev) => [...prev, activeParentHref]);
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleExpanded = (href) =>
    setExpanded((prev) =>
      prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href]
    );

  const openFlyout = (href) => { clearTimeout(flyoutTimer.current); setFlyout(href); };
  const closeFlyout = () => { flyoutTimer.current = setTimeout(() => setFlyout(null), 130); };
  const keepFlyout = () => clearTimeout(flyoutTimer.current);

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
          <button className={styles.iconBtn} onClick={() => setMobileNav(false)} aria-label="Close menu">
            <X size={18} />
          </button>
        ) : (
          <button className={styles.iconBtn} onClick={toggle} aria-label="Toggle sidebar">
            {collapsed ? <PanelLeft size={17} /> : <PanelLeftClose size={17} />}
          </button>
        )}
      </div>

      <nav className={styles.nav}>
        {(clientMode ? CLIENT_NAV : navItems).map((item) => {
          const Icon = item.icon;
          const hasChildren = !clientMode && Boolean(item.children?.length);
          const isOpen = expanded.includes(item.href);
          const selfActive = isActive(item.href);
          const childActive = hasChildren && item.children.some((c) => isActive(c.href));
          const parentActive = selfActive || childActive;

          if (!hasChildren) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(styles.navItem, parentActive && styles.navActive)}
                onClick={() => setMobileNav(false)}
                title={collapsed && !mobile ? item.name : undefined}
              >
                {parentActive && (
                  <motion.span
                    layoutId={mobile ? undefined : `glow-${item.href}`}
                    className={styles.navGlow}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon size={18} className={styles.navIcon} />
                {(!collapsed || mobile) && <span className={styles.navText}>{item.name}</span>}
              </Link>
            );
          }

          // Item with children
          return (
            <div key={item.href} className={styles.navGroupItem}>
              {collapsed && !mobile ? (
                // Collapsed mode → flyout on hover
                <div
                  className={styles.navFlyoutAnchor}
                  onMouseEnter={() => openFlyout(item.href)}
                  onMouseLeave={closeFlyout}
                >
                  <button
                    className={clsx(styles.navItem, styles.navItemBtn, parentActive && styles.navActive)}
                    title={item.name}
                  >
                    {parentActive && (
                      <motion.span
                        layoutId={`glow-${item.href}`}
                        className={styles.navGlow}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <Icon size={18} className={styles.navIcon} />
                  </button>
                  <AnimatePresence>
                    {flyout === item.href && (
                      <motion.div
                        className={styles.navFlyout}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        onMouseEnter={keepFlyout}
                        onMouseLeave={closeFlyout}
                      >
                        <div className={styles.navFlyoutLabel}>{item.name}</div>
                        {item.children.map((child) => {
                          const CI = child.icon;
                          const ca = isActive(child.href);
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={clsx(styles.navFlyoutItem, ca && styles.navFlyoutItemActive)}
                              onClick={() => setMobileNav(false)}
                            >
                              <CI size={14} />
                              {child.name}
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                // Expanded mode → accordion
                <>
                  <button
                    className={clsx(styles.navItem, styles.navItemBtn, parentActive && styles.navActive)}
                    onClick={() => toggleExpanded(item.href)}
                  >
                    {parentActive && (
                      <motion.span
                        layoutId={mobile ? undefined : `glow-${item.href}`}
                        className={styles.navGlow}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <Icon size={18} className={styles.navIcon} />
                    <span className={styles.navText}>{item.name}</span>
                    <ChevronDown
                      size={14}
                      className={clsx(styles.navChevron, isOpen && styles.navChevronOpen)}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        className={styles.navSubList}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      >
                        {item.children.map((child) => {
                          const CI = child.icon;
                          const ca = isActive(child.href);
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={clsx(styles.navSubItem, ca && styles.navSubActive)}
                              onClick={() => setMobileNav(false)}
                            >
                              <CI size={13} />
                              {child.name}
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>
          );
        })}
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
      <aside className={clsx(styles.sidebar, collapsed && styles.collapsed)}>
        {content(false)}
      </aside>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className={styles.mobileBackdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileNav(false)}
            />
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
