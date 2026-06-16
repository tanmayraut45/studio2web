// ============================================================================
// DUMMY SEED DATA — TEAM / HR / PAYROLL
// ============================================================================
// Seed for HR-related collections. See src/erp/lib/storage.js for persistence.
//
// ----------------------------------------------------------------------------
// EMPLOYEE — FIELD CONTRACT
//   id            string  primary key (e1…e10)
//   name          string
//   role          string  job title
//   dept          string  one of departments[].name
//   initials      string  2-letter avatar fallback
//   email, phone  string
//   joined        string  ISO date
//   salary        number  monthly gross in rupees
//   productivity  number  0–100 (internal score, last quarter)
//   attendance    number  0–100 % present, rolling 30 days
//   location      string  HQ Pune | Site · <name>
//   status        string  active | inactive | terminated
//
// `departments`     — { name, headcount, color }
// `attendanceWeek`  — DERIVED from employees; per-employee 7-day array of
//                     1 (present) / 0.5 (half day) / 0 (absent). Replace with
//                     real punch-in data when wiring biometric / attendance API.
// `leaveRequests`   — leave approvals. FK: leave.emp → employee.id
// `payrollRun`      — current month's payroll summary (gross/deductions/net)
// ============================================================================

// Employees / HR master data. Referenced by projects, tasks, attendance, payroll.

export const employees = [];

export const departments = [];

// 7-day attendance heat (1 = present, 0.5 = half, 0 = absent)
export const attendanceWeek = employees.map((e) => ({
  id: e.id,
  name: e.name,
  days: [1, 1, e.id === "e7" ? 0.5 : 1, 1, e.id === "e9" ? 0 : 1, e.id === "e5" ? 1 : 1, 1],
}));

export const leaveRequests = [];

export const payrollRun = {
  month: "—",
  status: "Pending",
  gross: 0,
  deductions: 0,
  net: 0,
  headcount: 0,
};
