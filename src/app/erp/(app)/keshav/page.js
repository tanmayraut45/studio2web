"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Crown, LayoutGrid, List, Plus, X, TrendingUp, Wallet,
  AlertCircle, Calendar, FileText, CreditCard, ChevronRight,
} from "lucide-react";
import { PageHeader, KpiCard, Badge, Btn } from "@/components/erp/ui";
import { useProjectsStore } from "@/erp/stores/useProjectsStore";
import { useClientsStore } from "@/erp/stores/useClientsStore";
import { useInvoicesStore } from "@/erp/stores/useInvoicesStore";
import { useExpensesStore } from "@/erp/stores/useExpensesStore";
import { inrCompact, inr, dateShort } from "@/erp/lib/format";
import grid from "@/components/erp/layout.module.css";
import styles from "./keshav.module.css";

const today = () => new Date().toISOString().slice(0, 10);

function daysFromToday(dateStr) {
  if (!dateStr) return null;
  return Math.floor((new Date(dateStr) - new Date(today())) / 86400000);
}

function payFill(pct) {
  if (pct >= 70) return styles.fillGreen;
  if (pct >= 40) return styles.fillAmber;
  return styles.fillRed;
}

function healthDotClass(h) {
  if (h === "on-track") return styles.dotGreen;
  if (h === "at-risk")  return styles.dotAmber;
  return styles.dotRed;
}

