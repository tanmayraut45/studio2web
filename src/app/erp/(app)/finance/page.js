"use client";

import { Wallet, Plus, ArrowDownLeft, Receipt, TrendingUp } from "lucide-react";
import { PageHeader, KpiCard, Panel, Badge, Btn } from "@/components/erp/ui";
import { AreaChart, Meter } from "@/components/erp/Charts";
import DataTable from "@/components/erp/DataTable";
import {
  invoices, payments, expenses, cashFlow, gstSummary, projects,
  clientName, projectName, getClient,
} from "@/erp/data";
import { inr, inrCompact, dateShort } from "@/erp/lib/format";
import grid from "@/components/erp/layout.module.css";
import styles from "./finance.module.css";

const collected = payments.reduce((s, p) => s + p.amount, 0);
const outstanding = invoices.filter((i) => i.status !== "Paid").reduce((s, i) => s + i.amount + i.gst, 0);
const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);

// expenses grouped by project (cost centers)
const byProject = projects.map((p) => ({
  project: p,
  total: expenses.filter((e) => e.project === p.id).reduce((s, e) => s + e.amount, 0),
})).filter((x) => x.total > 0).sort((a, b) => b.total - a.total);
const maxExp = Math.max(...byProject.map((x) => x.total), 1);

export default function FinancePage() {
  const invCols = [
    { key: "code", label: "Invoice", mono: true, render: (r) => <strong className={styles.code}>{r.code}</strong> },
    { key: "client", label: "Client", render: (r) => clientName(r.client) },
    { key: "type", label: "Type", render: (r) => <Badge tone="neutral">{r.type}</Badge> },
    { key: "amount", label: "Amount", align: "right", mono: true, render: (r) => inr(r.amount + r.gst) },
    { key: "status", label: "Status", render: (r) => <Badge>{r.status}</Badge> },
    { key: "due", label: "Due", align: "right", render: (r) => dateShort(r.due) },
  ];

  return (
    <div className={grid.stack}>
      <PageHeader title="Finance & Accounting" subtitle="Cash flow, receivables, P&L and cost centers" icon={Wallet}>
        <Btn icon={Plus}>New Invoice</Btn>
      </PageHeader>

      <div className={grid.kpiGrid}>
        <KpiCard index={0} label="Collected (FY)" value={inrCompact(collected)} delta="+22%" deltaUp accent="success" />
        <KpiCard index={1} label="Outstanding" value={inrCompact(outstanding)} sub="Rs 67.3L overdue" accent="danger" />
        <KpiCard index={2} label="Net Cash Position" value={inrCompact(collected - totalExpense * 6)} accent="gold" />
        <KpiCard index={3} label="GST Payable" value={inrCompact(gstSummary.netPayable)} sub={gstSummary.period} accent="warn" />
      </div>

      <div className={grid.split}>
        <Panel title="Net cash flow" subtitle="Monthly net position (Rs lakhs)" action={<TrendingUp size={15} />}>
          <AreaChart data={cashFlow.map((c) => c.net)} labels={cashFlow.map((c) => c.month)} color="gold" height={210} />
        </Panel>

        <Panel title="GST & Tax" subtitle={gstSummary.period}>
          <div className={styles.gst}>
            <div className={styles.gstRow}><span>Output GST</span><strong>{inr(gstSummary.outputGst)}</strong></div>
            <div className={styles.gstRow}><span>Input GST</span><strong>{inr(gstSummary.inputGst)}</strong></div>
            <div className={styles.gstNet}><span>Net Payable</span><strong>{inr(gstSummary.netPayable)}</strong></div>
            <div className={styles.gstRow}><span>TDS Deducted</span><strong>{inr(gstSummary.tdsDeducted)}</strong></div>
            <div className={styles.gstBadges}>
              <Badge tone="success">GSTR-1 {gstSummary.gstr1}</Badge>
              <Badge tone="warn">GSTR-3B {gstSummary.gstr3b}</Badge>
            </div>
          </div>
        </Panel>
      </div>

      <div className={grid.split}>
        <Panel title="Invoices" padded>
          <DataTable columns={invCols} rows={invoices} searchKeys={["code", "status", "type"]} pageSize={6} />
        </Panel>

        <Panel title="Recent payments" subtitle="Receipts cleared">
          <div className={styles.pays}>
            {payments.map((p) => (
              <div className={styles.pay} key={p.id}>
                <span className={styles.payIcon}><ArrowDownLeft size={15} /></span>
                <div className={styles.payInfo}>
                  <strong>{clientName(p.client)}</strong>
                  <span>{p.mode} · {dateShort(p.date)}</span>
                </div>
                <strong className={styles.payAmt}>{inrCompact(p.amount)}</strong>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Cost centers" subtitle="Project-wise expense distribution">
        <div className={styles.costList}>
          {byProject.map((x) => (
            <div className={styles.costRow} key={x.project.id}>
              <span className={styles.costName}>{x.project.name}</span>
              <div className={styles.costMeter}><Meter value={x.total} max={maxExp} color="gold" /></div>
              <span className={styles.costVal}>{inr(x.total)}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
