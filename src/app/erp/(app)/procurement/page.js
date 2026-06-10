"use client";

import { ShoppingCart, Plus, Check, Truck, Award } from "lucide-react";
import { PageHeader, KpiCard, Panel, Badge, Btn } from "@/components/erp/ui";
import { Meter } from "@/components/erp/Charts";
import DataTable from "@/components/erp/DataTable";
import {
  purchaseOrders, purchaseRequests, rfqComparison, vendors,
  vendorName, projectName,
} from "@/erp/data";
import { inr, inrCompact, pct } from "@/erp/lib/format";
import grid from "@/components/erp/layout.module.css";
import styles from "./procurement.module.css";

const openValue = purchaseOrders.filter((p) => p.status !== "Delivered").reduce((s, p) => s + p.value, 0);
const monthSpend = purchaseOrders.reduce((s, p) => s + p.value, 0);

export default function ProcurementPage() {
  const poCols = [
    { key: "code", label: "PO", mono: true, render: (r) => <strong className={styles.code}>{r.code}</strong> },
    { key: "vendor", label: "Vendor", render: (r) => vendorName(r.vendor) },
    { key: "project", label: "Project", render: (r) => <span className={styles.muted}>{projectName(r.project)}</span> },
    { key: "value", label: "Value", align: "right", mono: true, render: (r) => inr(r.value) },
    { key: "status", label: "Status", render: (r) => <Badge>{r.status}</Badge> },
    { key: "payment", label: "Terms", render: (r) => <Badge tone="neutral">{r.payment}</Badge> },
  ];

  return (
    <div className={grid.stack}>
      <PageHeader title="Procurement" subtitle="Requests, RFQs, purchase orders & vendor intelligence" icon={ShoppingCart}>
        <Btn icon={Plus}>New PO</Btn>
      </PageHeader>

      <div className={grid.kpiGrid}>
        <KpiCard index={0} label="Open POs" value={inrCompact(openValue)} sub={`${purchaseOrders.filter((p) => p.status !== "Delivered").length} in flight`} accent="gold" />
        <KpiCard index={1} label="Month Spend" value={inrCompact(monthSpend)} delta="+9%" deltaUp={false} accent="info" />
        <KpiCard index={2} label="Pending Approval" value={purchaseOrders.filter((p) => p.status === "Pending Approval").length} sub="needs sign-off" accent="warn" />
        <KpiCard index={3} label="Active Vendors" value={vendors.length} sub={`${vendors.filter((v) => v.status === "Preferred").length} preferred`} accent="success" />
      </div>

      {/* Vendor comparison engine */}
      <Panel title="Vendor comparison engine" subtitle={rfqComparison.item} action={<Badge tone="info">RFQ open</Badge>}>
        <div className={styles.compare}>
          {rfqComparison.quotes.map((q) => (
            <div key={q.vendor} className={`${styles.quote} ${q.recommended ? styles.quoteRec : ""}`}>
              {q.recommended && <span className={styles.recBadge}><Award size={12} /> Recommended</span>}
              <strong className={styles.quoteVendor}>{vendorName(q.vendor)}</strong>
              <div className={styles.quotePrice}>{inr(q.price)}</div>
              <span className={styles.quotePer}>{inr(q.perUnit)}/unit</span>
              <div className={styles.quoteRows}>
                <div><span>Delivery</span><strong>{q.delivery}</strong></div>
                <div><span>Quality</span><strong>{q.quality}/100</strong></div>
                <div><span>Credit</span><strong>{q.credit}</strong></div>
              </div>
              <Btn variant={q.recommended ? "primary" : "outline"} icon={q.recommended ? Check : undefined}>
                {q.recommended ? "Award PO" : "Select"}
              </Btn>
            </div>
          ))}
        </div>
      </Panel>

      <div className={grid.split}>
        <Panel title="Purchase orders" padded>
          <DataTable columns={poCols} rows={purchaseOrders} searchKeys={["code", "status"]} pageSize={6} />
        </Panel>

        <Panel title="Purchase requests" subtitle="Awaiting RFQ / approval">
          <div className={styles.prList}>
            {purchaseRequests.map((pr) => (
              <div className={styles.pr} key={pr.id}>
                <div className={styles.prInfo}>
                  <strong>{pr.item}</strong>
                  <span>{projectName(pr.project)} · {pr.qty} units</span>
                </div>
                <div className={styles.prMeta}>
                  <Badge tone={pr.priority === "Urgent" ? "danger" : pr.priority === "High" ? "warn" : "neutral"}>{pr.priority}</Badge>
                  <Badge>{pr.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Vendor scorecards" subtitle="Performance-ranked supplier intelligence">
        <div className={styles.vendorGrid}>
          {[...vendors].sort((a, b) => b.rating - a.rating).map((v) => (
            <div className={styles.vendor} key={v.id}>
              <div className={styles.vTop}>
                <div>
                  <strong>{v.name}</strong>
                  <span>{v.category}</span>
                </div>
                <span className={styles.vRating}>{v.rating}</span>
              </div>
              <div className={styles.vMetric}><span>On-time <b>{v.onTime}%</b></span><Meter value={v.onTime} color="success" height={5} /></div>
              <div className={styles.vMetric}><span>Quality <b>{v.quality}%</b></span><Meter value={v.quality} color="info" height={5} /></div>
              <div className={styles.vFoot}>
                <span><Truck size={11} /> {v.creditDays}d credit</span>
                <span>{pct(v.rejection)} reject</span>
                <Badge tone={v.status === "Preferred" ? "success" : v.status === "Watch" ? "danger" : "neutral"}>{v.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
