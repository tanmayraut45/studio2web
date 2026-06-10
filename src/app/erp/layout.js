"use client";

import { useSyncExternalStore } from "react";
import { useUI } from "@/erp/stores/useUI";
import "./erp-theme.css";

const emptySubscribe = () => () => {};
// Returns false during SSR + first client paint, true once hydrated —
// without setState-in-effect, so it stays React-Compiler clean.
function useHydrated() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

export default function ErpRootLayout({ children }) {
  const theme = useUI((s) => s.theme);
  const hydrated = useHydrated();

  return (
    <div className="erpRoot" data-erp-theme={hydrated ? theme : "dark"}>
      {children}
    </div>
  );
}
