"use client";

import { useEffect, useMemo, useState } from "react";
import { Sparkles, X } from "lucide-react";
import { PageHeader } from "@/components/erp/ui";
import { inrCompact, pct } from "@/erp/lib/format";
import { useInvoicesStore } from "@/erp/stores/useInvoicesStore";
import { useProjectsStore } from "@/erp/stores/useProjectsStore";
import { useClientsStore } from "@/erp/stores/useClientsStore";
import { useLeadsStore } from "@/erp/stores/useLeadsStore";
import { useExpensesStore } from "@/erp/stores/useExpensesStore";
import styles from "./intelligence.module.css";

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function buildInsights({ projects, clients, invoices, leads, expenses }) {
  const list = [];

  const overdueInv = invoices.filter((i) => (i.status || "").toLowerCase() === "overdue");
  if (overdueInv.length > 0) {
    const amt = overdueInv.reduce((s, i) => s + (i.amount || 0) + (i.gst || 0), 0);
    list.push({ type: "danger", label: "Overdue Risk", text: `${overdueInv.length} invoice${overdueInv.length > 1 ? "s" : ""} totalling ${inrCompact(amt)} are overdue. Immediate follow-up recommended.` });
  }

  const hotLeads = leads.filter((l) => (l.score || 0) >= 80 && !["Won", "Lost"].includes(l.stage));
  if (hotLeads.length > 0) {
    list.push({ type: "opportunity", label: "Hot Leads", text: `${hotLeads.length} lead${hotLeads.length > 1 ? "s" : ""} with score ≥ 80 haven't converted yet — prioritise proposals now.` });
  }

  const stalled = projects.filter((p) => {
    if (p.status !== "In Progress" && p.status !== "active") return false;
    const prog = typeof p.progress === "number" ? p.progress : 0;
    return prog < 20;
  });
  if (stalled.length > 0) {
    list.push({ type: "warning", label: "Stalled Projects", text: `${stalled.length} active project${stalled.length > 1 ? "s have" : " has"} less than 20% progress. Review blockers.` });
  }

  const totalExp = [...expenses.office, ...expenses.marketing, ...expenses.other].reduce((s, e) => s + (e.amount || 0), 0);
  const revenue  = invoices.filter((i) => i.status === "Paid" || i.status === "paid").reduce((s, i) => s + (i.amount || 0) + (i.gst || 0), 0);
  if (totalExp > 0 && revenue > 0) {
    const burnRatio = totalExp / revenue;
    if (burnRatio > 0.6) {
      list.push({ type: "warning", label: "High Burn Rate", text: `Expenses are ${pct(burnRatio * 100, 0)} of collected revenue. Consider deferring non-critical spends.` });
    } else if (burnRatio < 0.35) {
      list.push({ type: "info", label: "Healthy Margin", text: `Burn rate at ${pct(burnRatio * 100, 0)} of revenue — strong operational efficiency. Good time to reinvest in growth.` });
    }
  }

  const wonLeads = leads.filter((l) => l.stage === "Won");
  if (leads.length > 0) {
    const winRate = (wonLeads.length / leads.length) * 100;
    if (winRate > 40) {
      list.push({ type: "opportunity", label: "Strong Win Rate", text: `Pipeline conversion at ${pct(winRate, 0)} — above industry average. Maintain your proposal quality.` });
    }
  }

  if (list.length === 0) {
    list.push({ type: "info", label: "All Clear", text: "No critical signals detected. Add more data across modules to unlock deeper AI insights." });
  }

  return list;
}

