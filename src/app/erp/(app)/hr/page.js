"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness, Building2, Megaphone, Plus, Users, Wallet,
  Pencil, Trash2, UserPlus,
} from "lucide-react";
import { PageHeader, KpiCard, Panel, Btn, Avatar } from "@/components/erp/ui";
import { Drawer } from "@/components/erp/Modal";
import {
  attendanceWeek, expenseMonth,
} from "@/erp/data";
import { inr, inrCompact } from "@/erp/lib/format";
import { useExpensesStore } from "@/erp/stores/useExpensesStore";
import { useEmployeesStore } from "@/erp/stores/useEmployeesStore";
import ExpenseForm from "./ExpenseForm";
import EmployeeForm from "./EmployeeForm";
import grid from "@/components/erp/layout.module.css";
import styles from "./hr.module.css";

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const MONTH_AXIS = [1, 5, 10, 15, 20, 25, 30];

const CATEGORY_META = {
  office: { icon: Building2, title: "Office", tone: "gold" },
  marketing: { icon: Megaphone, title: "Marketing", tone: "info" },
  other: { icon: Wallet, title: "Other", tone: "warn" },
};

function ExpenseCard({ category, rows, total, onAdd, onEdit, onDelete }) {
  const { icon: Icon, title, tone } = CATEGORY_META[category];
  return (
    <section className={styles.expCard} data-tone={tone}>
      <header className={styles.expHead}>
        <span className={styles.expIcon}><Icon size={15} /></span>
        <h3>{title}</h3>
        <strong className={styles.expHeadTotal}>{inrCompact(total)}</strong>
        <button
          type="button"
          className={styles.expAdd}
          onClick={() => onAdd(category)}
          aria-label={`Add ${title} expense`}
        >
          <Plus size={13} /> Add
        </button>
      </header>
      <div className={styles.expList}>
        {rows.length === 0 && (
          <p className={styles.expEmpty}>No lines yet — add the first one.</p>
        )}
        {rows.map((r) => (
          <div className={styles.expRow} key={r.id || r.label}>
            <span className={styles.expLabel}>{r.label}</span>
            <span className={styles.expDots} />
            <span className={styles.expAmt}>{inr(r.amount)}</span>
            <span className={styles.expRowActions}>
              <button
                type="button"
                className={styles.expRowBtn}
                onClick={() => onEdit(category, r)}
                aria-label={`Edit ${r.label}`}
                title="Edit"
              >
                <Pencil size={12} />
              </button>
              <button
                type="button"
                className={`${styles.expRowBtn} ${styles.expRowBtnDanger}`}
                onClick={() => onDelete(category, r)}
                aria-label={`Delete ${r.label}`}
                title="Delete"
              >
                <Trash2 size={12} />
              </button>
            </span>
          </div>
        ))}
      </div>
      <footer className={styles.expFoot}>
        <span>Subtotal</span>
        <strong>{inr(total)}</strong>
      </footer>
    </section>
  );
}

function SalariesCard({ liveSalaries, month }) {
  return (
    <section className={styles.expCard} data-tone="purple">
      <header className={styles.expHead}>
        <span className={styles.expIcon}><Users size={15} /></span>
        <h3>Employee Salaries</h3>
        <strong className={styles.expHeadTotal}>{inrCompact(liveSalaries.net)}</strong>
      </header>
      <div className={styles.expList}>
        <div className={styles.expRow}>
          <span className={styles.expLabel}>Gross payroll ({liveSalaries.headcount} staff)</span>
          <span className={styles.expDots} />
          <span className={styles.expAmt}>{inr(liveSalaries.gross)}</span>
        </div>
        <div className={styles.expRow}>
          <span className={styles.expLabel}>Statutory deductions</span>
          <span className={styles.expDots} />
          <span className={`${styles.expAmt} ${styles.expNeg}`}>-{inr(liveSalaries.deductions)}</span>
        </div>
        <div className={styles.expRow}>
          <span className={styles.expLabel}>Net disbursed · {month}</span>
          <span className={styles.expDots} />
          <span className={styles.expAmt}>{inr(liveSalaries.net)}</span>
        </div>
      </div>
      <footer className={styles.expFoot}>
        <span>Subtotal</span>
        <strong>{inr(liveSalaries.net)}</strong>
      </footer>
    </section>
  );
}

const sum = (rows) => rows.reduce((s, r) => s + (Number(r.amount) || 0), 0);

