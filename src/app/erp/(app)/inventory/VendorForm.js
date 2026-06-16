"use client";

import { useState } from "react";
import { Btn } from "@/components/erp/ui";
import styles from "./VendorForm.module.css";

const STATUSES = ["preferred", "active", "inactive", "blacklisted"];

const todayISO = () => new Date().toISOString().slice(0, 10);

const initials = (name) =>
  (name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "?";

const EMPTY = {
  name: "",
  category: "",
  gst: "",
  pan: "",
  contact: "",
  phone: "",
  email: "",
  location: "",
  rating: 4,
  onTime: 90,
  rejection: 5,
  paymentTerms: "Net 30",
  since: todayISO(),
  status: "active",
};

function toForm(initial) {
  if (!initial) return EMPTY;
  return {
    name: initial.name ?? "",
    category: initial.category ?? "",
    gst: initial.gst ?? "",
    pan: initial.pan ?? "",
    contact: initial.contact ?? "",
    phone: initial.phone ?? "",
    email: initial.email ?? "",
    location: initial.location ?? "",
    rating: initial.rating ?? 4,
    onTime: initial.onTime ?? 90,
    rejection: initial.rejection ?? 5,
    paymentTerms: initial.paymentTerms ?? "Net 30",
    since: initial.since ?? todayISO(),
    status: initial.status ?? "active",
  };
}

const toNum = (v) => (v === "" || v === null || v === undefined ? 0 : Number(v));

export default function VendorForm({ initial, onSubmit, onCancel, submitLabel = "Save" }) {
  const [values, setValues] = useState(() => toForm(initial));

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!values.name.trim()) return;
    onSubmit({
      ...values,
      name: values.name.trim(),
      initials: initial?.initials || initials(values.name),
      category: values.category.trim(),
      gst: values.gst.trim(),
      pan: values.pan.trim(),
      contact: values.contact.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      location: values.location.trim(),
      rating: toNum(values.rating),
      onTime: toNum(values.onTime),
      rejection: toNum(values.rejection),
      paymentTerms: values.paymentTerms.trim(),
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="vendor-name">Vendor / supplier name</label>
        <input id="vendor-name" className={styles.input} value={values.name} onChange={set("name")} required autoFocus />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="vendor-category">Category</label>
          <input id="vendor-category" className={styles.input} placeholder="Civil / Carpentry / Tiles / …" value={values.category} onChange={set("category")} />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="vendor-location">City</label>
          <input id="vendor-location" className={styles.input} value={values.location} onChange={set("location")} />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="vendor-gst">GSTIN</label>
          <input id="vendor-gst" className={styles.input} value={values.gst} onChange={set("gst")} />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="vendor-pan">PAN</label>
          <input id="vendor-pan" className={styles.input} value={values.pan} onChange={set("pan")} />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="vendor-contact">Primary contact name</label>
          <input id="vendor-contact" className={styles.input} value={values.contact} onChange={set("contact")} />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="vendor-phone">Phone</label>
          <input id="vendor-phone" type="tel" className={styles.input} value={values.phone} onChange={set("phone")} />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="vendor-email">Email</label>
        <input id="vendor-email" type="email" className={styles.input} value={values.email} onChange={set("email")} />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="vendor-rating">Rating (1-5)</label>
          <input id="vendor-rating" type="number" min="1" max="5" inputMode="numeric" className={`${styles.input} ${styles.mono}`} value={values.rating} onChange={set("rating")} />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="vendor-ontime">On-time delivery %</label>
          <input id="vendor-ontime" type="number" min="0" max="100" inputMode="numeric" className={`${styles.input} ${styles.mono}`} value={values.onTime} onChange={set("onTime")} />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="vendor-rejection">Rejection rate %</label>
          <input id="vendor-rejection" type="number" min="0" max="100" inputMode="numeric" className={`${styles.input} ${styles.mono}`} value={values.rejection} onChange={set("rejection")} />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="vendor-payment">Payment terms</label>
          <input id="vendor-payment" className={styles.input} placeholder="Net 30" value={values.paymentTerms} onChange={set("paymentTerms")} />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="vendor-since">Since</label>
          <input id="vendor-since" type="date" className={styles.input} value={values.since} onChange={set("since")} />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="vendor-status">Status</label>
          <select id="vendor-status" className={styles.input} value={values.status} onChange={set("status")}>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className={styles.actions}>
        <Btn type="button" variant="ghost" onClick={onCancel}>Cancel</Btn>
        <Btn type="submit" variant="primary">{submitLabel}</Btn>
      </div>
    </form>
  );
}
