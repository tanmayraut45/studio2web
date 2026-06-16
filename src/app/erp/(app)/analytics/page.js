"use client";

import { BarChart3, TrendingUp, Percent, Clock, Recycle } from "lucide-react";
import { PageHeader, KpiCard, Panel } from "@/components/erp/ui";
import { AreaChart, DualBars, Meter } from "@/components/erp/Charts";
import { cashFlow, projectProfitability, kpis } from "@/erp/data";
import { pct } from "@/erp/lib/format";
import grid from "@/components/erp/layout.module.css";
import styles from "./analytics.module.css";

const revenueTrend = [86, 102, 78, 118, 142, 96, 134, 108];

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
          {cashFlow.length > 0
            ? <DualBars data={cashFlow} height={200} />
            : <p className={styles.emptyHint}>No cashflow data yet.</p>}
        </Panel>
      </div>

      <Panel title="Project profitability" subtitle="Margin by project">
        {projectProfitability.length > 0 ? (
          <div className={styles.barList}>
            {projectProfitability.map((p) => (
              <div className={styles.barRow} key={p.id}>
                <span className={styles.barLabel}>{p.name}</span>
                <div className={styles.barTrack}><Meter value={p.margin} max={32} color={p.margin >= 22 ? "success" : p.margin >= 16 ? "warn" : "danger"} /></div>
                <span className={styles.barVal}>{pct(p.margin)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.emptyHint}>No projects yet.</p>
        )}
      </Panel>
    </div>
  );
}
