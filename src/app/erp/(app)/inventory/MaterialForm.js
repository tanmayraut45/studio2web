"use client";

import { useEffect, useState } from "react";
import { Btn } from "@/components/erp/ui";
import { useVendorsStore } from "@/erp/stores/useVendorsStore";
import styles from "./MaterialForm.module.css";

const UNITS = ["sqft", "sq.ft", "piece", "nos", "kg", "litre", "ltr", "mtr", "sheet", "box"];

const CATEGORIES = [
  "Stone", "Wood", "Tiles", "Veneer", "Hardware",
  "Paint", "Lighting", "Sanitary", "Glass", "Metal", "Fabric",
];

const emptyForm = (vendors) => ({
  name: "",
  sku: "",
  category: CATEGORIES[0],
  unit: UNITS[0],
  rate: "",
  warehouse: "",
  site: "",
  transit: "",
  reserved: "",
  reorder: "",
  damaged: 0,
  vendor: vendors[0]?.id || "",
  hsn: "",
});

function toForm(initial, vendors) {
  if (!initial) return emptyForm(vendors);
  return {
    name: initial.name ?? "",
    sku: initial.sku ?? "",
    category: initial.category ?? CATEGORIES[0],
    unit: initial.unit ?? UNITS[0],
    rate: initial.rate ?? "",
    warehouse: initial.warehouse ?? "",
    site: initial.site ?? "",
    transit: initial.transit ?? "",
    reserved: initial.reserved ?? "",
    reorder: initial.reorder ?? "",
    damaged: initial.damaged ?? 0,
    vendor: initial.vendor ?? (vendors[0]?.id || ""),
    hsn: initial.hsn ?? "",
  };
}

const toNum = (v) => (v === "" || v === null || v === undefined ? 0 : Number(v));

export default function MaterialForm({ initial, onSubmit, onCancel, submitLabel = "Save" }) {
  const vendors = useVendorsStore((s) => s.vendors);
  const hydrateVendors = useVendorsStore((s) => s.hydrate);
  useEffect(() => { hydrateVendors(); }, [hydrateVendors]);

  const [values, setValues] = useState(() => toForm(initial, vendors));

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!values.name.trim() || !values.sku.trim()) return;
    onSubmit({
      ...values,
      name: values.name.trim(),
      sku: values.sku.trim(),
      category: values.category.trim(),
      hsn: values.hsn.trim(),
      rate: toNum(values.rate),
      warehouse: toNum(values.warehouse),
      site: toNum(values.site),
      transit: toNum(values.transit),
      reserved: toNum(values.reserved),
      reorder: toNum(values.reorder),
      damaged: toNum(values.damaged),
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="mat-name">Material name</label>
        <input
          id="mat-name"
          className={styles.input}
          value={values.name}
          onChange={set("name")}
          required
          autoFocus
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="mat-sku">SKU</label>
          <input
            id="mat-sku"
            className={`${styles.input} ${styles.mono}`}
            value={values.sku}
            onChange={set("sku")}
            required
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="mat-hsn">HSN code</label>
          <input
            id="mat-hsn"
            className={`${styles.input} ${styles.mono}`}
            value={values.hsn}
            onChange={set("hsn")}
            placeholder="2515"
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="mat-category">Category</label>
          <input
            id="mat-category"
            className={styles.input}
            list="mat-category-list"
            placeholder="Tiles / Veneer / Hardware / Paint / …"
            value={values.category}
            onChange={set("category")}
          />
          <datalist id="mat-category-list">
            {CATEGORIES.map((c) => <option key={c} value={c} />)}
          </datalist>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="mat-unit">Unit (UOM)</label>
          <select id="mat-unit" className={styles.input} value={values.unit} onChange={set("unit")}>
            {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="mat-rate">Rate (Rs per UOM)</label>
          <input
            id="mat-rate"
            type="number"
            min="0"
            inputMode="decimal"
            className={`${styles.input} ${styles.mono}`}
            value={values.rate}
            onChange={set("rate")}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="mat-reorder">Reorder threshold</label>
          <input
            id="mat-reorder"
            type="number"
            min="0"
            inputMode="numeric"
            className={`${styles.input} ${styles.mono}`}
            value={values.reorder}
            onChange={set("reorder")}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="mat-warehouse">On hand — Warehouse</label>
          <input
            id="mat-warehouse"
            type="number"
            min="0"
            inputMode="numeric"
            className={`${styles.input} ${styles.mono}`}
            value={values.warehouse}
            onChange={set("warehouse")}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="mat-site">On hand — Site</label>
          <input
            id="mat-site"
            type="number"
            min="0"
            inputMode="numeric"
            className={`${styles.input} ${styles.mono}`}
            value={values.site}
            onChange={set("site")}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="mat-transit">In transit</label>
          <input
            id="mat-transit"
            type="number"
            min="0"
            inputMode="numeric"
            className={`${styles.input} ${styles.mono}`}
            value={values.transit}
            onChange={set("transit")}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="mat-reserved">Reserved</label>
          <input
            id="mat-reserved"
            type="number"
            min="0"
            inputMode="numeric"
            className={`${styles.input} ${styles.mono}`}
            value={values.reserved}
            onChange={set("reserved")}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="mat-damaged">Damaged</label>
          <input
            id="mat-damaged"
            type="number"
            min="0"
            inputMode="numeric"
            className={`${styles.input} ${styles.mono}`}
            value={values.damaged}
            onChange={set("damaged")}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="mat-vendor">Preferred supplier</label>
          <select id="mat-vendor" className={styles.input} value={values.vendor} onChange={set("vendor")}>
            <option value="">— None —</option>
            {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
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
