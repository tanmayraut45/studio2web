"use client";

/*
 * Inventory — Materials AND stock movements are now fully wired CRUD modules,
 * backed by `useMaterialsStore` and `useStockMovementsStore` respectively.
 * Logging an inward / outward / damage movement also adjusts the affected
 * material's `warehouse` bucket so the stock register stays consistent with
 * the movement log.
 */

import { useEffect, useMemo, useState } from "react";
import {
  Boxes, Plus, ArrowRight, ArrowDownUp, PackageCheck, PackagePlus, Recycle,
  Pencil, Trash2,
} from "lucide-react";
import { PageHeader, KpiCard, Panel, Badge, Btn, Tag } from "@/components/erp/ui";
import { Ring } from "@/components/erp/Charts";
import DataTable from "@/components/erp/DataTable";
import { Drawer } from "@/components/erp/Modal";
import { warehouses, vendorName, materialName } from "@/erp/data";
import { inr, inrCompact, num, dateShort } from "@/erp/lib/format";
import { useMaterialsStore } from "@/erp/stores/useMaterialsStore";
import { useStockMovementsStore } from "@/erp/stores/useStockMovementsStore";
import MaterialForm from "./MaterialForm";
import MovementForm from "./MovementForm";
import grid from "@/components/erp/layout.module.css";
import styles from "./inventory.module.css";

const LIFECYCLE = [
  { label: "Purchase", icon: PackagePlus, color: "info" },
  { label: "Warehouse", icon: Boxes, color: "gold" },
  { label: "Site", icon: ArrowRight, color: "purple" },
  { label: "Consumption", icon: PackageCheck, color: "success" },
  { label: "Waste", icon: Recycle, color: "danger" },
];

// Type → badge tone. Legacy seed rows use TitleCase (Inward, Transfer,
// Consumption, Return); newly logged movements use the lowercase contract
// (inward, outward, transfer, adjustment, damage). Look up via lowercased key.
const MOVE_TONE = {
  inward: "success",
  outward: "warn",
  transfer: "info",
  consumption: "warn",
  return: "purple",
  adjustment: "neutral",
  damage: "danger",
};
const moveLabel = (t) => (t ? t.charAt(0).toUpperCase() + t.slice(1).toLowerCase() : "—");
const moveTone = (t) => MOVE_TONE[(t || "").toLowerCase()] || "neutral";

