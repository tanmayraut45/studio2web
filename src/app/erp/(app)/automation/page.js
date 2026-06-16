"use client";

import { useEffect, useState } from "react";
import { Workflow, Plus, Zap, MessageCircle, Mail, Bell, Smartphone, Pencil, Trash2 } from "lucide-react";
import { PageHeader, KpiCard, Panel, Badge, Btn } from "@/components/erp/ui";
import { Drawer } from "@/components/erp/Modal";
import { num } from "@/erp/lib/format";
import { useAutomationsStore } from "@/erp/stores/useAutomationsStore";
import AutomationForm from "./AutomationForm";
import grid from "@/components/erp/layout.module.css";
import styles from "./automation.module.css";

const CHANNELS = [
  { name: "WhatsApp", icon: MessageCircle, count: 231, color: "success" },
  { name: "Email", icon: Mail, count: 347, color: "info" },
  { name: "Push", icon: Smartphone, count: 124, color: "purple" },
  { name: "In-app", icon: Bell, count: 489, color: "gold" },
];

// Bridge between legacy seed (`status`) and new records (`active`).
const isActive = (a) =>
  typeof a.active === "boolean" ? a.active : a.status === "Active";

export default function AutomationPage() {
  const rules = useAutomationsStore((s) => s.automations);
  const hydrate = useAutomationsStore((s) => s.hydrate);
  const addAutomation = useAutomationsStore((s) => s.addAutomation);
  const updateAutomation = useAutomationsStore((s) => s.updateAutomation);
  const toggle = useAutomationsStore((s) => s.toggle);
  const removeAutomation = useAutomationsStore((s) => s.removeAutomation);

  const [addOpen, setAddOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const editing = editingId ? rules.find((r) => r.id === editingId) : null;

  const totalRuns = rules.reduce((s, a) => s + (a.runs || 0), 0);
  const activeCount = rules.filter(isActive).length;

  const handleCreate = async (values) => {
    await addAutomation(values);
    setAddOpen(false);
  };

  const handleUpdate = async (values) => {
    if (!editing) return;
    await updateAutomation(editing.id, values);
    setEditingId(null);
  };

  const handleDelete = async (rule) => {
    if (!window.confirm(`Delete automation "${rule.name}"? This cannot be undone.`)) return;
    await removeAutomation(rule.id);
  };

  return (
    <div className={grid.stack}>
      <PageHeader title="Automation Engine" subtitle="System-wide triggers, reminders & notifications" icon={Workflow}>
        <Btn icon={Plus} onClick={() => setAddOpen(true)}>New Automation</Btn>
      </PageHeader>

      <div className={grid.kpiGrid}>
        <KpiCard index={0} label="Active Rules" value={activeCount} sub={`${rules.length} total`} accent="gold" />
        <KpiCard index={1} label="Total Runs" value={num(totalRuns)} sub="lifetime" accent="success" />
        <KpiCard index={2} label="Channels" value={CHANNELS.length} accent="info" />
        <KpiCard index={3} label="Fired Today" value="47" delta="+12" deltaUp accent="purple" />
      </div>

      <div className={grid.cols4}>
        {CHANNELS.map((c) => (
          <Panel key={c.name} padded>
            <div className={styles.channel}>
              <span className={styles.chIcon} data-c={c.color}><c.icon size={18} /></span>
              <div>
                <strong>{num(c.count)}</strong>
                <span>{c.name} sent</span>
              </div>
            </div>
          </Panel>
        ))}
      </div>

      <Panel title="Automation rules" subtitle="Triggers and their delivery channels">
        <div className={styles.rules}>
          {rules.map((a) => {
            const on = isActive(a);
            const channel = a.channel || a.action;
            return (
              <div className={styles.rule} key={a.id}>
                <span className={styles.ruleIcon}><Zap size={16} /></span>
                <div className={styles.ruleInfo}>
                  <strong>{a.name}</strong>
                  <span>When: {a.trigger}</span>
                </div>
                <div className={styles.ruleMeta}>
                  {channel && <Badge tone="neutral">{channel}</Badge>}
                  {typeof a.runs === "number" && (
                    <span className={styles.runs}>{num(a.runs)} runs</span>
                  )}
                </div>
                <div className={styles.ruleActions}>
                  <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={() => setEditingId(a.id)}
                    aria-label={`Edit ${a.name}`}
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={() => handleDelete(a)}
                    aria-label={`Delete ${a.name}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <button
                  className={`${styles.switch} ${on ? styles.on : ""}`}
                  onClick={() => toggle(a.id)}
                  aria-label={`Toggle ${a.name}`}
                >
                  <span className={styles.knob} />
                </button>
              </div>
            );
          })}
        </div>
      </Panel>

      <Drawer
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="New automation"
        width={460}
      >
        {addOpen && (
          <AutomationForm
            initial={null}
            submitLabel="Create automation"
            onSubmit={handleCreate}
            onCancel={() => setAddOpen(false)}
          />
        )}
      </Drawer>

      <Drawer
        open={!!editing}
        onClose={() => setEditingId(null)}
        title="Edit automation"
        width={460}
      >
        {editing && (
          <AutomationForm
            initial={editing}
            submitLabel="Save changes"
            onSubmit={handleUpdate}
            onCancel={() => setEditingId(null)}
          />
        )}
      </Drawer>
    </div>
  );
}
