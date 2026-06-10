"use client";

import { HardHat, MapPin, Camera, Mic, Video, CloudRain, Users, AlertTriangle, CheckCircle2, Plus, Wifi } from "lucide-react";
import { PageHeader, KpiCard, Panel, Badge, Btn, Avatar } from "@/components/erp/ui";
import { Meter } from "@/components/erp/Charts";
import { dailyReports, snags, checklistTemplates, projects, employees, projectName, employeeName, getEmployee } from "@/erp/data";
import { dateShort } from "@/erp/lib/format";
import grid from "@/components/erp/layout.module.css";
import styles from "./site.module.css";

const activeSites = projects.filter((p) => !["Handover"].includes(p.stage)).length;
const todayLabour = dailyReports.reduce((s, r) => s + r.labour, 0);
const openSnags = snags.filter((s) => s.status !== "Closed").length;

const siteCrew = employees.filter((e) => e.dept === "Execution");

export default function SitePage() {
  return (
    <div className={grid.stack}>
      <PageHeader title="Site Execution" subtitle="Field operations — works offline, syncs when online" icon={HardHat}>
        <Badge tone="success" dot>Synced</Badge>
        <Btn icon={Plus}>New Report</Btn>
      </PageHeader>

      <div className={grid.kpiGrid}>
        <KpiCard index={0} label="Active Sites" value={activeSites} accent="gold" />
        <KpiCard index={1} label="Labour Today" value={todayLabour} sub="across all sites" accent="info" />
        <KpiCard index={2} label="Open Snags" value={openSnags} accent="danger" />
        <KpiCard index={3} label="Checklists Due" value="3" sub="pending QC" accent="warn" />
      </div>

      <div className={grid.split}>
        <Panel title="Today's site reports" subtitle="Live field updates" action={<Badge tone="info">{dateShort("2026-06-08")}</Badge>}>
          <div className={styles.reportGrid}>
            {dailyReports.map((r) => (
              <div className={styles.report} key={r.id}>
                <div className={styles.rHead}>
                  <div>
                    <strong>{projectName(r.project)}</strong>
                    <span className={styles.rBy}><Avatar name={employeeName(r.by)} initials={getEmployee(r.by)?.initials} size={18} tone="info" /> {employeeName(r.by)}</span>
                  </div>
                  {r.delay ? <Badge tone="danger" dot>Delay</Badge> : <Badge tone="success" dot>On track</Badge>}
                </div>
                <p className={styles.rText}>{r.progress}</p>
                <div className={styles.rStats}>
                  <span><Users size={12} /> {r.labour}</span>
                  <span><CloudRain size={12} /> {r.weather}</span>
                  <span><Camera size={12} /> {r.photos}</span>
                  <span><Video size={12} /> {r.videos}</span>
                  <span><Mic size={12} /> {r.voice}</span>
                  {r.issues > 0 && <span className={styles.issue}><AlertTriangle size={12} /> {r.issues}</span>}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <div className={grid.stack}>
          <Panel title="GPS attendance" subtitle="Crew check-ins">
            <div className={styles.crew}>
              {siteCrew.map((e) => (
                <div className={styles.crewRow} key={e.id}>
                  <Avatar name={e.name} initials={e.initials} size={32} tone="gold" />
                  <div className={styles.crewInfo}>
                    <strong>{e.name}</strong>
                    <span><MapPin size={11} /> {e.location}</span>
                  </div>
                  <span className={styles.checkin}><Wifi size={12} /> In</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <Panel title="QC checklists" subtitle="Stage-wise quality gates">
        <div className={styles.checkGrid}>
          {checklistTemplates.map((c, i) => {
            const done = Math.max(1, c.items.length - (i % 3));
            return (
              <div className={styles.check} key={c.id}>
                <div className={styles.checkHead}>
                  <strong>{c.name}</strong>
                  <Badge tone="neutral">{c.stage}</Badge>
                </div>
                <Meter value={done} max={c.items.length} color={done === c.items.length ? "success" : "warn"} />
                <span className={styles.checkProg}>{done}/{c.items.length} checks passed</span>
                <ul className={styles.checkItems}>
                  {c.items.slice(0, 3).map((it, idx) => (
                    <li key={it} className={idx < done ? styles.itemDone : ""}>
                      <CheckCircle2 size={13} /> {it}
                    </li>
                  ))}
                  {c.items.length > 3 && <li className={styles.more}>+{c.items.length - 3} more</li>}
                </ul>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}