export default function IntelligencePage() {
  const invoices   = useInvoicesStore((s) => s.invoices);
  const hydrateInv = useInvoicesStore((s) => s.hydrate);
  const projects   = useProjectsStore((s) => s.projects);
  const hydratePrj = useProjectsStore((s) => s.hydrate);
  const clients    = useClientsStore((s) => s.clients);
  const hydrateCli = useClientsStore((s) => s.hydrate);
  const leads      = useLeadsStore((s) => s.leads);
  const hydrateLd  = useLeadsStore((s) => s.hydrate);
  const office     = useExpensesStore((s) => s.office);
  const marketing  = useExpensesStore((s) => s.marketing);
  const other      = useExpensesStore((s) => s.other);
  const hydrateExp = useExpensesStore((s) => s.hydrate);

  useEffect(() => {
    hydrateInv(); hydratePrj(); hydrateCli(); hydrateLd(); hydrateExp();
  }, [hydrateInv, hydratePrj, hydrateCli, hydrateLd, hydrateExp]);

  const expenses = { office, marketing, other };

  const [dismissed, setDismissed] = useState([]);

  const metrics = useMemo(() => {
    const paid        = invoices.filter((i) => i.status === "Paid" || i.status === "paid");
    const outstanding = invoices.filter((i) => ["sent", "overdue", "partially paid"].includes((i.status || "").toLowerCase()));
    const revenue     = paid.reduce((s, i) => s + (i.amount || 0) + (i.gst || 0), 0);
    const outAmt      = outstanding.reduce((s, i) => s + (i.amount || 0) + (i.gst || 0), 0);
    const totalExp    = [...office, ...marketing, ...other].reduce((s, e) => s + (e.amount || 0), 0);

    const activeProjects  = projects.filter((p) => p.status === "In Progress" || p.status === "active").length;
    const onTrack         = projects.filter((p) => (p.progress || 0) >= 50 && (p.status === "In Progress" || p.status === "active")).length;
    const atRisk          = projects.filter((p) => (p.progress || 0) < 30 && (p.status === "In Progress" || p.status === "active")).length;
    const completed       = projects.filter((p) => p.status === "Completed" || p.status === "completed" || (p.progress || 0) >= 100).length;

    const wonLeads = leads.filter((l) => l.stage === "Won").length;
    const winRate  = leads.length > 0 ? Math.round((wonLeads / leads.length) * 100) : 0;

    // Business health: composite of win rate, project health, revenue vs expenses
    const revScore  = revenue > 0 ? Math.min(100, (revenue / (revenue + outAmt)) * 100) : 50;
    const prjScore  = activeProjects > 0 ? Math.min(100, (onTrack / Math.max(activeProjects, 1)) * 100) : 80;
    const crmScore = winRate;
    const healthScore = Math.round((revScore * 0.4) + (prjScore * 0.35) + (crmScore * 0.25));

    return { revenue, outAmt, totalExp, netCash: revenue - totalExp, activeProjects, onTrack, atRisk, completed, winRate, healthScore };
  }, [invoices, projects, leads, office, marketing, other]);

  const insights = useMemo(
    () => buildInsights({ projects, clients, invoices, leads, expenses }),
    [projects, clients, invoices, leads, expenses]
  );
  const visibleInsights = insights.filter((_, i) => !dismissed.includes(i));

  // Last 6 months revenue vs expenses data
  const monthlyData = useMemo(() => {
    const now = new Date();
    const rows = [];
    for (let i = 5; i >= 0; i--) {
      const d   = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const yr  = d.getFullYear();
      const mo  = d.getMonth();
      const rev = invoices
        .filter((inv) => {
          const d2 = new Date(inv.issued || 0);
          return d2.getFullYear() === yr && d2.getMonth() === mo && (inv.status === "Paid" || inv.status === "paid");
        })
        .reduce((s, inv) => s + (inv.amount || 0) + (inv.gst || 0), 0);
      const exp = metrics.totalExp / 6;
      rows.push({ label: MONTHS_SHORT[mo], rev, exp });
    }
    const maxVal = Math.max(...rows.map((r) => Math.max(r.rev, r.exp)), 1);
    return rows.map((r) => ({ ...r, revPct: (r.rev / maxVal) * 100, expPct: (r.exp / maxVal) * 100 }));
  }, [invoices, metrics.totalExp]);

  // Project health distribution
  const healthDist = useMemo(() => {
    const total = projects.length || 1;
    const onTrackN = projects.filter((p) => (p.progress || 0) >= 60 && p.status !== "Completed").length;
    const watchN   = projects.filter((p) => (p.progress || 0) >= 30 && (p.progress || 0) < 60).length;
    const atRiskN  = projects.filter((p) => (p.progress || 0) < 30 && p.status !== "Completed").length;
    const doneN    = projects.filter((p) => p.status === "Completed" || (p.progress || 0) >= 100).length;
    return [
      { label: "On Track", count: onTrackN, pct: (onTrackN / total) * 100, cls: styles.healthDotGreen, fillColor: "var(--erp-success)" },
      { label: "Watch", count: watchN, pct: (watchN / total) * 100, cls: styles.healthDotAmber, fillColor: "var(--erp-warn)" },
      { label: "At Risk", count: atRiskN, pct: (atRiskN / total) * 100, cls: styles.healthDotRed, fillColor: "var(--erp-danger)" },
      { label: "Completed", count: doneN, pct: (doneN / total) * 100, cls: styles.healthDotBlue, fillColor: "#3b82f6" },
    ];
  }, [projects]);

  // Forecast: next 3 months projected revenue based on outstanding + avg monthly
  const forecast = useMemo(() => {
    const avgMonthly = metrics.revenue / 6 || 0;
    const outstanding = invoices
      .filter((i) => ["sent", "overdue", "partially paid"].includes((i.status || "").toLowerCase()))
      .reduce((s, i) => s + (i.amount || 0) + (i.gst || 0), 0);
    const now = new Date();
    return [1, 2, 3].map((offset) => {
      const d     = new Date(now.getFullYear(), now.getMonth() + offset, 1);
      const label = `${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
      const proj  = avgMonthly * (1 + 0.05 * offset);
      const conf  = Math.max(40, 90 - offset * 15);
      return { label, proj, outstanding: offset === 1 ? outstanding : 0, conf };
    });
  }, [invoices, metrics.revenue]);

  const scoreColor =
    metrics.healthScore >= 80 ? "var(--erp-success)" :
    metrics.healthScore >= 60 ? "var(--erp-gold)" :
    metrics.healthScore >= 40 ? "var(--erp-warn)" :
    "var(--erp-danger)";

  const scoreGradeClass =
    metrics.healthScore >= 80 ? styles.scoreGradeA :
    metrics.healthScore >= 60 ? styles.scoreGradeB :
    metrics.healthScore >= 40 ? styles.scoreGradeC :
    styles.scoreGradeD;

  const scoreGrade =
    metrics.healthScore >= 80 ? "A — Excellent" :
    metrics.healthScore >= 60 ? "B — Good" :
    metrics.healthScore >= 40 ? "C — Fair" :
    "D — Needs Attention";

  const CIRC = 2 * Math.PI * 45;
  const offset = CIRC - (metrics.healthScore / 100) * CIRC;

  const insightDotCls = (type) => ({
    opportunity: styles.insightDotOpp,
    warning: styles.insightDotWarn,
    info: styles.insightDotInfo,
    danger: styles.insightDotDanger,
  }[type] || styles.insightDotInfo);

  const insightTypeCls = (type) => ({
    opportunity: styles.insightTypeOpp,
    warning: styles.insightTypeWarn,
    info: styles.insightTypeInfo,
    danger: styles.insightTypeDanger,
  }[type] || styles.insightTypeInfo);

  return (
    <div className={styles.hub}>
      <PageHeader
        icon={Sparkles}
        title="Intelligence"
        subtitle="AI-powered insights · Revenue analytics · Project health · Forecasting"
      />

      {/* Hero row: health score + KPI strip */}
      <div className={styles.heroRow}>
        <div className={styles.scoreCard}>
          <div className={styles.scoreRing}>
            <svg width="110" height="110" viewBox="0 0 110 110">
              <circle className={styles.scoreRingBg} cx="55" cy="55" r="45" />
              <circle
                className={styles.scoreRingFill}
                cx="55" cy="55" r="45"
                stroke={scoreColor}
                strokeDasharray={CIRC}
                strokeDashoffset={offset}
              />
            </svg>
            <div className={styles.scoreNum}>{metrics.healthScore}</div>
          </div>
          <span className={styles.scoreLabel}>Business Health</span>
          <span className={`${styles.scoreGrade} ${scoreGradeClass}`}>{scoreGrade}</span>
          <span className={styles.scoreDesc}>Composite of CRM conversion, project delivery, and cash health</span>
        </div>

        <div className={styles.heroKpis}>
          <div className={styles.heroKpi}>
            <span className={styles.hkLabel}>Revenue (YTD)</span>
            <span className={`${styles.hkValue} ${styles.hkGold}`}>{inrCompact(metrics.revenue)}</span>
            <span className={styles.hkSub}>Collected invoices</span>
          </div>
          <div className={styles.heroKpi}>
            <span className={styles.hkLabel}>Outstanding</span>
            <span className={`${styles.hkValue} ${styles.hkWarn}`}>{inrCompact(metrics.outAmt)}</span>
            <span className={styles.hkSub}>Pending collections</span>
          </div>
          <div className={styles.heroKpi}>
            <span className={styles.hkLabel}>Win Rate</span>
            <span className={`${styles.hkValue} ${metrics.winRate >= 40 ? styles.hkGreen : styles.hkWarn}`}>{pct(metrics.winRate, 0)}</span>
            <span className={styles.hkSub}>Lead→Client</span>
          </div>
          <div className={styles.heroKpi}>
            <span className={styles.hkLabel}>Net Cash</span>
            <span className={`${styles.hkValue} ${metrics.netCash >= 0 ? styles.hkGreen : styles.hkDanger}`}>{inrCompact(metrics.netCash)}</span>
            <span className={styles.hkSub}>Revenue - Expenses</span>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className={styles.mainGrid}>
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Revenue vs Expenses chart */}
          <div className={styles.panel}>
            <div className={styles.panelHead}>
              <span className={styles.panelTitle}>Revenue vs Expenses — Last 6 Months</span>
            </div>
            <div className={styles.revenueChart}>
              <div className={styles.revLegend}>
                <div className={styles.revLegendItem}>
                  <div className={styles.revDot} style={{ background: "var(--erp-gold)" }} />
                  Revenue
                </div>
                <div className={styles.revLegendItem}>
                  <div className={styles.revDot} style={{ background: "var(--erp-danger)", opacity: 0.6 }} />
                  Expenses
                </div>
              </div>
              {monthlyData.map((row) => (
                <div key={row.label} className={styles.revRow}>
                  <span className={styles.revMonth}>{row.label}</span>
                  <div className={styles.revBarWrap}>
                    <div className={styles.revBarRev} style={{ width: `${row.revPct}%` }} />
                  </div>
                  <div className={styles.revBarWrap}>
                    <div className={styles.revBarExp} style={{ width: `${row.expPct}%` }} />
                  </div>
                  <span className={styles.revAmt}>{inrCompact(row.rev)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Forecast table */}
          <div className={styles.panel}>
            <div className={styles.panelHead}>
              <span className={styles.panelTitle}>Revenue Forecast</span>
              <span className={styles.panelSub}>Based on pipeline + historical avg</span>
            </div>
            <table className={styles.fTable}>
              <thead>
                <tr>
                  <th className={styles.fTh}>Month</th>
                  <th className={`${styles.fTh} ${styles.fThR}`}>Projected</th>
                  <th className={`${styles.fTh} ${styles.fThR}`}>Outstanding</th>
                  <th className={`${styles.fTh} ${styles.fThR}`}>Confidence</th>
                </tr>
              </thead>
              <tbody>
                {forecast.map((row) => (
                  <tr key={row.label} className={styles.fTr}>
                    <td className={styles.fTd}>{row.label}</td>
                    <td className={`${styles.fTd} ${styles.fTdMono} ${styles.fTdR} ${styles.fTdGold}`}>{inrCompact(row.proj)}</td>
                    <td className={`${styles.fTd} ${styles.fTdMono} ${styles.fTdR} ${styles.fTdWarn}`}>
                      {row.outstanding > 0 ? inrCompact(row.outstanding) : "—"}
                    </td>
                    <td className={`${styles.fTd} ${styles.fTdMono} ${styles.fTdR} ${row.conf >= 70 ? styles.fTdGreen : styles.fTdWarn}`}>
                      {pct(row.conf, 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* AI Insights */}
          <div className={styles.panel}>
            <div className={styles.panelHead}>
              <span className={styles.panelTitle}>AI Insights</span>
              <span className={styles.panelSub}>{visibleInsights.length} signals</span>
            </div>
            {visibleInsights.length === 0 ? (
              <div className={styles.emptyInsights}>All insights dismissed. Great work!</div>
            ) : (
              <div className={styles.insightsList}>
                {visibleInsights.map((insight, idx) => (
                  <div key={idx} className={styles.insight}>
                    <div className={`${styles.insightDot} ${insightDotCls(insight.type)}`} />
                    <div className={styles.insightBody}>
                      <div className={`${styles.insightType} ${insightTypeCls(insight.type)}`}>{insight.label}</div>
                      <div className={styles.insightText}>{insight.text}</div>
                    </div>
                    <button
                      type="button"
                      className={styles.insightDismiss}
                      onClick={() => setDismissed((d) => [...d, insights.indexOf(insight)])}
                      title="Dismiss"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Project health distribution */}
          <div className={styles.panel}>
            <div className={styles.panelHead}>
              <span className={styles.panelTitle}>Project Health</span>
              <span className={styles.panelSub}>{projects.length} total</span>
            </div>
            <div className={styles.healthGrid}>
              {healthDist.map((item) => (
                <div key={item.label} className={styles.healthItem}>
                  <div className={`${styles.healthDot} ${item.cls}`} />
                  <span className={styles.healthLabel}>{item.label}</span>
                  <div className={styles.healthBarWrap}>
                    <div className={styles.healthBarTrack}>
                      <div className={styles.healthBarFill} style={{ width: `${item.pct}%`, background: item.fillColor }} />
                    </div>
                  </div>
                  <span className={styles.healthCount}>{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
