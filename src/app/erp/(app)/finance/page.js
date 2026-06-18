"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Receipt, TrendingUp, CreditCard, BarChart3, Users, Shield, Wallet,
} from "lucide-react";
import { PageHeader, Badge } from "@/components/erp/ui";
import { inrCompact, inr, dateShort } from "@/erp/lib/format";
import { useInvoicesStore } from "@/erp/stores/useInvoicesStore";
import { useExpensesStore } from "@/erp/stores/useExpensesStore";
import { useProjectsStore } from "@/erp/stores/useProjectsStore";
import styles from "./finance.module.css";

const SECTIONS = [
  { name: "Invoices", href: "/erp/invoices", icon: Receipt, desc: "Draft, send & track all project invoices", statKey: "invoices" },
  { name: "Receivables", href: "/erp/receivables", icon: TrendingUp, desc: "Amounts owed by clients — aging & follow-ups", statKey: "receivables" },
  { name: "Payables", href: "/erp/payables", icon: CreditCard, desc: "Vendor bills & purchase payment tracking", statKey: "payables" },
  { name: "Cash Flow", href: "/erp/cashflow", icon: BarChart3, desc: "Monthly inflow vs outflow & burn analysis", statKey: "cashflow" },
  { name: "HR & Payroll", href: "/erp/hr", icon: Users, desc: "Employee salaries, attendance & benefits", statKey: "hr" },
  { name: "GST & Compliance", href: "/erp/gst", icon: Shield, desc: "GST filings, returns & tax summaries", statKey: "gst" },
];