export default function InventoryPage() {
  const materials = useMaterialsStore((s) => s.materials);
  const hydrate = useMaterialsStore((s) => s.hydrate);
  const addMaterial = useMaterialsStore((s) => s.addMaterial);
  const updateMaterial = useMaterialsStore((s) => s.updateMaterial);
  const removeMaterial = useMaterialsStore((s) => s.removeMaterial);

  const movements = useStockMovementsStore((s) => s.movements);
  const hydrateMovements = useStockMovementsStore((s) => s.hydrate);
  const logMovement = useStockMovementsStore((s) => s.logMovement);

  const [creating, setCreating] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loggingMovement, setLoggingMovement] = useState(false);

  useEffect(() => {
    hydrate();
    hydrateMovements();
  }, [hydrate, hydrateMovements]);

  const selected = selectedId ? materials.find((m) => m.id === selectedId) : null;

  const { stockValue, lowStockCount, damagedValue } = useMemo(() => {
    const sv = materials.reduce(
      (s, m) => s + ((m.warehouse || 0) + (m.site || 0) + (m.transit || 0)) * (m.rate || 0),
      0,
    );
    const ls = materials.filter((m) => (m.warehouse || 0) < (m.reorder || 0)).length;
    const dv = materials.reduce((s, m) => s + (m.damaged || 0) * (m.rate || 0), 0);
    return { stockValue: sv, lowStockCount: ls, damagedValue: dv };
  }, [materials]);

  const cols = [
    { key: "name", label: "Material", render: (r) => <div className={styles.mName}><strong>{r.name}</strong><span>{r.sku}</span></div> },
    { key: "category", label: "Category", render: (r) => <Badge tone="neutral">{r.category}</Badge> },
    { key: "warehouse", label: "WH", align: "right", mono: true },
    { key: "site", label: "Site", align: "right", mono: true },
    { key: "transit", label: "Transit", align: "right", mono: true },
    { key: "reserved", label: "Reserved", align: "right", mono: true },
    { key: "damaged", label: "Damaged", align: "right", mono: true, render: (r) => <span className={r.damaged > 0 ? styles.dmg : ""}>{r.damaged}</span> },
    { key: "status", label: "Status", render: (r) => (r.warehouse || 0) < (r.reorder || 0) ? <Badge tone="danger" dot>Low</Badge> : <Badge tone="success" dot>OK</Badge> },
  ];

  const openMaterial = (m) => {
    setSelectedId(m.id);
    setEditing(false);
  };

  const closeDrawer = () => {
    setSelectedId(null);
    setEditing(false);
  };

  const handleCreate = async (values) => {
    await addMaterial(values);
    setCreating(false);
  };

  const handleUpdate = async (values) => {
    if (!selected) return;
    await updateMaterial(selected.id, values);
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!selected) return;
    if (!window.confirm(`Delete material "${selected.name}"? This cannot be undone.`)) return;
    await removeMaterial(selected.id);
    closeDrawer();
  };

  const handleLogMovement = async (values) => {
    // Apply sign convention based on movement type.
    //   inward                  → +qty
    //   outward / damage        → −qty
    //   transfer / adjustment   → +qty (no auto-sign; treated as inward for now)
    const absQty = Math.abs(Number(values.qty) || 0);
    const sign = values.type === "outward" || values.type === "damage" ? -1 : 1;
    const signedQty = sign * absQty;

    await logMovement({ ...values, qty: signedQty });

    // Reflect the change on the affected material's warehouse bucket.
    // Clamp at zero so we never push the bucket negative.
    const m = materials.find((x) => x.id === values.material);
    if (m) {
      const nextWh = Math.max(0, (m.warehouse || 0) + signedQty);
      await updateMaterial(m.id, { warehouse: nextWh });
    }

    setLoggingMovement(false);
  };

  return (
    <div className={grid.stack}>
      <PageHeader title="Inventory" subtitle="Warehouse-grade, multi-location stock control" icon={Boxes}>
        <Btn variant="ghost" icon={ArrowDownUp} onClick={() => setLoggingMovement(true)}>Log Movement</Btn>
        <Btn icon={Plus} onClick={() => setCreating(true)}>Add Material</Btn>
      </PageHeader>

      <div className={grid.kpiGrid}>
        <KpiCard index={0} label="Stock Value" value={inrCompact(stockValue)} sub={`${materials.length} SKUs`} accent="gold" />
        <KpiCard index={1} label="Low Stock" value={lowStockCount} sub="below reorder" accent="danger" />
        <KpiCard index={2} label="Damaged Value" value={inr(damagedValue)} accent="warn" />
        <KpiCard index={3} label="Locations" value={warehouses.length} sub="warehouses + sites" accent="info" />
      </div>

      <div className={grid.cols3}>
        {warehouses.map((w) => (
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
          <DataTable
            columns={cols}
            rows={materials}
            onRowClick={openMaterial}
            searchKeys={["name", "sku", "category"]}
            pageSize={8}
          />
        </Panel>

        <Panel title="Recent movements" subtitle="Inward, transfers & consumption">
          <div className={styles.moves}>
            {[...movements].reverse().map((m) => (
              <div className={styles.move} key={m.id}>
                <Badge tone={moveTone(m.type)}>{moveLabel(m.type)}</Badge>
                <div className={styles.moveInfo}>
                  <strong>{materialName(m.material)}</strong>
                  <span>{m.location || m.ref || "—"}</span>
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

      {/* Log movement drawer */}
      <Drawer
        open={loggingMovement}
        onClose={() => setLoggingMovement(false)}
        title="Log stock movement"
        width={520}
      >
        {loggingMovement && (
          <MovementForm
            onSubmit={handleLogMovement}
            onCancel={() => setLoggingMovement(false)}
          />
        )}
      </Drawer>

      {/* Create material drawer */}
      <Drawer
        open={creating}
        onClose={() => setCreating(false)}
        title="New material"
        width={520}
      >
        {creating && (
          <MaterialForm
            initial={null}
            submitLabel="Create material"
            onSubmit={handleCreate}
            onCancel={() => setCreating(false)}
          />
        )}
      </Drawer>

      {/* Detail / edit / delete drawer */}
      <Drawer
        open={!!selected}
        onClose={closeDrawer}
        title={editing ? "Edit material" : "Material details"}
        width={500}
      >
        {selected && editing && (
          <MaterialForm
            initial={selected}
            submitLabel="Save changes"
            onSubmit={handleUpdate}
            onCancel={() => setEditing(false)}
          />
        )}
        {selected && !editing && (
          <div className={styles.detail}>
            <div className={styles.detailHead}>
              <div className={styles.detailHeadInfo}>
                <h3>{selected.name}</h3>
                <div className={styles.detailHeadMeta}>
                  <Tag>{selected.sku}</Tag>
                  <Badge tone="neutral">{selected.category}</Badge>
                  {(selected.warehouse || 0) < (selected.reorder || 0)
                    ? <Badge tone="danger" dot>Low stock</Badge>
                    : <Badge tone="success" dot>OK</Badge>}
                </div>
              </div>
            </div>
            <div className={styles.detailGrid}>
              <div><span>Rate</span><strong>{inr(selected.rate || 0)} / {selected.unit}</strong></div>
              <div><span>Reorder</span><strong>{num(selected.reorder || 0)}</strong></div>
              <div><span>Warehouse</span><strong>{num(selected.warehouse || 0)}</strong></div>
              <div><span>Site</span><strong>{num(selected.site || 0)}</strong></div>
              <div><span>In transit</span><strong>{num(selected.transit || 0)}</strong></div>
              <div><span>Reserved</span><strong>{num(selected.reserved || 0)}</strong></div>
              <div><span>Damaged</span><strong>{num(selected.damaged || 0)}</strong></div>
              <div><span>HSN</span><strong>{selected.hsn || "—"}</strong></div>
              <div><span>Supplier</span><strong>{vendorName(selected.vendor)}</strong></div>
              <div><span>Stock value</span><strong>{inrCompact(((selected.warehouse || 0) + (selected.site || 0) + (selected.transit || 0)) * (selected.rate || 0))}</strong></div>
            </div>
            <div className={styles.actions}>
              <Btn variant="ghost" icon={Pencil} onClick={() => setEditing(true)}>Edit</Btn>
              <Btn variant="outline" icon={Trash2} onClick={handleDelete}>Delete</Btn>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
