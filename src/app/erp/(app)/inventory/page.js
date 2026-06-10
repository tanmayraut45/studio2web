"use client";

import { Boxes, Plus, ArrowRight, PackageCheck, PackagePlus, Recycle } from "lucide-react";
import { PageHeader, KpiCard, Panel, Badge, Btn } from "@/components/erp/ui";
import { Ring } from "@/components/erp/Charts";
import DataTable from "@/components/erp/DataTable";
import { materials, stockMovements, warehouses, vendorName, materialName, employeeName } from "@/erp/data";
import { inr, inrCompact, num, dateShort } from "@/erp/lib/format";
import grid from "@/components/erp/layout.module.css";
import styles from "./inventory.module.css";

const stockValue = materials.reduce((s, m) => s + (m.warehouse + m.site + m.transit) * m.rate, 0);
const lowStock = materials.filter((m) => m.warehouse < m.reorder);
const damagedValue = materials.reduce((s, m) => s + m.damaged * m.rate, 0);

const LIFECYCLE = [
  { label: "Purchase", icon: PackagePlus, color: "info" },
  { label: "Warehouse", icon: Boxes, color: "gold" },
  { label: "Site", icon: ArrowRight, color: "purple" },
  { label: "Consumption", icon: PackageCheck, color: "success" },
  { label: "Waste", icon: Recycle, color: "danger" },
];

const MOVE_TONE = { Inward: "success", Transfer: "info", Consumption: "warn", Return: "purple" };

export default function InventoryPage() {
  const cols = [
    { key: "name", label: "Material", render: (r) => <div className={styles.mName}><strong>{r.name}</strong><span>{r.sku}</span></div> },
    { key: "category", label: "Category", render: (r) => <Badge tone="neutral">{r.category}</Badge> },
    { key: "warehouse", label: "WH", align: "right", mono: true },
    { key: "site", label: "Site", align: "right", mono: true },
    { key: "transit", label: "Transit", align: "right", mono: true },
    { key: "reserved", label: "Reserved", align: "right", mono: true },
    { key: "damaged", label: "Damaged", align: "right", mono: true, render: (r) => <span className={r.damaged > 0 ? styles.dmg : ""}>{r.damaged}</span> },
    { key: "status", label: "Status", render: (r) => r.warehouse < r.reorder ? <Badge tone="danger" dot>Low</Badge> : <Badge tone="success" dot>OK</Badge> },
  ];

  return (
    <div className={grid.stack}>
      <PageHeader title="Inventory" subtitle="Warehouse-grade, multi-location stock control" icon={Boxes}>
        <Btn icon={Plus}>Add Material</Btn>
      </PageHeader>

      <div className={grid.kpiGrid}>
        <KpiCard index={0} label="Stock Value" value={inrCompact(stockValue)} sub={`${materials.length} SKUs`} accent="gold" />
        <KpiCard index={1} label="Low Stock" value={lowStock.length} sub="below reorder" accent="danger" />
        <KpiCard index={2} label="Damaged Value" value={inr(damagedValue)} accent="warn" />
        <KpiCard index={3} label="Locations" value={warehouses.length} sub="warehouses + sites" accent="info" />
      </div>

      <div className={grid.cols3}>
        {warehouses.map((w, i) => (
          <Panel key={w.id} padded>
            <div className={styles.wh}>
              <Ring value={w.utilization} size={64} color={w.utilization > 75 ? "warn" : "success"} />
              <div className={styles.whInfo}>
                <strong>{w.name}</strong>
                <span>{w.items} items</span>
                <span className={styles.whVal}>{inrCompact(w.value)}</span>
              </div>
            </div>
          </Panel>
        ))}
      </div>

      {/* Material lifecycle */}
      <Panel title="Material lifecycle" subtitle="End-to-end traceability">
        <div className={styles.lifecycle}>
          {LIFECYCLE.map((step, i) => (
            <div key={step.label} className={styles.lcStep}>
              <span className={styles.lcIcon} data-c={step.color}><step.icon size={18} /></span>
              <span className={styles.lcLabel}>{step.label}</span>
              {i < LIFECYCLE.length - 1 && <ArrowRight size={16} className={styles.lcArrow} />}
            </div>
          ))}
        </div>
      </Panel>

      <div className={grid.split}>
        <Panel title="Stock register" padded>
          <DataTable columns={cols} rows={materials} searchKeys={["name", "sku", "category"]} pageSize={8} />
        </Panel>

        <Panel title="Recent movements" subtitle="Inward, transfers & consumption">
          <div className={styles.moves}>
            {stockMovements.map((m) => (
              <div className={styles.move} key={m.id}>
                <Badge tone={MOVE_TONE[m.type]}>{m.type}</Badge>
                <div className={styles.moveInfo}>
                  <strong>{materialName(m.material)}</strong>
                  <span>{m.location}</span>
                </div>
                <div className={styles.moveQty}>
                  <strong>{num(m.qty)}</strong>
                  <span>{dateShort(m.date).slice(0, 6)}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
