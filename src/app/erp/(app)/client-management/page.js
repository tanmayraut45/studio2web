"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Users2, Plus, Search, LayoutGrid, List, X, Phone, Mail, MapPin,
  MessageCircle, Calendar, UserCheck, Pencil, Trash2, FileText,
  ChevronRight, Package, FolderKanban, Star, TrendingUp, Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge, Tag, Avatar, Btn } from "@/components/erp/ui";
import { Drawer } from "@/components/erp/Modal";
import { useLeadsStore, leadStages } from "@/erp/stores/useLeadsStore";
import { useClientsStore } from "@/erp/stores/useClientsStore";
import { useProjectsStore } from "@/erp/stores/useProjectsStore";
import { useDocumentsStore } from "@/erp/stores/useDocumentsStore";
import { useMaterialsStore } from "@/erp/stores/useMaterialsStore";
import { useEmployeesStore } from "@/erp/stores/useEmployeesStore";
import { useActivityStore, getEntityActivities } from "@/erp/stores/useActivityStore";
import { inrCompact, inr, dateShort } from "@/erp/lib/format";
import styles from "./client-management.module.css";

const TABS = ["Leads", "Clients", "Projects", "Documents", "Inventory"];
const LEAD_SOURCES = ["Instagram", "Referral", "Website", "Meta Ads", "WhatsApp", "Google Ads"];
const CLIENT_TYPES = ["Residential", "Commercial", "Hospitality"];
const DOC_TYPES = ["Quotation", "Agreement", "Drawing", "BOQ", "Invoice", "Other"];
const MAT_STATUSES = ["Ordered", "Delivered", "In Use"];

const today = () => new Date().toISOString().slice(0, 10);

function scoreClass(n) {
  if (n >= 80) return styles.scoreHot;
  if (n >= 60) return styles.scoreWarm;
  return styles.scoreCold;
}
function scoreFillClass(n) {
  if (n >= 80) return styles.scoreBarHot;
  if (n >= 60) return styles.scoreBarWarm;
  return styles.scoreBarCold;
}
function healthFill(h) {
  if (h === "on-track") return styles.fillGreen;
  if (h === "at-risk")  return styles.fillAmber;
  return styles.fillRed;
}

function Stars({ n }) {
  return (
    <span className={styles.stars}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={11} fill={i < n ? "currentColor" : "none"} />
      ))}
    </span>
  );
}

function MiniBar({ value, fill = styles.fillGold }) {
  return (
    <span className={styles.miniBar}>
      <span className={styles.miniBarTrack}>
        <span className={`${styles.miniBarFill} ${fill}`} style={{ width: `${Math.min(100, value || 0)}%` }} />
      </span>
      <span className={styles.pctLabel}>{Math.round(value || 0)}%</span>
    </span>
  );
}

