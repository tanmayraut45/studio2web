"use client";

import { useEffect, useMemo } from "react";
import { BarChart3 } from "lucide-react";
import { PageHeader } from "@/components/erp/ui";
import { inr, inrCompact } from "@/erp/lib/format";
import { useInvoicesStore } from "@/erp/stores/useInvoicesStore";
import { useExpensesStore } from "@/erp/stores/useExpensesStore";
import styles from "./cashflow.module.css";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function CashFlowPage() {
  const invoices   = useInvoicesStore((s) => s.invoices);
  const hydrate    = useInvoicesStore((s) => s.hydrate);
  const office     = useExpensesStore((s) => s.office);
  const marketing  = useExpensesStore((s) => s.marketing);
  const other      = useExpensesStore((s) => s.other);
  const hydrateExp = useExpensesStore((s) => s.hydrate);

  useEffect(() => { hydrate(); hydrateExp(); }, [hydrate, hydrateExp]);

  const totalExp = useMemo(() =>
    [...office, ...marketing, ...other].reduce((s, e) => s + (e.amount || 0), 0),
    [office, marketing, other]
  );

  const monthlyData = useMemo(() => {
    const now = new Date();
    const rows = [];
    for (let i = 11; i >= 0; i--) {
      const d   = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const yr  = d.getFullYear();
      const mo  = d.getMonth();
      const inflow = invoices
        .filter((inv) => {
          const d2 = new Date(inv.issued || 0);
          return d2.getFullYear() === yr && d2.getMonth() === mo && (inv.status === "Paid" || inv.status === "paid");
        })
        .reduce((s, inv) => s + (inv.amount || 0) + (inv.gst || 0), 0);
      const exp = totalExp / 12;
      rows.push({ label: MONTHS[mo], yr, inflow, exp, net: inflow - exp });
    }
    return rows;
  }, [invoices, totalExp]);

  const maxVal = Math.max(...monthlyData.map((r) => Math.max(r.inflow, r.exp)), 1);

  const summary = useMemo(() => ({
    totalInflow:  monthlyData.reduce((s, r) => s + r.inflow, 0),
    totalExp:     monthlyData.reduce((s, r) => s + r.exp, 0),
    netCash:      monthlyData.reduce((s, r) => s + r.net, 0),
    bestMonth:    [...monthlyData].sort((a, b) => b.inflow - a.inflow)[0]?.label || "—",
  }), [monthlyData]);

  return (
    <div className={styles.page}>
      <PageHeader icon={BarChart3} title="Cash Flow" subtitle="Monthly inflow vs expenses — 12-month view" />

      <div className={styles.kpiRow}>
        <div className={styles.kpiCard} data-accent="gold">
          <span className={styles.kpiLabel}>Total Inflow</span>
          <span className={`${styles.kpiValue} ${styles.kpiGold}`}>{inrCompact(summary.totalInflow)}</span>
        </div>
        <div className={styles.kpiCard} data-accent="danger">
          <span className={styles.kpiLabel}>Total Expenses</span>
          <span className={`${styles.kpiValue} ${styles.kpiDanger}`}>{inrCompact(summary.totalExp)}</span>
        </div>
        <div className={styles.kpiCard} data-accent={summary.netCash >= 0 ? "green" : "danger"}>
          <span className={styles.kpiLabel}>Net Position</span>
          <span className={`${styles.kpiValue} ${summary.netCash >= 0 ? styles.kpiGreen : styles.kpiDanger}`}>{inrCompact(summary.netCash)}</span>
        </div>
        <div className={styles.kpiCard} data-accent="gold">
          <span className={styles.kpiLabel}>Best Month</span>
          <span className={`${styles.kpiValue} ${styles.kpiGold}`}>{summary.bestMonth}</span>
        </div>
      </div>

      <div className={styles.chartCard}>
        <div className={styles.chartHead}>
          <span className={styles.chartTitle}>Monthly Cash Flow — Last 12 Months</span>
          <div className={styles.legend}>
            <span className={styles.legendItem}><span className={styles.legendDot} style={{ background: "var(--erp-gold)" }} /> Inflow</span>
            <span className={styles.legendItem}><span className={styles.legendDot} style={{ background: "var(--erp-danger)", opacity: 0.7 }} /> Expenses</span>
          </div>
        </div>
        <div className={styles.barChart}>
          {monthlyData.map((row) => (
            <div key={`${row.label}-${row.yr}`} className={styles.barGroup}>
              <div className={styles.bars}>
                <div
                  className={styles.barInflow}
                  style={{ height: `${(row.inflow / maxVal) * 140}px` }}
                  title={`Inflow: ${inr(row.inflow)}`}
                />
                <div
                  className={styles.barExp}
                  style={{ height: `${(row.exp / maxVal) * 140}px` }}
                  title={`Expenses: ${inr(row.exp)}`}
                />
              </div>
              <span className={styles.barLabel}>{row.label}</span>
              <span className={`${styles.barNet} ${row.net >= 0 ? styles.netPos : styles.netNeg}`}>
                {row.net >= 0 ? "+" : ""}{inrCompact(row.net)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Month</th>
              <th className={`${styles.th} ${styles.thR}`}>Inflow</th>
              <th className={`${styles.th} ${styles.thR}`}>Expenses</th>
              <th className={`${styles.th} ${styles.thR}`}>Net</th>
            </tr>
          </thead>
          <tbody>
            {[...monthlyData].reverse().map((row) => (
              <tr key={`${row.label}-${row.yr}-t`} className={styles.tr}>
                <td className={styles.td}>{row.label} {row.yr}</td>
                <td className={`${styles.td} ${styles.tdMono} ${styles.tdR} ${styles.kpiGold}`}>{row.inflow > 0 ? inr(row.inflow) : "—"}</td>
                <td className={`${styles.td} ${styles.tdMono} ${styles.tdR} ${styles.kpiDanger}`}>{inr(row.exp)}</td>
                <td className={`${styles.td} ${styles.tdMono} ${styles.tdR} ${row.net >= 0 ? styles.kpiGreen : styles.kpiDanger}`}>
                  {row.net >= 0 ? "+" : ""}{inr(row.net)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
