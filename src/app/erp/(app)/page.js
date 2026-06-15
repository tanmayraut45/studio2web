"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Wallet, TrendingUp, Receipt, Banknote, FolderKanban,
  ArrowUpRight, AlertTriangle, Sparkles, Activity, Clock,
} from "lucide-react";
import { KpiCard, Panel, Badge, Avatar, Btn } from "@/components/erp/ui";
import { DualBars, Meter } from "@/components/erp/Charts";
import { useSession } from "@/erp/stores/useSession";
import {
  kpis, projectProfitability, cashFlow, leadFunnel, activityLog, aiInsights,
  getEmployee, getClient, projectName,
} from "@/erp/data";
import { inrCompact, inr, pct } from "@/erp/lib/format";
import grid from "@/components/erp/layout.module.css";
import styles from "./dashboard.module.css";

const actorName = (id) =>
  getEmployee(id)?.name || getClient(id)?.company || (id === "system" ? "Automation" : id);
const actorInitials = (id) =>
  getEmployee(id)?.initials || getClient(id)?.initials || "SY";

export default function Dashboard() {
  const user = useSession((s) => s.user);
  const maxFunnel = Math.max(...leadFunnel.map((f) => f.value));

  return (
    <div className={grid.stack}>
      {/* Greeting */}
      <div className={styles.greeting}>
        <div>
          <span className={styles.kicker}>Command Centre</span>
          <h1 className={styles.hello}>
            Good to see you, {user?.name?.split(" ")[0] || "there"}.
          </h1>
          <p className={styles.helloSub}>
            Here is the real-time pulse of Studio II — profitability, cash, vendors, people.
          </p>
        </div>
        <Btn variant="ghost" icon={ArrowUpRight}>Export snapshot</Btn>
      </div>

      {/* KPI row */}
      <div className={grid.kpiGrid}>
        <KpiCard index={0} label="Portfolio Value" value={inrCompact(kpis.totalContractValue)} delta="+12.4%" deltaUp sub="6 active projects" icon={Wallet} accent="gold" spark={[40, 44, 42, 50, 55, 58, 62, 68]} />
        <KpiCard index={1} label="Profit Margin" value={pct(kpis.portfolioMargin)} delta="+1.8pts" deltaUp sub="target 20%" icon={TrendingUp} accent="success" spark={[18, 19, 20, 19, 21, 22, 22, 23]} />
        <KpiCard index={2} label="Receivables" value={inrCompact(kpis.outstanding)} delta="-3.1%" deltaUp={false} sub="Rs 67.3L overdue" icon={Receipt} accent="warn" spark={[80, 72, 75, 68, 70, 64, 66, 60]} />
        <KpiCard index={3} label="June Cash Forecast" value={inrCompact(kpis.netForecast * 100000)} delta="tight" deltaUp={false} sub="lowest in 8 mo" icon={Banknote} accent="danger" spark={[28, 50, 5, 41, 62, 9, 41, 6]} />
        <KpiCard index={4} label="Active Projects" value={kpis.activeProjects} delta={`${kpis.onTrack} on track`} deltaUp sub={`${kpis.delayedCount} need attention`} icon={FolderKanban} accent="info" spark={[3, 4, 4, 5, 5, 6, 6, 6]} />
      </div>

      {/* Cash flow + profitability / side answers */}
      <div className={grid.split}>
        <div className={grid.stack}>
          <Panel title="Cash Flow & Liquidity" subtitle="Inflow vs outflow (Rs lakhs) — June projected">
            <DualBars data={cashFlow} height={210} />
            <div className={styles.legend}>
              <span><i className={styles.dotIn} /> Inflow</span>
              <span><i className={styles.dotOut} /> Outflow</span>
              <span className={styles.legendMute}>Faded = projected</span>
            </div>
          </Panel>

          <Panel
            title="Which projects are profitable?"
            subtitle="Margin ranking across the active portfolio"
            action={<Link href="/erp/projects" className={styles.link}>All projects →</Link>}
          >
            <div className={styles.profList}>
              {projectProfitability.slice(0, 5).map((p) => (
                <div className={styles.profRow} key={p.id}>
                  <div className={styles.profName}>
                    <strong>{p.name}</strong>
                    <span>{p.location}</span>
                  </div>
                  <div className={styles.profMeter}>
                    <Meter value={p.margin} max={32} color={p.margin >= 22 ? "success" : p.margin >= 16 ? "warn" : "danger"} />
                  </div>
                  <span className={styles.profPct}>{pct(p.margin)}</span>
                  <span className={styles.profVal}>{inrCompact(p.profit)}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Side answers */}
        <div className={grid.stack}>
          <Panel title="Where money leaks">
            <div className={styles.leak}>
              <AlertTriangle size={16} className={styles.leakIcon} />
              <div>
                <strong>{kpis.overrunProjects.length} projects</strong> over expected burn
              </div>
            </div>
            <div className={styles.leakStat}>
              <span>Damaged stock value</span>
              <strong>{inr(kpis.damagedValue)}</strong>
            </div>
            <div className={styles.leakStat}>
              <span>Vertex civil variance</span>
              <strong className={styles.danger}>+8.2%</strong>
            </div>
          </Panel>
        </div>
      </div>

      {/* Pipeline + delayed */}
      <div className={grid.splitEven}>
        <Panel title="Sales pipeline" subtitle="Value by stage" action={<Link href="/erp/leads" className={styles.link}>CRM →</Link>}>
          <div className={styles.funnel}>
            {leadFunnel.map((f, i) => (
              <div className={styles.funnelRow} key={f.stage}>
                <span className={styles.funnelStage}>{f.stage}</span>
                <div className={styles.funnelBar}>
                  <motion.div
                    className={styles.funnelFill}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(f.value / maxFunnel) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
                <span className={styles.funnelVal}>{inrCompact(f.value)}</span>
                <span className={styles.funnelCount}>{f.count}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Needs attention" subtitle="Delayed & at-risk projects">
          <div className={grid.stackSm}>
            {kpis.delayedProjects.map((p) => (
              <Link href="/erp/projects" key={p.id} className={styles.alertRow}>
                <span className={styles.alertBar} data-health={p.health} />
                <div className={styles.alertInfo}>
                  <strong>{p.name}</strong>
                  <span>{p.location} · {p.stage}</span>
                </div>
                <Badge>{p.health === "delayed" ? "Delayed" : "At-risk"}</Badge>
                <span className={styles.alertPct}>{p.progress}%</span>
              </Link>
            ))}
          </div>
        </Panel>
      </div>

      {/* AI + activity */}
      <div className={grid.split}>
        <Panel
          title={<span className={styles.aiTitle}><Sparkles size={16} /> AI insights</span>}
          subtitle="Generated from live operational data"
          action={<Link href="/erp/ai" className={styles.link}>AI engine →</Link>}
        >
          <div className={grid.stackSm}>
            {aiInsights.slice(0, 3).map((ai) => (
              <div className={styles.insight} key={ai.id}>
                <div className={styles.insightHead}>
                  <strong>{ai.title}</strong>
                  <span className={styles.confidence}>{ai.confidence}%</span>
                </div>
                <p>{ai.body}</p>
                <span className={styles.insightMod}>{ai.module}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Recent activity" subtitle="Across all modules" action={<Activity size={15} />}>
          <div className={styles.feed}>
            {activityLog.map((a) => (
              <div className={styles.feedItem} key={a.id}>
                <Avatar name={actorName(a.actor)} initials={actorInitials(a.actor)} size={30} tone="purple" />
                <div className={styles.feedBody}>
                  <p><strong>{actorName(a.actor)}</strong> {a.action} <em>{a.target}</em></p>
                  <span className={styles.feedMeta}><Clock size={11} /> {a.time} · {a.module}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
