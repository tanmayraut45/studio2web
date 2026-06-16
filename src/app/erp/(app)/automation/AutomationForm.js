"use client";

import { useState } from "react";
import { Btn } from "@/components/erp/ui";
import styles from "./AutomationForm.module.css";

const EMPTY = {
  name: "",
  trigger: "",
  action: "",
  active: true,
};

function toForm(initial) {
  if (!initial) return EMPTY;
  return {
    name: initial.name ?? "",
    trigger: initial.trigger ?? "",
    action: initial.action ?? initial.channel ?? "",
    active:
      typeof initial.active === "boolean"
        ? initial.active
        : initial.status
          ? initial.status === "Active"
          : true,
  };
}

export default function AutomationForm({ initial, onSubmit, onCancel, submitLabel = "Save" }) {
  const [values, setValues] = useState(() => toForm(initial));

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));
  const setBool = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.checked }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!values.name.trim() || !values.trigger.trim() || !values.action.trim()) return;
    onSubmit({
      ...values,
      name: values.name.trim(),
      trigger: values.trigger.trim(),
      action: values.action.trim(),
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="auto-name">Rule name</label>
        <input
          id="auto-name"
          className={styles.input}
          value={values.name}
          onChange={set("name")}
          required
          autoFocus
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="auto-trigger">Trigger event</label>
        <input
          id="auto-trigger"
          className={styles.input}
          placeholder="Invoice due in 3 days"
          value={values.trigger}
          onChange={set("trigger")}
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="auto-action">Action taken</label>
        <input
          id="auto-action"
          className={styles.input}
          placeholder="WhatsApp + Email"
          value={values.action}
          onChange={set("action")}
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.checkLabel}>
          <input
            type="checkbox"
            checked={values.active}
            onChange={setBool("active")}
          />
          <span>Active</span>
        </label>
      </div>

      <div className={styles.actions}>
        <Btn type="button" variant="ghost" onClick={onCancel}>Cancel</Btn>
        <Btn type="submit" variant="primary">{submitLabel}</Btn>
      </div>
    </form>
  );
}
