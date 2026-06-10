"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CornerDownLeft } from "lucide-react";
import { allNavItems } from "./nav";
import { useUI } from "@/erp/stores/useUI";
import { projects, clients, leads } from "@/erp/data";
import styles from "./Command.module.css";

export default function CommandPalette() {
  const theme = useUI((s) => s.theme);
  const open = useUI((s) => s.commandOpen);
  const setOpen = useUI((s) => s.setCommandOpen);

  useEffect(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, setOpen]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div data-erp-theme={theme} className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
          {/* PaletteInner mounts fresh on open, so its search state resets naturally */}
          <PaletteInner onClose={() => setOpen(false)} />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

function PaletteInner({ onClose }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const items = [
      ...allNavItems.map((n) => ({ type: "Navigate", label: n.name, sub: n.group, href: n.href })),
      ...projects.map((p) => ({ type: "Project", label: p.name, sub: p.code, href: "/erp/projects" })),
      ...clients.map((c) => ({ type: "Client", label: c.company, sub: c.type, href: "/erp/clients" })),
      ...leads.map((l) => ({ type: "Lead", label: l.name, sub: l.requirement, href: "/erp/leads" })),
    ];
    if (!q.trim()) return items.slice(0, 8);
    const s = q.toLowerCase();
    return items.filter((i) => `${i.label} ${i.sub}`.toLowerCase().includes(s)).slice(0, 12);
  }, [q]);

  const go = (item) => { if (item) { router.push(item.href); onClose(); } };

  const onKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    if (e.key === "Enter") { e.preventDefault(); go(results[active]); }
  };

  return (
    <motion.div
      className={styles.palette}
      initial={{ opacity: 0, y: -16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.98 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.inputRow}>
        <Search size={17} />
        <input autoFocus placeholder="Search projects, clients, leads, modules…" value={q}
          onChange={(e) => { setQ(e.target.value); setActive(0); }} onKeyDown={onKey} />
        <kbd>ESC</kbd>
      </div>
      <div className={styles.list}>
        {results.map((r, i) => (
          <button key={i} className={`${styles.item} ${i === active ? styles.itemActive : ""}`}
            onMouseEnter={() => setActive(i)} onClick={() => go(r)}>
            <span className={styles.itemType}>{r.type}</span>
            <span className={styles.itemLabel}>{r.label}</span>
            <span className={styles.itemSub}>{r.sub}</span>
            {i === active && <CornerDownLeft size={14} className={styles.enter} />}
          </button>
        ))}
        {results.length === 0 && <div className={styles.noRes}>No matches for “{q}”</div>}
      </div>
    </motion.div>
  );
}
