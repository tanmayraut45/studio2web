"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Wallet, TrendingUp, Receipt, Banknote, FolderKanban,
  ArrowUpRight, AlertTriangle, Sparkles, Activity, Clock,
  UserPlus, Building2, FolderPlus, FileText,
} from "lucide-react";
import { KpiCard, Panel, Badge, Avatar, Btn } from "@/components/erp/ui";
import { DualBars, Meter } from "@/components/erp/Charts";
import { useSession } from "@/erp/stores/useSession";
import { useAiInsightsStore } from "@/erp/stores/useAiInsightsStore";
import { useLeadsStore } from "@/erp/stores/useLeadsStore";
import { useClientsStore } from "@/erp/stores/useClientsStore";
import { useProjectsStore } from "@/erp/stores/useProjectsStore";
import { useInvoicesStore } from "@/erp/stores/useInvoicesStore";
import {
  cashFlow, activityLog,
  getEmployee, getClient,
} from "@/erp/data";
import { inrCompact, inr, pct } from "@/erp/lib/format";
import grid from "@/components/erp/layout.module.css";
import styles from "./dashboard.module.css";

const actorName = (id) =>
  getEmployee(id)?.name || getClient(id)?.company || (id === "system" ? "Automation" : id);
const actorInitials = (id) =>
  getEmployee(id)?.initials || getClient(id)?.initials || "SY";

