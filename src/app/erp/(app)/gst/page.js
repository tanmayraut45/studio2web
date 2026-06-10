"use client";

import { Receipt, Download, FileCheck2, ShieldCheck, Lock } from "lucide-react";
import { PageHeader, KpiCard, Panel, Badge, Btn } from "@/components/erp/ui";
import DataTable from "@/components/erp/DataTable";
import { gstSummary, gstReturns } from "@/erp/data";
import { inr, inrCompact, dateShort } from "@/erp/lib/format";
import grid from "@/components/erp/layout.module.css";
import styles from "./gst.module.css";

const HSN = [
  { code: "2515", desc: "Marble & stone", taxable: 4820000, rate: 18 },
  { code: "4412", desc: "Plywood & veneer", taxable: 3610000, rate: 18 },
  { code: "9405", desc: "Lighting fixtures", taxable: 2940000, rate: 12 },
  { code: "6910", desc: "Sanitaryware", taxable: 1980000, rate: 18 },
  { code: "3209", desc: "Paints & coatings", taxable: 1450000, rate: 18 },
];

export default function GstPage() {
  const cols = [
    { key: "form", label: "Return", render: (r) => <strong className={styles.form}>{r.form}</strong> },
    { key: "period", label: "Period" },
    { key: "value", label: "Tax Value", align: "right", mono: true, render: (r) => inr(r.value) },
    { key: "due", label: "Due Date", align: "right", render: (r) => dateShort(r.due) },
    { key: "status", label: "Status", render: (r) => <Badge>{r.status}</Badge> },
  ];

  const hsnCols = [
    { key: "code", label: "HSN/SAC", mono: true, render: (r) => <strong className={styles.form}>{r.code}</strong> },
    { key: "desc", label: "Description" },
    { key: "rate", label: "Rate", align: "right", mono: true, render: (r) => `${r.rate}%` },
    { key: "taxable", label: "Taxable Value", align: "right", mono: true, render: (r) => inr(r.taxable) },
    { key: "gst", label: "GST", align: "right", mono: true, render: (r) => inr(r.taxable * r.rate / 100) },
  ];

  return (
    <div className={grid.stack}>
      <PageHeader title="GST & Tax" subtitle="India-compliant taxation & filing engine" icon={Receipt}>
        <Btn variant="ghost" icon={Download}>Tax audit export</Btn>
        <Btn icon={FileCheck2}>File GSTR-3B</Btn>
      </PageHeader>

      <div className={grid.kpiGrid}>
        <KpiCard index={0} label="Output GST" value={inrCompact(gstSummary.outputGst)} sub={gstSummary.period} accent="gold" />
        <KpiCard index={1} label="Input Credit" value={inrCompact(gstSummary.inputGst)} accent="success" />
        <KpiCard index={2} label="Net Payable" value={inrCompact(gstSummary.netPayable)} accent="danger" />
        <KpiCard index={3} label="TDS Deducted" value={inrCompact(gstSummary.tdsDeducted)} accent="info" />
      </div>

      <Panel title="Returns & filings" subtitle="GSTR-1, GSTR-3B and compliance calendar" padded>
        <DataTable columns={cols} rows={gstReturns} searchable={false} />
      </Panel>

      <div className={grid.split}>
        <Panel title="HSN / SAC summary" subtitle="Output tax by category" padded>
          <DataTable columns={hsnCols} rows={HSN} searchable={false} />
        </Panel>

        <div className={grid.stack}>
          <Panel title="Compliance status">
            <div className={styles.compliance}>
              <div className={styles.cRow}><span className={styles.cLabel}><FileCheck2 size={15} /> GSTR-1 (May)</span><Badge tone="success">Filed</Badge></div>
              <div className={styles.cRow}><span className={styles.cLabel}><FileCheck2 size={15} /> GSTR-3B (May)</span><Badge tone="warn">Due 20 Jun</Badge></div>
              <div className={styles.cRow}><span className={styles.cLabel}><FileCheck2 size={15} /> E-invoicing</span><Badge tone="success">Active</Badge></div>
              <div className={styles.cRow}><span className={styles.cLabel}><FileCheck2 size={15} /> TDS returns</span><Badge tone="success">Filed</Badge></div>
            </div>
          </Panel>

          <Panel title="CA portal">
            <div className={styles.ca}>
              <span className={styles.caIcon}><ShieldCheck size={22} /></span>
              <p>Restricted, export-ready access for your chartered accountant.</p>
              <div className={styles.caLock}><Lock size={12} /> Role-scoped · read-only ledgers</div>
              <Btn variant="outline">Manage access</Btn>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
