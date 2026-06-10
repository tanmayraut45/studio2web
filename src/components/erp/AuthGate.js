"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/erp/stores/useSession";
import styles from "./Shell.module.css";

const emptySubscribe = () => () => {};
// false on the server + first client paint, true once mounted — avoids
// hydration mismatches from the persisted (localStorage) session.
function useHydrated() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

export default function AuthGate({ children }) {
  const router = useRouter();
  const mounted = useHydrated();
  const isAuthed = useSession((s) => s.isAuthed);
  const sessionHydrated = useSession((s) => s._hydrated);

  const ready = mounted && sessionHydrated;

  useEffect(() => {
    if (ready && !isAuthed) router.replace("/erp/login");
  }, [ready, isAuthed, router]);

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
