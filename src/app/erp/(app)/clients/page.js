"use client";

import { useState } from "react";
import { Contact, Plus, Star, Phone, Mail, MapPin, Building2, FolderKanban } from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader, KpiCard, Badge, Avatar, Btn, Tag } from "@/components/erp/ui";
import { Drawer } from "@/components/erp/Modal";
import { clients, getProject } from "@/erp/data";
import { inrCompact, inr, dateShort } from "@/erp/lib/format";
import grid from "@/components/erp/layout.module.css";
import styles from "./clients.module.css";

const totalLTV = clients.reduce((s, c) => s + c.lifetimeValue, 0);
const avgRating = (clients.reduce((s, c) => s + c.rating, 0) / clients.length).toFixed(1);

function Stars({ n }) {
  return (
    <span className={styles.stars}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={13} fill={i < n ? "currentColor" : "none"} />
      ))}
    </span>
  );
}

export default function ClientsPage() {
  const [selected, setSelected] = useState(null);

  return (
    <div className={grid.stack}>
      <PageHeader title="Clients" subtitle="Centralized client intelligence & relationships" icon={Contact}>
        <Btn icon={Plus}>Add Client</Btn>
      </PageHeader>

      <div className={grid.kpiGrid}>
        <KpiCard index={0} label="Total Clients" value={clients.length} sub="all active" accent="gold" />
        <KpiCard index={1} label="Lifetime Value" value={inrCompact(totalLTV)} delta="+18%" deltaUp accent="success" />
        <KpiCard index={2} label="Avg Satisfaction" value={`${avgRating}/5`} sub="across portfolio" accent="info" />
        <KpiCard index={3} label="Repeat Clients" value="2" sub="33% retention" accent="purple" />
      </div>

      <div className={styles.cardGrid}>
        {clients.map((c, i) => (
          <motion.button
            key={c.id}
            className={styles.clientCard}
            onClick={() => setSelected(c)}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <div className={styles.ccTop}>
              <Avatar name={c.company} initials={c.initials} size={44} tone={["gold", "info", "purple", "success"][i % 4]} />
              <Stars n={c.rating} />
            </div>
            <h3>{c.company}</h3>
            <span className={styles.ccType}><Building2 size={12} /> {c.type}</span>
            <div className={styles.ccStats}>
              <div><span>Lifetime</span><strong>{inrCompact(c.lifetimeValue)}</strong></div>
              <div><span>Projects</span><strong>{c.projects.length}</strong></div>
            </div>
            <div className={styles.ccFoot}>
              <Tag>{c.style}</Tag>
              <Badge tone="success" dot>Active</Badge>
            </div>
          </motion.button>
        ))}
      </div>

      <Drawer open={!!selected} onClose={() => setSelected(null)} title="Client profile" width={480}>
        {selected && (
          <div className={styles.detail}>
            <div className={styles.detailHead}>
              <Avatar name={selected.company} initials={selected.initials} size={56} tone="gold" />
              <div>
                <h3>{selected.company}</h3>
                <p>{selected.name}</p>
                <Stars n={selected.rating} />
              </div>
            </div>

            <div className={styles.contactRow}>
              <a href={`tel:${selected.phone}`}><Phone size={14} /> {selected.phone}</a>
              <a href={`mailto:${selected.email}`}><Mail size={14} /> {selected.email}</a>
            </div>

            <section className={styles.section}>
              <h4>KYC & Compliance</h4>
              <div className={styles.kvGrid}>
                <div><span>GST</span><strong>{selected.gst}</strong></div>
                <div><span>PAN</span><strong>{selected.pan}</strong></div>
                <div><span>Client Since</span><strong>{dateShort(selected.since)}</strong></div>
                <div><span>Budget Flex</span><strong>{selected.budgetFlex}</strong></div>
              </div>
            </section>

            <section className={styles.section}>
              <h4>Addresses</h4>
              <p className={styles.addr}><MapPin size={13} /> <strong>Billing:</strong> {selected.billing}</p>
              <p className={styles.addr}><MapPin size={13} /> <strong>Site:</strong> {selected.site}</p>
            </section>

            <section className={styles.section}>
              <h4>Decision making</h4>
              <p className={styles.addr}>Primary: <strong>{selected.decisionMaker}</strong></p>
              <p className={styles.addr}>Preferred style: <strong>{selected.style}</strong></p>
            </section>

            <section className={styles.section}>
              <h4>Projects</h4>
              {selected.projects.map((pid) => {
                const p = getProject(pid);
                if (!p) return null;
                return (
                  <div key={pid} className={styles.projRow}>
                    <FolderKanban size={15} />
                    <div>
                      <strong>{p.name}</strong>
                      <span>{p.code} · {p.stage}</span>
                    </div>
                    <span className={styles.projVal}>{inrCompact(p.budget)}</span>
                  </div>
                );
              })}
            </section>
          </div>
        )}
      </Drawer>
    </div>
  );
}