const EXP_COLORS = { office: "#d4af37", marketing: "#3b82f6", other: "#8b5cf6" };
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function FinancePage() {
  const invoices  = useInvoicesStore((s) => s.invoices);
  const hydrateInv = useInvoicesStore((s) => s.hydrate);

  const office    = useExpensesStore((s) => s.office);
  const marketing = useExpensesStore((s) => s.marketing);
  const other     = useExpensesStore((s) => s.other);
  const hydrateExp = useExpensesStore((s) => s.hydrate);

  const projects  = useProjectsStore((s) => s.projects);
  const hydratePrj = useProjectsStore((s) => s.hydrate);

  useEffect(() => {
    hydrateInv();
    hydrateExp();
    hydratePrj();
  }, [hydrateInv, hydrateExp, hydratePrj]);

  const metrics = useMemo(() => {
    const paid      = invoices.filter((i) => i.status === "Paid" || i.status === "paid");
    const outstanding = invoices.filter((i) => ["sent", "overdue", "partially paid"].includes((i.status || "").toLowerCase()));
    const overdue   = invoices.filter((i) => (i.status || "").toLowerCase() === "overdue");

    const revenue   = paid.reduce((s, i) => s + (i.amount || 0) + (i.gst || 0), 0);
    const outstandingAmt = outstanding.reduce((s, i) => s + (i.amount || 0) + (i.gst || 0), 0);

    const offTotal  = office.reduce((s, e) => s + (e.amount || 0), 0);
    const mktTotal  = marketing.reduce((s, e) => s + (e.amount || 0), 0);
    const othTotal  = other.reduce((s, e) => s + (e.amount || 0), 0);
    const expenses  = offTotal + mktTotal + othTotal;

    const netCash   = revenue - expenses;

    const sectStats = {
      invoices:    `${invoices.length} total`,
      receivables: `${outstanding.length} open`,
      payables:    `${overdue.length} overdue`,
      cashflow:    netCash >= 0 ? `+${inrCompact(netCash)}` : inrCompact(netCash),
      hr:          "",
      gst:         "",
    };

    return { revenue, outstandingAmt, expenses, netCash, offTotal, mktTotal, othTotal, sectStats, overdue };
  }, [invoices, office, marketing, other]);

  const recentInvoices = useMemo(() => {
    return [...invoices]
      .sort((a, b) => new Date(b.issued || 0) - new Date(a.issued || 0))
      .slice(0, 8);
  }, [invoices]);

  const expBreakdown = [
    { name: "Office", color: EXP_COLORS.office, amt: metrics.offTotal },
    { name: "Marketing", color: EXP_COLORS.marketing, amt: metrics.mktTotal },
    { name: "Other", color: EXP_COLORS.other, amt: metrics.othTotal },
  ].filter((e) => e.amt > 0);
  const totalExp = metrics.expenses || 1;

  // Build last-6-month cash-flow bars from invoices
  const cfData = useMemo(() => {
    const now   = new Date();
    const bars  = [];
    for (let i = 5; i >= 0; i--) {
      const d   = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const yr  = d.getFullYear();
      const mo  = d.getMonth();
      const inflow = invoices
        .filter((inv) => {
          const d2 = new Date(inv.issued || 0);
          return d2.getFullYear() === yr && d2.getMonth() === mo &&
            (inv.status === "Paid" || inv.status === "paid");
        })
        .reduce((s, inv) => s + (inv.amount || 0) + (inv.gst || 0), 0);
      bars.push({ label: MONTHS_SHORT[mo], inflow, expense: metrics.expenses / 6 });
    }
    const maxVal = Math.max(...bars.map((b) => Math.max(b.inflow, b.expense)), 1);
    return bars.map((b) => ({ ...b, inflowH: (b.inflow / maxVal) * 60, expenseH: (b.expense / maxVal) * 60 }));
  }, [invoices, metrics.expenses]);

  return (
    <div className={styles.hub}>
      <PageHeader
        icon={Wallet}
        title="Finance"
        subtitle="Revenue · Expenses · Cash Flow · Compliance"
      />

      {/* KPI cards */}
      <div className={styles.kpiRow}>
        <div className={styles.kpiCard} data-accent="gold">
          <span className={styles.kpiLabel}>Revenue Collected</span>
          <span className={`${styles.kpiValue} ${styles.kpiGold}`}>{inrCompact(metrics.revenue)}</span>
          <span className={styles.kpiSub}>From paid invoices</span>
        </div>
        <div className={styles.kpiCard} data-accent="warn">
          <span className={styles.kpiLabel}>Outstanding</span>
          <span className={`${styles.kpiValue} ${styles.kpiWarn}`}>{inrCompact(metrics.outstandingAmt)}</span>
          <span className={styles.kpiSub}>{metrics.overdue.length} overdue</span>
        </div>
        <div className={styles.kpiCard} data-accent="danger">
          <span className={styles.kpiLabel}>Total Expenses</span>
          <span className={`${styles.kpiValue} ${styles.kpiDanger}`}>{inrCompact(metrics.expenses)}</span>
          <span className={styles.kpiSub}>Office · Marketing · Other</span>
        </div>
        <div className={styles.kpiCard} data-accent={metrics.netCash >= 0 ? "green" : "danger"}>
          <span className={styles.kpiLabel}>Net Cash Position</span>
          <span className={`${styles.kpiValue} ${metrics.netCash >= 0 ? styles.kpiGreen : styles.kpiDanger}`}>
            {inrCompact(metrics.netCash)}
          </span>
          <span className={styles.kpiSub}>Revenue minus expenses</span>
        </div>
      </div>

      {/* Navigation cards */}
      <div className={styles.sectionGrid}>
        {SECTIONS.map((s) => (
          <Link key={s.href} href={s.href} className={styles.sectionCard}>
            <div className={styles.sectionIcon}><s.icon size={18} /></div>
            <div className={styles.sectionInfo}>
              <span className={styles.sectionName}>{s.name}</span>
              <span className={styles.sectionDesc}>{s.desc}</span>
              {metrics.sectStats[s.statKey] && (
                <span className={styles.sectionStat}>{metrics.sectStats[s.statKey]}</span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Lower split */}
      <div className={styles.splitArea}>
        {/* Recent Invoices */}
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <span className={styles.panelTitle}>Recent Invoices</span>
            <Link href="/erp/invoices" className={styles.panelLink}>View all →</Link>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Invoice</th>
                <th className={styles.th}>Client</th>
                <th className={styles.th}>Issued</th>
                <th className={`${styles.th} ${styles.thR}`}>Amount</th>
                <th className={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.length === 0 ? (
                <tr className={styles.emptyRow}><td colSpan={5}>No invoices yet</td></tr>
              ) : recentInvoices.map((inv) => {
                const total = (inv.amount || 0) + (inv.gst || 0);
                const isOver = (inv.status || "").toLowerCase() === "overdue";
                return (
                  <tr key={inv.id} className={styles.tr}>
                    <td className={`${styles.td} ${styles.tdPrimary} ${styles.tdMono}`}>
                      {inv.code || inv.id?.slice(0, 8)}
                    </td>
                    <td className={styles.td}>
                      <span>{inv.client || "—"}</span>
                      {inv.type && <span className={styles.tdSub}>{inv.type}</span>}
                    </td>
                    <td className={`${styles.td} ${styles.tdMono}`}>
                      {dateShort(inv.issued)}
                    </td>
                    <td className={`${styles.td} ${styles.tdMono} ${styles.tdR}`}>{inr(total)}</td>
                    <td className={styles.td}>
                      <Badge>{inv.status || "draft"}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Right column: expense breakdown + cash flow */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Expense breakdown */}
          <div className={styles.panel}>
            <div className={styles.panelHead}>
              <span className={styles.panelTitle}>Expense Breakdown</span>
            </div>
            {expBreakdown.length === 0 ? (
              <div style={{ padding: "1.5rem", textAlign: "center", color: "var(--erp-text-3)", fontSize: "0.82rem" }}>
                No expenses recorded
              </div>
            ) : (
              <>
                <div className={styles.expBarRow}>
                  <div className={styles.expBarTrack}>
                    {expBreakdown.map((e) => (
                      <div
                        key={e.name}
                        className={styles.expBarFill}
                        style={{ width: `${(e.amt / totalExp) * 100}%`, background: e.color }}
                      />
                    ))}
                  </div>
                </div>
                <div className={styles.expBreak}>
                  {expBreakdown.map((e) => (
                    <div key={e.name} className={styles.expBreakItem}>
                      <div className={styles.expBreakLeft}>
                        <div className={styles.expBreakDot} style={{ background: e.color }} />
                        <span className={styles.expBreakName}>{e.name}</span>
                      </div>
                      <div className={styles.expBreakRight}>
                        <span className={styles.expBreakAmt}>{inr(e.amt)}</span>
                        <span className={styles.expBreakPct}>{((e.amt / totalExp) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Cash flow mini chart */}
          <div className={styles.panel}>
            <div className={styles.panelHead}>
              <span className={styles.panelTitle}>Cash Flow (6 mo)</span>
            </div>
            <div className={styles.cfSection}>
              <div className={styles.cfMonths}>
                {cfData.map((bar) => (
                  <div key={bar.label} className={styles.cfBar}>
                    <div className={`${styles.cfBarInner} ${styles.cfBarInInflow}`} style={{ height: bar.inflowH }} />
                    <div className={`${styles.cfBarInner} ${styles.cfBarInExpense}`} style={{ height: bar.expenseH }} />
                    <span className={styles.cfBarLabel}>{bar.label}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.7rem", color: "var(--erp-text-3)" }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--erp-success)", display: "inline-block" }} /> Inflow
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.7rem", color: "var(--erp-text-3)" }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--erp-danger)", display: "inline-block" }} /> Expenses
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
