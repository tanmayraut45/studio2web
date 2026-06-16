"use client";

import { useState } from "react";
import { Btn } from "@/components/erp/ui";
import { clients, employees, projectStages } from "@/erp/data";
import styles from "./ProjectForm.module.css";

const TYPES = ["Residential", "Commercial", "Hospitality"];
const HEALTHS = ["on-track", "at-risk", "delayed"];
const RISKS = ["Low", "Medium", "High"];

const EMPTY = {
  name: "",
  code: "",
  client: clients[0]?.id || "",
  location: "",
  type: TYPES[0],
  manager: employees[0]?.id || "",
  team: [],
  stage: projectStages[0],
  progress: "",
  health: HEALTHS[0],
  budget: "",
  actual: "",
  committed: "",
  margin: "",
  start: "",
  due: "",
  risk: RISKS[0],
};

function toForm(initial) {
  if (!initial) return EMPTY;
  return {
    name: initial.name ?? "",
    code: initial.code ?? "",
    client: initial.client ?? (clients[0]?.id || ""),
    location: initial.location ?? "",
    type: initial.type ?? TYPES[0],
    manager: initial.manager ?? (employees[0]?.id || ""),
    team: Array.isArray(initial.team) ? [...initial.team] : [],
    stage: initial.stage ?? projectStages[0],
    progress: initial.progress ?? "",
    health: initial.health ?? HEALTHS[0],
    budget: initial.budget ?? "",
    actual: initial.actual ?? "",
    committed: initial.committed ?? "",
    margin: initial.margin ?? "",
    start: initial.start ?? "",
    due: initial.due ?? "",
    risk: initial.risk ?? RISKS[0],
  };
}

export default function ProjectForm({ initial, onSubmit, onCancel, submitLabel = "Save" }) {
  const [values, setValues] = useState(() => toForm(initial));

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  const toggleTeam = (id) =>
    setValues((v) => ({
      ...v,
      team: v.team.includes(id) ? v.team.filter((x) => x !== id) : [...v.team, id],
    }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!values.name.trim()) return;
    onSubmit({
      ...values,
      name: values.name.trim(),
      code: values.code.trim(),
      location: values.location.trim(),
      progress: values.progress === "" ? 0 : Number(values.progress),
      budget: values.budget === "" ? 0 : Number(values.budget),
      actual: values.actual === "" ? 0 : Number(values.actual),
      committed: values.committed === "" ? 0 : Number(values.committed),
      margin: values.margin === "" ? 0 : Number(values.margin),
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="proj-name">Name</label>
        <input
          id="proj-name"
          className={styles.input}
          value={values.name}
          onChange={set("name")}
          required
          autoFocus
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="proj-code">Code</label>
          <input
            id="proj-code"
            className={styles.input}
            placeholder="ST2-2026-NNN"
            value={values.code}
            onChange={set("code")}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="proj-client">Client</label>
          <select id="proj-client" className={styles.input} value={values.client} onChange={set("client")}>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.company || c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="proj-location">Location</label>
          <input
            id="proj-location"
            className={styles.input}
            placeholder="Area, City"
            value={values.location}
            onChange={set("location")}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="proj-type">Type</label>
          <select id="proj-type" className={styles.input} value={values.type} onChange={set("type")}>
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="proj-manager">Manager</label>
          <select id="proj-manager" className={styles.input} value={values.manager} onChange={set("manager")}>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="proj-stage">Stage</label>
          <select id="proj-stage" className={styles.input} value={values.stage} onChange={set("stage")}>
            {projectStages.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <span className={styles.label}>Team members</span>
        <div className={styles.teamGrid} role="group" aria-label="Team members">
          {employees.map((emp) => {
            const checked = values.team.includes(emp.id);
            return (
              <label
                key={emp.id}
                className={styles.teamItem}
                data-checked={checked ? "true" : "false"}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleTeam(emp.id)}
                />
                <span>{emp.name}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="proj-progress">Progress (%)</label>
          <input
            id="proj-progress"
            type="number"
            min="0"
            max="100"
            inputMode="numeric"
            className={`${styles.input} ${styles.mono}`}
            value={values.progress}
            onChange={set("progress")}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="proj-health">Health</label>
          <select id="proj-health" className={styles.input} value={values.health} onChange={set("health")}>
            {HEALTHS.map((h) => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="proj-budget">Budget (Rs)</label>
          <input
            id="proj-budget"
            type="number"
            min="0"
            inputMode="numeric"
            className={`${styles.input} ${styles.mono}`}
            value={values.budget}
            onChange={set("budget")}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="proj-actual">Actual (Rs)</label>
          <input
            id="proj-actual"
            type="number"
            min="0"
            inputMode="numeric"
            className={`${styles.input} ${styles.mono}`}
            value={values.actual}
            onChange={set("actual")}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="proj-committed">Committed (Rs)</label>
          <input
            id="proj-committed"
            type="number"
            min="0"
            inputMode="numeric"
            className={`${styles.input} ${styles.mono}`}
            value={values.committed}
            onChange={set("committed")}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="proj-margin">Margin (%)</label>
          <input
            id="proj-margin"
            type="number"
            min="0"
            max="50"
            inputMode="numeric"
            className={`${styles.input} ${styles.mono}`}
            value={values.margin}
            onChange={set("margin")}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="proj-start">Start</label>
          <input
            id="proj-start"
            type="date"
            className={styles.input}
            value={values.start}
            onChange={set("start")}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="proj-due">Due</label>
          <input
            id="proj-due"
            type="date"
            className={styles.input}
            value={values.due}
            onChange={set("due")}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="proj-risk">Risk</label>
          <select id="proj-risk" className={styles.input} value={values.risk} onChange={set("risk")}>
            {RISKS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className={styles.field} aria-hidden="true" />
      </div>

      <div className={styles.actions}>
        <Btn type="button" variant="ghost" onClick={onCancel}>Cancel</Btn>
        <Btn type="submit" variant="primary">{submitLabel || "Save"}</Btn>
      </div>
    </form>
  );
}
