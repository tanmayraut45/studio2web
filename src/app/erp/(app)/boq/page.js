"use client";

import { useState } from "react";
import { Calculator, Plus, Lock, FileSpreadsheet, GitBranch, Sparkles } from "lucide-react";
import { PageHeader, KpiCard, Panel, Badge, Btn } from "@/components/erp/ui";
import { Donut } from "@/components/erp/Charts";
import DataTable from "@/components/erp/DataTable";
import { boqDocs, boqLines, boqTemplates, getMaterial, projectName } from "@/erp/data";
import { inr, inrCompact, pct, dateShort } from "@/erp/lib/format";
import grid from "@/components/erp/layout.module.css";
import styles from "./boq.module.css";

const AREA_COLORS = ["gold", "info", "purple", "success", "warn", "danger"];
const totalValue = boqDocs.reduce((s, b) => s + b.total, 0);
const approvedValue = boqDocs.filter((b) => b.status === "Approved").reduce((s, b) => s + b.total, 0);

export default function BoqPage() {
  const [selected, setSelected] = useState(boqDocs[1]); // Vertex (has line items)

  const lines = boqLines.filter((l) => l.boq === selected.id);
  const areas = [...new Set(lines.map((l) => l.area))].map((a, i) => ({
    label: a,
    value: lines.filter((l) => l.area === a).reduce((s, l) => s + l.qty * l.rate, 0),
    color: AREA_COLORS[i % AREA_COLORS.length],
  }));
  const linesTotal = lines.reduce((s, l) => s + l.qty * l.rate, 0);

  const cols = [
    { key: "area", label: "Area", render: (r) => <Badge tone="neutral">{r.area}</Badge> },
    { key: "item", label: "Item" },
    { key: "qty", label: "Qty", align: "right", mono: true, render: (r) => `${r.qty} ${r.unit}` },
    { key: "rate", label: "Rate", align: "right", mono: true, render: (r) => inr(r.rate) },
    { key: "amount", label: "Amount", align: "right", mono: true, render: (r) => inr(r.qty * r.rate) },
  ];

  return (
    <div className={grid.stack}>
      <PageHeader title="BOQ & Estimation" subtitle="Dynamic, versioned, area-wise costing engine" icon={Calculator}>
        <Btn variant="ghost" icon={Sparkles}>AI Generate</Btn>
        <Btn icon={Plus}>New BOQ</Btn>
      </PageHeader>

      <div className={grid.kpiGrid}>
        <KpiCard index={0} label="Total BOQ Value" value={inrCompact(totalValue)} sub={`${boqDocs.length} documents`} accent="gold" />
        <KpiCard index={1} label="Approved & Locked" value={inrCompact(approvedValue)} sub={`${boqDocs.filter((b) => b.locked).length} locked`} accent="success" />
        <KpiCard index={2} label="Avg Margin" value={pct(boqDocs.reduce((s, b) => s + b.margin, 0) / boqDocs.length)} accent="info" />
        <KpiCard index={3} label="Pending Approval" value={boqDocs.filter((b) => b.status !== "Approved").length} accent="warn" />
      </div>

      <div className={grid.split}>
        <div className={grid.stack}>
          <Panel title="BOQ documents" subtitle="Select a document to inspect line items">
            <div className={styles.docList}>
              {boqDocs.map((b) => (
                <button key={b.id} className={`${styles.doc} ${selected.id === b.id ? styles.docActive : ""}`} onClick={() => setSelected(b)}>
                  <div className={styles.docInfo}>
                    <strong>{b.title}{b.locked && <Lock size={12} />}</strong>
                    <span>{projectName(b.project)} · {b.version} · {b.revisions} revisions</span>
                  </div>
                  <div className={styles.docMeta}>
                    <span className={styles.docVal}>{inrCompact(b.total)}</span>
                    <Badge>{b.status}</Badge>
                  </div>
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Line items" subtitle={`${selected.title} · ${selected.version}`} action={<Btn variant="outline" icon={FileSpreadsheet}>Export</Btn>}>
            {lines.length > 0 ? (
              <DataTable columns={cols} rows={lines} searchable={false} pageSize={10} />
            ) : (
              <p className={styles.noLines}>Line items for this BOQ are stored against the approved revision. Select the Vertex Office BOQ to preview an itemised breakdown.</p>
            )}
          </Panel>
        </div>

        <div className={grid.stack}>
          <Panel title="Area-wise split" subtitle={selected.title}>
            {areas.length > 0 ? (
              <>
                <div className={styles.donutRow}>
                  <Donut segments={areas} size={150} label={inrCompact(linesTotal)} sub="itemised" />
                </div>
                <div className={styles.legend}>
                  {areas.map((a) => (
                    <div key={a.label} className={styles.legendRow}>
                      <span className={styles.legendDot} data-c={a.color} />
                      <span className={styles.legendLabel}>{a.label}</span>
                      <span className={styles.legendVal}>{inrCompact(a.value)}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : <p className={styles.noLines}>No itemised areas to chart.</p>}
          </Panel>

          <Panel title="Version & approval" subtitle="Revision control">
            <div className={styles.verBox}>
              <div className={styles.verRow}><GitBranch size={14} /> Current version <strong>{selected.version}</strong></div>
              <div className={styles.verRow}>Revisions <strong>{selected.revisions}</strong></div>
              <div className={styles.verRow}>Updated <strong>{dateShort(selected.updated)}</strong></div>
              <div className={styles.verRow}>Status <Badge>{selected.status}</Badge></div>
              {selected.locked && <div className={styles.lockNote}><Lock size={13} /> Locked after client approval — variance tracked against actuals.</div>}
            </div>
          </Panel>
        </div>
      </div>

      <Panel title="BOQ templates" subtitle="Reusable modular estimates">
        <div className={styles.tplGrid}>
          {boqTemplates.map((t) => (
            <div className={styles.tpl} key={t.id}>
              <FileSpreadsheet size={18} />
              <strong>{t.name}</strong>
              <span>{t.areas} areas · {t.items} items</span>
              <span className={styles.tplVal}>~{inrCompact(t.avgValue)}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
