"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, Bell, Sun, Moon, LogOut, ChevronDown, Command } from "lucide-react";
import { clsx } from "clsx";
import { allNavItems } from "./nav";
import { useUI } from "@/erp/stores/useUI";
import { useSession } from "@/erp/stores/useSession";
import { useNotifications } from "@/erp/stores/useNotifications";
import { Avatar } from "./ui";
import styles from "./Shell.module.css";

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const setMobileNav = useUI((s) => s.setMobileNav);
  const theme = useUI((s) => s.theme);
  const toggleTheme = useUI((s) => s.toggleTheme);
  const setCommandOpen = useUI((s) => s.setCommandOpen);
  const user = useSession((s) => s.user);
  const logout = useSession((s) => s.logout);
  const notes = useNotifications((s) => s.items);
  const markAllRead = useNotifications((s) => s.markAllRead);

  const [openMenu, setOpenMenu] = useState(null); // 'notes' | 'user' | null
  const unread = notes.filter((n) => !n.read).length;

  const current = allNavItems.find((i) =>
    i.href === "/erp" ? pathname === "/erp" : pathname.startsWith(i.href)
  );

  const doLogout = () => { logout(); router.replace("/erp/login"); };

  return (
    <header className={styles.topbar}>
      <div className={styles.topLeft}>
        <button className={clsx(styles.iconBtn, styles.mobileOnly)} onClick={() => setMobileNav(true)} aria-label="Open menu">
          <Menu size={19} />
        </button>
        <div className={styles.crumb}>
          <span className={styles.crumbGroup}>{current?.group || "Studio OS"}</span>
          <span className={styles.crumbSep}>/</span>
          <span className={styles.crumbPage}>{current?.name || "Dashboard"}</span>
        </div>
      </div>

      <div className={styles.topRight}>
        <button className={styles.searchBtn} onClick={() => setCommandOpen(true)}>
          <Search size={15} />
          <span>Search…</span>
          <kbd><Command size={11} />K</kbd>
        </button>

        <button className={styles.iconBtn} onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className={styles.menuAnchor}>
          <button className={styles.iconBtn} onClick={() => setOpenMenu(openMenu === "notes" ? null : "notes")} aria-label="Notifications">
            <Bell size={18} />
            {unread > 0 && <span className={styles.dot}>{unread}</span>}
          </button>
          {openMenu === "notes" && (
            <>
              <div className={styles.menuBackdrop} onClick={() => setOpenMenu(null)} />
              <div className={clsx(styles.dropdown, styles.notesDropdown)}>
                <div className={styles.dropHead}>
                  <strong>Notifications</strong>
                  <button onClick={markAllRead}>Mark all read</button>
                </div>
                <div className={styles.notesList}>
                  {notes.map((n) => (
                    <div key={n.id} className={clsx(styles.note, !n.read && styles.noteUnread)}>
                      <span className={clsx(styles.noteDot, styles[`nd_${n.type}`])} />
                      <div>
                        <strong>{n.title}</strong>
                        <p>{n.body}</p>
                        <span className={styles.noteTime}>{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className={styles.menuAnchor}>
          <button className={styles.userBtn} onClick={() => setOpenMenu(openMenu === "user" ? null : "user")}>
            <Avatar name={user?.name} initials={user?.initials} size={30} />
            <span className={styles.userInfo}>
              <span className={styles.userName}>{user?.name}</span>
              <span className={styles.userRole}>{user?.label}</span>
            </span>
            <ChevronDown size={15} />
          </button>
          {openMenu === "user" && (
            <>
              <div className={styles.menuBackdrop} onClick={() => setOpenMenu(null)} />
              <div className={styles.dropdown}>
                <div className={styles.userCard}>
                  <Avatar name={user?.name} initials={user?.initials} size={38} />
                  <div>
                    <strong>{user?.name}</strong>
                    <span>{user?.email}</span>
                  </div>
                </div>
                <button className={styles.menuItem} onClick={doLogout}>
                  <LogOut size={15} /> Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
