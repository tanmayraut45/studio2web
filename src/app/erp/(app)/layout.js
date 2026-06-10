"use client";

import AuthGate from "@/components/erp/AuthGate";
import Sidebar from "@/components/erp/Sidebar";
import Topbar from "@/components/erp/Topbar";
import CommandPalette from "@/components/erp/CommandPalette";
import styles from "@/components/erp/Shell.module.css";

export default function AppLayout({ children }) {
  return (
    <AuthGate>
      <div className={styles.appShell}>
        <Sidebar />
        <div className={styles.main}>
          <Topbar />
          <main className={styles.content}>{children}</main>
        </div>
        <CommandPalette />
      </div>
    </AuthGate>
  );
}
