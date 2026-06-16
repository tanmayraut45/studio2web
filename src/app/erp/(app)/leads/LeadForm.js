"use client";

import { useEffect, useState } from "react";
import { Btn } from "@/components/erp/ui";
import { useEmployeesStore } from "@/erp/stores/useEmployeesStore";
import { leadStages } from "@/erp/stores/useLeadsStore";
import styles from "./LeadForm.module.css";

const SOURCES = ["Instagram", "Referral", "Website", "Meta Ads", "WhatsApp", "Google Ads"];

const emptyForm = (employees) => ({
  name: "",
  phone: "",
  email: "",
  location: "",
  requirement: "",
  propertyType: "",
  style: "",
  source: SOURCES[0],
  timeline: "",
  stage: leadStages[0],
  value: "",
  score: "",
  owner: employees[0]?.id || "",
});

function toForm(initial, employees) {
  if (!initial) return emptyForm(employees);
  return {
    name: initial.name ?? "",
    phone: initial.phone ?? "",
    email: initial.email ?? "",
    location: initial.location ?? "",
    requirement: initial.requirement ?? "",
    propertyType: initial.propertyType ?? "",
    style: initial.style ?? "",
    source: initial.source ?? SOURCES[0],
    timeline: initial.timeline ?? "",
    stage: initial.stage ?? leadStages[0],
    value: initial.value ?? "",
    score: initial.score ?? "",
    owner: initial.owner ?? (employees[0]?.id || ""),
  };
}

export default function LeadForm({ initial, onSubmit, onCancel, submitLabel }) {
  const employees = useEmployeesStore((s) => s.employees);
  const hydrateEmployees = useEmployeesStore((s) => s.hydrate);
  useEffect(() => { hydrateEmployees(); }, [hydrateEmployees]);

  const [values, setValues] = useState(() => toForm(initial, employees));

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!values.name.trim()) return;
    onSubmit({
      ...values,
      name: values.name.trim(),
      value: values.value === "" ? 0 : Number(values.value),
      score: values.score === "" ? 0 : Number(values.score),
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="lead-name">Name</label>
        <input
          id="lead-name"
          className={styles.input}
          value={values.name}
          onChange={set("name")}
          required
          autoFocus
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="lead-phone">Phone</label>
          <input id="lead-phone" className={styles.input} value={values.phone} onChange={set("phone")} />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="lead-email">Email</label>
          <input id="lead-email" type="email" className={styles.input} value={values.email} onChange={set("email")} />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="lead-location">Location</label>
          <input id="lead-location" className={styles.input} placeholder="Area, City" value={values.location} onChange={set("location")} />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="lead-requirement">Requirement</label>
          <input id="lead-requirement" className={styles.input} placeholder="Full Interior" value={values.requirement} onChange={set("requirement")} />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="lead-property">Property Type</label>
          <input id="lead-property" className={styles.input} value={values.propertyType} onChange={set("propertyType")} />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="lead-style">Style</label>
          <input id="lead-style" className={styles.input} value={values.style} onChange={set("style")} />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="lead-source">Source</label>
          <select id="lead-source" className={styles.input} value={values.source} onChange={set("source")}>
            {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="lead-timeline">Timeline</label>
          <input id="lead-timeline" className={styles.input} placeholder="3 months" value={values.timeline} onChange={set("timeline")} />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="lead-stage">Stage</label>
          <select id="lead-stage" className={styles.input} value={values.stage} onChange={set("stage")}>
            {leadStages.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="lead-owner">Owner</label>
          <select id="lead-owner" className={styles.input} value={values.owner} onChange={set("owner")}>
            {employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="lead-value">Value (Rs)</label>
          <input
            id="lead-value"
            type="number"
            min="0"
            inputMode="numeric"
            className={`${styles.input} ${styles.mono}`}
            value={values.value}
            onChange={set("value")}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="lead-score">Score (0–100)</label>
          <input
            id="lead-score"
            type="number"
            min="0"
            max="100"
            inputMode="numeric"
            className={`${styles.input} ${styles.mono}`}
            value={values.score}
            onChange={set("score")}
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
