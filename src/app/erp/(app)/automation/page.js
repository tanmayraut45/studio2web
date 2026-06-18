"use client";

import { useEffect, useState, useRef } from "react";
import {
  Workflow, MessageCircle, Mail, FileText, Receipt, Pencil, X, Check,
} from "lucide-react";
import { PageHeader } from "@/components/erp/ui";
import { useAutomationsStore } from "@/erp/stores/useAutomationsStore";
import styles from "./automation.module.css";

/* ------------------------------------------------------------------ */
/*  Static template definitions — the "shell" of each automation type  */
/* ------------------------------------------------------------------ */
const TEMPLATE_DEFS = [
  {
    section: "WhatsApp Templates",
    icon: MessageCircle,
    color: "#25D366",
    items: [
      {
        key: "wa_payment_received",
        name: "Payment Received",
        trigger: "Invoice marked as Paid",
        preview: "Hi {client_name}, we've received your payment of ₹{amount} for {project_name}. Thank you! 🙏",
      },
      {
        key: "wa_payment_reminder",
        name: "Payment Reminder",
        trigger: "3 days before invoice due",
        preview: "Hi {client_name}, just a gentle reminder that your invoice of ₹{amount} for {project_name} is due on {due_date}.",
      },
      {
        key: "wa_overdue_alert",
        name: "Overdue Alert",
        trigger: "Invoice past due date",
        preview: "Hi {client_name}, your invoice for {project_name} (₹{amount}) is now overdue. Please arrange payment at the earliest.",
      },
      {
        key: "wa_thank_you",
        name: "Project Thank You",
        trigger: "Project marked as Completed",
        preview: "Thank you for choosing Studio2 for {project_name}! It was a pleasure working with you. We'd love your feedback. 🏠✨",
      },
    ],
  },
  {
    section: "Email Templates",
    icon: Mail,
    color: "#3b82f6",
    items: [
      {
        key: "email_welcome",
        name: "Welcome Email",
        trigger: "New client added",
        preview: "Subject: Welcome to Studio2 — {client_name}\n\nDear {client_name},\n\nWelcome aboard! We're thrilled to be working with you on {project_name}...",
      },
      {
        key: "email_proposal",
        name: "Proposal Follow-Up",
        trigger: "Lead in Proposal stage for 5+ days",
        preview: "Subject: Following up on {project_name} Proposal\n\nHi {client_name},\n\nI wanted to follow up on the proposal we shared for {project_name}...",
      },
    ],
  },
  {
    section: "Auto-Generation",
    icon: FileText,
    color: "var(--erp-gold)",
    items: [
      {
        key: "auto_invoice",
        name: "Auto Invoice Generation",
        trigger: "Project milestone reached",
        preview: "Automatically drafts an invoice when a project milestone is marked complete. Invoice is created as 'Draft' for review before sending.",
      },
      {
        key: "auto_receipt",
        name: "Payment Receipt",
        trigger: "Payment recorded",
        preview: "Generates a professional payment receipt PDF and emails it to the client automatically when a payment is logged.",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Toggle switch component                                             */
/* ------------------------------------------------------------------ */
function Toggle({ active, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      className={`${styles.toggle} ${active ? styles.toggleOn : ""}`}
      onClick={() => onChange(!active)}
    >
      <span className={styles.toggleThumb} />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Edit modal                                                          */
/* ------------------------------------------------------------------ */
function EditModal({ template, defaultText, onSave, onClose }) {
  const [text, setText] = useState(defaultText || template?.preview || "");
  const textRef = useRef(null);

  useEffect(() => {
    textRef.current?.focus();
  }, []);

  const handleSave = () => {
    onSave(text);
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modalBox}>
        <button type="button" className={styles.modalClose} onClick={onClose}><X size={16} /></button>
        <div className={styles.modalTitle}>Edit — {template?.name}</div>
        <p className={styles.modalTrigger}>Trigger: <span>{template?.trigger}</span></p>
        <p className={styles.modalHint}>Available variables: {"{client_name}"} {"{amount}"} {"{project_name}"} {"{due_date}"}</p>
        <textarea
          ref={textRef}
          className={styles.modalTextarea}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
        />
        <div className={styles.modalActions}>
          <button type="button" className={styles.btnSecondary} onClick={onClose}>Cancel</button>
          <button type="button" className={styles.btnPrimary} onClick={handleSave}>
            <Check size={14} /> Save Template
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */
const isActive = (a) =>
  typeof a.active === "boolean" ? a.active : a.status === "Active";

export default function AutomationPage() {
  const automations   = useAutomationsStore((s) => s.automations);
  const hydrate       = useAutomationsStore((s) => s.hydrate);
  const addAutomation = useAutomationsStore((s) => s.addAutomation);
  const toggle        = useAutomationsStore((s) => s.toggle);
  const updateAutomation = useAutomationsStore((s) => s.updateAutomation);

  const [editTarget, setEditTarget] = useState(null); // { key, name, trigger, preview, stored }

  useEffect(() => { hydrate(); }, [hydrate]);

  /* Build a map of key → stored automation for O(1) lookup */
  const byKey = {};
  automations.forEach((a) => { if (a.key) byKey[a.key] = a; });

  const getRecord = (key) => byKey[key];
  const isOn = (key) => {
    const rec = getRecord(key);
    return rec ? isActive(rec) : false;
  };
  const getText = (key, def) => getRecord(key)?.templateText ?? def;

  const handleToggle = async (item) => {
    const rec = getRecord(item.key);
    if (rec) {
      await toggle(rec.id);
    } else {
      await addAutomation({
        key: item.key,
        name: item.name,
        trigger: item.trigger,
        templateText: item.preview,
        active: true,
        channel: item.key.startsWith("wa_") ? "WhatsApp" : item.key.startsWith("email_") ? "Email" : "System",
      });
    }
  };

  const handleEdit = (item) => {
    setEditTarget({ ...item, stored: getText(item.key, item.preview) });
  };

  const handleSave = async (text) => {
    if (!editTarget) return;
    const rec = getRecord(editTarget.key);
    if (rec) {
      await updateAutomation(rec.id, { templateText: text });
    } else {
      await addAutomation({
        key: editTarget.key,
        name: editTarget.name,
        trigger: editTarget.trigger,
        templateText: text,
        active: false,
        channel: editTarget.key.startsWith("wa_") ? "WhatsApp" : editTarget.key.startsWith("email_") ? "Email" : "System",
      });
    }
  };

  const activeCount = TEMPLATE_DEFS.flatMap((s) => s.items).filter((i) => isOn(i.key)).length;
  const totalCount  = TEMPLATE_DEFS.flatMap((s) => s.items).length;

  return (
    <div className={styles.automationPage}>
      <PageHeader
        icon={Workflow}
        title="Automation"
        subtitle="WhatsApp · Email · Invoice · Receipts — configure your communication templates"
      />

      {/* Summary bar */}
      <div className={styles.summaryBar}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryNum}>{activeCount}</span>
          <span className={styles.summaryLabel}>Active</span>
        </div>
        <div className={styles.summarySep} />
        <div className={styles.summaryItem}>
          <span className={styles.summaryNum}>{totalCount - activeCount}</span>
          <span className={styles.summaryLabel}>Inactive</span>
        </div>
        <div className={styles.summarySep} />
        <div className={styles.summaryItem}>
          <span className={styles.summaryNum}>{totalCount}</span>
          <span className={styles.summaryLabel}>Total Templates</span>
        </div>
      </div>

      {/* Sections */}
      {TEMPLATE_DEFS.map((section) => (
        <div key={section.section} className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionIcon} style={{ background: `${section.color}18`, color: section.color }}>
              <section.icon size={16} />
            </span>
            <span className={styles.sectionTitle}>{section.section}</span>
            <span className={styles.sectionCount}>
              {section.items.filter((i) => isOn(i.key)).length} / {section.items.length} active
            </span>
          </div>
          <div className={styles.cards}>
            {section.items.map((item) => {
              const on      = isOn(item.key);
              const preview = getText(item.key, item.preview);
              return (
                <div key={item.key} className={`${styles.card} ${on ? styles.cardOn : ""}`}>
                  <div className={styles.cardTop}>
                    <div className={styles.cardName}>{item.name}</div>
                    <Toggle active={on} onChange={() => handleToggle(item)} />
                  </div>
                  <div className={styles.cardTrigger}>
                    Trigger: <span>{item.trigger}</span>
                  </div>
                  <div className={styles.cardPreview}>{preview}</div>
                  <div className={styles.cardFooter}>
                    <button
                      type="button"
                      className={styles.editBtn}
                      onClick={() => handleEdit(item)}
                    >
                      <Pencil size={13} /> Edit Template
                    </button>
                    <span className={`${styles.statusPill} ${on ? styles.pillOn : styles.pillOff}`}>
                      {on ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Edit Modal */}
      {editTarget && (
        <EditModal
          template={editTarget}
          defaultText={editTarget.stored}
          onSave={handleSave}
          onClose={() => setEditTarget(null)}
        />
      )}
    </div>
  );
}
