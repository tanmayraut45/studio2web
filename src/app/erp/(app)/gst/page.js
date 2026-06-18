"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Receipt, Download, FileCheck2, ShieldCheck, Lock, Plus,
  CheckCircle2, Trash2,
} from "lucide-react";
import { PageHeader, KpiCard, Panel, Badge, Btn, ConfirmDialog } from "@/components/erp/ui";
import DataTable from "@/components/erp/DataTable";
import { Drawer } from "@/components/erp/Modal";
import { gstSummary, gstReturns, clientName, projectName } from "@/erp/data";
import { inr, inrCompact, dateShort } from "@/erp/lib/format";
import { useInvoicesStore } from "@/erp/stores/useInvoicesStore";
import InvoiceForm from "./InvoiceForm";
import grid from "@/components/erp/layout.module.css";
import styles from "./gst.module.css";

const HSN = [
  { code: "2515", desc: "Marble & stone", taxable: 4820000, rate: 18 },
  { code: "4412", desc: "Plywood & veneer", taxable: 3610000, rate: 18 },
  { code: "9405", desc: "Lighting fixtures", taxable: 2940000, rate: 12 },
  { code: "6910", desc: "Sanitaryware", taxable: 1980000, rate: 18 },
  { code: "3209", desc: "Paints & coatings", taxable: 1450000, rate: 18 },
];

const STATUS_TONE = {
  Paid: "success",
  Sent: "info",
  Draft: "neutral",
  "Partially Paid": "warn",
  Overdue: "danger",
};

export default function GstPage() {
  const invoices = useInvoicesStore((s) => s.invoices);
  const hydrate = useInvoicesStore((s) => s.hydrate);
  const addInvoice = useInvoicesStore((s) => s.addInvoice);
  const updateInvoice = useInvoicesStore((s) => s.updateInvoice);
  const markPaid = useInvoicesStore((s) => s.markPaid);
  const removeInvoice = useInvoicesStore((s) => s.removeInvoice);

  const [creating, setCreating] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const selected = selectedId ? invoices.find((i) => i.id === selectedId) : null;

  // ---- Derived KPIs (live, from store) ---------------------------------
  const derived = useMemo(() => {
    const outputGst = invoices.reduce((s, i) => s + (i.gst || 0), 0);
    // Input GST credit is not modelled on invoices — keep the seed figure
    // (driven by purchase / expense GST) as a stable proxy.
    const inputGst = gstSummary?.inputGst || 0;
    const netPayable = Math.max(outputGst - inputGst, 0);
    const outstanding = invoices
      .filter((i) => i.status !== "Paid")
      .reduce((s, i) => s + (i.amount || 0) + (i.gst || 0), 0);
    const collected = invoices
      .filter((i) => i.status === "Paid")
      .reduce((s, i) => s + (i.amount || 0) + (i.gst || 0), 0);
    return { outputGst, inputGst, netPayable, outstanding, collected };
  }, [invoices]);

  // ---- Handlers ---------------------------------------------------------
  const openInvoice = (row) => setSelectedId(row.id);
  const closeDrawer = () => setSelectedId(null);

  const handleCreate = async (values) => {
    await addInvoice(values);
    setCreating(false);
  };

  const handleUpdate = async (values) => {
    if (!selected) return;
    await updateInvoice(selected.id, values);
    closeDrawer();
  };

  const handleDelete = async () => {
    if (!selected) return;
    if (!deleteConfirm) { setDeleteConfirm(true); return; }
    await removeInvoice(selected.id);
    setDeleteConfirm(false);
    closeDrawer();
  };

  const handleMarkPaid = async (e, inv) => {
    e.stopPropagation();
    await markPaid(inv.id);
  };

  // ---- Columns ---------------------------------------------------------
  const invoiceCols = [
    { key: "code", label: "Invoice", render: (r) => <strong className={styles.form}>{r.code}</strong> },
    { key: "client", label: "Client", render: (r) => clientName(r.client) },
    { key: "project", label: "Project", render: (r) => projectName(r.project) },
    { key: "type", label: "Type", render: (r) => <Badge>{r.type}</Badge> },
    { key: "amount", label: "Amount", align: "right", mono: true, render: (r) => inr(r.amount) },
    { key: "gst", label: "GST", align: "right", mono: true, render: (r) => inr(r.gst) },
    { key: "due", label: "Due", align: "right", render: (r) => dateShort(r.due) },
    {
      key: "status",
      label: "Status",
      render: (r) => <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge>,
    },
    {
      key: "_actions",
      label: "",
      align: "right",
      sortable: false,
      render: (r) => (
        <div className={styles.rowActions}>
          {r.status !== "Paid" && (
            <button
              type="button"
              className={styles.miniBtn}
              onClick={(e) => handleMarkPaid(e, r)}
              title="Mark as paid"
            >
              <CheckCircle2 /> Mark Paid
            </button>
          )}
        </div>
      ),
    },
  ];

  const returnCols = [
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
        <Btn variant="ghost" icon={FileCheck2}>File GSTR-3B</Btn>
        <Btn icon={Plus} onClick={() => setCreating(true)}>Add Invoice</Btn>
      </PageHeader>

      <div className={grid.kpiGrid}>
        <KpiCard index={0} label="Output GST" value={inrCompact(derived.outputGst || 0)} sub={gstSummary?.period || "—"} accent="gold" />
        <KpiCard index={1} label="Input Credit" value={inrCompact(derived.inputGst || 0)} accent="success" />
        <KpiCard index={2} label="Net Payable" value={inrCompact(derived.netPayable || 0)} accent="danger" />
        <KpiCard index={3} label="Outstanding" value={inrCompact(derived.outstanding || 0)} sub={`${invoices.filter((i) => i.status !== "Paid").length} open`} accent="info" />
      </div>

      <Panel title="Invoices" subtitle="Tax invoices issued — drives output GST and AR" padded>
        <DataTable
          columns={invoiceCols}
          rows={invoices}
          onRowClick={openInvoice}
          searchKeys={["code", "type", "status"]}
        />
      </Panel>

      <Panel title="Returns & filings" subtitle="GSTR-1, GSTR-3B and compliance calendar" padded>
        {gstReturns.length > 0 ? (
          <DataTable columns={returnCols} rows={gstReturns} searchable={false} />
        ) : (
          <p className={styles.emptyHint}>No filed returns yet.</p>
        )}
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

      <Drawer
        open={creating}
        onClose={() => setCreating(false)}
        title="New invoice"
        width={480}
      >
        {creating && (
          <InvoiceForm
            initial={null}
            submitLabel="Create invoice"
            onSubmit={handleCreate}
            onCancel={() => setCreating(false)}
          />
        )}
      </Drawer>

      <Drawer
        open={!!selected}
        onClose={closeDrawer}
        title={selected ? `Edit ${selected.code}` : "Edit invoice"}
        width={480}
      >
        {selected && (
          <>
            <InvoiceForm
              initial={selected}
              submitLabel="Save changes"
              onSubmit={handleUpdate}
              onCancel={closeDrawer}
            />
            <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end" }}>
              <Btn variant="outline" icon={Trash2} onClick={handleDelete}>Delete invoice</Btn>
            </div>
          </>
        )}
      </Drawer>

      <ConfirmDialog
        open={deleteConfirm}
        label={`Delete invoice "${selected?.code}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(false)}
      />
    </div>
  );
}
