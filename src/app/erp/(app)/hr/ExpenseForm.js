"use client";

import { useState } from "react";
import { Btn } from "@/components/erp/ui";
import styles from "./ExpenseForm.module.css";

const EMPTY = { label: "", amount: "" };

function toForm(initial) {
  if (!initial) return EMPTY;
  return {
    label: initial.label ?? "",
    amount: initial.amount ?? "",
  };
}

export default function ExpenseForm({ initial, onSubmit, onCancel, submitLabel }) {
  const [values, setValues] = useState(() => toForm(initial));

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const label = values.label.trim();
    if (!label) return;
    onSubmit({
      label,
      amount: values.amount === "" ? 0 : Number(values.amount),
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="exp-label">Label</label>
        <input
          id="exp-label"
          className={styles.input}
          placeholder="e.g. Rent, Meta Ads, Travel"
          value={values.label}
          onChange={set("label")}
          required
          autoFocus
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="exp-amount">Amount (Rs)</label>
        <input
          id="exp-amount"
          type="number"
          min="0"
          inputMode="numeric"
          className={`${styles.input} ${styles.mono}`}
          placeholder="0"
          value={values.amount}
          onChange={set("amount")}
          required
        />
      </div>

      <div className={styles.actions}>
        <Btn type="button" variant="ghost" onClick={onCancel}>Cancel</Btn>
        <Btn type="submit" variant="primary">{submitLabel || "Save"}</Btn>
      </div>
    </form>
  );
}
