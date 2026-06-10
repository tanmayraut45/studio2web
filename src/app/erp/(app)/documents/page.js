"use client";

import { useState } from "react";
import { FolderOpen, Upload, Lock, FileText, Folder } from "lucide-react";
import { PageHeader, KpiCard, Panel, Badge, Btn, Tag } from "@/components/erp/ui";
import { documents, projects, projectName } from "@/erp/data";
import { dateShort } from "@/erp/lib/format";
import grid from "@/components/erp/layout.module.css";
import styles from "./documents.module.css";

const TYPE_TONE = { CAD: "info", Render: "purple", BOQ: "gold", Agreement: "success", Drawing: "info", Photos: "warn", "Mood Board": "purple" };

export default function DocumentsPage() {
  const [folder, setFolder] = useState("all");
  const list = folder === "all" ? documents : documents.filter((d) => d.project === folder);

  return (
    <div className={grid.stack}>
      <PageHeader title="Document Management" subtitle="Versioned, OCR-searchable, approval-controlled" icon={FolderOpen}>
        <Btn icon={Upload}>Upload</Btn>
      </PageHeader>

      <div className={grid.kpiGrid}>
        <KpiCard index={0} label="Total Files" value={documents.length} sub="across projects" accent="gold" />
        <KpiCard index={1} label="Locked / Final" value={documents.filter((d) => d.locked).length} accent="success" />
        <KpiCard index={2} label="Latest Revisions" value="R3 avg" sub="version controlled" accent="info" />
        <KpiCard index={3} label="Storage" value="2.4 GB" sub="of 50 GB" accent="purple" />
      </div>

      <div className={styles.layout}>
        <Panel title="Folders" padded>
          <button className={`${styles.folder} ${folder === "all" ? styles.folderActive : ""}`} onClick={() => setFolder("all")}>
            <Folder size={16} /> All documents <span>{documents.length}</span>
          </button>
          {projects.map((p) => {
            const count = documents.filter((d) => d.project === p.id).length;
            if (!count) return null;
            return (
              <button key={p.id} className={`${styles.folder} ${folder === p.id ? styles.folderActive : ""}`} onClick={() => setFolder(p.id)}>
                <Folder size={16} /> <span className={styles.fName}>{p.name}</span> <span>{count}</span>
              </button>
            );
          })}
        </Panel>

        <Panel title={folder === "all" ? "All documents" : projectName(folder)} subtitle={`${list.length} files`}>
          <div className={styles.docs}>
            {list.map((d) => (
              <div className={styles.doc} key={d.id}>
                <span className={styles.docIcon} data-t={d.type}><FileText size={18} /></span>
                <div className={styles.docMain}>
                  <strong>{d.name} {d.locked && <Lock size={12} />}</strong>
                  <div className={styles.docTags}>
                    <Badge tone={TYPE_TONE[d.type] || "neutral"}>{d.type}</Badge>
                    <span className={styles.ver}>{d.version}</span>
                    {d.tags.map((t) => <Tag key={t}>{t}</Tag>)}
                  </div>
                </div>
                <div className={styles.docMeta}>
                  <span>{d.size}</span>
                  <span>{dateShort(d.date)}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
