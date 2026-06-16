"use client";

import { useState } from "react";
import { Btn } from "@/components/erp/ui";
import styles from "./EmployeeForm.module.css";

const STATUSES = ["active", "inactive", "terminated"];

const today = () => new Date().toISOString().slice(0, 10);

const EMPTY = {
  name: "",
  role: "",
  dept: "",
  email: "",
  phone: "",
  joined: today(),
  salary: "",
  productivity: 90,
  attendance: 95,
  location: "HQ Pune",
  status: STATUSES[0],
};

function toForm(initial) {
  if (!initial) return EMPTY;
  return {
    name: initial.name ?? "",
    role: initial.role ?? "",
    dept: initial.dept ?? "",
    email: initial.email ?? "",
    phone: initial.phone ?? "",
    joined: initial.joined ?? today(),
    salary: initial.salary ?? "",
    productivity: initial.productivity ?? 90,
    attendance: initial.attendance ?? 95,
    location: initial.location ?? "HQ Pune",
    status: initial.status ?? STATUSES[0],
  };
}

function deriveInitials(name) {
  if (!name) return "";
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export default function EmployeeForm({ initial, onSubmit, onCancel, submitLabel = "Save" }) {
  const [values, setValues] = useState(() => toForm(initial));

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!values.name.trim() || !values.role.trim()) return;
    const name = values.name.trim();
    const initials = (initial && initial.initials) || deriveInitials(name);
    onSubmit({
      ...values,
      name,
      role: values.role.trim(),
      dept: values.dept.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      location: values.location.trim(),
      initials,
      salary: values.salary === "" ? 0 : Number(values.salary),
      productivity: values.productivity === "" ? 0 : Number(values.productivity),
      attendance: values.attendance === "" ? 0 : Number(values.attendance),
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="emp-name">Full name</label>
          <input
            id="emp-name"
            className={styles.input}
            value={values.name}
            onChange={set("name")}
            required
            autoFocus
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="emp-role">Job title</label>
          <input
            id="emp-role"
            className={styles.input}
            value={values.role}
            onChange={set("role")}
            required
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="emp-dept">Department</label>
          <input
            id="emp-dept"
            className={styles.input}
            value={values.dept}
            onChange={set("dept")}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="emp-status">Status</label>
          <select id="emp-status" className={styles.input} value={values.status} onChange={set("status")}>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="emp-email">Email</label>
          <input id="emp-email" type="email" className={styles.input} value={values.email} onChange={set("email")} />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="emp-phone">Phone</label>
          <input id="emp-phone" type="tel" className={styles.input} value={values.phone} onChange={set("phone")} />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="emp-joined">Joined</label>
          <input
            id="emp-joined"
            type="date"
            className={styles.input}
            value={values.joined}
            onChange={set("joined")}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="emp-location">Location</label>
          <input
            id="emp-location"
            className={styles.input}
            value={values.location}
            onChange={set("location")}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="emp-salary">Monthly gross (Rs)</label>
          <input
            id="emp-salary"
            type="number"
            min="0"
            inputMode="numeric"
            className={`${styles.input} ${styles.mono}`}
            value={values.salary}
            onChange={set("salary")}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="emp-productivity">Productivity (0–100)</label>
          <input
            id="emp-productivity"
            type="number"
            min="0"
            max="100"
            inputMode="numeric"
            className={`${styles.input} ${styles.mono}`}
            value={values.productivity}
            onChange={set("productivity")}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="emp-attendance">Attendance %</label>
          <input
            id="emp-attendance"
            type="number"
            min="0"
            max="100"
            inputMode="numeric"
            className={`${styles.input} ${styles.mono}`}
            value={values.attendance}
            onChange={set("attendance")}
          />
        </div>
        <div className={styles.field}>
          {/* spacer to keep symmetrical row layout on wide screens */}
        </div>
      </div>

      <div className={styles.actions}>
        <Btn type="button" variant="ghost" onClick={onCancel}>Cancel</Btn>
        <Btn type="submit" variant="primary">{submitLabel}</Btn>
      </div>
    </form>
  );
}
