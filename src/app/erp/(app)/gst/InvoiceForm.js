"use client";

import { useState, useMemo } from "react";
import { Btn } from "@/components/erp/ui";
import { projects, clients } from "@/erp/data";
import styles from "./InvoiceForm.module.css";

const TYPES = ["Advance", "Milestone", "Retention", "Full"];
const STATUSES = ["Draft", "Sent", "Partially Paid", "Paid", "Overdue"];

const todayISO = () => new Date().toISOString().slice(0, 10);
const plusDaysISO = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

function suggestCode() {
  const year = new Date().getFullYear();
  const n = Math.floor(100 + Math.random() * 900);
  return `INV-${year}-${n}`;
}

const EMPTY = () => ({
  code: suggestCode(),
  project: projects[0]?.id || "",
  client: clients[0]?.id || "",
  type: TYPES[1], // Milestone
  amount: "",
  gst: "",
  issued: todayISO(),
  due: plusDaysISO(30),
  status: STATUSES[0], // Draft
});

function toForm(initial) {
  if (!initial) return EMPTY();
  return {
    code: initial.code ?? "",
    project: initial.project ?? (projects[0]?.id || ""),
    client: initial.client ?? (clients[0]?.id || ""),
    type: initial.type ?? TYPES[1],
    amount: initial.amount ?? "",
    gst: initial.gst ?? "",
    issued: initial.issued ?? todayISO(),
    due: initial.due ?? plusDaysISO(30),
    status: initial.status ?? STATUSES[0],
  };
}

export default function InvoiceForm({ initial, onSubmit, onCancel, submitLabel }) {
  const [values, setValues] = useState(() => toForm(initial));
  // GST auto-fill helper — only when creating a new invoice and user hasn't
  // touched the GST field yet. Editing existing invoices respects the saved
  // gst value as-is.
  const [userTouchedGst, setUserTouchedGst] = useState(() => !!initial);

  const isCreate = useMemo(() => !initial, [initial]);

  const setField = (key) => (e) => {
    const v = e.target.value;
    setValues((prev) => {
      const next = { ...prev, [key]: v };
      if (isCreate && key === "amount" && !userTouchedGst) {
        const amt = Number(v);
        if (!Number.isNaN(amt) && v !== "") {
          next.gst = Math.round(amt * 0.18);
        } else {
          next.gst = "";
        }
      }
      return next;
    });
  };

  const setGst = (e) => {
    setUserTouchedGst(true);
    setValues((prev) => ({ ...prev, gst: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!values.code.trim()) return;
    onSubmit({
      ...values,
      code: values.code.trim(),
      amount: values.amount === "" ? 0 : Number(values.amount),
      gst: values.gst === "" ? 0 : Number(values.gst),
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="inv-code">Invoice Code</label>
        <input
          id="inv-code"
          className={`${styles.input} ${styles.mono}`}
          value={values.code}
          onChange={setField("code")}
          required
          autoFocus
          placeholder="INV-2026-001"
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="inv-project">Project</label>
          <select id="inv-project" className={styles.input} value={values.project} onChange={setField("project")}>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="inv-client">Client</label>
          <select id="inv-client" className={styles.input} value={values.client} onChange={setField("client")}>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.company || c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="inv-type">Type</label>
          <select id="inv-type" className={styles.input} value={values.type} onChange={setField("type")}>
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="inv-status">Status</label>
          <select id="inv-status" className={styles.input} value={values.status} onChange={setField("status")}>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="inv-amount">Amount (pre-GST, Rs)</label>
          <input
            id="inv-amount"
            type="number"
            min="0"
            inputMode="numeric"
            className={`${styles.input} ${styles.mono}`}
            value={values.amount}
            onChange={setField("amount")}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="inv-gst">GST (Rs)</label>
          <input
            id="inv-gst"
            type="number"
            min="0"
            inputMode="numeric"
            className={`${styles.input} ${styles.mono}`}
            value={values.gst}
            onChange={setGst}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="inv-issued">Issued</label>
          <input
            id="inv-issued"
            type="date"
            className={styles.input}
            value={values.issued}
            onChange={setField("issued")}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="inv-due">Due</label>
          <input
            id="inv-due"
            type="date"
            className={styles.input}
            value={values.due}
            onChange={setField("due")}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <Btn type="button" variant="ghost" onClick={onCancel}>Cancel</Btn>
        <Btn type="submit" variant="primary">{submitLabel || "Save"}</Btn>
      </div>
    </form>
  );
}
