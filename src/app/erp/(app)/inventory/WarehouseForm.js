"use client";

import { useState } from "react";
import { Btn } from "@/components/erp/ui";
import styles from "./MaterialForm.module.css";

const EMPTY = {
  name: "",
  location: "",
  capacity: 50,
  items: 0,
};

function toForm(initial) {
  if (!initial) return EMPTY;
  return {
    name: initial.name ?? "",
    location: initial.location ?? "",
    capacity: initial.capacity ?? 50,
    items: initial.items ?? 0,
  };
}

const toNum = (v) => (v === "" || v === null || v === undefined ? 0 : Number(v));

const clampPct = (v) => {
  const n = toNum(v);
  if (Number.isNaN(n)) return 0;
  if (n < 0) return 0;
  if (n > 100) return 100;
  return n;
};

export default function WarehouseForm({ initial, onSubmit, onCancel, submitLabel = "Save" }) {
  const [values, setValues] = useState(() => toForm(initial));

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!values.name.trim()) return;
    onSubmit({
      ...values,
      name: values.name.trim(),
      location: values.location.trim(),
      capacity: clampPct(values.capacity),
      items: toNum(values.items),
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="wh-name">Warehouse name</label>
        <input
          id="wh-name"
          className={styles.input}
          value={values.name}
          onChange={set("name")}
          placeholder="Warehouse A — Pune"
          required
          autoFocus
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="wh-location">Address</label>
        <input
          id="wh-location"
          className={styles.input}
          value={values.location}
          onChange={set("location")}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="wh-capacity">Occupancy %</label>
          <input
            id="wh-capacity"
            type="number"
            min="0"
            max="100"
            inputMode="numeric"
            className={`${styles.input} ${styles.mono}`}
            value={values.capacity}
            onChange={set("capacity")}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="wh-items">Distinct SKUs stored</label>
          <input
            id="wh-items"
            type="number"
            min="0"
            inputMode="numeric"
            className={`${styles.input} ${styles.mono}`}
            value={values.items}
            onChange={set("items")}
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
