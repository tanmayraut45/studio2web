"use client";

import { useState } from "react";
import { Btn } from "@/components/erp/ui";
import styles from "./ClientForm.module.css";

const TYPES = ["Residential", "Commercial", "Hospitality"];
const BUDGET_FLEX = ["Low", "Medium", "High"];
const STATUSES = ["Active", "Inactive", "Archived"];

const today = () => new Date().toISOString().slice(0, 10);

const EMPTY = {
  name: "",
  company: "",
  type: TYPES[0],
  email: "",
  phone: "",
  gst: "—",
  pan: "",
  billing: "",
  site: "",
  decisionMaker: "",
  budgetFlex: BUDGET_FLEX[1],
  rating: 4,
  style: "",
  lifetimeValue: "",
  since: today(),
  status: STATUSES[0],
};

function toForm(initial) {
  if (!initial) return EMPTY;
  return {
    name: initial.name ?? "",
    company: initial.company ?? "",
    type: initial.type ?? TYPES[0],
    email: initial.email ?? "",
    phone: initial.phone ?? "",
    gst: initial.gst ?? "—",
    pan: initial.pan ?? "",
    billing: initial.billing ?? "",
    site: initial.site ?? "",
    decisionMaker: initial.decisionMaker ?? "",
    budgetFlex: initial.budgetFlex ?? BUDGET_FLEX[1],
    rating: initial.rating ?? 4,
    style: initial.style ?? "",
    lifetimeValue: initial.lifetimeValue ?? "",
    since: initial.since ?? today(),
    status: initial.status ?? STATUSES[0],
  };
}

function deriveInitials(company) {
  if (!company) return "";
  const words = company.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export default function ClientForm({ initial, onSubmit, onCancel, submitLabel = "Save" }) {
  const [values, setValues] = useState(() => toForm(initial));

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!values.name.trim() || !values.company.trim()) return;
    const company = values.company.trim();
    const initials = (initial && initial.initials) || deriveInitials(company);
    onSubmit({
      ...values,
      name: values.name.trim(),
      company,
      initials,
      rating: values.rating === "" ? 0 : Number(values.rating),
      lifetimeValue: values.lifetimeValue === "" ? 0 : Number(values.lifetimeValue),
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="client-name">Primary contact name</label>
          <input
            id="client-name"
            className={styles.input}
            value={values.name}
            onChange={set("name")}
            required
            autoFocus
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="client-company">Company</label>
          <input
            id="client-company"
            className={styles.input}
            value={values.company}
            onChange={set("company")}
            required
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="client-type">Type</label>
          <select id="client-type" className={styles.input} value={values.type} onChange={set("type")}>
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="client-status">Status</label>
          <select id="client-status" className={styles.input} value={values.status} onChange={set("status")}>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="client-email">Email</label>
          <input id="client-email" type="email" className={styles.input} value={values.email} onChange={set("email")} />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="client-phone">Phone</label>
          <input id="client-phone" type="tel" className={styles.input} value={values.phone} onChange={set("phone")} />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="client-gst">GST</label>
          <input id="client-gst" className={styles.input} value={values.gst} onChange={set("gst")} />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="client-pan">PAN</label>
          <input id="client-pan" className={styles.input} value={values.pan} onChange={set("pan")} />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="client-billing">Billing address</label>
        <input id="client-billing" className={styles.input} value={values.billing} onChange={set("billing")} />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="client-site">Site address</label>
        <input id="client-site" className={styles.input} value={values.site} onChange={set("site")} />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="client-dm">Decision maker</label>
          <input id="client-dm" className={styles.input} value={values.decisionMaker} onChange={set("decisionMaker")} />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="client-flex">Budget flex</label>
          <select id="client-flex" className={styles.input} value={values.budgetFlex} onChange={set("budgetFlex")}>
            {BUDGET_FLEX.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="client-rating">Rating (1–5)</label>
          <input
            id="client-rating"
            type="number"
            min="1"
            max="5"
            inputMode="numeric"
            className={`${styles.input} ${styles.mono}`}
            value={values.rating}
            onChange={set("rating")}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="client-style">Preferred style</label>
          <input id="client-style" className={styles.input} value={values.style} onChange={set("style")} />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="client-ltv">Lifetime value (Rs)</label>
          <input
            id="client-ltv"
            type="number"
            min="0"
            inputMode="numeric"
            className={`${styles.input} ${styles.mono}`}
            value={values.lifetimeValue}
            onChange={set("lifetimeValue")}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="client-since">Client since</label>
          <input
            id="client-since"
            type="date"
            className={styles.input}
            value={values.since}
            onChange={set("since")}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <Btn type="button" variant="ghost" onClick={onCancel}>Cancel</Btn>
        <Btn type="submit" variant="primary">{submitLabel}</Btn>
      </div>
    </form>
  );
}
