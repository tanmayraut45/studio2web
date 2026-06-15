"use client";

import { BriefcaseBusiness, Building2, Megaphone, Users, Wallet } from "lucide-react";
import { PageHeader, KpiCard, Panel } from "@/components/erp/ui";
import {
  employees, attendanceWeek, payrollRun,
  officeExpenses, marketingExpenses, otherExpenses, expenseTotals, expenseMonth,
} from "@/erp/data";
import { inr, inrCompact } from "@/erp/lib/format";
import grid from "@/components/erp/layout.module.css";
import styles from "./hr.module.css";

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const MONTH_AXIS = [1, 5, 10, 15, 20, 25, 30];

const attendanceMonth = employees.map((e) => {
  const base = e.id.charCodeAt(1);
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
});

const totalSalaries = payrollRun.net;
const totalOperatingExpenses = expenseTotals.office + expenseTotals.marketing + expenseTotals.other;
const totalAllExpenses = totalOperatingExpenses + totalSalaries;

function ExpenseCard({ icon: Icon, title, rows, total, tone = "gold" }) {
  return (
    <section className={styles.expCard} data-tone={tone}>
      <header className={styles.expHead}>
        <span className={styles.expIcon}><Icon size={15} /></span>
        <h3>{title}</h3>
        <strong className={styles.expHeadTotal}>{inrCompact(total)}</strong>
      </header>
      <div className={styles.expList}>
        {rows.map((r) => (
          <div className={styles.expRow} key={r.label}>
            <span className={styles.expLabel}>{r.label}</span>
            <span className={styles.expDots} />
            <span className={styles.expAmt}>{inr(r.amount)}</span>
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

function SalariesCard() {
  return (
    <section className={styles.expCard} data-tone="purple">
      <header className={styles.expHead}>
        <span className={styles.expIcon}><Users size={15} /></span>
        <h3>Employee Salaries</h3>
        <strong className={styles.expHeadTotal}>{inrCompact(totalSalaries)}</strong>
      </header>
      <div className={styles.expList}>
        <div className={styles.expRow}>
          <span className={styles.expLabel}>Gross payroll ({payrollRun.headcount} staff)</span>
          <span className={styles.expDots} />
          <span className={styles.expAmt}>{inr(payrollRun.gross)}</span>
        </div>
        <div className={styles.expRow}>
          <span className={styles.expLabel}>Statutory deductions</span>
          <span className={styles.expDots} />
          <span className={`${styles.expAmt} ${styles.expNeg}`}>-{inr(payrollRun.deductions)}</span>
        </div>
        <div className={styles.expRow}>
          <span className={styles.expLabel}>Net disbursed · {payrollRun.month}</span>
          <span className={styles.expDots} />
          <span className={styles.expAmt}>{inr(payrollRun.net)}</span>
        </div>
      </div>
      <footer className={styles.expFoot}>
        <span>Subtotal</span>
        <strong>{inr(totalSalaries)}</strong>
      </footer>
    </section>
  );
}

export default function HrPage() {
  return (
    <div className={grid.stack}>
      <PageHeader title="HR & Payroll" subtitle="Attendance & business expenses" icon={BriefcaseBusiness} />

      <div className={grid.kpiGrid}>
        <KpiCard index={0} label={`Total Expenses · ${expenseMonth}`} value={inrCompact(totalAllExpenses)} sub="payroll + operating" accent="gold" />
        <KpiCard index={1} label="Salaries (Net)" value={inrCompact(totalSalaries)} sub={`${payrollRun.headcount} employees`} accent="purple" />
        <KpiCard index={2} label="Operating Burn" value={inrCompact(totalOperatingExpenses)} sub="office + marketing + other" accent="info" />
      </div>

      <Panel title="Attendance — this week" subtitle="Present / half / absent">
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
      </Panel>

      <Panel title="Attendance — this month" subtitle={`Present / half / absent · 30 days · ${expenseMonth}`}>
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
      </Panel>

      <div className={styles.expSection}>
        <div className={styles.expSectionHead}>
          <h2>Business Expenses</h2>
          <p>Operating costs for {expenseMonth} — office, marketing, payroll & other.</p>
        </div>
        <div className={styles.expGrid}>
          <ExpenseCard icon={Building2} title="Office" rows={officeExpenses} total={expenseTotals.office} tone="gold" />
          <ExpenseCard icon={Megaphone} title="Marketing" rows={marketingExpenses} total={expenseTotals.marketing} tone="info" />
          <SalariesCard />
          <ExpenseCard icon={Wallet} title="Other" rows={otherExpenses} total={expenseTotals.other} tone="warn" />
        </div>
      </div>
    </div>
  );
}
