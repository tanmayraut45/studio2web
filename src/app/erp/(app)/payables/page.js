"use client";

import { useEffect, useMemo } from "react";
import { CreditCard } from "lucide-react";
import { PageHeader } from "@/components/erp/ui";
import { inr, inrCompact } from "@/erp/lib/format";
import { useExpensesStore } from "@/erp/stores/useExpensesStore";
import styles from "./payables.module.css";

const CAT_LABELS = { office: "Office & Admin", marketing: "Marketing", other: "Other" };
const CAT_COLORS = { office: "var(--erp-gold)", marketing: "#3b82f6", other: "#8b5cf6" };

export default function PayablesPage() {
  const office     = useExpensesStore((s) => s.office);
  const marketing  = useExpensesStore((s) => s.marketing);
  const other      = useExpensesStore((s) => s.other);
  const hydrate    = useExpensesStore((s) => s.hydrate);

  useEffect(() => { hydrate(); }, [hydrate]);

  const all = useMemo(() => {
    const rows = [];
    Object.entries({ office, marketing, other }).forEach(([cat, items]) => {
      items.forEach((item) => rows.push({ ...item, category: cat }));
    });
    return rows.sort((a, b) => (b.amount || 0) - (a.amount || 0));
  }, [office, marketing, other]);

  const totals = useMemo(() => ({
    office:    office.reduce((s, e) => s + (e.amount || 0), 0),
    marketing: marketing.reduce((s, e) => s + (e.amount || 0), 0),
    other:     other.reduce((s, e) => s + (e.amount || 0), 0),
  }), [office, marketing, other]);
  const grand = totals.office + totals.marketing + totals.other;

  return (
    <div className={styles.page}>
      <PageHeader icon={CreditCard} title="Payables" subtitle="Business expenses by category · Office · Marketing · Other" />

      <div className={styles.kpiRow}>
        {Object.entries(CAT_LABELS).map(([cat, label]) => (
          <div key={cat} className={styles.kpiCard} style={{ borderTopColor: CAT_COLORS[cat] }}>
            <span className={styles.kpiLabel}>{label}</span>
            <span className={styles.kpiValue} style={{ color: CAT_COLORS[cat] }}>{inrCompact(totals[cat])}</span>
            <span className={styles.kpiSub}>{((totals[cat] / (grand || 1)) * 100).toFixed(1)}% of total</span>
          </div>
        ))}
        <div className={styles.kpiCard} style={{ borderTopColor: "var(--erp-text-2)" }}>
          <span className={styles.kpiLabel}>Total Payables</span>
          <span className={styles.kpiValue}>{inrCompact(grand)}</span>
          <span className={styles.kpiSub}>{all.length} line items</span>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Description</th>
              <th className={styles.th}>Category</th>
              <th className={`${styles.th} ${styles.thR}`}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {all.length === 0 ? (
              <tr><td colSpan={3} className={styles.emptyCell}>No expenses recorded. Add them in HR & Payroll.</td></tr>
            ) : all.map((row) => (
              <tr key={row.id} className={styles.tr}>
                <td className={`${styles.td} ${styles.tdPrimary}`}>{row.label}</td>
                <td className={styles.td}>
                  <span className={styles.catPill} style={{ color: CAT_COLORS[row.category], background: `${CAT_COLORS[row.category]}18` }}>
                    {CAT_LABELS[row.category]}
                  </span>
                </td>
                <td className={`${styles.td} ${styles.tdMono} ${styles.tdR}`}>{inr(row.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
