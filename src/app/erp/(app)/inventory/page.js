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
  Pencil, Trash2, Warehouse, Truck,
} from "lucide-react";
import { PageHeader, KpiCard, Panel, Badge, Btn, Tag, Avatar } from "@/components/erp/ui";
import { Ring } from "@/components/erp/Charts";
import DataTable from "@/components/erp/DataTable";
import { Drawer } from "@/components/erp/Modal";
import { vendorName, materialName } from "@/erp/data";
import { inr, inrCompact, num, dateShort } from "@/erp/lib/format";
import { useMaterialsStore } from "@/erp/stores/useMaterialsStore";
import { useStockMovementsStore } from "@/erp/stores/useStockMovementsStore";
import { useWarehousesStore } from "@/erp/stores/useWarehousesStore";
import { useVendorsStore } from "@/erp/stores/useVendorsStore";
import MaterialForm from "./MaterialForm";
import MovementForm from "./MovementForm";
import WarehouseForm from "./WarehouseForm";
import VendorForm from "./VendorForm";
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

  const warehouses = useWarehousesStore((s) => s.warehouses);
  const hydrateWarehouses = useWarehousesStore((s) => s.hydrate);
  const addWarehouse = useWarehousesStore((s) => s.addWarehouse);
  const updateWarehouse = useWarehousesStore((s) => s.updateWarehouse);
  const removeWarehouse = useWarehousesStore((s) => s.removeWarehouse);

  const vendors = useVendorsStore((s) => s.vendors);
  const hydrateVendors = useVendorsStore((s) => s.hydrate);
  const addVendor = useVendorsStore((s) => s.addVendor);
  const updateVendor = useVendorsStore((s) => s.updateVendor);
  const removeVendor = useVendorsStore((s) => s.removeVendor);

  const [creating, setCreating] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loggingMovement, setLoggingMovement] = useState(false);
  const [addWarehouseOpen, setAddWarehouseOpen] = useState(false);
  const [editingWarehouseId, setEditingWarehouseId] = useState(null);
  const [addVendorOpen, setAddVendorOpen] = useState(false);
  const [editingVendorId, setEditingVendorId] = useState(null);

  useEffect(() => {
    hydrate();
    hydrateMovements();
    hydrateWarehouses();
    hydrateVendors();
  }, [hydrate, hydrateMovements, hydrateWarehouses, hydrateVendors]);

  const editingVendor = editingVendorId ? vendors.find((v) => v.id === editingVendorId) : null;

  const handleAddVendor = async (values) => {
    await addVendor(values);
    setAddVendorOpen(false);
  };

  const handleUpdateVendor = async (values) => {
    if (!editingVendor) return;
    await updateVendor(editingVendor.id, values);
    setEditingVendorId(null);
  };

  const handleDeleteVendor = async () => {
    if (!editingVendor) return;
    if (!window.confirm(`Delete vendor "${editingVendor.name}"?`)) return;
    await removeVendor(editingVendor.id);
    setEditingVendorId(null);
  };

  const editingWarehouse = editingWarehouseId
    ? warehouses.find((w) => w.id === editingWarehouseId)
    : null;

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

  const handleAddWarehouse = async (values) => {
    await addWarehouse(values);
    setAddWarehouseOpen(false);
  };

  const handleUpdateWarehouse = async (values) => {
    if (!editingWarehouse) return;
    await updateWarehouse(editingWarehouse.id, values);
    setEditingWarehouseId(null);
  };

  const handleDeleteWarehouse = async () => {
    if (!editingWarehouse) return;
    if (!window.confirm(`Delete warehouse "${editingWarehouse.name}"? This cannot be undone.`)) return;
    await removeWarehouse(editingWarehouse.id);
    setEditingWarehouseId(null);
  };

  return (
    <div className={grid.stack}>
      <PageHeader title="Inventory" subtitle="Warehouse-grade, multi-location stock control" icon={Boxes}>
        <Btn variant="ghost" icon={Truck} onClick={() => setAddVendorOpen(true)}>Add Vendor</Btn>
        <Btn variant="ghost" icon={Warehouse} onClick={() => setAddWarehouseOpen(true)}>Add Warehouse</Btn>
        <Btn variant="ghost" icon={ArrowDownUp} onClick={() => setLoggingMovement(true)}>Log Movement</Btn>
        <Btn icon={Plus} onClick={() => setCreating(true)}>Add Material</Btn>
      </PageHeader>

      <div className={grid.kpiGrid}>
        <KpiCard index={0} label="Stock Value" value={inrCompact(stockValue)} sub={`${materials.length} SKUs`} accent="gold" />
        <KpiCard index={1} label="Low Stock" value={lowStockCount} sub="below reorder" accent="danger" />
        <KpiCard index={2} label="Damaged Value" value={inr(damagedValue)} accent="warn" />
        <KpiCard index={3} label="Locations" value={warehouses.length} sub="warehouses + sites" accent="info" />
      </div>

      {warehouses.length > 0 ? (
        <div className={grid.cols3}>
          {warehouses.map((w) => {
            const occ = Number(w.capacity ?? w.utilization ?? 0);
            return (
              <div
                key={w.id}
                onClick={() => setEditingWarehouseId(w.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setEditingWarehouseId(w.id);
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                <Panel padded>
                  <div className={styles.wh}>
                    <Ring value={occ} size={64} color={occ > 75 ? "warn" : "success"} />
                    <div className={styles.whInfo}>
                      <strong>{w.name}</strong>
                      <span>{num(w.items || 0)} items</span>
                      {w.location && <span>{w.location}</span>}
                    </div>
                  </div>
                </Panel>
              </div>
            );
          })}
        </div>
      ) : (
        <p className={styles.emptyHint}>No warehouses configured yet.</p>
      )}

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
          {movements.length > 0 ? (
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
          ) : (
            <p className={styles.emptyHint}>No stock movements logged yet.</p>
          )}
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

      {/* Create warehouse drawer */}
      <Drawer
        open={addWarehouseOpen}
        onClose={() => setAddWarehouseOpen(false)}
        title="New warehouse"
        width={500}
      >
        {addWarehouseOpen && (
          <WarehouseForm
            initial={null}
            submitLabel="Create warehouse"
            onSubmit={handleAddWarehouse}
            onCancel={() => setAddWarehouseOpen(false)}
          />
        )}
      </Drawer>

      {/* Edit warehouse drawer */}
      <Drawer
        open={!!editingWarehouse}
        onClose={() => setEditingWarehouseId(null)}
        title="Edit warehouse"
        width={500}
      >
        {editingWarehouse && (
          <div className={styles.detail}>
            <WarehouseForm
              initial={editingWarehouse}
              submitLabel="Save changes"
              onSubmit={handleUpdateWarehouse}
              onCancel={() => setEditingWarehouseId(null)}
            />
            <div className={styles.actions}>
              <Btn variant="outline" icon={Trash2} onClick={handleDeleteWarehouse}>Delete warehouse</Btn>
            </div>
          </div>
        )}
      </Drawer>

      <Panel title="Vendor directory" subtitle="Suppliers and contractors">
        {vendors.length > 0 ? (
          <div className={styles.vendorList}>
            {vendors.map((v) => (
              <button key={v.id} type="button" className={styles.vendorRow} onClick={() => setEditingVendorId(v.id)}>
                <Avatar name={v.name} initials={v.initials} size={32} tone="info" />
                <div className={styles.vrInfo}>
                  <strong>{v.name}</strong>
                  <span>{[v.category, v.location].filter(Boolean).join(" · ") || "—"}</span>
                </div>
                {v.rating != null && <span className={styles.vrRating}>★ {v.rating}</span>}
              </button>
            ))}
          </div>
        ) : (
          <p className={styles.emptyHint}>No vendors yet — click Add Vendor above.</p>
        )}
      </Panel>

      <Drawer
        open={addVendorOpen}
        onClose={() => setAddVendorOpen(false)}
        title="New vendor"
        width={520}
      >
        {addVendorOpen && (
          <VendorForm
            initial={null}
            submitLabel="Create vendor"
            onSubmit={handleAddVendor}
            onCancel={() => setAddVendorOpen(false)}
          />
        )}
      </Drawer>

      <Drawer
        open={!!editingVendor}
        onClose={() => setEditingVendorId(null)}
        title="Edit vendor"
        width={520}
      >
        {editingVendor && (
          <div className={styles.detail}>
            <VendorForm
              initial={editingVendor}
              submitLabel="Save changes"
              onSubmit={handleUpdateVendor}
              onCancel={() => setEditingVendorId(null)}
            />
            <div className={styles.actions}>
              <Btn variant="outline" icon={Trash2} onClick={handleDeleteVendor}>Delete vendor</Btn>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
