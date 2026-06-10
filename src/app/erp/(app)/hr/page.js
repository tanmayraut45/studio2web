"use client";

import { BriefcaseBusiness, Plus, Calendar, CheckCircle2, Clock } from "lucide-react";
import { PageHeader, KpiCard, Panel, Badge, Btn, Avatar } from "@/components/erp/ui";
import { Meter, Donut } from "@/components/erp/Charts";
import DataTable from "@/components/erp/DataTable";
import { employees, departments, attendanceWeek, leaveRequests, payrollRun, employeeName, getEmployee } from "@/erp/data";
import { inr, inrCompact, pct } from "@/erp/lib/format";
import grid from "@/components/erp/layout.module.css";
import styles from "./hr.module.css";

const DEPT_COLORS = ["gold", "purple", "info", "success", "warn", "info", "purple"];
const avgProd = Math.round(employees.reduce((s, e) => s + e.productivity, 0) / employees.length);
const avgAtt = Math.round(employees.reduce((s, e) => s + e.attendance, 0) / employees.length);
const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export default function HrPage() {
  const cols = [
    { key: "name", label: "Employee", render: (r) => <div className={styles.emp}><Avatar name={r.name} initials={r.initials} size={30} tone="gold" /><div><strong>{r.name}</strong><span>{r.role}</span></div></div> },
    { key: "dept", label: "Dept", render: (r) => <Badge tone="neutral">{r.dept}</Badge> },
    { key: "productivity", label: "Productivity", render: (r) => <div className={styles.prodCell}><Meter value={r.productivity} color={r.productivity >= 90 ? "success" : "warn"} height={6} /><span>{r.productivity}</span></div> },
    { key: "attendance", label: "Attend.", align: "right", mono: true, render: (r) => pct(r.attendance, 0) },
    { key: "salary", label: "Salary", align: "right", mono: true, render: (r) => inrCompact(r.salary) },
  ];

  const deptSegments = departments.map((d, i) => ({ label: d.name, value: d.headcount, color: DEPT_COLORS[i % DEPT_COLORS.length] }));

  return (
    <div className={grid.stack}>
      <PageHeader title="HR & Payroll" subtitle="People, attendance, payroll & productivity" icon={BriefcaseBusiness}>
        <Btn icon={Plus}>Add Employee</Btn>
      </PageHeader>

      <div className={grid.kpiGrid}>
        <KpiCard index={0} label="Headcount" value={employees.length} sub={`${departments.length} departments`} accent="gold" />
        <KpiCard index={1} label="Avg Productivity" value={pct(avgProd, 0)} delta="+3%" deltaUp accent="success" />
        <KpiCard index={2} label="Monthly Payroll" value={inrCompact(payrollRun.net)} sub={payrollRun.month} accent="info" />
        <KpiCard index={3} label="Avg Attendance" value={pct(avgAtt, 0)} accent="purple" />
      </div>

      <div className={grid.split}>
        <Panel title="Team directory" padded>
          <DataTable columns={cols} rows={employees} searchKeys={["name", "role", "dept"]} pageSize={7} />
        </Panel>

        <div className={grid.stack}>
          <Panel title="Departments" subtitle="Headcount split">
            <div className={styles.deptRow}>
              <Donut segments={deptSegments} size={140} label={employees.length} sub="people" />
              <div className={styles.deptLegend}>
                {deptSegments.map((d) => (
                  <div key={d.label} className={styles.dl}>
                    <span className={styles.dlDot} data-c={d.color} />
                    <span className={styles.dlName}>{d.label}</span>
                    <span className={styles.dlVal}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Panel>

          <Panel title="Payroll run" subtitle={payrollRun.month}>
            <div className={styles.payroll}>
              <div className={styles.pRow}><span>Gross</span><strong>{inr(payrollRun.gross)}</strong></div>
              <div className={styles.pRow}><span>Deductions</span><strong className={styles.neg}>-{inr(payrollRun.deductions)}</strong></div>
              <div className={styles.pNet}><span>Net Payable</span><strong>{inr(payrollRun.net)}</strong></div>
              <Badge tone="success" dot>{payrollRun.status}</Badge>
            </div>
          </Panel>
        </div>
      </div>

      <div className={grid.split}>
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

        <Panel title="Leave requests" subtitle="Approvals pending">
          <div className={styles.leaves}>
            {leaveRequests.map((l) => (
              <div className={styles.leave} key={l.id}>
                <Avatar name={employeeName(l.emp)} initials={getEmployee(l.emp)?.initials} size={32} tone="info" />
                <div className={styles.leaveInfo}>
                  <strong>{employeeName(l.emp)}</strong>
                  <span>{l.type} · {l.days}d</span>
                </div>
                <Badge tone={l.status === "Approved" ? "success" : "warn"}>{l.status}</Badge>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
