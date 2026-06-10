"use client";

import { ShieldCheck, Check, X, Minus, Smartphone, Monitor, KeyRound, Fingerprint } from "lucide-react";
import { PageHeader, KpiCard, Panel, Badge, Avatar } from "@/components/erp/ui";
import { activityLog, getEmployee, getClient } from "@/erp/data";
import grid from "@/components/erp/layout.module.css";
import styles from "./settings.module.css";

const ROLES = ["Owner", "Client"];
const MODULES = ["CRM", "Projects", "BOQ", "Procurement", "Finance", "HR", "Client Portal", "Settings"];
// access: 2 = full, 1 = view, 0 = none
const MATRIX = {
  CRM:            [2, 0],
  Projects:       [2, 0],
  BOQ:            [2, 1],
  Procurement:    [2, 0],
  Finance:        [2, 1],
  HR:             [2, 0],
  "Client Portal":[2, 2],
  Settings:       [2, 0],
};

const SESSIONS = [
  { device: "MacBook Pro · Chrome", loc: "Pune, IN", ip: "49.36.x.x", current: true, icon: Monitor },
  { device: "iPhone 15 · Studio OS App", loc: "Mumbai, IN", ip: "103.21.x.x", current: false, icon: Smartphone },
  { device: "iPad · Site App", loc: "Lonavala, IN", ip: "157.32.x.x", current: false, icon: Smartphone },
];

const actorName = (id) => getEmployee(id)?.name || getClient(id)?.company || (id === "system" ? "Automation" : id);
const actorInitials = (id) => getEmployee(id)?.initials || getClient(id)?.initials || "SY";

function AccessCell({ v }) {
  if (v === 2) return <span className={`${styles.acc} ${styles.full}`}><Check size={13} /></span>;
  if (v === 1) return <span className={`${styles.acc} ${styles.view}`}><Minus size={13} /></span>;
  return <span className={`${styles.acc} ${styles.none}`}><X size={13} /></span>;
}

export default function SettingsPage() {
  return (
    <div className={grid.stack}>
      <PageHeader title="Security & Settings" subtitle="Roles, permissions, audit & access control" icon={ShieldCheck} />

      <div className={grid.kpiGrid}>
        <KpiCard index={0} label="Roles" value={ROLES.length} sub="RBAC enforced" accent="gold" />
        <KpiCard index={1} label="Active Sessions" value={SESSIONS.length} accent="info" />
        <KpiCard index={2} label="MFA Enabled" value="100%" sub="all admins" accent="success" />
        <KpiCard index={3} label="Audit Events" value="2,481" sub="last 30 days" accent="purple" />
      </div>

      <Panel title="Roles & permissions" subtitle="Module access matrix">
        <div className={styles.matrixScroll}>
          <table className={styles.matrix}>
            <thead>
              <tr>
                <th>Module</th>
                {ROLES.map((r) => <th key={r}>{r}</th>)}
              </tr>
            </thead>
            <tbody>
              {MODULES.map((m) => (
                <tr key={m}>
                  <td className={styles.modName}>{m}</td>
                  {MATRIX[m].map((v, i) => <td key={i}><AccessCell v={v} /></td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.legend}>
          <span><span className={`${styles.acc} ${styles.full}`}><Check size={11} /></span> Full</span>
          <span><span className={`${styles.acc} ${styles.view}`}><Minus size={11} /></span> View only</span>
          <span><span className={`${styles.acc} ${styles.none}`}><X size={11} /></span> No access</span>
        </div>
      </Panel>

      <div className={grid.split}>
        <Panel title="Audit log" subtitle="Every action is recorded">
          <div className={styles.audit}>
            {activityLog.map((a) => (
              <div className={styles.auditRow} key={a.id}>
                <Avatar name={actorName(a.actor)} initials={actorInitials(a.actor)} size={28} tone="purple" />
                <div className={styles.auditInfo}>
                  <p><strong>{actorName(a.actor)}</strong> {a.action} <em>{a.target}</em></p>
                  <span>{a.time} · {a.module}</span>
                </div>
                <Badge tone="neutral">{a.type}</Badge>
              </div>
            ))}
          </div>
        </Panel>

        <div className={grid.stack}>
          <Panel title="Active sessions" subtitle="Device & location tracking">
            <div className={styles.sessions}>
              {SESSIONS.map((s, i) => (
                <div className={styles.session} key={i}>
                  <span className={styles.sIcon}><s.icon size={16} /></span>
                  <div className={styles.sInfo}>
                    <strong>{s.device}</strong>
                    <span>{s.loc} · {s.ip}</span>
                  </div>
                  {s.current ? <Badge tone="success" dot>This device</Badge> : <button className={styles.revoke}>Revoke</button>}
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Security">
            <div className={styles.secList}>
              <div className={styles.secRow}><KeyRound size={15} /> <span>Multi-factor auth</span> <Badge tone="success" dot>On</Badge></div>
              <div className={styles.secRow}><Fingerprint size={15} /> <span>Biometric (mobile)</span> <Badge tone="success" dot>On</Badge></div>
              <div className={styles.secRow}><ShieldCheck size={15} /> <span>Encryption at rest</span> <Badge tone="success" dot>AES-256</Badge></div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