// ─── Activity Log ────────────────────────────────────────────────
function ActivityLog({ entityType, entityId }) {
  const activities = useActivityStore((s) => s.activities);
  const addActivity = useActivityStore((s) => s.addActivity);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const list = useMemo(
    () => getEntityActivities(activities, entityType, entityId),
    [activities, entityType, entityId]
  );

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    setSaving(true);
    await addActivity({ entityType, entityId, type: "note", content: note.trim(), author: "You" });
    setNote("");
    setSaving(false);
  };

  const TYPE_LABELS = { note: "Note", call: "Call", whatsapp: "WhatsApp", email: "Email", meeting: "Meeting", stage_change: "Stage" };

  return (
    <div>
      {list.length === 0 ? (
        <p className={styles.noActivity}>No activity logged yet.</p>
      ) : (
        <div className={styles.activityList}>
          {list.map((a) => (
            <div key={a.id} className={styles.activityItem}>
              <span className={styles.actDot} />
              <div className={styles.actContent}>
                <p className={styles.actText}>{a.content}</p>
                <span className={styles.actMeta}>
                  {TYPE_LABELS[a.type] || a.type} · {a.author || "System"} · {dateShort(a.createdAt?.slice(0, 10) || today())}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      <form className={styles.noteForm} onSubmit={handleAddNote}>
        <textarea
          className={styles.noteInput}
          placeholder="Add a note, log a call…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
        />
        <Btn type="submit" variant="ghost" disabled={!note.trim() || saving}>
          {saving ? "Saving…" : "Log note"}
        </Btn>
      </form>
    </div>
  );
}

// ─── Lead Form ───────────────────────────────────────────────────
function LeadForm({ initial, onSubmit, onCancel, submitLabel = "Save", employees = [] }) {
  const [v, setV] = useState(() => ({
    name: initial?.name ?? "",
    phone: initial?.phone ?? "",
    email: initial?.email ?? "",
    location: initial?.location ?? "",
    requirement: initial?.requirement ?? "",
    propertyType: initial?.propertyType ?? "",
    style: initial?.style ?? "",
    source: initial?.source ?? LEAD_SOURCES[0],
    timeline: initial?.timeline ?? "",
    stage: initial?.stage ?? leadStages[0],
    value: initial?.value ?? "",
    score: initial?.score ?? "",
    owner: initial?.owner ?? (employees[0]?.id || ""),
  }));
  const set = (k) => (e) => setV((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!v.name.trim()) return;
    onSubmit({ ...v, name: v.name.trim(), value: v.value === "" ? 0 : Number(v.value), score: v.score === "" ? 0 : Number(v.score) });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.formRow}>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Name *</label>
          <input className={styles.formInput} value={v.name} onChange={set("name")} required autoFocus />
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Phone</label>
          <input className={styles.formInput} value={v.phone} onChange={set("phone")} />
        </div>
      </div>
      <div className={styles.formRow}>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Email</label>
          <input type="email" className={styles.formInput} value={v.email} onChange={set("email")} />
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Location</label>
          <input className={styles.formInput} placeholder="Area, City" value={v.location} onChange={set("location")} />
        </div>
      </div>
      <div className={styles.formRow}>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Requirement</label>
          <input className={styles.formInput} placeholder="Full Interior" value={v.requirement} onChange={set("requirement")} />
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Property Type</label>
          <input className={styles.formInput} value={v.propertyType} onChange={set("propertyType")} />
        </div>
      </div>
      <div className={styles.formRow}>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Source</label>
          <select className={styles.formInput} value={v.source} onChange={set("source")}>
            {LEAD_SOURCES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Stage</label>
          <select className={styles.formInput} value={v.stage} onChange={set("stage")}>
            {leadStages.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div className={styles.formRow}>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Value (₹)</label>
          <input type="number" min="0" className={styles.formInput} value={v.value} onChange={set("value")} />
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Score (0–100)</label>
          <input type="number" min="0" max="100" className={styles.formInput} value={v.score} onChange={set("score")} />
        </div>
      </div>
      <div className={styles.formRow}>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Timeline</label>
          <input className={styles.formInput} placeholder="3 months" value={v.timeline} onChange={set("timeline")} />
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Style</label>
          <input className={styles.formInput} value={v.style} onChange={set("style")} />
        </div>
      </div>
      {employees.length > 0 && (
        <div className={styles.formField}>
          <label className={styles.formLabel}>Owner</label>
          <select className={styles.formInput} value={v.owner} onChange={set("owner")}>
            {employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </div>
      )}
      <div className={styles.formActions}>
        <Btn type="button" variant="ghost" onClick={onCancel}>Cancel</Btn>
        <Btn type="submit" variant="primary">{submitLabel}</Btn>
      </div>
    </form>
  );
}

// ─── Client Form ─────────────────────────────────────────────────
function ClientForm({ initial, onSubmit, onCancel, submitLabel = "Save" }) {
  const [v, setV] = useState(() => ({
    name: initial?.name ?? "",
    company: initial?.company ?? "",
    type: initial?.type ?? CLIENT_TYPES[0],
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    gst: initial?.gst ?? "—",
    pan: initial?.pan ?? "",
    billing: initial?.billing ?? "",
    site: initial?.site ?? "",
    decisionMaker: initial?.decisionMaker ?? "",
    budgetFlex: initial?.budgetFlex ?? "Medium",
    rating: initial?.rating ?? 4,
    style: initial?.style ?? "",
    lifetimeValue: initial?.lifetimeValue ?? "",
    since: initial?.since ?? today(),
    status: initial?.status ?? "Active",
  }));
  const set = (k) => (e) => setV((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!v.name.trim() || !v.company.trim()) return;
    const company = v.company.trim();
    const words = company.split(/\s+/);
    const initials = words.length === 1 ? words[0].slice(0, 2).toUpperCase() : (words[0][0] + words[1][0]).toUpperCase();
    onSubmit({ ...v, name: v.name.trim(), company, initials: initial?.initials || initials, rating: Number(v.rating), lifetimeValue: v.lifetimeValue === "" ? 0 : Number(v.lifetimeValue) });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.formRow}>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Contact Name *</label>
          <input className={styles.formInput} value={v.name} onChange={set("name")} required autoFocus />
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Company *</label>
          <input className={styles.formInput} value={v.company} onChange={set("company")} required />
        </div>
      </div>
      <div className={styles.formRow}>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Type</label>
          <select className={styles.formInput} value={v.type} onChange={set("type")}>
            {CLIENT_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Status</label>
          <select className={styles.formInput} value={v.status} onChange={set("status")}>
            {["Active", "Inactive", "Archived"].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div className={styles.formRow}>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Email</label>
          <input type="email" className={styles.formInput} value={v.email} onChange={set("email")} />
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Phone</label>
          <input type="tel" className={styles.formInput} value={v.phone} onChange={set("phone")} />
        </div>
      </div>
      <div className={styles.formRow}>
        <div className={styles.formField}>
          <label className={styles.formLabel}>GST</label>
          <input className={styles.formInput} value={v.gst} onChange={set("gst")} />
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>PAN</label>
          <input className={styles.formInput} value={v.pan} onChange={set("pan")} />
        </div>
      </div>
      <div className={styles.formField}>
        <label className={styles.formLabel}>Billing Address</label>
        <input className={styles.formInput} value={v.billing} onChange={set("billing")} />
      </div>
      <div className={styles.formField}>
        <label className={styles.formLabel}>Site Address</label>
        <input className={styles.formInput} value={v.site} onChange={set("site")} />
      </div>
      <div className={styles.formRow}>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Decision Maker</label>
          <input className={styles.formInput} value={v.decisionMaker} onChange={set("decisionMaker")} />
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Budget Flex</label>
          <select className={styles.formInput} value={v.budgetFlex} onChange={set("budgetFlex")}>
            {["Low", "Medium", "High"].map((b) => <option key={b}>{b}</option>)}
          </select>
        </div>
      </div>
      <div className={styles.formRow}>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Rating (1–5)</label>
          <input type="number" min="1" max="5" className={styles.formInput} value={v.rating} onChange={set("rating")} />
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Preferred Style</label>
          <input className={styles.formInput} value={v.style} onChange={set("style")} />
        </div>
      </div>
      <div className={styles.formRow}>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Lifetime Value (₹)</label>
          <input type="number" min="0" className={styles.formInput} value={v.lifetimeValue} onChange={set("lifetimeValue")} />
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Client Since</label>
          <input type="date" className={styles.formInput} value={v.since} onChange={set("since")} />
        </div>
      </div>
      <div className={styles.formActions}>
        <Btn type="button" variant="ghost" onClick={onCancel}>Cancel</Btn>
        <Btn type="submit" variant="primary">{submitLabel}</Btn>
      </div>
    </form>
  );
}

// ─── Main Page ───────────────────────────────────────────────────
export default function ClientManagement() {
  const [activeTab, setActiveTab] = useState("Leads");
  const [selectedId, setSelectedId] = useState(null);
  const [view, setView] = useState("table");
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [docTypeFilter, setDocTypeFilter] = useState("All");
  const [matStatusFilter, setMatStatusFilter] = useState("All");
  const [healthFilter, setHealthFilter] = useState("All");
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Stores
  const leads = useLeadsStore((s) => s.leads);
  const addLead = useLeadsStore((s) => s.addLead);
  const updateLead = useLeadsStore((s) => s.updateLead);
  const removeLead = useLeadsStore((s) => s.removeLead);

  const clients = useClientsStore((s) => s.clients);
  const addClient = useClientsStore((s) => s.addClient);
  const updateClient = useClientsStore((s) => s.updateClient);
  const removeClient = useClientsStore((s) => s.removeClient);

  const projects = useProjectsStore((s) => s.projects);
  const documents = useDocumentsStore((s) => s.documents);
  const materials = useMaterialsStore((s) => s.materials);
  const employees = useEmployeesStore((s) => s.employees);

  const addActivity = useActivityStore((s) => s.addActivity);

  const hydrateLeads = useLeadsStore((s) => s.hydrate);
  const hydrateClients = useClientsStore((s) => s.hydrate);
  const hydrateProjects = useProjectsStore((s) => s.hydrate);
  const hydrateDocuments = useDocumentsStore((s) => s.hydrate);
  const hydrateMaterials = useMaterialsStore((s) => s.hydrate);
  const hydrateEmployees = useEmployeesStore((s) => s.hydrate);
  const hydrateActivities = useActivityStore((s) => s.hydrate);

  useEffect(() => {
    hydrateLeads(); hydrateClients(); hydrateProjects();
    hydrateDocuments(); hydrateMaterials(); hydrateEmployees(); hydrateActivities();
  }, [hydrateLeads, hydrateClients, hydrateProjects, hydrateDocuments, hydrateMaterials, hydrateEmployees, hydrateActivities]);

  // Reset selection on tab change
  useEffect(() => { setSelectedId(null); setSearch(""); setStageFilter("All"); setTypeFilter("All"); }, [activeTab]);

  // ── Computed values ────────────────────────
  const filteredLeads = useMemo(() => {
    let out = leads;
    if (stageFilter !== "All") out = out.filter((l) => l.stage === stageFilter);
    if (search) out = out.filter((l) => [l.name, l.requirement, l.location, l.source].join(" ").toLowerCase().includes(search.toLowerCase()));
    return out;
  }, [leads, stageFilter, search]);

  const filteredClients = useMemo(() => {
    let out = clients;
    if (typeFilter !== "All") out = out.filter((c) => c.type === typeFilter);
    if (search) out = out.filter((c) => [c.company, c.name, c.email, c.phone].join(" ").toLowerCase().includes(search.toLowerCase()));
    return out;
  }, [clients, typeFilter, search]);

  const filteredProjects = useMemo(() => {
    let out = projects;
    if (healthFilter !== "All") out = out.filter((p) => p.health === healthFilter);
    if (search) out = out.filter((p) => [p.name, p.code, p.location].join(" ").toLowerCase().includes(search.toLowerCase()));
    return out;
  }, [projects, healthFilter, search]);

  const filteredDocs = useMemo(() => {
    let out = documents;
    if (docTypeFilter !== "All") out = out.filter((d) => d.type === docTypeFilter);
    if (search) out = out.filter((d) => (d.title || "").toLowerCase().includes(search.toLowerCase()));
    return out;
  }, [documents, docTypeFilter, search]);

  const filteredMaterials = useMemo(() => {
    let out = materials;
    if (matStatusFilter !== "All") out = out.filter((m) => m.status === matStatusFilter);
    if (search) out = out.filter((m) => [m.name, m.category, m.vendor].join(" ").toLowerCase().includes(search.toLowerCase()));
    return out;
  }, [materials, matStatusFilter, search]);

  // ── KPI computations ───────────────────────
  const leadKpis = useMemo(() => {
    const active = leads.filter((l) => !["Won", "Lost"].includes(l.stage));
    const closedDecided = leads.filter((l) => ["Won", "Lost"].includes(l.stage));
    const won = leads.filter((l) => l.stage === "Won");
    return {
      pipeline: active.reduce((s, l) => s + (Number(l.value) || 0), 0),
      winRate: closedDecided.length ? Math.round((won.length / closedDecided.length) * 100) : 0,
      open: active.length,
      hot: leads.filter((l) => (Number(l.score) || 0) >= 80).length,
    };
  }, [leads]);

  const clientKpis = useMemo(() => ({
    total: clients.length,
    active: clients.filter((c) => c.status === "Active").length,
    ltv: clients.reduce((s, c) => s + (Number(c.lifetimeValue) || 0), 0),
    avgRating: clients.length ? (clients.reduce((s, c) => s + (Number(c.rating) || 0), 0) / clients.length).toFixed(1) : "—",
  }), [clients]);

  const projectKpis = useMemo(() => ({
    total: projects.length,
    onTrack: projects.filter((p) => p.health === "on-track").length,
    atRisk: projects.filter((p) => ["at-risk", "delayed"].includes(p.health)).length,
    value: projects.reduce((s, p) => s + (Number(p.budget) || 0), 0),
  }), [projects]);

  // ── Actions ────────────────────────────────
  const handleConvertToClient = useCallback(async (lead) => {
    await addClient({
      name: lead.name,
      company: lead.name,
      type: "Residential",
      phone: lead.phone || "",
      email: lead.email || "",
      since: today(),
      lifetimeValue: Number(lead.value) || 0,
      status: "Active",
      rating: 3,
      style: lead.style || "",
      budgetFlex: "Medium",
      billing: lead.location || "",
      site: lead.location || "",
      decisionMaker: lead.name,
      pan: "",
      gst: "—",
      projects: [],
    });
    await updateLead(lead.id, { stage: "Won", lastTouch: today() });
    await addActivity({ entityType: "lead", entityId: lead.id, type: "stage_change", content: `Converted to client`, author: "You" });
    setSelectedId(null);
  }, [addClient, updateLead, addActivity]);

  const handleDeleteLead = useCallback(async (id) => {
    await removeLead(id);
    if (selectedId === id) setSelectedId(null);
    setDeleteConfirmId(null);
  }, [removeLead, selectedId]);

  const handleDeleteClient = useCallback(async (id) => {
    await removeClient(id);
    if (selectedId === id) setSelectedId(null);
    setDeleteConfirmId(null);
  }, [removeClient, selectedId]);

  // ── Selected items ─────────────────────────
  const selectedLead    = activeTab === "Leads"     ? leads.find((l) => l.id === selectedId)      : null;
  const selectedClient  = activeTab === "Clients"   ? clients.find((c) => c.id === selectedId)    : null;
  const selectedProject = activeTab === "Projects"  ? projects.find((p) => p.id === selectedId)   : null;
  const selectedDoc     = activeTab === "Documents" ? documents.find((d) => d.id === selectedId)  : null;
  const selectedMat     = activeTab === "Inventory" ? materials.find((m) => m.id === selectedId)  : null;
  const hasPanel = !!(selectedLead || selectedClient || selectedProject || selectedDoc || selectedMat);

  // ── Renders ────────────────────────────────
  const renderLeadsKpiBar = () => (
    <div className={styles.kpiBar}>
      <div className={styles.kpiStat}><span className={styles.kpiLabel}>Open Pipeline</span><span className={`${styles.kpiValue} ${styles.kpiMono} ${styles.kpiGold}`}>{inrCompact(leadKpis.pipeline)}</span></div>
      <div className={styles.kpiStat}><span className={styles.kpiLabel}>Win Rate</span><span className={`${styles.kpiValue} ${styles.kpiGreen}`}>{leadKpis.winRate}%</span></div>
      <div className={styles.kpiStat}><span className={styles.kpiLabel}>Open Leads</span><span className={styles.kpiValue}>{leadKpis.open}</span></div>
      <div className={styles.kpiStat}><span className={styles.kpiLabel}>Hot Leads</span><span className={`${styles.kpiValue} ${styles.kpiGold}`}>{leadKpis.hot}</span></div>
    </div>
  );

  const renderLeadsToolbar = () => (
    <div className={styles.toolbar}>
      <div style={{ position: "relative" }}>
        <input className={styles.search} placeholder="Search leads…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      {["All", ...leadStages.slice(0, 6)].map((s) => (
        <button key={s} className={`${styles.chip} ${stageFilter === s ? styles.chipActive : ""}`} onClick={() => setStageFilter(s)}>{s}</button>
      ))}
      <div className={styles.viewToggle}>
        <button className={`${styles.vtBtn} ${view === "table" ? styles.vtBtnActive : ""}`} onClick={() => setView("table")}><List size={14} /> Table</button>
        <button className={`${styles.vtBtn} ${view === "kanban" ? styles.vtBtnActive : ""}`} onClick={() => setView("kanban")}><LayoutGrid size={14} /> Board</button>
      </div>
      <Btn icon={Plus} variant="primary" onClick={() => { setCreating(true); }}>New Lead</Btn>
    </div>
  );

  const renderLeadsTable = () => (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Name</th>
            <th className={styles.th}>Requirement</th>
            <th className={styles.th}>Source</th>
            <th className={`${styles.th} ${styles.thR}`}>Value</th>
            <th className={`${styles.th} ${styles.thR}`}>Score</th>
            <th className={styles.th}>Stage</th>
            <th className={styles.th}>Last Touch</th>
            <th className={styles.th} />
          </tr>
        </thead>
        <tbody>
          {filteredLeads.length === 0 && (
            <tr><td colSpan={8} className={styles.td}><div className={styles.emptyState}><strong>No leads yet</strong><span>Add your first lead to get started</span></div></td></tr>
          )}
          {filteredLeads.map((l) => (
            <tr key={l.id} className={`${styles.tr} ${selectedId === l.id ? styles.trSelected : ""}`} onClick={() => { setSelectedId(l.id); setEditingId(null); }}>
              <td className={styles.td}>
                <div className={styles.rowBorder} />
                <span className={styles.tdPrimary}>{l.name}</span>
                {l.phone && <span className={styles.tdSub}>{l.phone}</span>}
              </td>
              <td className={styles.td}>{l.requirement || "—"}</td>
              <td className={styles.td}><Tag>{l.source}</Tag></td>
              <td className={`${styles.td} ${styles.tdMono} ${styles.tdR}`}>{l.value ? inrCompact(l.value) : "—"}</td>
              <td className={`${styles.td} ${styles.tdR}`}><span className={`${styles.scoreNum} ${scoreClass(l.score)}`}>{l.score ?? "—"}</span></td>
              <td className={styles.td}><Badge>{l.stage}</Badge></td>
              <td className={styles.td}>{l.lastTouch ? dateShort(l.lastTouch) : "—"}</td>
              <td className={`${styles.td} ${styles.tdR}`}>
                <div className={styles.tdActions}>
                  <button className={styles.actionBtn} onClick={(e) => { e.stopPropagation(); setSelectedId(l.id); setEditingId(l.id); }} title="Edit"><Pencil size={13} /></button>
                  <button className={`${styles.actionBtn} ${styles.actionBtnDanger}`} onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(l.id); setSelectedId(l.id); }} title="Delete"><Trash2 size={13} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderKanban = () => (
    <div className={styles.kanban}>
      {leadStages.map((stage) => {
        const cols = filteredLeads.filter((l) => l.stage === stage);
        const total = cols.reduce((s, l) => s + (Number(l.value) || 0), 0);
        return (
          <div key={stage} className={styles.kanbanCol}>
            <div className={styles.kanbanColHead}>
              <span className={styles.kanbanColTitle}>{stage}</span>
              <span className={styles.kanbanColMeta}>{cols.length} · {total ? inrCompact(total) : "—"}</span>
            </div>
            <div className={styles.kanbanCards}>
              {cols.length === 0 && <span className={styles.kanbanEmpty}>Empty</span>}
              {cols.map((l) => (
                <div key={l.id} className={styles.kanbanCard} onClick={() => { setSelectedId(l.id); setEditingId(null); }}>
                  <div className={styles.cardName}>{l.name}</div>
                  <div className={styles.cardReq}>{l.requirement}</div>
                  <div className={styles.cardFoot}>
                    <Tag>{l.source}</Tag>
                    <span className={styles.cardVal}>{l.value ? inrCompact(l.value) : "—"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderLeadDetail = () => {
    const lead = selectedLead;
    if (!lead) return null;
    if (editingId === lead.id) {
      return (
        <div className={styles.detailPanel}>
          <div className={styles.dpHead}>
            <span className={styles.dpName}>Edit Lead</span>
            <button className={styles.dpCloseBtn} onClick={() => setEditingId(null)}><X size={14} /></button>
          </div>
          <div className={styles.dpSection}>
            <LeadForm
              initial={lead}
              submitLabel="Save changes"
              employees={employees}
              onSubmit={async (vals) => { await updateLead(lead.id, { ...vals, lastTouch: today() }); setEditingId(null); }}
              onCancel={() => setEditingId(null)}
            />
          </div>
        </div>
      );
    }
    return (
      <div className={styles.detailPanel}>
        <div className={styles.dpHead}>
          <div>
            <div className={styles.dpName}>{lead.name}</div>
            <div className={styles.dpSub}>{lead.location}</div>
          </div>
          <button className={styles.dpCloseBtn} onClick={() => setSelectedId(null)}><X size={14} /></button>
        </div>

        <div className={styles.dpSection}>
          <div className={styles.dpSectionTitle}>Score & Stage</div>
          <div style={{ marginBottom: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.35rem" }}>
              <span className={`${styles.scoreNum} ${scoreClass(lead.score)}`}>{lead.score ?? 0}/100</span>
              <select className={styles.stageSelect} value={lead.stage} onChange={(e) => updateLead(lead.id, { stage: e.target.value, lastTouch: today() })}>
                {leadStages.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className={styles.scoreBarTrack}>
              <div className={`${styles.scoreBarFill} ${scoreFillClass(lead.score)}`} style={{ width: `${lead.score || 0}%` }} />
            </div>
          </div>
        </div>

        <div className={styles.dpSection}>
          <div className={styles.dpSectionTitle}>Details</div>
          <div className={styles.dpGrid}>
            <div className={styles.dpField}><span className={styles.dpFieldLabel}>Value</span><span className={styles.dpFieldMono}>{lead.value ? inr(lead.value) : "—"}</span></div>
            <div className={styles.dpField}><span className={styles.dpFieldLabel}>Timeline</span><span className={styles.dpFieldValue}>{lead.timeline || "—"}</span></div>
            <div className={styles.dpField}><span className={styles.dpFieldLabel}>Source</span><span className={styles.dpFieldValue}>{lead.source}</span></div>
            <div className={styles.dpField}><span className={styles.dpFieldLabel}>Property</span><span className={styles.dpFieldValue}>{lead.propertyType || "—"}</span></div>
            <div className={styles.dpField}><span className={styles.dpFieldLabel}>Style</span><span className={styles.dpFieldValue}>{lead.style || "—"}</span></div>
            <div className={styles.dpField}><span className={styles.dpFieldLabel}>Requirement</span><span className={styles.dpFieldValue}>{lead.requirement || "—"}</span></div>
          </div>
        </div>

        <div className={styles.dpSection}>
          <div className={styles.dpSectionTitle}>Contact</div>
          <div className={styles.contactRow}>
            {lead.phone && <div className={styles.contactItem}><Phone size={13} className={styles.contactIcon} /><a href={`tel:${lead.phone}`}>{lead.phone}</a></div>}
            {lead.email && <div className={styles.contactItem}><Mail size={13} className={styles.contactIcon} /><a href={`mailto:${lead.email}`}>{lead.email}</a></div>}
            {lead.location && <div className={styles.contactItem}><MapPin size={13} className={styles.contactIcon} />{lead.location}</div>}
          </div>
        </div>

        <div className={styles.dpSection}>
          <div className={styles.dpActions}>
            {lead.phone && (
              <a href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                <button className={styles.waBtnGreen}><MessageCircle size={14} /> WhatsApp</button>
              </a>
            )}
            <Btn variant="ghost" icon={Calendar}>Schedule</Btn>
            {lead.stage !== "Won" && (
              <button className={styles.convertBtn} onClick={() => handleConvertToClient(lead)}>
                <UserCheck size={13} /> Convert to Client
              </button>
            )}
          </div>
        </div>

        <div className={styles.dpSection}>
          <div className={styles.dpSectionTitle}>Quick Actions</div>
          <div className={styles.dpActions}>
            <Btn variant="ghost" icon={Pencil} onClick={() => setEditingId(lead.id)}>Edit</Btn>
            {deleteConfirmId === lead.id ? (
              <div className={styles.inlineConfirm}>
                <span>Delete?</span>
                <Btn variant="ghost" onClick={() => handleDeleteLead(lead.id)}>Yes</Btn>
                <Btn variant="ghost" onClick={() => setDeleteConfirmId(null)}>No</Btn>
              </div>
            ) : (
              <Btn variant="outline" icon={Trash2} onClick={() => setDeleteConfirmId(lead.id)}>Delete</Btn>
            )}
          </div>
        </div>

        <div className={styles.dpSection}>
          <div className={styles.dpSectionTitle}>Activity</div>
          <ActivityLog entityType="lead" entityId={lead.id} />
        </div>
      </div>
    );
  };

  const renderClientsTable = () => (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Company</th>
            <th className={styles.th}>Type</th>
            <th className={`${styles.th} ${styles.thR}`}>Lifetime Value</th>
            <th className={styles.th}>Rating</th>
            <th className={styles.th}>Status</th>
            <th className={styles.th}>Since</th>
            <th className={styles.th} />
          </tr>
        </thead>
        <tbody>
          {filteredClients.length === 0 && (
            <tr><td colSpan={7} className={styles.td}><div className={styles.emptyState}><strong>No clients yet</strong><span>Convert a lead or add a client directly</span></div></td></tr>
          )}
          {filteredClients.map((c) => (
            <tr key={c.id} className={`${styles.tr} ${selectedId === c.id ? styles.trSelected : ""}`} onClick={() => { setSelectedId(c.id); setEditingId(null); }}>
              <td className={styles.td}>
                <div className={styles.rowBorder} />
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <Avatar name={c.company} initials={c.initials} size={28} tone="gold" />
                  <div>
                    <span className={styles.tdPrimary}>{c.company}</span>
                    <span className={styles.tdSub}>{c.name}</span>
                  </div>
                </div>
              </td>
              <td className={styles.td}><Tag>{c.type}</Tag></td>
              <td className={`${styles.td} ${styles.tdMono} ${styles.tdR}`}>{c.lifetimeValue ? inrCompact(c.lifetimeValue) : "—"}</td>
              <td className={styles.td}><Stars n={c.rating} /></td>
              <td className={styles.td}><Badge>{c.status || "Active"}</Badge></td>
              <td className={styles.td}>{c.since ? dateShort(c.since) : "—"}</td>
              <td className={`${styles.td} ${styles.tdR}`}>
                <div className={styles.tdActions}>
                  <button className={styles.actionBtn} onClick={(e) => { e.stopPropagation(); setSelectedId(c.id); setEditingId(c.id); }} title="Edit"><Pencil size={13} /></button>
                  <button className={`${styles.actionBtn} ${styles.actionBtnDanger}`} onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(c.id); setSelectedId(c.id); }} title="Delete"><Trash2 size={13} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderClientDetail = () => {
    const client = selectedClient;
    if (!client) return null;
    const linkedProjects = projects.filter((p) => p.clientId === client.id);
    if (editingId === client.id) {
      return (
        <div className={styles.detailPanel}>
          <div className={styles.dpHead}>
            <span className={styles.dpName}>Edit Client</span>
            <button className={styles.dpCloseBtn} onClick={() => setEditingId(null)}><X size={14} /></button>
          </div>
          <div className={styles.dpSection}>
            <ClientForm initial={client} submitLabel="Save changes"
              onSubmit={async (vals) => { await updateClient(client.id, vals); setEditingId(null); }}
              onCancel={() => setEditingId(null)} />
          </div>
        </div>
      );
    }
    return (
      <div className={styles.detailPanel}>
        <div className={styles.dpHead}>
          <div>
            <div className={styles.dpName}>{client.company}</div>
            <div className={styles.dpSub}>{client.name} · <Stars n={client.rating} /></div>
          </div>
          <button className={styles.dpCloseBtn} onClick={() => setSelectedId(null)}><X size={14} /></button>
        </div>

        <div className={styles.dpSection}>
          <div className={styles.dpSectionTitle}>Contact</div>
          <div className={styles.contactRow}>
            {client.phone && <div className={styles.contactItem}><Phone size={13} className={styles.contactIcon} /><a href={`tel:${client.phone}`}>{client.phone}</a></div>}
            {client.email && <div className={styles.contactItem}><Mail size={13} className={styles.contactIcon} /><a href={`mailto:${client.email}`}>{client.email}</a></div>}
          </div>
        </div>

        <div className={styles.dpSection}>
          <div className={styles.dpSectionTitle}>KYC & Compliance</div>
          <div className={styles.dpGrid}>
            <div className={styles.dpField}><span className={styles.dpFieldLabel}>GST</span><span className={styles.dpFieldMono}>{client.gst}</span></div>
            <div className={styles.dpField}><span className={styles.dpFieldLabel}>PAN</span><span className={styles.dpFieldMono}>{client.pan || "—"}</span></div>
            <div className={styles.dpField}><span className={styles.dpFieldLabel}>Budget Flex</span><span className={styles.dpFieldValue}>{client.budgetFlex}</span></div>
            <div className={styles.dpField}><span className={styles.dpFieldLabel}>Since</span><span className={styles.dpFieldValue}>{client.since ? dateShort(client.since) : "—"}</span></div>
          </div>
          {client.billing && <div style={{ marginTop: "0.6rem", fontSize: "0.8rem", color: "var(--erp-text-2)" }}><MapPin size={12} style={{ display: "inline", marginRight: 4 }} /><strong>Billing:</strong> {client.billing}</div>}
          {client.site && <div style={{ marginTop: "0.3rem", fontSize: "0.8rem", color: "var(--erp-text-2)" }}><MapPin size={12} style={{ display: "inline", marginRight: 4 }} /><strong>Site:</strong> {client.site}</div>}
        </div>

        {linkedProjects.length > 0 && (
          <div className={styles.dpSection}>
            <div className={styles.dpSectionTitle}>Projects ({linkedProjects.length})</div>
            {linkedProjects.map((p) => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.5rem 0", borderBottom: "1px solid var(--erp-border)" }}>
                <FolderKanban size={14} style={{ color: "var(--erp-gold)", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.84rem", fontWeight: 600, color: "var(--erp-text)" }}>{p.name}</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--erp-text-3)" }}>{p.code} · <Badge>{p.stage}</Badge></div>
                </div>
                <span style={{ fontFamily: "var(--erp-font-mono)", fontSize: "0.82rem" }}>{p.budget ? inrCompact(p.budget) : "—"}</span>
              </div>
            ))}
          </div>
        )}

        <div className={styles.dpSection}>
          <div className={styles.dpActions}>
            <Btn variant="ghost" icon={Pencil} onClick={() => setEditingId(client.id)}>Edit</Btn>
            {deleteConfirmId === client.id ? (
              <div className={styles.inlineConfirm}>
                <span>Delete?</span>
                <Btn variant="ghost" onClick={() => handleDeleteClient(client.id)}>Yes</Btn>
                <Btn variant="ghost" onClick={() => setDeleteConfirmId(null)}>No</Btn>
              </div>
            ) : (
              <Btn variant="outline" icon={Trash2} onClick={() => setDeleteConfirmId(client.id)}>Delete</Btn>
            )}
          </div>
        </div>

        <div className={styles.dpSection}>
          <div className={styles.dpSectionTitle}>Activity</div>
          <ActivityLog entityType="client" entityId={client.id} />
        </div>
      </div>
    );
  };

  const renderProjectsTable = () => (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Project</th>
            <th className={styles.th}>Client</th>
            <th className={styles.th}>Stage</th>
            <th className={styles.th}>Health</th>
            <th className={styles.th}>Progress</th>
            <th className={`${styles.th} ${styles.thR}`}>Budget</th>
          </tr>
        </thead>
        <tbody>
          {filteredProjects.length === 0 && (
            <tr><td colSpan={6} className={styles.td}><div className={styles.emptyState}><strong>No projects yet</strong></div></td></tr>
          )}
          {filteredProjects.map((p) => {
            const client = clients.find((c) => c.id === p.clientId);
            return (
              <tr key={p.id} className={`${styles.tr} ${selectedId === p.id ? styles.trSelected : ""}`} onClick={() => setSelectedId(p.id)}>
                <td className={styles.td}>
                  <div className={styles.rowBorder} />
                  <span className={styles.tdPrimary}>{p.name}</span>
                  <span className={styles.tdSub}>{p.code}</span>
                </td>
                <td className={styles.td}>{client?.company || "—"}</td>
                <td className={styles.td}><Badge>{p.stage}</Badge></td>
                <td className={styles.td}><Badge>{p.health || "on-track"}</Badge></td>
                <td className={styles.td}><MiniBar value={p.progress} fill={healthFill(p.health)} /></td>
                <td className={`${styles.td} ${styles.tdMono} ${styles.tdR}`}>{p.budget ? inrCompact(p.budget) : "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const renderProjectDetail = () => {
    const proj = selectedProject;
    if (!proj) return null;
    const client = clients.find((c) => c.id === proj.clientId);
    return (
      <div className={styles.detailPanel}>
        <div className={styles.dpHead}>
          <div>
            <div className={styles.dpName}>{proj.name}</div>
            <div className={styles.dpSub}>{proj.code}{client ? ` · ${client.company}` : ""}</div>
          </div>
          <button className={styles.dpCloseBtn} onClick={() => setSelectedId(null)}><X size={14} /></button>
        </div>
        <div className={styles.dpSection}>
          <div className={styles.dpSectionTitle}>Progress</div>
          <MiniBar value={proj.progress} fill={healthFill(proj.health)} />
          <div className={styles.dpGrid} style={{ marginTop: "0.85rem" }}>
            <div className={styles.dpField}><span className={styles.dpFieldLabel}>Budget</span><span className={styles.dpFieldMono}>{proj.budget ? inr(proj.budget) : "—"}</span></div>
            <div className={styles.dpField}><span className={styles.dpFieldLabel}>Margin</span><span className={styles.dpFieldMono}>{proj.margin ?? "—"}%</span></div>
            <div className={styles.dpField}><span className={styles.dpFieldLabel}>Stage</span><span className={styles.dpFieldValue}>{proj.stage}</span></div>
            <div className={styles.dpField}><span className={styles.dpFieldLabel}>Health</span><span className={styles.dpFieldValue}><Badge>{proj.health || "on-track"}</Badge></span></div>
            <div className={styles.dpField}><span className={styles.dpFieldLabel}>Start</span><span className={styles.dpFieldValue}>{proj.startDate ? dateShort(proj.startDate) : "—"}</span></div>
            <div className={styles.dpField}><span className={styles.dpFieldLabel}>End</span><span className={styles.dpFieldValue}>{proj.endDate ? dateShort(proj.endDate) : "—"}</span></div>
          </div>
        </div>
      </div>
    );
  };

  const renderDocsTable = () => (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Title</th>
            <th className={styles.th}>Type</th>
            <th className={styles.th}>Status</th>
            <th className={styles.th}>Created</th>
          </tr>
        </thead>
        <tbody>
          {filteredDocs.length === 0 && (
            <tr><td colSpan={4} className={styles.td}><div className={styles.emptyState}><strong>No documents yet</strong></div></td></tr>
          )}
          {filteredDocs.map((d) => (
            <tr key={d.id} className={`${styles.tr} ${selectedId === d.id ? styles.trSelected : ""}`} onClick={() => setSelectedId(d.id)}>
              <td className={styles.td}><div className={styles.rowBorder} /><span className={styles.tdPrimary}>{d.title || "Untitled"}</span></td>
              <td className={styles.td}><Tag>{d.type}</Tag></td>
              <td className={styles.td}><Badge>{d.status || "Draft"}</Badge></td>
              <td className={styles.td}>{d.createdAt ? dateShort(d.createdAt.slice(0, 10)) : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderDocDetail = () => {
    const doc = selectedDoc;
    if (!doc) return null;
    return (
      <div className={styles.detailPanel}>
        <div className={styles.dpHead}>
          <div><div className={styles.dpName}>{doc.title || "Untitled"}</div><div className={styles.dpSub}><Tag>{doc.type}</Tag></div></div>
          <button className={styles.dpCloseBtn} onClick={() => setSelectedId(null)}><X size={14} /></button>
        </div>
        <div className={styles.dpSection}>
          <div style={{ background: "var(--erp-surface-2)", border: "1px solid var(--erp-border)", borderRadius: "var(--erp-r-sm)", height: 140, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--erp-text-3)" }}>
            <FileText size={32} />
          </div>
          <div className={styles.dpGrid} style={{ marginTop: "1rem" }}>
            <div className={styles.dpField}><span className={styles.dpFieldLabel}>Status</span><Badge>{doc.status || "Draft"}</Badge></div>
            <div className={styles.dpField}><span className={styles.dpFieldLabel}>Created</span><span className={styles.dpFieldValue}>{doc.createdAt ? dateShort(doc.createdAt.slice(0, 10)) : "—"}</span></div>
          </div>
        </div>
      </div>
    );
  };

  const renderInventoryTable = () => (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Material</th>
            <th className={styles.th}>Category</th>
            <th className={`${styles.th} ${styles.thR}`}>Qty</th>
            <th className={`${styles.th} ${styles.thR}`}>Unit Price</th>
            <th className={styles.th}>Status</th>
            <th className={styles.th}>Vendor</th>
          </tr>
        </thead>
        <tbody>
          {filteredMaterials.length === 0 && (
            <tr><td colSpan={6} className={styles.td}><div className={styles.emptyState}><strong>No materials yet</strong></div></td></tr>
          )}
          {filteredMaterials.map((m) => (
            <tr key={m.id} className={`${styles.tr} ${selectedId === m.id ? styles.trSelected : ""}`} onClick={() => setSelectedId(m.id)}>
              <td className={styles.td}><div className={styles.rowBorder} /><span className={styles.tdPrimary}>{m.name}</span></td>
              <td className={styles.td}><Tag>{m.category}</Tag></td>
              <td className={`${styles.td} ${styles.tdMono} ${styles.tdR}`}>{m.qty ?? "—"} {m.unit}</td>
              <td className={`${styles.td} ${styles.tdMono} ${styles.tdR}`}>{m.unitPrice ? inrCompact(m.unitPrice) : "—"}</td>
              <td className={styles.td}><Badge>{m.status}</Badge></td>
              <td className={styles.td}>{m.vendor || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderMatDetail = () => {
    const mat = selectedMat;
    if (!mat) return null;
    return (
      <div className={styles.detailPanel}>
        <div className={styles.dpHead}>
          <div><div className={styles.dpName}>{mat.name}</div><div className={styles.dpSub}><Tag>{mat.category}</Tag></div></div>
          <button className={styles.dpCloseBtn} onClick={() => setSelectedId(null)}><X size={14} /></button>
        </div>
        <div className={styles.dpSection}>
          <div className={styles.dpGrid}>
            <div className={styles.dpField}><span className={styles.dpFieldLabel}>Quantity</span><span className={styles.dpFieldMono}>{mat.qty} {mat.unit}</span></div>
            <div className={styles.dpField}><span className={styles.dpFieldLabel}>Unit Price</span><span className={styles.dpFieldMono}>{mat.unitPrice ? inr(mat.unitPrice) : "—"}</span></div>
            <div className={styles.dpField}><span className={styles.dpFieldLabel}>Total</span><span className={styles.dpFieldMono}>{mat.qty && mat.unitPrice ? inrCompact(mat.qty * mat.unitPrice) : "—"}</span></div>
            <div className={styles.dpField}><span className={styles.dpFieldLabel}>Status</span><Badge>{mat.status}</Badge></div>
          </div>
          {mat.vendor && <div style={{ marginTop: "0.6rem", fontSize: "0.82rem", color: "var(--erp-text-2)" }}>Vendor: <strong>{mat.vendor}</strong></div>}
        </div>
      </div>
    );
  };

  // ── Tab content renderer ───────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case "Leads":
        return (
          <>
            {renderLeadsKpiBar()}
            {renderLeadsToolbar()}
            <div className={styles.splitLayout}>
              {view === "table" ? renderLeadsTable() : <div className={styles.tableWrap}>{renderKanban()}</div>}
              <AnimatePresence>{hasPanel && renderLeadDetail()}</AnimatePresence>
            </div>
          </>
        );

      case "Clients":
        return (
          <>
            <div className={styles.kpiBar}>
              <div className={styles.kpiStat}><span className={styles.kpiLabel}>Total Clients</span><span className={styles.kpiValue}>{clientKpis.total}</span></div>
              <div className={styles.kpiStat}><span className={styles.kpiLabel}>Active</span><span className={`${styles.kpiValue} ${styles.kpiGreen}`}>{clientKpis.active}</span></div>
              <div className={styles.kpiStat}><span className={styles.kpiLabel}>Lifetime Value</span><span className={`${styles.kpiValue} ${styles.kpiMono} ${styles.kpiGold}`}>{inrCompact(clientKpis.ltv)}</span></div>
              <div className={styles.kpiStat}><span className={styles.kpiLabel}>Avg Rating</span><span className={styles.kpiValue}>{clientKpis.avgRating} ★</span></div>
            </div>
            <div className={styles.toolbar}>
              <input className={styles.search} placeholder="Search clients…" value={search} onChange={(e) => setSearch(e.target.value)} />
              {["All", ...CLIENT_TYPES].map((t) => (
                <button key={t} className={`${styles.chip} ${typeFilter === t ? styles.chipActive : ""}`} onClick={() => setTypeFilter(t)}>{t}</button>
              ))}
              <Btn icon={Plus} variant="primary" style={{ marginLeft: "auto" }} onClick={() => setCreating(true)}>New Client</Btn>
            </div>
            <div className={styles.splitLayout}>
              {renderClientsTable()}
              <AnimatePresence>{hasPanel && renderClientDetail()}</AnimatePresence>
            </div>
          </>
        );

      case "Projects":
        return (
          <>
            <div className={styles.kpiBar}>
              <div className={styles.kpiStat}><span className={styles.kpiLabel}>Total</span><span className={styles.kpiValue}>{projectKpis.total}</span></div>
              <div className={styles.kpiStat}><span className={styles.kpiLabel}>On Track</span><span className={`${styles.kpiValue} ${styles.kpiGreen}`}>{projectKpis.onTrack}</span></div>
              <div className={styles.kpiStat}><span className={styles.kpiLabel}>Needs Attention</span><span className={`${styles.kpiValue} ${styles.kpiWarn}`}>{projectKpis.atRisk}</span></div>
              <div className={styles.kpiStat}><span className={styles.kpiLabel}>Portfolio Value</span><span className={`${styles.kpiValue} ${styles.kpiMono} ${styles.kpiGold}`}>{inrCompact(projectKpis.value)}</span></div>
            </div>
            <div className={styles.toolbar}>
              <input className={styles.search} placeholder="Search projects…" value={search} onChange={(e) => setSearch(e.target.value)} />
              {["All", "on-track", "at-risk", "delayed"].map((h) => (
                <button key={h} className={`${styles.chip} ${healthFilter === h ? styles.chipActive : ""}`} onClick={() => setHealthFilter(h)}>{h === "All" ? "All" : h}</button>
              ))}
            </div>
            <div className={styles.splitLayout}>
              {renderProjectsTable()}
              <AnimatePresence>{hasPanel && renderProjectDetail()}</AnimatePresence>
            </div>
          </>
        );

      case "Documents":
        return (
          <>
            <div className={styles.kpiBar}>
              <div className={styles.kpiStat}><span className={styles.kpiLabel}>Total</span><span className={styles.kpiValue}>{documents.length}</span></div>
              {DOC_TYPES.map((t) => (
                <div key={t} className={styles.kpiStat}><span className={styles.kpiLabel}>{t}</span><span className={styles.kpiValue}>{documents.filter((d) => d.type === t).length}</span></div>
              ))}
            </div>
            <div className={styles.toolbar}>
              <input className={styles.search} placeholder="Search documents…" value={search} onChange={(e) => setSearch(e.target.value)} />
              {["All", ...DOC_TYPES].map((t) => (
                <button key={t} className={`${styles.chip} ${docTypeFilter === t ? styles.chipActive : ""}`} onClick={() => setDocTypeFilter(t)}>{t}</button>
              ))}
            </div>
            <div className={styles.splitLayout}>
              {renderDocsTable()}
              <AnimatePresence>{hasPanel && renderDocDetail()}</AnimatePresence>
            </div>
          </>
        );

      case "Inventory":
        return (
          <>
            <div className={styles.kpiBar}>
              <div className={styles.kpiStat}><span className={styles.kpiLabel}>Total</span><span className={styles.kpiValue}>{materials.length}</span></div>
              {MAT_STATUSES.map((s) => (
                <div key={s} className={styles.kpiStat}><span className={styles.kpiLabel}>{s}</span><span className={styles.kpiValue}>{materials.filter((m) => m.status === s).length}</span></div>
              ))}
            </div>
            <div className={styles.toolbar}>
              <input className={styles.search} placeholder="Search materials…" value={search} onChange={(e) => setSearch(e.target.value)} />
              {["All", ...MAT_STATUSES].map((s) => (
                <button key={s} className={`${styles.chip} ${matStatusFilter === s ? styles.chipActive : ""}`} onClick={() => setMatStatusFilter(s)}>{s}</button>
              ))}
            </div>
            <div className={styles.splitLayout}>
              {renderInventoryTable()}
              <AnimatePresence>{hasPanel && renderMatDetail()}</AnimatePresence>
            </div>
          </>
        );

      default: return null;
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHead}>
        <div className={styles.pageTitleRow}>
          <Users2 size={22} className={styles.pageIcon} />
          <div>
            <h1 className={styles.pageTitle}>Client Management</h1>
            <p className={styles.pageSub}>Leads · Clients · Projects · Documents · Inventory</p>
          </div>
        </div>
      </div>

      <div className={styles.tabs}>
        {TABS.map((tab) => (
          <button key={tab} className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ""}`} onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
      </div>

      <div className={styles.tabContent}>
        {renderTabContent()}
      </div>

      {/* Create Drawers */}
      <Drawer open={creating && activeTab === "Leads"} onClose={() => setCreating(false)} title="New Lead" width={520}>
        {creating && activeTab === "Leads" && (
          <LeadForm employees={employees} submitLabel="Create Lead"
            onSubmit={async (vals) => { await addLead({ ...vals, lastTouch: today() }); setCreating(false); }}
            onCancel={() => setCreating(false)} />
        )}
      </Drawer>

      <Drawer open={creating && activeTab === "Clients"} onClose={() => setCreating(false)} title="New Client" width={520}>
        {creating && activeTab === "Clients" && (
          <ClientForm submitLabel="Create Client"
            onSubmit={async (vals) => { await addClient({ ...vals, projects: [] }); setCreating(false); }}
            onCancel={() => setCreating(false)} />
        )}
      </Drawer>
    </div>
  );
}
