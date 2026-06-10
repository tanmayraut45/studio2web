"use client";

import { useState } from "react";
import { Workflow, Plus, Zap, MessageCircle, Mail, Bell, Smartphone } from "lucide-react";
import { PageHeader, KpiCard, Panel, Badge, Btn } from "@/components/erp/ui";
import { automations } from "@/erp/data";
import { num } from "@/erp/lib/format";
import grid from "@/components/erp/layout.module.css";
import styles from "./automation.module.css";

const CHANNELS = [
  { name: "WhatsApp", icon: MessageCircle, count: 231, color: "success" },
  { name: "Email", icon: Mail, count: 347, color: "info" },
  { name: "Push", icon: Smartphone, count: 124, color: "purple" },
  { name: "In-app", icon: Bell, count: 489, color: "gold" },
];

export default function AutomationPage() {
  const [rules, setRules] = useState(automations);
  const toggle = (id) => setRules((r) => r.map((x) => x.id === id ? { ...x, status: x.status === "Active" ? "Paused" : "Active" } : x));
  const totalRuns = automations.reduce((s, a) => s + a.runs, 0);

  return (
    <div className={grid.stack}>
      <PageHeader title="Automation Engine" subtitle="System-wide triggers, reminders & notifications" icon={Workflow}>
        <Btn icon={Plus}>New Automation</Btn>
      </PageHeader>

      <div className={grid.kpiGrid}>
        <KpiCard index={0} label="Active Rules" value={rules.filter((r) => r.status === "Active").length} sub={`${automations.length} total`} accent="gold" />
        <KpiCard index={1} label="Total Runs" value={num(totalRuns)} sub="lifetime" accent="success" />
        <KpiCard index={2} label="Channels" value={CHANNELS.length} accent="info" />
        <KpiCard index={3} label="Fired Today" value="47" delta="+12" deltaUp accent="purple" />
      </div>

      <div className={grid.cols4}>
        {CHANNELS.map((c) => (
          <Panel key={c.name} padded>
            <div className={styles.channel}>
              <span className={styles.chIcon} data-c={c.color}><c.icon size={18} /></span>
              <div>
                <strong>{num(c.count)}</strong>
                <span>{c.name} sent</span>
              </div>
            </div>
          </Panel>
        ))}
      </div>

      <Panel title="Automation rules" subtitle="Triggers and their delivery channels">
        <div className={styles.rules}>
          {rules.map((a) => (
            <div className={styles.rule} key={a.id}>
              <span className={styles.ruleIcon}><Zap size={16} /></span>
              <div className={styles.ruleInfo}>
                <strong>{a.name}</strong>
                <span>When: {a.trigger}</span>
              </div>
              <div className={styles.ruleMeta}>
                <Badge tone="neutral">{a.channel}</Badge>
                <span className={styles.runs}>{num(a.runs)} runs</span>
              </div>
              <button
                className={`${styles.switch} ${a.status === "Active" ? styles.on : ""}`}
                onClick={() => toggle(a.id)}
                aria-label={`Toggle ${a.name}`}
              >
                <span className={styles.knob} />
              </button>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
