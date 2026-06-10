"use client";

import { BarChart3, Download, TrendingUp, Percent, Clock, Recycle } from "lucide-react";
import { PageHeader, KpiCard, Panel, Badge } from "@/components/erp/ui";
import { AreaChart, DualBars, Donut, Meter } from "@/components/erp/Charts";
import {
  cashFlow, projectProfitability, vendors, employees, leads, kpis,
} from "@/erp/data";
import { inrCompact, pct } from "@/erp/lib/format";
import grid from "@/components/erp/layout.module.css";
import styles from "./analytics.module.css";

const SRC_COLORS = ["gold", "info", "purple", "success", "warn", "danger"];
const sources = [...new Set(leads.map((l) => l.source))].map((s, i) => ({
  label: s,
  value: leads.filter((l) => l.source === s).length,
  color: SRC_COLORS[i % SRC_COLORS.length],
}));

const revenueTrend = [86, 102, 78, 118, 142, 96, 134, 108];
const topVendors = [...vendors].sort((a, b) => b.rating - a.rating).slice(0, 5);
const topEmployees = [...employees].sort((a, b) => b.productivity - a.productivity).slice(0, 5);

export default function AnalyticsPage() {
  return (
    <div className={grid.stack}>
      <PageHeader title="Analytics & BI" subtitle="Operational intelligence & drill-down dashboards" icon={BarChart3} />

      <div className={grid.kpiGrid}>
        <KpiCard index={0} label="Gross Margin" value={pct(kpis.portfolioMargin)} delta="+1.8pts" deltaUp icon={Percent} accent="gold" />
        <KpiCard index={1} label="Net Margin" value="16.2%" delta="+0.9pts" deltaUp icon={TrendingUp} accent="success" />
        <KpiCard index={2} label="Material Wastage" value="5.1%" delta="-0.6pts" deltaUp icon={Recycle} accent="warn" />
        <KpiCard index={3} label="Avg Delay" value="6.4 days" delta="+1.2d" deltaUp={false} icon={Clock} accent="danger" />
      </div>

      <div className={grid.splitEven}>
        <Panel title="Revenue trend" subtitle="Monthly revenue (Rs lakhs)">
          <AreaChart data={revenueTrend} labels={cashFlow.map((c) => c.month)} color="gold" height={200} />
        </Panel>
        <Panel title="Cash flow" subtitle="Inflow vs outflow">
          <DualBars data={cashFlow} height={200} />
        </Panel>
      </div>

      <div className={grid.splitEven}>
        <Panel title="Project profitability" subtitle="Margin by project">
          <div className={styles.barList}>
            {projectProfitability.map((p) => (
              <div className={styles.barRow} key={p.id}>
                <span className={styles.barLabel}>{p.name}</span>
                <div className={styles.barTrack}><Meter value={p.margin} max={32} color={p.margin >= 22 ? "success" : p.margin >= 16 ? "warn" : "danger"} /></div>
                <span className={styles.barVal}>{pct(p.margin)}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Lead sources" subtitle="Where enquiries come from">
          <div className={styles.donutRow}>
            <Donut segments={sources} size={150} label={leads.length} sub="leads" />
            <div className={styles.legend}>
              {sources.map((s) => (
                <div key={s.label} className={styles.lRow}>
                  <span className={styles.lDot} data-c={s.color} />
                  <span className={styles.lName}>{s.label}</span>
                  <span className={styles.lVal}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      <div className={grid.splitEven}>
        <Panel title="Vendor performance" subtitle="Top-rated suppliers">
          <div className={styles.rankList}>
            {topVendors.map((v, i) => (
              <div className={styles.rank} key={v.id}>
                <span className={styles.rankNo}>{i + 1}</span>
                <div className={styles.rankInfo}><strong>{v.name}</strong><span>{v.category}</span></div>
                <div className={styles.rankMeter}><Meter value={v.onTime} color="info" height={6} /></div>
                <span className={styles.rankScore}>{v.rating}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Employee productivity" subtitle="Top performers">
          <div className={styles.rankList}>
            {topEmployees.map((e, i) => (
              <div className={styles.rank} key={e.id}>
                <span className={styles.rankNo}>{i + 1}</span>
                <div className={styles.rankInfo}><strong>{e.name}</strong><span>{e.role}</span></div>
                <div className={styles.rankMeter}><Meter value={e.productivity} color="success" height={6} /></div>
                <span className={styles.rankScore}>{e.productivity}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
