"use client";

import { useEffect, useState } from "react";
import { Btn } from "@/components/erp/ui";
import { employees } from "@/erp/data";
import { useProjectsStore } from "@/erp/stores/useProjectsStore";
import styles from "./DocumentForm.module.css";

// Matches the field-names actually used in src/erp/data/documents.js so that
// editing existing seed rows round-trips cleanly. The seed uses:
//   name, type, project, uploadedBy, date, size (string with units),
//   version, locked (boolean), tags (string[]), url (optional)
const TYPES = ["CAD", "Render", "BOQ", "Agreement", "Drawing", "Photos", "Mood Board", "PDF", "XLSX", "Image", "Other"];

const today = () => new Date().toISOString().slice(0, 10);

const emptyForm = (projects) => ({
  name: "",
  type: TYPES[0],
  project: projects[0]?.id || "",
  uploadedBy: employees[0]?.id || "",
  date: today(),
  size: "",
  version: "R1",
  locked: false,
  tags: "",
  url: "/uploads/placeholder.pdf",
});

function toForm(initial, projects) {
  if (!initial) return emptyForm(projects);
  return {
    name: initial.name ?? "",
    type: initial.type ?? TYPES[0],
    project: initial.project ?? (projects[0]?.id || ""),
    uploadedBy: initial.uploadedBy ?? (employees[0]?.id || ""),
    date: initial.date ?? today(),
    size: initial.size ?? "",
    version: initial.version ?? "R1",
    locked: Boolean(initial.locked),
    tags: Array.isArray(initial.tags) ? initial.tags.join(", ") : (initial.tags ?? ""),
    url: initial.url ?? "/uploads/placeholder.pdf",
  };
}

export default function DocumentForm({ initial, onSubmit, onCancel, submitLabel = "Save" }) {
  const projects = useProjectsStore((s) => s.projects);
  const hydrateProjects = useProjectsStore((s) => s.hydrate);
  useEffect(() => { hydrateProjects(); }, [hydrateProjects]);

  const [values, setValues] = useState(() => toForm(initial, projects));

  const set = (key) => (e) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const setBool = (key) => (e) =>
    setValues((v) => ({ ...v, [key]: e.target.checked }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!values.name.trim()) return;
    const tags = values.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    onSubmit({
      ...values,
      name: values.name.trim(),
      size: values.size.trim(),
      version: values.version.trim() || "R1",
      tags,
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="doc-name">File name</label>
        <input
          id="doc-name"
          className={styles.input}
          value={values.name}
          onChange={set("name")}
          required
          autoFocus
          placeholder="Floor_Plan_R1.dwg"
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="doc-type">Type</label>
          <select id="doc-type" className={styles.input} value={values.type} onChange={set("type")}>
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="doc-version">Version</label>
          <input
            id="doc-version"
            className={styles.input}
            placeholder="R1"
            value={values.version}
            onChange={set("version")}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="doc-project">Project</label>
          <select id="doc-project" className={styles.input} value={values.project} onChange={set("project")}>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="doc-uploadedBy">Uploaded by</label>
          <select id="doc-uploadedBy" className={styles.input} value={values.uploadedBy} onChange={set("uploadedBy")}>
            {employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="doc-date">Date</label>
          <input
            id="doc-date"
            type="date"
            className={styles.input}
            value={values.date}
            onChange={set("date")}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="doc-size">Size</label>
          <input
            id="doc-size"
            className={`${styles.input} ${styles.mono}`}
            placeholder="4.2 MB"
            value={values.size}
            onChange={set("size")}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="doc-tags">Tags <span className={styles.hint}>(comma separated)</span></label>
        <input
          id="doc-tags"
          className={styles.input}
          placeholder="floor-plan, approved"
          value={values.tags}
          onChange={set("tags")}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="doc-url">URL</label>
        <input
          id="doc-url"
          className={styles.input}
          placeholder="/uploads/..."
          value={values.url}
          onChange={set("url")}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.checkLabel}>
          <input
            type="checkbox"
            checked={values.locked}
            onChange={setBool("locked")}
          />
          <span>Locked / Final</span>
        </label>
      </div>

      <div className={styles.actions}>
        <Btn type="button" variant="ghost" onClick={onCancel}>Cancel</Btn>
        <Btn type="submit" variant="primary">{submitLabel}</Btn>
      </div>
    </form>
  );
}
