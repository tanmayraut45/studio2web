"use client";

import Image from "next/image";
import { Globe, CheckCircle2, Clock, Download, MessageSquare, ImageIcon, Send } from "lucide-react";
import { PageHeader, Panel, Badge, Btn, Avatar } from "@/components/erp/ui";
import { Ring } from "@/components/erp/Charts";
import { getProject, getClient, milestones, designAssets, invoices } from "@/erp/data";
import { inr, inrCompact, dateShort } from "@/erp/lib/format";
import grid from "@/components/erp/layout.module.css";
import styles from "./portal.module.css";

const project = getProject("p1");
const client = project ? getClient(project.client) : null;
const projMilestones = project ? milestones.filter((m) => m.project === project.id) : [];
const approvals = designAssets.filter((d) => d.stage !== "Approved").slice(0, 2);
const projInvoices = project ? invoices.filter((i) => i.project === project.id) : [];
const gallery = ["/images/project1.png", "/images/project2.png", "/images/project3.png"];

const CHAT = client ? [
  { who: "team", name: "Sara Iyer", text: "The master bedroom veneer samples are ready for your approval.", time: "10:24" },
  { who: "client", name: client.name, text: "Looks great! Can we see a warmer tone option too?", time: "10:31" },
  { who: "team", name: "Sara Iyer", text: "Absolutely — sharing 2 warmer options by tomorrow.", time: "10:33" },
] : [];

export default function PortalPage() {
  if (!project) {
    return (
      <div className={grid.stack}>
        <PageHeader title="Client Portal" subtitle="A preview of the premium experience your clients see" icon={Globe}>
          <Badge tone="info">Preview mode</Badge>
        </PageHeader>
        <Panel>
          <div className={styles.emptyPortal}>
            <Globe size={32} />
            <h3>No project to preview</h3>
            <p>Create a project to see the client-facing portal experience.</p>
          </div>
        </Panel>
      </div>
    );
  }

  return (
    <div className={grid.stack}>
      <PageHeader title="Client Portal" subtitle="A preview of the premium experience your clients see" icon={Globe}>
        <Badge tone="info">Preview mode</Badge>
      </PageHeader>

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroBg}>
          <Image src={project.cover} alt={project.name} fill sizes="100vw" className={styles.heroImg} />
          <div className={styles.heroOverlay} />
        </div>
        <div className={styles.heroContent}>
          <div>
            <span className={styles.welcome}>Welcome back, {client.name.split(" ")[0]}</span>
            <h2>{project.name}</h2>
            <p>{project.location} · {project.stage} stage</p>
          </div>
          <div className={styles.heroRing}>
            <Ring value={project.progress} size={84} color="gold" />
            <span>Complete</span>
          </div>
        </div>
      </div>

      <div className={grid.split}>
        <div className={grid.stack}>
          <Panel title="Project timeline" subtitle="Your milestones">
            <div className={styles.timeline}>
              {projMilestones.map((m) => (
                <div className={styles.tItem} key={m.id} data-state={m.status}>
                  <span className={styles.tDot}>{m.status === "done" ? <CheckCircle2 size={14} /> : <Clock size={14} />}</span>
                  <div className={styles.tInfo}>
                    <strong>{m.name}</strong>
                    <span>{dateShort(m.date)}</span>
                  </div>
                  <Badge tone={m.status === "done" ? "success" : m.status === "active" ? "warn" : "neutral"}>{m.status}</Badge>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Progress photos" subtitle="Latest from your site">
            <div className={styles.gallery}>
              {gallery.map((src, i) => (
                <div className={styles.gItem} key={i}>
                  <Image src={src} alt={`Progress ${i + 1}`} fill sizes="200px" className={styles.gImg} />
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className={grid.stack}>
          <Panel title="Pending your approval" subtitle="Designs awaiting sign-off">
            {approvals.map((a) => (
              <div className={styles.approval} key={a.id}>
                <Image src={a.thumb} alt={a.title} width={56} height={42} className={styles.aThumb} />
                <div className={styles.aInfo}>
                  <strong>{a.title}</strong>
                  <span>{a.type}</span>
                </div>
                <Btn variant="primary">Review</Btn>
              </div>
            ))}
          </Panel>

          <Panel title="Invoices & payments">
            {projInvoices.map((inv) => (
              <div className={styles.inv} key={inv.id}>
                <div>
                  <strong>{inv.code}</strong>
                  <span>{inv.type} · due {dateShort(inv.due)}</span>
                </div>
                <div className={styles.invRight}>
                  <span className={styles.invAmt}>{inrCompact(inv.amount + inv.gst)}</span>
                  <Badge>{inv.status}</Badge>
                </div>
              </div>
            ))}
            <Btn variant="ghost" icon={Download}>Download all</Btn>
          </Panel>

          <Panel title={<span className={styles.chatTitle}><MessageSquare size={15} /> Chat with your team</span>}>
            <div className={styles.chat}>
              {CHAT.map((c, i) => (
                <div key={i} className={`${styles.msg} ${c.who === "client" ? styles.msgClient : ""}`}>
                  {c.who === "team" && <Avatar name={c.name} size={26} tone="gold" />}
                  <div className={styles.bubble}>
                    <p>{c.text}</p>
                    <span>{c.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.chatInput}>
              <input placeholder="Message your design team…" />
              <button><Send size={16} /></button>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
