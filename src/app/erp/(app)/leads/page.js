"use client";

import { useState } from "react";
import { Target, Plus, LayoutGrid, List, Phone, MapPin, Calendar, MessageSquare } from "lucide-react";
import { PageHeader, KpiCard, Panel, Badge, Avatar, Btn, Tag } from "@/components/erp/ui";
import KanbanBoard from "@/components/erp/KanbanBoard";
import DataTable from "@/components/erp/DataTable";
import { Drawer } from "@/components/erp/Modal";
import { leads, leadStages, leadActivity, getEmployee } from "@/erp/data";
import { inrCompact, inr, dateShort } from "@/erp/lib/format";
import grid from "@/components/erp/layout.module.css";
import styles from "./leads.module.css";

const STAGE_META = {
  New: { dot: true, tone: "info" },
  Contacted: { dot: true, tone: "info" },
  "Meeting Scheduled": { dot: true, tone: "purple" },
  "Proposal Sent": { dot: true, tone: "warn" },
  Negotiation: { dot: true, tone: "warn" },
  Won: { dot: true, tone: "success" },
  Lost: { dot: true, tone: "danger" },
  "On Hold": { dot: true, tone: "neutral" },
};

const pipelineValue = leads.filter((l) => !["Won", "Lost"].includes(l.stage)).reduce((s, l) => s + l.value, 0);
const wonCount = leads.filter((l) => l.stage === "Won").length;
const winRate = Math.round((wonCount / leads.filter((l) => ["Won", "Lost"].includes(l.stage)).length) * 100);
const avgDeal = Math.round(leads.reduce((s, l) => s + l.value, 0) / leads.length);

export default function LeadsPage() {
  const [view, setView] = useState("kanban");
  const [selected, setSelected] = useState(null);

  const cols = [
    { key: "name", label: "Lead", render: (r) => <div className={styles.tName}><strong>{r.name}</strong><span>{r.location}</span></div> },
    { key: "requirement", label: "Requirement" },
    { key: "source", label: "Source", render: (r) => <Tag>{r.source}</Tag> },
    { key: "value", label: "Value", align: "right", mono: true, render: (r) => inrCompact(r.value) },
    { key: "score", label: "Score", align: "right", mono: true, render: (r) => <span className={styles.scoreCell} data-hot={r.score >= 80}>{r.score}</span> },
    { key: "stage", label: "Stage", render: (r) => <Badge>{r.stage}</Badge> },
  ];

  return (
    <div className={grid.stack}>
      <PageHeader title="CRM & Leads" subtitle="Capture, qualify and convert every enquiry" icon={Target}>
        <div className={styles.viewToggle}>
          <button className={view === "kanban" ? styles.vActive : ""} onClick={() => setView("kanban")}><LayoutGrid size={16} /></button>
          <button className={view === "table" ? styles.vActive : ""} onClick={() => setView("table")}><List size={16} /></button>
        </div>
        <Btn icon={Plus}>Add Lead</Btn>
      </PageHeader>

      <div className={grid.kpiGrid}>
        <KpiCard index={0} label="Open Pipeline" value={inrCompact(pipelineValue)} sub={`${leads.filter((l) => !["Won", "Lost"].includes(l.stage)).length} active leads`} accent="gold" />
        <KpiCard index={1} label="Win Rate" value={`${winRate}%`} delta="+6%" deltaUp sub="last 90 days" accent="success" />
        <KpiCard index={2} label="Avg Deal Size" value={inrCompact(avgDeal)} accent="info" />
        <KpiCard index={3} label="Won (QTD)" value={wonCount} sub={inrCompact(leads.filter((l) => l.stage === "Won").reduce((s, l) => s + l.value, 0))} accent="purple" />
      </div>

      {view === "kanban" ? (
        <KanbanBoard
          columns={leadStages}
          items={leads}
          groupKey="stage"
          columnMeta={STAGE_META}
          renderCard={(l) => (
            <div onClick={() => setSelected(l)} className={styles.card}>
              <div className={styles.cardTop}>
                <strong>{l.name}</strong>
                <span className={styles.score} data-hot={l.score >= 80}>{l.score}</span>
              </div>
              <p className={styles.req}>{l.requirement}</p>
              <div className={styles.cardMeta}>
                <Tag>{l.source}</Tag>
                <span className={styles.val}>{inrCompact(l.value)}</span>
              </div>
              <div className={styles.cardFoot}>
                <span className={styles.loc}><MapPin size={11} /> {l.location.split(",")[0]}</span>
                <Avatar name={getEmployee(l.owner)?.name} size={22} tone="gold" />
              </div>
            </div>
          )}
        />
      ) : (
        <Panel padded={false}>
          <div style={{ padding: "1rem" }}>
            <DataTable columns={cols} rows={leads} onRowClick={setSelected} searchKeys={["name", "location", "requirement", "source"]} />
          </div>
        </Panel>
      )}

      <Drawer open={!!selected} onClose={() => setSelected(null)} title="Lead details" width={440}>
        {selected && (
          <div className={styles.detail}>
            <div className={styles.detailHead}>
              <Avatar name={selected.name} size={52} tone="gold" />
              <div>
                <h3>{selected.name}</h3>
                <Badge>{selected.stage}</Badge>
              </div>
            </div>
            <div className={styles.detailGrid}>
              <div><span>Value</span><strong>{inr(selected.value)}</strong></div>
              <div><span>Score</span><strong>{selected.score}/100</strong></div>
              <div><span>Source</span><strong>{selected.source}</strong></div>
              <div><span>Timeline</span><strong>{selected.timeline}</strong></div>
              <div><span>Property</span><strong>{selected.propertyType}</strong></div>
              <div><span>Style</span><strong>{selected.style}</strong></div>
            </div>
            <div className={styles.contactRow}>
              <a href={`tel:${selected.phone}`}><Phone size={14} /> {selected.phone}</a>
              <span><MapPin size={14} /> {selected.location}</span>
              <span><Calendar size={14} /> Last touch {dateShort(selected.lastTouch)}</span>
            </div>
            <div className={styles.actions}>
              <Btn variant="primary" icon={MessageSquare}>WhatsApp</Btn>
              <Btn variant="ghost" icon={Calendar}>Schedule</Btn>
              <Btn variant="outline">Convert</Btn>
            </div>
            <h4 className={styles.timelineTitle}>Activity</h4>
            <div className={styles.timeline}>
              {leadActivity.filter((a) => a.lead === selected.id).length === 0 && (
                <p className={styles.noAct}>No logged activity yet.</p>
              )}
              {leadActivity.filter((a) => a.lead === selected.id).map((a) => (
                <div key={a.id} className={styles.titem}>
                  <span className={styles.tDot} />
                  <div>
                    <p>{a.note}</p>
                    <span>{a.type} · {a.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
