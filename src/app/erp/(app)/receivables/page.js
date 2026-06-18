"use client";

import { useEffect, useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { PageHeader, Badge } from "@/components/erp/ui";
import { inr, inrCompact, dateShort } from "@/erp/lib/format";
import { useInvoicesStore } from "@/erp/stores/useInvoicesStore";
import { useClientsStore } from "@/erp/stores/useClientsStore";
import styles from "./receivables.module.css";

export default function ReceivablesPage() {
  const invoices  = useInvoicesStore((s) => s.invoices);
  const hydrate   = useInvoicesStore((s) => s.hydrate);
  const clients   = useClientsStore((s) => s.clients);
  const hydrateC  = useClientsStore((s) => s.hydrate);

  useEffect(() => { hydrate(); hydrateC(); }, [hydrate, hydrateC]);

  const open = useMemo(() =>
    invoices
      .filter((i) => ["sent", "overdue", "partially paid"].includes((i.status || "").toLowerCase()))
      .sort((a, b) => new Date(a.due || 0) - new Date(b.due || 0)),
    [invoices]
  );

  const totals = useMemo(() => ({
    outstanding: open.reduce((s, i) => s + (i.amount || 0) + (i.gst || 0), 0),
    overdue:     open.filter((i) => (i.status || "").toLowerCase() === "overdue").reduce((s, i) => s + (i.amount || 0) + (i.gst || 0), 0),
    count:       open.length,
  }), [open]);

  const getClientName = (id) => clients.find((c) => c.id === id)?.company || clients.find((c) => c.id === id)?.name || id || "—";

  const daysPast = (due) => {
    if (!due) return null;
    const diff = Math.floor((Date.now() - new Date(due)) / 86400000);
    return diff;
  };

  return (
    <div className={styles.page}>
      <PageHeader icon={TrendingUp} title="Receivables" subtitle="Open invoices · Aging · Client follow-up" />

      <div className={styles.kpiRow}>
        <div className={styles.kpiCard} data-accent="warn">
          <span className={styles.kpiLabel}>Total Outstanding</span>
          <span className={`${styles.kpiValue} ${styles.kpiWarn}`}>{inrCompact(totals.outstanding)}</span>
        </div>
        <div className={styles.kpiCard} data-accent="danger">
          <span className={styles.kpiLabel}>Overdue Amount</span>
          <span className={`${styles.kpiValue} ${styles.kpiDanger}`}>{inrCompact(totals.overdue)}</span>
        </div>
        <div className={styles.kpiCard} data-accent="gold">
          <span className={styles.kpiLabel}>Open Invoices</span>
          <span className={`${styles.kpiValue} ${styles.kpiGold}`}>{totals.count}</span>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Invoice</th>
              <th className={styles.th}>Client</th>
              <th className={styles.th}>Due Date</th>
              <th className={styles.th}>Aging</th>
              <th className={`${styles.th} ${styles.thR}`}>Amount</th>
              <th className={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {open.length === 0 ? (
              <tr><td colSpan={6} className={styles.emptyCell}>No outstanding receivables</td></tr>
            ) : open.map((inv) => {
              const total = (inv.amount || 0) + (inv.gst || 0);
              const days  = daysPast(inv.due);
              const isOver = days > 0;
              return (
                <tr key={inv.id} className={styles.tr}>
                  <td className={`${styles.td} ${styles.tdMono} ${styles.tdPrimary}`}>{inv.code || inv.id?.slice(0, 8)}</td>
                  <td className={styles.td}>{getClientName(inv.client)}</td>
                  <td className={`${styles.td} ${styles.tdMono}`}>{dateShort(inv.due)}</td>
                  <td className={styles.td}>
                    {days !== null ? (
                      <span className={isOver ? styles.overdue : styles.dueFuture}>
                        {isOver ? `${days}d overdue` : `${Math.abs(days)}d left`}
                      </span>
                    ) : "—"}
                  </td>
                  <td className={`${styles.td} ${styles.tdMono} ${styles.tdR}`}>{inr(total)}</td>
                  <td className={styles.td}><Badge>{inv.status || "sent"}</Badge></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