export default function Dashboard() {
  const router = useRouter();
  const user = useSession((s) => s.user);
  const aiInsightsLive = useAiInsightsStore((s) => s.insights);
  const hydrateAi = useAiInsightsStore((s) => s.hydrate);

  const leads = useLeadsStore((s) => s.leads);
  const clients = useClientsStore((s) => s.clients);
  const projects = useProjectsStore((s) => s.projects);
  const invoices = useInvoicesStore((s) => s.invoices);

  const hydrateLeads = useLeadsStore((s) => s.hydrate);
  const hydrateClients = useClientsStore((s) => s.hydrate);
  const hydrateProjects = useProjectsStore((s) => s.hydrate);
  const hydrateInvoices = useInvoicesStore((s) => s.hydrate);

  useEffect(() => {
    hydrateAi();
    hydrateLeads();
    hydrateClients();
    hydrateProjects();
    hydrateInvoices();
  }, [hydrateAi, hydrateLeads, hydrateClients, hydrateProjects, hydrateInvoices]);

  const live = useMemo(() => {
    const totalContractValue = projects.reduce((s, p) => s + (Number(p.budget) || 0), 0);
    const portfolioMargin = totalContractValue
      ? Math.round((projects.reduce((s, p) => s + (Number(p.margin) || 0) * (Number(p.budget) || 0), 0) / totalContractValue) * 10) / 10
      : 0;
    const outstanding = invoices
      .filter((i) => {
        const st = String(i.status || "").toLowerCase();
        return st !== "paid" && st !== "cancelled";
      })
      .reduce((s, i) => s + (Number(i.amount) || 0) + (Number(i.gst) || 0), 0);
    const overdue = invoices
      .filter((i) => String(i.status || "").toLowerCase() === "overdue")
      .reduce((s, i) => s + (Number(i.amount) || 0) + (Number(i.gst) || 0), 0);
    const collected = invoices
      .filter((i) => String(i.status || "").toLowerCase() === "paid")
      .reduce((s, i) => s + (Number(i.amount) || 0) + (Number(i.gst) || 0), 0);
    // Simple next-month forecast: avg of last-3-months collected invoices
    const now = new Date();
    const recentCollected = invoices.filter((i) => {
      const d = new Date(i.issued || 0);
      return String(i.status || "").toLowerCase() === "paid" &&
        (now - d) / (1000 * 60 * 60 * 24 * 30) <= 3;
    }).reduce((s, i) => s + (Number(i.amount) || 0) + (Number(i.gst) || 0), 0);
    const cashForecast = Math.round(recentCollected / 3);
    const activeProjects = projects.length;
    const onTrack = projects.filter((p) => p.health === "on-track").length;
    const delayedCount = projects.filter((p) => p.health === "delayed" || p.health === "at-risk").length;
    const overrunProjects = projects.filter((p) => (p.actual || 0) / Math.max(1, p.budget || 1) > ((p.progress || 0) / 100) + 0.1);
    return { totalContractValue, portfolioMargin, outstanding, overdue, collected, cashForecast, activeProjects, onTrack, delayedCount, overrunProjects };
  }, [projects, invoices]);

  const liveFunnel = useMemo(() => {
    const stages = ["New", "Contacted", "Meeting Scheduled", "Proposal Sent", "Negotiation", "Won"];
    return stages.map((stage) => {
      const stageLeads = leads.filter((l) => l.stage === stage);
      return {
        stage: stage === "Meeting Scheduled" ? "Meeting" : stage === "Proposal Sent" ? "Proposal" : stage,
        count: stageLeads.length,
        value: stageLeads.reduce((s, l) => s + (Number(l.value) || 0), 0),
      };
    });
  }, [leads]);
  const maxFunnel = Math.max(1, ...liveFunnel.map((f) => f.value));

  const profitability = useMemo(
    () =>
      [...projects]
        .map((p) => ({
          ...p,
          profit: Math.round((Number(p.budget) || 0) * ((Number(p.margin) || 0) / 100)),
        }))
        .sort((a, b) => (b.margin || 0) - (a.margin || 0))
        .slice(0, 5),
    [projects]
  );

  const delayed = useMemo(
    () => projects.filter((p) => p.health === "delayed" || p.health === "at-risk").slice(0, 5),
    [projects]
  );

  const liveAi = aiInsightsLive.filter((i) => !i.dismissed).slice(0, 3);

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

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <button className={styles.qa} onClick={() => router.push("/erp/leads")}>
          <UserPlus size={16} />
          <span>Add Lead</span>
        </button>
        <button className={styles.qa} onClick={() => router.push("/erp/clients")}>
          <Building2 size={16} />
          <span>Add Client</span>
        </button>
        <button className={styles.qa} onClick={() => router.push("/erp/projects")}>
          <FolderPlus size={16} />
          <span>New Project</span>
        </button>
        <button className={styles.qa} onClick={() => router.push("/erp/invoices")}>
          <FileText size={16} />
          <span>New Invoice</span>
        </button>
      </div>

      {/* KPI row */}
      <div className={grid.kpiGrid}>
        <KpiCard index={0} label="Portfolio Value" value={inrCompact(live.totalContractValue)} delta="+12.4%" deltaUp sub={`${live.activeProjects} active projects`} icon={Wallet} accent="gold" spark={[40, 44, 42, 50, 55, 58, 62, 68]} />
        <KpiCard index={1} label="Profit Margin" value={pct(live.portfolioMargin)} delta="+1.8pts" deltaUp sub="target 20%" icon={TrendingUp} accent="success" spark={[18, 19, 20, 19, 21, 22, 22, 23]} />
        <KpiCard index={2} label="Receivables" value={inrCompact(live.outstanding)} delta={live.overdue > 0 ? `-${inrCompact(live.overdue)} overdue` : "All current"} deltaUp={live.overdue === 0} sub={live.overdue > 0 ? `${inrCompact(live.overdue)} overdue` : "No overdue invoices"} icon={Receipt} accent="warn" spark={[80, 72, 75, 68, 70, 64, 66, 60]} />
        <KpiCard index={3} label="Cash Forecast" value={inrCompact(live.cashForecast)} delta={live.cashForecast > 0 ? "3-mo avg" : "No data yet"} deltaUp={live.cashForecast > 0} sub="Based on recent collections" icon={Banknote} accent={live.cashForecast > 0 ? "info" : "danger"} spark={[28, 50, 5, 41, 62, 9, 41, 6]} />
        <KpiCard index={4} label="Active Projects" value={live.activeProjects} delta={`${live.onTrack} on track`} deltaUp sub={`${live.delayedCount} need attention`} icon={FolderKanban} accent="info" spark={[3, 4, 4, 5, 5, 6, 6, 6]} />
      </div>

      {/* Cash flow + profitability / side answers */}
      <div className={grid.split}>
        <div className={grid.stack}>
          <Panel title="Cash Flow & Liquidity" subtitle="Inflow vs outflow (Rs lakhs) — June projected">
            {cashFlow.length > 0 ? (
              <>
                <DualBars data={cashFlow} height={210} />
                <div className={styles.legend}>
                  <span><i className={styles.dotIn} /> Inflow</span>
                  <span><i className={styles.dotOut} /> Outflow</span>
                  <span className={styles.legendMute}>Faded = projected</span>
                </div>
              </>
            ) : (
              <p className={styles.emptyHint}>No cashflow data yet — add invoices and payments to see this chart.</p>
            )}
          </Panel>

          <Panel
            title="Which projects are profitable?"
            subtitle="Margin ranking across the active portfolio"
            action={<Link href="/erp/projects" className={styles.link}>All projects →</Link>}
          >
            {profitability.length > 0 ? (
              <div className={styles.profList}>
                {profitability.map((p) => (
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
            ) : (
              <p className={styles.emptyHint}>No projects yet.</p>
            )}
          </Panel>
        </div>

        {/* Side answers */}
        <div className={grid.stack}>
          <Panel title="Where money leaks">
            <div className={styles.leak}>
              <AlertTriangle size={16} className={styles.leakIcon} />
              <div>
                <strong>{live.overrunProjects.length} project{live.overrunProjects.length !== 1 ? "s" : ""}</strong> over expected burn
              </div>
            </div>
            <div className={styles.leakStat}>
              <span>Outstanding receivables</span>
              <strong>{live.outstanding > 0 ? inrCompact(live.outstanding) : "—"}</strong>
            </div>
            <div className={styles.leakStat}>
              <span>Revenue collected</span>
              <strong className={styles.success}>{live.collected > 0 ? inrCompact(live.collected) : "—"}</strong>
            </div>
          </Panel>
        </div>
      </div>

      {/* Pipeline + delayed */}
      <div className={grid.splitEven}>
        <Panel title="Sales pipeline" subtitle="Value by stage" action={<Link href="/erp/leads" className={styles.link}>CRM →</Link>}>
          <div className={styles.funnel}>
            {liveFunnel.map((f, i) => (
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
          {delayed.length > 0 ? (
            <div className={grid.stackSm}>
              {delayed.map((p) => (
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
          ) : (
            <p className={styles.emptyHint}>All projects on track.</p>
          )}
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
            {liveAi.length > 0 ? (
              liveAi.map((ai) => (
                <div className={styles.insight} key={ai.id}>
                  <div className={styles.insightHead}>
                    <strong>{ai.title}</strong>
                    <span className={styles.confidence}>{ai.confidence}%</span>
                  </div>
                  <p>{ai.body}</p>
                  <span className={styles.insightMod}>{ai.module}</span>
                </div>
              ))
            ) : (
              <p className={styles.emptyHint}>No insights yet — generate one from /erp/ai.</p>
            )}
          </div>
        </Panel>

        <Panel title="Recent activity" subtitle="Across all modules" action={<Activity size={15} />}>
          <div className={styles.feed}>
            {activityLog.length > 0 ? (
              activityLog.map((a) => (
                <div className={styles.feedItem} key={a.id}>
                  <Avatar name={actorName(a.actor)} initials={actorInitials(a.actor)} size={30} tone="purple" />
                  <div className={styles.feedBody}>
                    <p><strong>{actorName(a.actor)}</strong> {a.action} <em>{a.target}</em></p>
                    <span className={styles.feedMeta}><Clock size={11} /> {a.time} · {a.module}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.emptyHint}>No activity yet.</p>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}
