"use client";

import Image from "next/image";
import { Palette, Plus, Check, Clock, RefreshCw, Layers } from "lucide-react";
import { PageHeader, KpiCard, Panel, Badge, Btn } from "@/components/erp/ui";
import { designAssets, projectName } from "@/erp/data";
import { dateShort } from "@/erp/lib/format";
import grid from "@/components/erp/layout.module.css";
import styles from "./design.module.css";

const STAGE_TONE = { Approved: "success", "In Review": "warn", Revision: "danger" };
const INTEGRATIONS = ["AutoCAD", "SketchUp", "Revit", "Blender", "Lumion"];

export default function DesignPage() {
  return (
    <div className={grid.stack}>
      <PageHeader title="Design Studio" subtitle="Mood boards, 2D/3D, renders & approval workflows" icon={Palette}>
        <Btn icon={Plus}>New Design</Btn>
      </PageHeader>

      <div className={grid.kpiGrid}>
        <KpiCard index={0} label="Design Assets" value={designAssets.length} accent="gold" />
        <KpiCard index={1} label="Approved" value={designAssets.filter((d) => d.stage === "Approved").length} accent="success" />
        <KpiCard index={2} label="In Review" value={designAssets.filter((d) => d.stage === "In Review").length} accent="warn" />
        <KpiCard index={3} label="Avg Revisions" value={(designAssets.reduce((s, d) => s + d.revisions, 0) / designAssets.length).toFixed(1)} accent="purple" />
      </div>

      <div className={styles.gallery}>
        {designAssets.map((d) => (
          <div className={styles.asset} key={d.id}>
            <div className={styles.thumb}>
              <Image src={d.thumb} alt={d.title} fill sizes="(max-width: 768px) 100vw, 320px" className={styles.img} />
              <span className={styles.type}>{d.type}</span>
            </div>
            <div className={styles.assetBody}>
              <strong>{d.title}</strong>
              <span className={styles.proj}>{projectName(d.project)}</span>
              <div className={styles.assetFoot}>
                <Badge tone={STAGE_TONE[d.stage]} dot>{d.stage}</Badge>
                <span className={styles.rev}><RefreshCw size={11} /> {d.revisions}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={grid.split}>
        <Panel title="Approval workflow" subtitle="Concept to design freeze">
          <div className={styles.flow}>
            {["Concept", "Internal Review", "Client Shared", "Revisions", "Approved", "Design Freeze"].map((s, i) => (
              <div className={styles.flowStep} key={s} data-state={i < 4 ? "done" : i === 4 ? "active" : "todo"}>
                <span className={styles.flowDot}>{i < 4 ? <Check size={12} /> : i + 1}</span>
                <span className={styles.flowLabel}>{s}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Integrations" subtitle="Connected design tools">
          <div className={styles.integrations}>
            {INTEGRATIONS.map((t) => (
              <div className={styles.integration} key={t}>
                <Layers size={16} />
                <span>{t}</span>
                <Badge tone="success" dot>Linked</Badge>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