// ─── Modal: Record Payment ───────────────────────────────────────
function PaymentModal({ project, client, onClose, addInvoice }) {
  const [v, setV] = useState({ amount: "", date: today(), type: "Stage Payment", notes: "" });
  const set = (k) => (e) => setV((p) => ({ ...p, [k]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!v.amount) return;
    await addInvoice({
      projectId: project.id,
      clientId: client?.id || "",
      amount: Number(v.amount),
      gst: 0,
      status: "paid",
      issueDate: v.date,
      dueDate: v.date,
      number: `PAY-${Date.now()}`,
      description: `${v.type}${v.notes ? ` — ${v.notes}` : ""}`,
    });
    onClose();
  };
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}><X size={14} /></button>
        <div className={styles.modalTitle}>Record Payment</div>
        <form onSubmit={handleSubmit}>
          <div className={styles.formField}>
            <label className={styles.formLabel}>Project</label>
            <input className={styles.formInput} value={project.name} readOnly />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Amount (₹) *</label>
              <input type="number" min="1" className={styles.formInput} value={v.amount} onChange={set("amount")} required autoFocus />
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Payment Date</label>
              <input type="date" className={styles.formInput} value={v.date} onChange={set("date")} />
            </div>
          </div>
          <div className={styles.formField}>
            <label className={styles.formLabel}>Payment Type</label>
            <select className={styles.formInput} value={v.type} onChange={set("type")}>
              {["Advance", "Stage Payment", "Final Payment", "Retention"].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className={styles.formField}>
            <label className={styles.formLabel}>Notes (optional)</label>
            <input className={styles.formInput} value={v.notes} onChange={set("notes")} placeholder="e.g. Bank transfer, reference #123" />
          </div>
          <div className={styles.formActions}>
            <Btn type="button" variant="ghost" onClick={onClose}>Cancel</Btn>
            <Btn type="submit" variant="primary" icon={Plus}>Record Payment</Btn>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Modal: Change Request ───────────────────────────────────────
function ChangeModal({ project, onClose, updateProject }) {
  const [v, setV] = useState({ type: "Change Request", description: "", amount: "", approvedBy: "" });
  const set = (k) => (e) => setV((p) => ({ ...p, [k]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    const extra = Number(v.amount) || 0;
    await updateProject(project.id, { budget: (Number(project.budget) || 0) + extra });
    onClose();
  };
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}><X size={14} /></button>
        <div className={styles.modalTitle}>Add Change Request</div>
        <form onSubmit={handleSubmit}>
          <div className={styles.formField}>
            <label className={styles.formLabel}>Type</label>
            <select className={styles.formInput} value={v.type} onChange={set("type")}>
              {["Change Request", "Rework", "Additional Work"].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className={styles.formField}>
            <label className={styles.formLabel}>Description</label>
            <input className={styles.formInput} value={v.description} onChange={set("description")} required />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Amount Impact (₹)</label>
              <input type="number" className={styles.formInput} value={v.amount} onChange={set("amount")} />
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Approved By</label>
              <input className={styles.formInput} value={v.approvedBy} onChange={set("approvedBy")} />
            </div>
          </div>
          <div className={styles.formActions}>
            <Btn type="button" variant="ghost" onClick={onClose}>Cancel</Btn>
            <Btn type="submit" variant="primary">Submit</Btn>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────
export default function KeshavDashboard() {
  const projects = useProjectsStore((s) => s.projects);
  const updateProject = useProjectsStore((s) => s.updateProject);
  const clients = useClientsStore((s) => s.clients);
  const invoices = useInvoicesStore((s) => s.invoices);
  const addInvoice = useInvoicesStore((s) => s.addInvoice);

  const hydrateProjects = useProjectsStore((s) => s.hydrate);
  const hydrateClients = useClientsStore((s) => s.hydrate);
  const hydrateInvoices = useInvoicesStore((s) => s.hydrate);
  const hydrateExpenses = useExpensesStore((s) => s.hydrate);

  const [view, setView] = useState("table");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dueFilter, setDueFilter] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [paymentModal, setPaymentModal] = useState(null); // project
  const [changeModal, setChangeModal] = useState(null);   // project

  useEffect(() => {
    hydrateProjects(); hydrateClients(); hydrateInvoices(); hydrateExpenses();
  }, [hydrateProjects, hydrateClients, hydrateInvoices, hydrateExpenses]);

  // ── Build rows ─────────────────────────────────────────────────
  const rows = useMemo(() => {
    return projects.map((p) => {
      const client = clients.find((c) => c.id === p.clientId) || null;
      const pInvoices = invoices.filter((i) => i.projectId === p.id);
      const received = pInvoices
        .filter((i) => String(i.status).toLowerCase() === "paid")
        .reduce((s, i) => s + (Number(i.amount) || 0) + (Number(i.gst) || 0), 0);
      const outstanding = pInvoices
        .filter((i) => ["pending", "overdue"].includes(String(i.status).toLowerCase()))
        .reduce((s, i) => s + (Number(i.amount) || 0) + (Number(i.gst) || 0), 0);
      const budget = Number(p.budget) || 0;
      const payPct = budget > 0 ? Math.min(100, Math.round((received / budget) * 100)) : 0;

      const unpaid = pInvoices
        .filter((i) => ["pending", "overdue"].includes(String(i.status).toLowerCase()))
        .sort((a, b) => new Date(a.dueDate || 0) - new Date(b.dueDate || 0));
      const nextInvoice = unpaid[0] || null;
      const nextDueAmount = nextInvoice ? (Number(nextInvoice.amount) || 0) + (Number(nextInvoice.gst) || 0) : 0;
      const nextDueDate = nextInvoice?.dueDate || null;
      const daysPending = nextDueDate ? daysFromToday(nextDueDate) : null;

      return { project: p, client, received, outstanding, payPct, nextDueAmount, nextDueDate, daysPending, pInvoices };
    });
  }, [projects, clients, invoices]);

  // ── Filter ─────────────────────────────────────────────────────
  const filteredRows = useMemo(() => {
    let out = rows;
    if (search) out = out.filter((r) => {
      const str = [r.project.name, r.project.code, r.client?.company || ""].join(" ").toLowerCase();
      return str.includes(search.toLowerCase());
    });
    if (statusFilter !== "All") {
      if (statusFilter === "Active")    out = out.filter((r) => !["Completed", "On Hold"].includes(r.project.stage));
      if (statusFilter === "Completed") out = out.filter((r) => r.project.stage === "Completed");
      if (statusFilter === "On Hold")   out = out.filter((r) => r.project.stage === "On Hold");
    }
    if (dueFilter) out = out.filter((r) => r.outstanding > 0);
    return out;
  }, [rows, search, statusFilter, dueFilter]);

  // ── KPIs ───────────────────────────────────────────────────────
  const kpis = useMemo(() => {
    const totalQuotation = projects.reduce((s, p) => s + (Number(p.budget) || 0), 0);
    const totalReceived = invoices.filter((i) => String(i.status).toLowerCase() === "paid").reduce((s, i) => s + (Number(i.amount) || 0) + (Number(i.gst) || 0), 0);
    const totalOutstanding = invoices.filter((i) => ["pending", "overdue"].includes(String(i.status).toLowerCase())).reduce((s, i) => s + (Number(i.amount) || 0) + (Number(i.gst) || 0), 0);
    const now = new Date();
    const dueThisMonth = invoices.filter((i) => {
      if (String(i.status).toLowerCase() === "paid") return false;
      const d = i.dueDate ? new Date(i.dueDate) : null;
      return d && d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }).length;
    const avgMargin = projects.length ? (projects.reduce((s, p) => s + (Number(p.margin) || 0), 0) / projects.length).toFixed(1) : 0;
    return { totalQuotation, totalReceived, totalOutstanding, dueThisMonth, avgMargin };
  }, [projects, invoices]);

  const selectedRow = filteredRows.find((r) => r.project.id === selectedId) || null;

  // ── Detail Panel ───────────────────────────────────────────────
  const renderDetail = () => {
    if (!selectedRow) return null;
    const { project: p, client, received, outstanding, payPct, pInvoices, nextDueAmount, nextDueDate, daysPending } = selectedRow;
    return (
      <div className={styles.detailPanel}>
        <div className={styles.dpHead}>
          <div>
            <div className={styles.dpCompany}>{client?.company || "Unknown Client"}</div>
            <div className={styles.dpProject}>{p.name} · {p.code}</div>
          </div>
          <button className={styles.dpCloseBtn} onClick={() => setSelectedId(null)}><X size={14} /></button>
        </div>

        <div className={styles.dpSection}>
          <div className={styles.dpSectionLabel}>Payment Progress</div>
          <div className={styles.bigBarWrap}>
            <div className={styles.bigBarLabel}><span>{inrCompact(received)} received</span><span>{payPct}%</span></div>
            <div className={styles.bigBarTrack}><div className={`${styles.bigBarFill} ${payFill(payPct)}`} style={{ width: `${payPct}%` }} /></div>
          </div>
          <div className={styles.dpGrid} style={{ marginTop: "0.75rem" }}>
            <div className={styles.dpField}><span className={styles.dpFieldLabel}>Quotation</span><span className={styles.dpFieldValue}>{inrCompact(Number(p.budget) || 0)}</span></div>
            <div className={styles.dpField}><span className={styles.dpFieldLabel}>Received</span><span style={{ fontFamily: "var(--erp-font-mono)", fontSize: "0.88rem", color: "var(--erp-success)" }}>{inrCompact(received)}</span></div>
            <div className={styles.dpField}><span className={styles.dpFieldLabel}>Outstanding</span><span style={{ fontFamily: "var(--erp-font-mono)", fontSize: "0.88rem", color: outstanding > 0 ? "var(--erp-danger)" : "var(--erp-text-3)" }}>{inrCompact(outstanding)}</span></div>
            <div className={styles.dpField}><span className={styles.dpFieldLabel}>Margin</span><span className={styles.dpFieldValue}>{p.margin ?? "—"}%</span></div>
          </div>
        </div>

        <div className={styles.dpSection}>
          <div className={styles.dpSectionLabel}>Project Progress</div>
          <div className={styles.bigBarWrap}>
            <div className={styles.bigBarLabel}><span>Site completion</span><span>{p.progress ?? 0}%</span></div>
            <div className={styles.bigBarTrack}><div className={`${styles.bigBarFill} ${healthDotClass(p.health) === styles.dotGreen ? styles.fillGreen : healthDotClass(p.health) === styles.dotAmber ? styles.fillAmber : styles.fillRed}`} style={{ width: `${p.progress ?? 0}%` }} /></div>
          </div>
          <div className={styles.dpGrid} style={{ marginTop: "0.75rem" }}>
            <div className={styles.dpField}><span className={styles.dpFieldLabel}>Stage</span><span className={styles.dpFieldText}>{p.stage}</span></div>
            <div className={styles.dpField}><span className={styles.dpFieldLabel}>Health</span><span><Badge>{p.health || "on-track"}</Badge></span></div>
            <div className={styles.dpField}><span className={styles.dpFieldLabel}>Start</span><span className={styles.dpFieldText}>{p.startDate ? dateShort(p.startDate) : "—"}</span></div>
            <div className={styles.dpField}><span className={styles.dpFieldLabel}>End</span><span className={styles.dpFieldText}>{p.endDate ? dateShort(p.endDate) : "—"}</span></div>
          </div>
        </div>

        {nextDueAmount > 0 && (
          <div className={styles.dpSection}>
            <div className={styles.dpSectionLabel}>Next Payment Due</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "var(--erp-font-mono)", fontSize: "1rem", fontWeight: 700, color: "var(--erp-text)" }}>{inrCompact(nextDueAmount)}</span>
              {daysPending !== null && (
                <span className={daysPending <= 0 ? styles.overdue : styles.dueFuture}>
                  {daysPending <= 0 ? `${Math.abs(daysPending)}d overdue` : `in ${daysPending}d`}
                </span>
              )}
            </div>
            {nextDueDate && <div style={{ fontSize: "0.76rem", color: "var(--erp-text-3)", marginTop: "0.25rem" }}>Due: {dateShort(nextDueDate)}</div>}
          </div>
        )}

        {pInvoices.length > 0 && (
          <div className={styles.dpSection}>
            <div className={styles.dpSectionLabel}>Invoices ({pInvoices.length})</div>
            <div className={styles.invoiceList}>
              {pInvoices.slice(0, 6).map((inv) => (
                <div key={inv.id} className={`${styles.invoiceItem} ${inv.status === "overdue" ? styles.invoiceOverdue : ""}`}>
                  <span className={styles.invNum}>{inv.number || "—"}</span>
                  <span className={styles.invAmt}>{inrCompact((Number(inv.amount) || 0) + (Number(inv.gst) || 0))}</span>
                  <Badge>{inv.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles.dpActions}>
          <Btn variant="primary" icon={Plus} onClick={() => setPaymentModal(selectedRow.project)}>Add Payment</Btn>
          <Btn variant="ghost" icon={FileText} onClick={() => setChangeModal(selectedRow.project)}>Change Request</Btn>
          <Btn variant="outline" icon={FileText}>Generate Invoice</Btn>
        </div>
      </div>
    );
  };

  // ── Table view ─────────────────────────────────────────────────
  const renderTable = () => (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Client</th>
            <th className={styles.th}>Project</th>
            <th className={styles.th}>Health</th>
            <th className={`${styles.th} ${styles.thR}`}>Quotation</th>
            <th className={`${styles.th} ${styles.thR}`}>Received</th>
            <th className={`${styles.th} ${styles.thR}`}>Outstanding</th>
            <th className={styles.th}>Pay%</th>
            <th className={styles.th}>Progress</th>
            <th className={styles.th}>Next Due</th>
            <th className={`${styles.th} ${styles.thR}`}>Margin</th>
            <th className={styles.th} />
          </tr>
        </thead>
        <tbody>
          {filteredRows.length === 0 && (
            <tr><td colSpan={11} className={styles.td}><div className={styles.emptyState}><strong>No projects yet</strong><span>Add projects and clients to see them here</span></div></td></tr>
          )}
          {filteredRows.map(({ project: p, client, received, outstanding, payPct, nextDueAmount, nextDueDate, daysPending }) => (
            <tr key={p.id} className={`${styles.tr} ${selectedId === p.id ? styles.trSelected : ""}`} onClick={() => setSelectedId(selectedId === p.id ? null : p.id)}>
              <td className={styles.td}>
                <span className={styles.tdPrimary}>{client?.company || "—"}</span>
                <span className={styles.tdSub}>{client?.name}</span>
              </td>
              <td className={styles.td}>
                <span className={styles.tdPrimary}>{p.name}</span>
                <span className={styles.tdSub}>{p.code} · {p.location}</span>
              </td>
              <td className={styles.td}>
                <span className={`${styles.healthDot} ${healthDotClass(p.health)}`} />
                {p.health || "on-track"}
              </td>
              <td className={`${styles.td} ${styles.tdMono} ${styles.tdR}`}>{inrCompact(Number(p.budget) || 0)}</td>
              <td className={`${styles.td} ${styles.tdMonoGreen} ${styles.tdR}`}>{inrCompact(received)}</td>
              <td className={`${styles.td} ${outstanding > 0 ? styles.tdMonoDanger : styles.tdMono} ${styles.tdR}`}>{outstanding > 0 ? inrCompact(outstanding) : "—"}</td>
              <td className={styles.td}>
                <div className={styles.miniBar}>
                  <div className={styles.miniBarTrack}><div className={`${styles.miniBarFill} ${payFill(payPct)}`} style={{ width: `${payPct}%` }} /></div>
                  <span className={styles.pct}>{payPct}%</span>
                </div>
              </td>
              <td className={styles.td}>
                <div className={styles.miniBar}>
                  <div className={styles.miniBarTrack}><div className={`${styles.miniBarFill} ${healthDotClass(p.health) === styles.dotGreen ? styles.fillGreen : healthDotClass(p.health) === styles.dotAmber ? styles.fillAmber : styles.fillRed}`} style={{ width: `${p.progress ?? 0}%` }} /></div>
                  <span className={styles.pct}>{p.progress ?? 0}%</span>
                </div>
              </td>
              <td className={styles.td}>
                {nextDueAmount > 0 ? (
                  <div>
                    <div style={{ fontFamily: "var(--erp-font-mono)", fontSize: "0.8rem", color: "var(--erp-text)" }}>{inrCompact(nextDueAmount)}</div>
                    {daysPending !== null && (
                      <div className={daysPending <= 0 ? styles.overdue : styles.dueFuture}>
                        {daysPending <= 0 ? `${Math.abs(daysPending)}d overdue` : `in ${daysPending}d`}
                      </div>
                    )}
                  </div>
                ) : <span className={styles.dueFuture}>—</span>}
              </td>
              <td className={`${styles.td} ${styles.tdMono} ${styles.tdR}`}>{p.margin ?? "—"}%</td>
              <td className={`${styles.td} ${styles.tdR}`}>
                <div className={styles.rowActions}>
                  <button className={styles.actionBtn} title="Add Payment" onClick={(e) => { e.stopPropagation(); setPaymentModal(p); }}><Plus size={13} /></button>
                  <button className={styles.actionBtn} title="Generate Invoice" onClick={(e) => { e.stopPropagation(); }}><FileText size={13} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // ── Card view ─────────────────────────────────────────────────
  const renderCards = () => (
    <div className={styles.cardGrid}>
      {filteredRows.length === 0 && (
        <div className={styles.emptyState} style={{ gridColumn: "1 / -1" }}>
          <strong>No projects yet</strong>
          <span>Add projects and clients to see them here</span>
        </div>
      )}
      {filteredRows.map(({ project: p, client, received, outstanding, payPct, nextDueAmount, nextDueDate, daysPending }) => (
        <div key={p.id} className={styles.card} onClick={() => setSelectedId(selectedId === p.id ? null : p.id)}>
          <div className={styles.cardTop}>
            <div>
              <div className={styles.cardCompany}>{client?.company || "Unknown"}</div>
              <div className={styles.cardProject}>{p.name} · {p.code}</div>
            </div>
            <Badge>{p.health || "on-track"}</Badge>
          </div>
          <div className={styles.cardStatRow}>
            <div><span>Quotation</span><strong>{inrCompact(Number(p.budget) || 0)}</strong></div>
            <div><span>Received</span><strong style={{ color: "var(--erp-success)" }}>{inrCompact(received)}</strong></div>
            {outstanding > 0 && <div><span>Due</span><strong style={{ color: "var(--erp-danger)" }}>{inrCompact(outstanding)}</strong></div>}
          </div>
          <div className={styles.cardBarSection}>
            <div className={styles.cardBarLabel}><span>Payment</span><span>{payPct}%</span></div>
            <div className={styles.cardBarTrack}><div className={`${styles.cardBarFill} ${payFill(payPct)}`} style={{ width: `${payPct}%` }} /></div>
          </div>
          <div className={styles.cardBarSection}>
            <div className={styles.cardBarLabel}><span>Progress</span><span>{p.progress ?? 0}%</span></div>
            <div className={styles.cardBarTrack}><div className={`${styles.cardBarFill} ${healthDotClass(p.health) === styles.dotGreen ? styles.fillGreen : healthDotClass(p.health) === styles.dotAmber ? styles.fillAmber : styles.fillRed}`} style={{ width: `${p.progress ?? 0}%` }} /></div>
          </div>
          {nextDueAmount > 0 && (
            <div className={styles.cardNextDue}>
              <span style={{ color: "var(--erp-text-3)", fontSize: "0.76rem" }}>Next due</span>
              <div>
                <span style={{ fontFamily: "var(--erp-font-mono)", fontWeight: 700 }}>{inrCompact(nextDueAmount)}</span>
                {daysPending !== null && (
                  <span className={daysPending <= 0 ? styles.overdue : styles.dueFuture} style={{ marginLeft: "0.5rem" }}>
                    {daysPending <= 0 ? `${Math.abs(daysPending)}d overdue` : `in ${daysPending}d`}
                  </span>
                )}
              </div>
            </div>
          )}
          <div className={styles.cardActions}>
            <Btn variant="primary" icon={Plus} onClick={(e) => { e.stopPropagation(); setPaymentModal(p); }}>Add Payment</Btn>
            <Btn variant="ghost" icon={FileText} onClick={(e) => { e.stopPropagation(); }}>Invoice</Btn>
          </div>
        </div>
      ))}
    </div>
  );

  const payProject = paymentModal ? projects.find((p) => p.id === paymentModal.id) || paymentModal : null;
  const payClient  = payProject ? clients.find((c) => c.id === payProject.clientId) || null : null;
  const changeProject = changeModal ? projects.find((p) => p.id === changeModal.id) || changeModal : null;

  return (
    <div className={grid.stack}>
      <div className={styles.pageTop}>
        <PageHeader
          title="Executive Dashboard"
          subtitle="Mr. Keshav Sir — Complete financial & project visibility"
          icon={Crown}
        />
        <div className={styles.pageTopRight}>
          <div className={styles.viewToggle}>
            <button className={`${styles.vtBtn} ${view === "table" ? styles.vtBtnActive : ""}`} onClick={() => setView("table")}><List size={14} /> Table</button>
            <button className={`${styles.vtBtn} ${view === "card" ? styles.vtBtnActive : ""}`} onClick={() => setView("card")}><LayoutGrid size={14} /> Cards</button>
          </div>
          <Btn variant="primary" icon={Plus} onClick={() => setPaymentModal(projects[0] || null)}>Add Payment</Btn>
        </div>
      </div>

      {/* KPI row */}
      <div className={grid.kpiGrid}>
        <KpiCard index={0} label="Total Clients" value={clients.length} accent="gold" />
        <KpiCard index={1} label="Active Projects" value={projects.length} accent="info" />
        <KpiCard index={2} label="Total Quotation Value" value={inrCompact(kpis.totalQuotation)} accent="gold" />
        <KpiCard index={3} label="Revenue Received" value={inrCompact(kpis.totalReceived)} accent="success" />
        <KpiCard index={4} label="Outstanding Dues" value={inrCompact(kpis.totalOutstanding)} accent="warn" />
        <KpiCard index={5} label="Due This Month" value={kpis.dueThisMonth} sub="invoices" accent="danger" />
        <KpiCard index={6} label="Avg Project Margin" value={`${kpis.avgMargin}%`} accent="purple" />
      </div>

      {/* Filter bar */}
      <div className={styles.filterBar}>
        <input className={styles.filterSearch} placeholder="Search client or project…" value={search} onChange={(e) => setSearch(e.target.value)} />
        {["All", "Active", "Completed", "On Hold"].map((s) => (
          <button key={s} className={`${styles.chip} ${statusFilter === s ? styles.chipActive : ""}`} onClick={() => setStatusFilter(s)}>{s}</button>
        ))}
        <button className={`${styles.chip} ${dueFilter ? styles.chipActive : ""}`} onClick={() => setDueFilter((v) => !v)}>
          <AlertCircle size={12} style={{ display: "inline", marginRight: 4 }} />Payments Due
        </button>
      </div>

      {/* Main content */}
      {view === "table" ? (
        <div className={styles.splitView}>
          <div className={styles.tableArea}>{renderTable()}</div>
          {selectedRow && renderDetail()}
        </div>
      ) : (
        <div className={styles.splitView}>
          <div className={styles.tableArea}>{renderCards()}</div>
          {selectedRow && renderDetail()}
        </div>
      )}

      {/* Modals */}
      {paymentModal && payProject && (
        <PaymentModal project={payProject} client={payClient} onClose={() => setPaymentModal(null)} addInvoice={addInvoice} />
      )}
      {changeModal && changeProject && (
        <ChangeModal project={changeProject} onClose={() => setChangeModal(null)} updateProject={updateProject} />
      )}
    </div>
  );
}
