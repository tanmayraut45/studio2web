"use client";

import { useEffect, useMemo, useState } from "react";
import { Receipt, Plus, X } from "lucide-react";
import { PageHeader, Badge, Btn } from "@/components/erp/ui";
import { inr, inrCompact, dateShort } from "@/erp/lib/format";
import { useInvoicesStore } from "@/erp/stores/useInvoicesStore";
import { useClientsStore } from "@/erp/stores/useClientsStore";
import { useProjectsStore } from "@/erp/stores/useProjectsStore";
import styles from "./invoices.module.css";

const STATUS_CHIPS = ["All", "Draft", "Sent", "Partially Paid", "Paid", "Overdue"];
const TYPES = ["advance", "milestone", "retention", "full"];

function InvoiceForm({ clients, projects, onSave, onClose }) {
  const [form, setForm] = useState({ code: "", client: "", project: "", type: "milestone", amount: "", gst: "", issued: new Date().toISOString().split("T")[0], due: "", status: "draft" });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const handleSave = (e) => {
    e.preventDefault();
    onSave({ ...form, amount: Number(form.amount) || 0, gst: Number(form.gst) || 0 });
  };
  return (
    <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modalBox}>
        <button type="button" className={styles.modalClose} onClick={onClose}><X size={16} /></button>
        <div className={styles.modalTitle}>New Invoice</div>
        <form onSubmit={handleSave}>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Invoice Code</label>
              <input className={styles.formInput} placeholder="INV-2026-001" value={form.code} onChange={(e) => set("code", e.target.value)} />
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Type</label>
              <select className={styles.formInput} value={form.type} onChange={(e) => set("type", e.target.value)}>
                {TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Client</label>
              <select className={styles.formInput} value={form.client} onChange={(e) => set("client", e.target.value)}>
                <option value="">Select client</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.company || c.name}</option>)}
              </select>
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Project</label>
              <select className={styles.formInput} value={form.project} onChange={(e) => set("project", e.target.value)}>
                <option value="">Select project</option>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Amount (₹)</label>
              <input className={styles.formInput} type="number" min="0" placeholder="0" value={form.amount} onChange={(e) => set("amount", e.target.value)} />
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>GST (₹)</label>
              <input className={styles.formInput} type="number" min="0" placeholder="0" value={form.gst} onChange={(e) => set("gst", e.target.value)} />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Issued Date</label>
              <input className={styles.formInput} type="date" value={form.issued} onChange={(e) => set("issued", e.target.value)} />
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Due Date</label>
              <input className={styles.formInput} type="date" value={form.due} onChange={(e) => set("due", e.target.value)} />
            </div>
          </div>
          <div className={styles.formField}>
            <label className={styles.formLabel}>Status</label>
            <select className={styles.formInput} value={form.status} onChange={(e) => set("status", e.target.value)}>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
            </select>
          </div>
          <div className={styles.formActions}>
            <button type="button" className={styles.btnSecondary} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.btnPrimary}>Create Invoice</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function InvoicesPage() {
  const invoices    = useInvoicesStore((s) => s.invoices);
  const hydrate     = useInvoicesStore((s) => s.hydrate);
  const addInvoice  = useInvoicesStore((s) => s.addInvoice);
  const markPaid    = useInvoicesStore((s) => s.markPaid);
  const clients     = useClientsStore((s) => s.clients);
  const hydrateC    = useClientsStore((s) => s.hydrate);
  const projects    = useProjectsStore((s) => s.projects);
  const hydrateP    = useProjectsStore((s) => s.hydrate);

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => { hydrate(); hydrateC(); hydrateP(); }, [hydrate, hydrateC, hydrateP]);

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      const matchStatus = filter === "All" || (inv.status || "").toLowerCase() === filter.toLowerCase();
      const q = search.toLowerCase();
      const matchSearch = !q || (inv.code || "").toLowerCase().includes(q) || (inv.client || "").toLowerCase().includes(q);
      return matchStatus && matchSearch;
    }).sort((a, b) => new Date(b.issued || 0) - new Date(a.issued || 0));
  }, [invoices, filter, search]);

  const kpis = useMemo(() => {
    const total   = invoices.reduce((s, i) => s + (i.amount || 0) + (i.gst || 0), 0);
    const paid    = invoices.filter((i) => (i.status || "").toLowerCase() === "paid").reduce((s, i) => s + (i.amount || 0) + (i.gst || 0), 0);
    const overdue = invoices.filter((i) => (i.status || "").toLowerCase() === "overdue");
    return { total, paid, overdue: overdue.length, outstanding: total - paid };
  }, [invoices]);

  const getClientName = (id) => clients.find((c) => c.id === id)?.company || clients.find((c) => c.id === id)?.name || id || "—";

  return (
    <div className={styles.page}>
      <PageHeader icon={Receipt} title="Invoices" subtitle="All project invoices · Track status · Record payments">
        <Btn icon={Plus} onClick={() => setAddOpen(true)}>New Invoice</Btn>
      </PageHeader>

      <div className={styles.kpiRow}>
        <div className={styles.kpiCard} data-accent="gold">
          <span className={styles.kpiLabel}>Total Invoiced</span>
          <span className={`${styles.kpiValue} ${styles.kpiGold}`}>{inrCompact(kpis.total)}</span>
        </div>
        <div className={styles.kpiCard} data-accent="green">
          <span className={styles.kpiLabel}>Collected</span>
          <span className={`${styles.kpiValue} ${styles.kpiGreen}`}>{inrCompact(kpis.paid)}</span>
        </div>
        <div className={styles.kpiCard} data-accent="warn">
          <span className={styles.kpiLabel}>Outstanding</span>
          <span className={`${styles.kpiValue} ${styles.kpiWarn}`}>{inrCompact(kpis.outstanding)}</span>
        </div>
        <div className={styles.kpiCard} data-accent="danger">
          <span className={styles.kpiLabel}>Overdue</span>
          <span className={`${styles.kpiValue} ${styles.kpiDanger}`}>{kpis.overdue}</span>
        </div>
      </div>

      <div className={styles.filterBar}>
        <input className={styles.search} placeholder="Search by code or client…" value={search} onChange={(e) => setSearch(e.target.value)} />
        {STATUS_CHIPS.map((s) => (
          <button key={s} type="button" className={`${styles.chip} ${filter === s ? styles.chipActive : ""}`} onClick={() => setFilter(s)}>{s}</button>
        ))}
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Invoice</th>
              <th className={styles.th}>Client</th>
              <th className={styles.th}>Type</th>
              <th className={styles.th}>Issued</th>
              <th className={styles.th}>Due</th>
              <th className={`${styles.th} ${styles.thR}`}>Amount</th>
              <th className={`${styles.th} ${styles.thR}`}>GST</th>
              <th className={`${styles.th} ${styles.thR}`}>Total</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th} />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={10} className={styles.emptyCell}>No invoices match</td></tr>
            ) : filtered.map((inv) => {
              const total = (inv.amount || 0) + (inv.gst || 0);
              const isOver = (inv.status || "").toLowerCase() === "overdue";
              return (
                <tr key={inv.id} className={styles.tr}>
                  <td className={`${styles.td} ${styles.tdMono} ${styles.tdPrimary}`}>{inv.code || inv.id?.slice(0, 8)}</td>
                  <td className={styles.td}>{getClientName(inv.client)}</td>
                  <td className={styles.td}>{inv.type || "—"}</td>
                  <td className={`${styles.td} ${styles.tdMono}`}>{dateShort(inv.issued)}</td>
                  <td className={`${styles.td} ${isOver ? styles.overdue : styles.tdMono}`}>{dateShort(inv.due)}</td>
                  <td className={`${styles.td} ${styles.tdMono} ${styles.tdR}`}>{inr(inv.amount)}</td>
                  <td className={`${styles.td} ${styles.tdMono} ${styles.tdR}`}>{inr(inv.gst)}</td>
                  <td className={`${styles.td} ${styles.tdMono} ${styles.tdR}`}>{inr(total)}</td>
                  <td className={styles.td}><Badge>{inv.status || "draft"}</Badge></td>
                  <td className={styles.td}>
                    {(inv.status || "").toLowerCase() !== "paid" && (
                      <button type="button" className={styles.markPaidBtn} onClick={() => markPaid(inv.id)}>Mark Paid</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {addOpen && (
        <InvoiceForm
          clients={clients}
          projects={projects}
          onSave={async (vals) => { await addInvoice(vals); setAddOpen(false); }}
          onClose={() => setAddOpen(false)}
        />
      )}
    </div>
  );
}
