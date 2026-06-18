"use client";

/*
 * Documents — wired CRUD module.
 *
 * Source of truth: `useDocumentsStore` (Zustand) backed by
 * `createCollection("documents", …)` from `src/erp/lib/storage.js`. Persisted in
 * window.localStorage under key "studio2-erp:documents".
 *
 * The seed schema (src/erp/data/documents.js) uses: name, type, project,
 * uploadedBy, date, size (string with units), version, locked (boolean),
 * tags (string[]), url (optional). The form mirrors those names exactly so
 * editing seeded rows round-trips cleanly.
 */

import { useEffect, useMemo, useState } from "react";
import { FolderOpen, Upload, Lock, FileText, Folder, Pencil, Trash2 } from "lucide-react";
import { PageHeader, KpiCard, Panel, Badge, Btn, Tag, ConfirmDialog } from "@/components/erp/ui";
import { Drawer } from "@/components/erp/Modal";
import { projects, projectName } from "@/erp/data";
import { dateShort } from "@/erp/lib/format";
import { useDocumentsStore } from "@/erp/stores/useDocumentsStore";
import DocumentForm from "./DocumentForm";
import grid from "@/components/erp/layout.module.css";
import styles from "./documents.module.css";

const TYPE_TONE = {
  CAD: "info",
  Render: "purple",
  BOQ: "gold",
  Agreement: "success",
  Drawing: "info",
  Photos: "warn",
  "Mood Board": "purple",
};

export default function DocumentsPage() {
  const documents = useDocumentsStore((s) => s.documents);
  const hydrate = useDocumentsStore((s) => s.hydrate);
  const addDocument = useDocumentsStore((s) => s.addDocument);
  const updateDocument = useDocumentsStore((s) => s.updateDocument);
  const removeDocument = useDocumentsStore((s) => s.removeDocument);

  const [folder, setFolder] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const list = useMemo(
    () => (folder === "all" ? documents : documents.filter((d) => d.project === folder)),
    [documents, folder]
  );

  const editing = editingId ? documents.find((d) => d.id === editingId) : null;

  // Derived KPIs.
  const totalFiles = documents.length;
  const lockedCount = documents.filter((d) => d.locked).length;
  const latestRevisions = useMemo(() => {
    const versions = documents
      .map((d) => {
        const m = String(d.version || "").match(/(\d+)/);
        return m ? Number(m[1]) : null;
      })
      .filter((n) => n != null);
    if (!versions.length) return "—";
    const avg = versions.reduce((s, n) => s + n, 0) / versions.length;
    return `R${Math.round(avg)} avg`;
  }, [documents]);

  const storage = useMemo(() => {
    // Sum sizes that look like "4.2 MB" / "1024 KB" / "2 GB".
    let totalMB = 0;
    for (const d of documents) {
      const raw = String(d.size || "").trim();
      const m = raw.match(/([\d.]+)\s*(KB|MB|GB)?/i);
      if (!m) continue;
      const v = parseFloat(m[1]);
      if (Number.isNaN(v)) continue;
      const unit = (m[2] || "MB").toUpperCase();
      if (unit === "KB") totalMB += v / 1024;
      else if (unit === "GB") totalMB += v * 1024;
      else totalMB += v;
    }
    if (totalMB >= 1024) return `${(totalMB / 1024).toFixed(1)} GB`;
    return `${totalMB.toFixed(1)} MB`;
  }, [documents]);

  const handleCreate = async (values) => {
    await addDocument(values);
    setAddOpen(false);
  };

  const handleUpdate = async (values) => {
    if (!editing) return;
    await updateDocument(editing.id, values);
    setEditingId(null);
  };

  const handleDelete = async (doc, e) => {
    e.stopPropagation();
    setDeleteTarget(doc);
  };

  return (
    <div className={grid.stack}>
      <PageHeader
        title="Document Management"
        subtitle="Versioned, OCR-searchable, approval-controlled"
        icon={FolderOpen}
      >
        <Btn icon={Upload} onClick={() => setAddOpen(true)}>Upload</Btn>
      </PageHeader>

      <div className={grid.kpiGrid}>
        <KpiCard index={0} label="Total Files" value={totalFiles} sub="across projects" accent="gold" />
        <KpiCard index={1} label="Locked / Final" value={lockedCount} accent="success" />
        <KpiCard index={2} label="Latest Revisions" value={latestRevisions} sub="version controlled" accent="info" />
        <KpiCard index={3} label="Storage" value={storage} sub="of 50 GB" accent="purple" />
      </div>

      <div className={styles.layout}>
        <Panel title="Folders" padded>
          <button
            className={`${styles.folder} ${folder === "all" ? styles.folderActive : ""}`}
            onClick={() => setFolder("all")}
          >
            <Folder size={16} /> All documents <span>{documents.length}</span>
          </button>
          {projects.map((p) => {
            const count = documents.filter((d) => d.project === p.id).length;
            if (!count) return null;
            return (
              <button
                key={p.id}
                className={`${styles.folder} ${folder === p.id ? styles.folderActive : ""}`}
                onClick={() => setFolder(p.id)}
              >
                <Folder size={16} /> <span className={styles.fName}>{p.name}</span> <span>{count}</span>
              </button>
            );
          })}
        </Panel>

        <Panel
          title={folder === "all" ? "All documents" : projectName(folder)}
          subtitle={`${list.length} files`}
        >
          <div className={styles.docs}>
            {list.length === 0 && (
              <p className={styles.empty}>No documents yet. Click Upload to add one.</p>
            )}
            {list.map((d) => (
              <div
                className={styles.doc}
                key={d.id}
                onClick={() => setEditingId(d.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setEditingId(d.id);
                  }
                }}
              >
                <span className={styles.docIcon} data-t={d.type}><FileText size={18} /></span>
                <div className={styles.docMain}>
                  <strong>{d.name} {d.locked && <Lock size={12} />}</strong>
                  <div className={styles.docTags}>
                    <Badge tone={TYPE_TONE[d.type] || "neutral"}>{d.type}</Badge>
                    <span className={styles.ver}>{d.version}</span>
                    {(d.tags || []).map((t) => <Tag key={t}>{t}</Tag>)}
                  </div>
                </div>
                <div className={styles.docMeta}>
                  <span>{d.size}</span>
                  <span>{dateShort(d.date)}</span>
                </div>
                <div className={styles.docActions}>
                  <button
                    type="button"
                    className={styles.iconBtn}
                    aria-label={`Edit ${d.name}`}
                    onClick={(e) => { e.stopPropagation(); setEditingId(d.id); }}
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    className={styles.iconBtn}
                    data-danger="true"
                    aria-label={`Delete ${d.name}`}
                    onClick={(e) => handleDelete(d, e)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Drawer
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Upload document"
        width={480}
      >
        {addOpen && (
          <DocumentForm
            initial={null}
            submitLabel="Upload"
            onSubmit={handleCreate}
            onCancel={() => setAddOpen(false)}
          />
        )}
      </Drawer>

      <Drawer
        open={!!editing}
        onClose={() => setEditingId(null)}
        title="Edit document"
        width={480}
      >
        {editing && (
          <DocumentForm
            initial={editing}
            submitLabel="Save changes"
            onSubmit={handleUpdate}
            onCancel={() => setEditingId(null)}
          />
        )}
      </Drawer>

      <ConfirmDialog
        open={!!deleteTarget}
        label={`Delete "${deleteTarget?.name}"? This cannot be undone.`}
        onConfirm={async () => { await removeDocument(deleteTarget.id); setDeleteTarget(null); }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