export default function HrPage() {
  const office = useExpensesStore((s) => s.office);
  const marketing = useExpensesStore((s) => s.marketing);
  const other = useExpensesStore((s) => s.other);
  const hydrate = useExpensesStore((s) => s.hydrate);
  const addLine = useExpensesStore((s) => s.addLine);
  const updateLine = useExpensesStore((s) => s.updateLine);
  const removeLine = useExpensesStore((s) => s.removeLine);

  const employees = useEmployeesStore((s) => s.employees);
  const hydrateEmployees = useEmployeesStore((s) => s.hydrate);
  const addEmployee = useEmployeesStore((s) => s.addEmployee);
  const updateEmployee = useEmployeesStore((s) => s.updateEmployee);
  const removeEmployee = useEmployeesStore((s) => s.removeEmployee);

  useEffect(() => {
    hydrate();
    hydrateEmployees();
  }, [hydrate, hydrateEmployees]);

  // Drawer state: { mode: "add" | "edit", category, item? }
  const [drawer, setDrawer] = useState(null);

  // Employee drawer state
  const [addEmployeeOpen, setAddEmployeeOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const totals = useMemo(
    () => ({ office: sum(office), marketing: sum(marketing), other: sum(other) }),
    [office, marketing, other]
  );

  const liveSalaries = useMemo(() => {
    const gross = employees.reduce((s, e) => s + (Number(e.salary) || 0), 0);
    const deductions = Math.round(gross * 0.11); // 11% statutory blend
    const net = gross - deductions;
    return { gross, deductions, net, headcount: employees.length };
  }, [employees]);

  const attendanceMonth = useMemo(
    () =>
      employees.map((e) => {
        const idStr = String(e.id || "x0");
        const base = idStr.charCodeAt(Math.min(1, idStr.length - 1)) || 65;
        return {
          id: e.id,
          name: e.name,
          days: Array.from({ length: 30 }, (_, i) => {
            const seed = (base * 13 + i * 7) % 100;
            if (seed < 5) return 0;
            if (seed < 12) return 0.5;
            return 1;
          }),
        };
      }),
    [employees]
  );

  const totalOperatingExpenses = totals.office + totals.marketing + totals.other;
  const totalAllExpenses = totalOperatingExpenses + liveSalaries.net;

  const categoryRows = { office, marketing, other };

  const openAdd = (category) => setDrawer({ mode: "add", category });
  const openEdit = (category, item) => setDrawer({ mode: "edit", category, item });
  const closeDrawer = () => setDrawer(null);

  const handleSubmit = async (values) => {
    if (!drawer) return;
    if (drawer.mode === "add") {
      await addLine(drawer.category, values);
    } else if (drawer.mode === "edit" && drawer.item?.id) {
      await updateLine(drawer.category, drawer.item.id, values);
    }
    closeDrawer();
  };

  const handleDelete = async (category, item) => {
    if (!item?.id) return;
    if (!window.confirm(`Delete expense "${item.label}"? This cannot be undone.`)) return;
    await removeLine(category, item.id);
  };

  const drawerTitle =
    drawer?.mode === "add"
      ? `New ${CATEGORY_META[drawer.category]?.title || ""} expense`
      : drawer?.mode === "edit"
      ? `Edit ${CATEGORY_META[drawer.category]?.title || ""} expense`
      : "";

  return (
    <div className={grid.stack}>
      <PageHeader title="HR & Payroll" subtitle="Attendance & business expenses" icon={BriefcaseBusiness}>
        <Btn icon={UserPlus} onClick={() => setAddEmployeeOpen(true)}>Add Employee</Btn>
      </PageHeader>

      <div className={grid.kpiGrid}>
        <KpiCard index={0} label={`Total Expenses · ${expenseMonth}`} value={inrCompact(totalAllExpenses)} sub="payroll + operating" accent="gold" />
        <KpiCard index={1} label="Salaries (Net)" value={inrCompact(liveSalaries.net)} sub={`${liveSalaries.headcount} employees`} accent="purple" />
        <KpiCard index={2} label="Operating Burn" value={inrCompact(totalOperatingExpenses)} sub="office + marketing + other" accent="info" />
      </div>

      <Panel title="Attendance — this week" subtitle="Present / half / absent">
        {attendanceWeek.length > 0 ? (
          <>
            <div className={styles.attHead}>
              <span />
              {DAYS.map((d, i) => <span key={i} className={styles.attDay}>{d}</span>)}
            </div>
            <div className={styles.attGrid}>
              {attendanceWeek.map((a) => (
                <div className={styles.attRow} key={a.id}>
                  <span className={styles.attName}>{a.name.split(" ")[0]}</span>
                  {a.days.map((d, i) => (
                    <span key={i} className={styles.cell} data-v={d === 1 ? "full" : d === 0.5 ? "half" : "none"} />
                  ))}
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className={styles.emptyHint}>No attendance data this week.</p>
        )}
      </Panel>

      <Panel title="Attendance — this month" subtitle={`Present / half / absent · 30 days · ${expenseMonth}`}>
        {attendanceMonth.length > 0 ? (
          <>
            <div className={styles.monthHead}>
              <span />
              {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
                <span key={d} className={styles.monthDay}>{MONTH_AXIS.includes(d) ? d : ""}</span>
              ))}
            </div>
            <div className={styles.attGrid}>
              {attendanceMonth.map((a) => {
                const present = a.days.filter((d) => d === 1).length;
                const half = a.days.filter((d) => d === 0.5).length;
                const absent = a.days.filter((d) => d === 0).length;
                return (
                  <div className={styles.monthRow} key={a.id}>
                    <span className={styles.attName}>{a.name.split(" ")[0]}</span>
                    {a.days.map((d, i) => (
                      <span key={i} className={styles.monthCell} data-v={d === 1 ? "full" : d === 0.5 ? "half" : "none"} />
                    ))}
                    <span className={styles.monthStats}>
                      <span className={styles.statPos}>{present}</span>
                      <span className={styles.statHalf}>{half}</span>
                      <span className={styles.statNeg}>{absent}</span>
                    </span>
                  </div>
                );
              })}
            </div>
            <div className={styles.monthLegend}>
              <span><i data-v="full" /> Present</span>
              <span><i data-v="half" /> Half day</span>
              <span><i data-v="none" /> Absent</span>
            </div>
          </>
        ) : (
          <p className={styles.emptyHint}>No employees yet — add team members to track attendance.</p>
        )}
      </Panel>

      <div className={styles.expSection}>
        <div className={styles.expSectionHead}>
          <h2>Business Expenses</h2>
          <p>Operating costs for {expenseMonth} — office, marketing, payroll & other.</p>
        </div>
        <div className={styles.expGrid}>
          <ExpenseCard
            category="office"
            rows={categoryRows.office}
            total={totals.office}
            onAdd={openAdd}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
          <ExpenseCard
            category="marketing"
            rows={categoryRows.marketing}
            total={totals.marketing}
            onAdd={openAdd}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
          <SalariesCard liveSalaries={liveSalaries} month={expenseMonth} />
          <ExpenseCard
            category="other"
            rows={categoryRows.other}
            total={totals.other}
            onAdd={openAdd}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <Drawer
        open={!!drawer}
        onClose={closeDrawer}
        title={drawerTitle}
        width={420}
      >
        {drawer && (
          <ExpenseForm
            initial={drawer.mode === "edit" ? drawer.item : null}
            submitLabel={drawer.mode === "edit" ? "Save changes" : "Add expense"}
            onSubmit={handleSubmit}
            onCancel={closeDrawer}
          />
        )}
      </Drawer>

      <Panel title="Team directory" subtitle="People at Studio II">
        {employees.length > 0 ? (
          <div className={styles.teamList}>
            {employees.map((e) => (
              <button
                key={e.id}
                type="button"
                className={styles.teamRow}
                onClick={() => setEditingEmployee(e)}
              >
                <Avatar name={e.name} initials={e.initials} size={32} tone="gold" />
                <div className={styles.tmInfo}>
                  <strong>{e.name}</strong>
                  <span>{e.role}{e.dept ? ` · ${e.dept}` : ""}</span>
                </div>
                <span className={styles.tmSalary}>{inrCompact(Number(e.salary) || 0)}</span>
              </button>
            ))}
          </div>
        ) : (
          <p className={styles.emptyHint}>No employees yet — click Add Employee above.</p>
        )}
      </Panel>

      <Drawer
        open={addEmployeeOpen}
        onClose={() => setAddEmployeeOpen(false)}
        title="Add employee"
        width={460}
      >
        {addEmployeeOpen && (
          <EmployeeForm
            initial={null}
            submitLabel="Create employee"
            onSubmit={async (v) => { await addEmployee(v); setAddEmployeeOpen(false); }}
            onCancel={() => setAddEmployeeOpen(false)}
          />
        )}
      </Drawer>

      <Drawer
        open={!!editingEmployee}
        onClose={() => setEditingEmployee(null)}
        title="Edit employee"
        width={460}
      >
        {editingEmployee && (
          <div>
            <EmployeeForm
              initial={editingEmployee}
              submitLabel="Save changes"
              onSubmit={async (v) => { await updateEmployee(editingEmployee.id, v); setEditingEmployee(null); }}
              onCancel={() => setEditingEmployee(null)}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.6rem" }}>
              <Btn
                variant="outline"
                icon={Trash2}
                onClick={async () => {
                  if (!window.confirm(`Delete employee "${editingEmployee.name}"? This cannot be undone.`)) return;
                  await removeEmployee(editingEmployee.id);
                  setEditingEmployee(null);
                }}
              >
                Delete employee
              </Btn>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
