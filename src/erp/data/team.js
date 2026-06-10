// Employees / HR master data. Referenced by projects, tasks, attendance, payroll.

export const employees = [
  { id: "e1", name: "Aarav Mehta", role: "Principal Architect", dept: "Leadership", initials: "AM", email: "aarav@studio2.in", phone: "+91 98220 11001", joined: "2019-04-01", salary: 220000, productivity: 96, attendance: 99, location: "HQ Pune", status: "active" },
  { id: "e2", name: "Priya Nair", role: "Operations Head", dept: "Admin", initials: "PN", email: "priya@studio2.in", phone: "+91 98220 11002", joined: "2019-07-15", salary: 145000, productivity: 92, attendance: 97, location: "HQ Pune", status: "active" },
  { id: "e3", name: "Rohan Shah", role: "Senior Accountant", dept: "Finance", initials: "RS", email: "rohan@studio2.in", phone: "+91 98220 11003", joined: "2020-01-10", salary: 98000, productivity: 89, attendance: 98, location: "HQ Pune", status: "active" },
  { id: "e4", name: "Sara Iyer", role: "Lead Interior Designer", dept: "Design", initials: "SI", email: "sara@studio2.in", phone: "+91 98220 11004", joined: "2020-03-22", salary: 110000, productivity: 94, attendance: 95, location: "HQ Pune", status: "active" },
  { id: "e5", name: "Vikram Patil", role: "Site Engineer", dept: "Execution", initials: "VP", email: "vikram@studio2.in", phone: "+91 98220 11005", joined: "2021-06-01", salary: 78000, productivity: 91, attendance: 96, location: "Site · Koregaon Park", status: "active" },
  { id: "e6", name: "Neha Gupta", role: "Purchase Manager", dept: "Procurement", initials: "NG", email: "neha@studio2.in", phone: "+91 98220 11006", joined: "2021-02-18", salary: 92000, productivity: 88, attendance: 94, location: "HQ Pune", status: "active" },
  { id: "e7", name: "Karan Desai", role: "Site Engineer", dept: "Execution", initials: "KD", email: "karan@studio2.in", phone: "+91 98220 11007", joined: "2022-08-09", salary: 72000, productivity: 85, attendance: 92, location: "Site · Bandra", status: "active" },
  { id: "e8", name: "Ananya Rao", role: "Junior Designer", dept: "Design", initials: "AR", email: "ananya@studio2.in", phone: "+91 98220 11008", joined: "2023-01-30", salary: 58000, productivity: 87, attendance: 97, location: "HQ Pune", status: "active" },
  { id: "e9", name: "Imran Sheikh", role: "Site Supervisor", dept: "Execution", initials: "IS", email: "imran@studio2.in", phone: "+91 98220 11009", joined: "2022-11-12", salary: 54000, productivity: 90, attendance: 93, location: "Site · Lonavala", status: "active" },
  { id: "e10", name: "Meera Joshi", role: "HR Executive", dept: "HR", initials: "MJ", email: "meera@studio2.in", phone: "+91 98220 11010", joined: "2023-05-05", salary: 62000, productivity: 86, attendance: 98, location: "HQ Pune", status: "active" },
];

export const departments = [
  { name: "Leadership", headcount: 1, color: "gold" },
  { name: "Design", headcount: 2, color: "purple" },
  { name: "Execution", headcount: 3, color: "info" },
  { name: "Finance", headcount: 1, color: "success" },
  { name: "Procurement", headcount: 1, color: "warn" },
  { name: "Admin", headcount: 1, color: "info" },
  { name: "HR", headcount: 1, color: "purple" },
];

// 7-day attendance heat (1 = present, 0.5 = half, 0 = absent)
export const attendanceWeek = employees.map((e) => ({
  id: e.id,
  name: e.name,
  days: [1, 1, e.id === "e7" ? 0.5 : 1, 1, e.id === "e9" ? 0 : 1, e.id === "e5" ? 1 : 1, 1],
}));

export const leaveRequests = [
  { id: "lv1", emp: "e7", type: "Casual Leave", from: "2026-06-12", to: "2026-06-13", days: 2, status: "Pending" },
  { id: "lv2", emp: "e8", type: "Sick Leave", from: "2026-06-09", to: "2026-06-09", days: 1, status: "Approved" },
  { id: "lv3", emp: "e9", type: "Earned Leave", from: "2026-06-20", to: "2026-06-25", days: 6, status: "Pending" },
];

export const payrollRun = {
  month: "May 2026",
  status: "Processed",
  gross: employees.reduce((s, e) => s + e.salary, 0),
  deductions: 184000,
  net: employees.reduce((s, e) => s + e.salary, 0) - 184000,
  headcount: employees.length,
};
