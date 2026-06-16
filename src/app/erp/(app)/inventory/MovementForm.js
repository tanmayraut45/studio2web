"use client";

import { useEffect, useState } from "react";
import { Btn } from "@/components/erp/ui";
import { useEmployeesStore } from "@/erp/stores/useEmployeesStore";
import { useMaterialsStore } from "@/erp/stores/useMaterialsStore";
import styles from "./MaterialForm.module.css";

const TYPES = [
  { value: "inward", label: "Inward" },
  { value: "outward", label: "Outward" },
  { value: "transfer", label: "Transfer" },
  { value: "adjustment", label: "Adjustment" },
  { value: "damage", label: "Damage" },
];

// `datetime-local` wants `YYYY-MM-DDTHH:mm` in local time (not UTC).
function nowLocal() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const toNum = (v) => (v === "" || v === null || v === undefined ? 0 : Number(v));

const emptyForm = (materials, employees) => ({
  material: materials[0]?.id || "",
  type: TYPES[0].value,
  qty: "",
  date: nowLocal(),
  ref: "",
  by: employees[0]?.id || "",
});

export default function MovementForm({ onSubmit, onCancel, submitLabel = "Log movement" }) {
  const materials = useMaterialsStore((s) => s.materials);

  const employees = useEmployeesStore((s) => s.employees);
  const hydrateEmployees = useEmployeesStore((s) => s.hydrate);
  useEffect(() => { hydrateEmployees(); }, [hydrateEmployees]);

  const [values, setValues] = useState(() => emptyForm(materials, employees));

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!values.material || !values.by) return;
    const qty = Math.abs(toNum(values.qty));
    if (qty <= 0) return;
    onSubmit({
      material: values.material,
      type: values.type,
      qty,
      date: values.date ? new Date(values.date).toISOString() : new Date().toISOString(),
      ref: values.ref.trim(),
      by: values.by,
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="mov-material">Material</label>
        <select
          id="mov-material"
          className={styles.input}
          value={values.material}
          onChange={set("material")}
          required
        >
          {materials.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="mov-type">Movement type</label>
          <select id="mov-type" className={styles.input} value={values.type} onChange={set("type")}>
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="mov-qty">Quantity</label>
          <input
            id="mov-qty"
            type="number"
            min="0"
            step="any"
            inputMode="decimal"
            className={`${styles.input} ${styles.mono}`}
            value={values.qty}
            onChange={set("qty")}
            placeholder="0"
            required
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="mov-date">When</label>
          <input
            id="mov-date"
            type="datetime-local"
            className={styles.input}
            value={values.date}
            onChange={set("date")}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="mov-by">Logged by</label>
          <select id="mov-by" className={styles.input} value={values.by} onChange={set("by")} required>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="mov-ref">Reference (PO / project code)</label>
        <input
          id="mov-ref"
          className={`${styles.input} ${styles.mono}`}
          value={values.ref}
          onChange={set("ref")}
          placeholder="PO-2026-014"
        />
      </div>

      <div className={styles.actions}>
        <Btn type="button" variant="ghost" onClick={onCancel}>Cancel</Btn>
        <Btn type="submit" variant="primary">{submitLabel}</Btn>
      </div>
    </form>
  );
}
