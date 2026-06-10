"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession, isClient } from "@/erp/stores/useSession";
import styles from "./Shell.module.css";

const emptySubscribe = () => () => {};
// false on the server + first client paint, true once mounted — avoids
// hydration mismatches from the persisted (localStorage) session.
function useHydrated() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

const CLIENT_ALLOWED = ["/erp/portal"];

export default function AuthGate({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const mounted = useHydrated();
  const isAuthed = useSession((s) => s.isAuthed);
  const sessionHydrated = useSession((s) => s._hydrated);
  const user = useSession((s) => s.user);

  const ready = mounted && sessionHydrated;

  useEffect(() => {
    if (!ready) return;
    if (!isAuthed) {
      router.replace("/erp/login");
      return;
    }
    // Clients can only see the Client Portal.
    if (isClient(user?.id) && !CLIENT_ALLOWED.some((p) => pathname.startsWith(p))) {
      router.replace("/erp/portal");
    }
  }, [ready, isAuthed, user, pathname, router]);

  if (!ready || !isAuthed) {
    return (
      <div className={styles.bootScreen}>
        <div className={styles.bootMark}>
          <span>Studio</span><strong>OS</strong>
        </div>
        <div className={styles.bootBar}><span /></div>
      </div>
    );
  }
  return children;
}
