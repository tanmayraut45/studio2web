/**
 * Seed mirrors the frontend dummy data so the API can later be wired in
 * module-by-module. Run with: npm run db:seed (after prisma migrate).
 */
import { PrismaClient, UserRole, ProjectHealth, LeadStage, InvoiceStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Studio2 ERP...');

  // Clean (reverse dependency order) — safe for a dev/demo database.
  await prisma.auditLog.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.boqLine.deleteMany();
  await prisma.boqDoc.deleteMany();
  await prisma.purchaseOrder.deleteMany();
  await prisma.purchaseRequest.deleteMany();
  await prisma.stockMovement.deleteMany();
  await prisma.stockItem.deleteMany();
  await prisma.material.deleteMany();
  await prisma.warehouse.deleteMany();
  await prisma.snag.deleteMany();
  await prisma.dailyReport.deleteMany();
  await prisma.task.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.document.deleteMany();
  await prisma.project.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.client.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.organization.deleteMany();

  const org = await prisma.organization.create({
    data: { name: 'Studio II', gstin: '27AAAAA0000A1Z5' },
  });

  // RBAC
  const perms = ['project:read', 'project:write', 'finance:read', 'finance:write', 'crm:write', 'procurement:write', 'hr:write', 'settings:write'];
  await prisma.permission.createMany({ data: perms.map((key) => ({ key })) });
  const ownerRole = await prisma.role.create({
    data: {
      name: 'Owner',
      description: 'Full platform access',
      permissions: { connect: (await prisma.permission.findMany()).map((p) => ({ id: p.id })) },
    },
  });

  // Users (password: studio2)
  const passwordHash = await bcrypt.hash('studio2', 10);
  const roleUsers: { email: string; name: string; role: UserRole }[] = [
    { email: 'aarav@studio2.in', name: 'Aarav Mehta', role: UserRole.OWNER },
    { email: 'priya@studio2.in', name: 'Priya Nair', role: UserRole.ADMIN },
    { email: 'rohan@studio2.in', name: 'Rohan Shah', role: UserRole.ACCOUNTANT },
    { email: 'sara@studio2.in', name: 'Sara Iyer', role: UserRole.DESIGNER },
    { email: 'vikram@studio2.in', name: 'Vikram Patil', role: UserRole.SITE_ENGINEER },
    { email: 'neha@studio2.in', name: 'Neha Gupta', role: UserRole.PURCHASE_MANAGER },
  ];
  for (const u of roleUsers) {
    await prisma.user.create({
      data: { orgId: org.id, email: u.email, name: u.name, role: u.role, passwordHash, mfaEnabled: u.role === UserRole.OWNER, roles: { connect: { id: ownerRole.id } } },
    });
  }

  // Employees
  const employeeSeed = [
    ['Aarav Mehta', 'Principal Architect', 'Leadership', 'aarav.e@studio2.in', 220000, 96, 99],
    ['Priya Nair', 'Operations Head', 'Admin', 'priya.e@studio2.in', 145000, 92, 97],
    ['Rohan Shah', 'Senior Accountant', 'Finance', 'rohan.e@studio2.in', 98000, 89, 98],
    ['Sara Iyer', 'Lead Interior Designer', 'Design', 'sara.e@studio2.in', 110000, 94, 95],
    ['Vikram Patil', 'Site Engineer', 'Execution', 'vikram.e@studio2.in', 78000, 91, 96],
    ['Neha Gupta', 'Purchase Manager', 'Procurement', 'neha.e@studio2.in', 92000, 88, 94],
    ['Karan Desai', 'Site Engineer', 'Execution', 'karan.e@studio2.in', 72000, 85, 92],
    ['Ananya Rao', 'Junior Designer', 'Design', 'ananya.e@studio2.in', 58000, 87, 97],
  ] as const;
  const employees: any[] = [];
  for (const [name, title, department, email, salary, productivity, attendancePct] of employeeSeed) {
    employees.push(
      await prisma.employee.create({
        data: { orgId: org.id, name, title, department, email, salary, productivity, attendancePct, joinedAt: new Date('2021-01-01'), status: 'active' },
      }),
    );
  }

  // Clients
  const clientSeed = [
    ['Rajesh & Kavita Malhotra', 'Private Residence', 'Residential', 14200000, 5, 'Modern Luxury'],
    ['Vertex Technologies Pvt Ltd', 'Vertex Technologies', 'Commercial', 28500000, 4, 'Corporate Minimal'],
    ['Dr. Anil Kapoor', 'Serenity Villa', 'Residential', 19800000, 5, 'Contemporary'],
    ['Sunrise Hospitality LLP', 'Sunrise Hospitality', 'Hospitality', 41000000, 4, 'Resort Luxe'],
  ] as const;
  const clients: any[] = [];
  for (const [name, company, type, lifetimeValue, rating, style] of clientSeed) {
    clients.push(
      await prisma.client.create({
        data: { orgId: org.id, name, company, type, lifetimeValue, rating, style, status: 'Active', gstin: type === 'Residential' ? null : '27AABCV1234D1Z5', pan: 'AKLPM1234C' },
      }),
    );
  }

  // Vendors
  const vendorSeed = [
    ['Marble Mantra', 'Stone & Marble', 4.7, 94, 96, 1.8, 45, 'Preferred'],
    ['TimberCraft Industries', 'Plywood & Veneer', 4.4, 88, 91, 3.1, 30, 'Preferred'],
    ['Luxe Lighting Co.', 'Lighting & Electrical', 4.6, 91, 95, 2.0, 30, 'Approved'],
    ['Sanitary Solutions', 'Plumbing & Sanitary', 4.1, 82, 88, 4.4, 21, 'Approved'],
  ] as const;
  const vendors: any[] = [];
  for (const [name, category, rating, onTimePct, qualityScore, rejectionPct, creditDays, status] of vendorSeed) {
    vendors.push(
      await prisma.vendor.create({
        data: { orgId: org.id, name, category, rating, onTimePct, qualityScore, rejectionPct, creditDays, status, location: 'India' },
      }),
    );
  }

  // Materials + warehouse + stock
  const warehouse = await prisma.warehouse.create({ data: { orgId: org.id, name: 'Warehouse A — Pune', utilization: 78 } });
  const mat = await prisma.material.create({
    data: { orgId: org.id, name: 'Statuario Italian Marble', sku: 'MRB-STA-18', unit: 'sq.ft', vendorId: vendors[0].id, rate: 480, hsn: '2515', reorderLevel: 400, category: 'Stone' },
  });
  await prisma.stockItem.create({ data: { materialId: mat.id, warehouseId: warehouse.id, onHand: 320, reserved: 150, damaged: 8, inTransit: 200 } });
  await prisma.stockMovement.create({ data: { materialId: mat.id, type: 'Inward', quantity: 200, ref: 'PO-2026-014', location: 'Warehouse A' } });

  // Projects
  const projectSeed = [
    ['ST2-2024-001', 'Malhotra Private Residence', 0, 'Carpentry', 68, ProjectHealth.ON_TRACK, 14200000, 9180000, 22.4],
    ['ST2-2024-002', 'Vertex Office Fit-out', 1, 'Civil', 41, ProjectHealth.AT_RISK, 28500000, 13420000, 14.8],
    ['ST2-2024-003', 'Serenity Villa', 2, 'Finishing', 84, ProjectHealth.ON_TRACK, 19800000, 15240000, 26.1],
    ['ST2-2025-004', 'Coastal Retreat Boutique Hotel', 3, 'Electrical', 37, ProjectHealth.DELAYED, 41000000, 14850000, 18.2],
  ] as const;
  const projects: any[] = [];
  for (const [code, name, clientIdx, stage, progress, health, budget, actual, margin] of projectSeed) {
    projects.push(
      await prisma.project.create({
        data: {
          orgId: org.id, code, name, clientId: clients[clientIdx].id, managerId: employees[0].id,
          stage, progress, health, budget, actual, committed: Math.round(budget * 0.7), margin,
          startDate: new Date('2025-09-01'), dueDate: new Date('2026-08-30'), location: 'India',
          members: { create: [{ employeeId: employees[3].id }, { employeeId: employees[4].id }] },
          milestones: { create: [{ name: 'Design Freeze', dueDate: new Date('2025-10-15'), status: 'done', paymentAmount: Math.round(budget * 0.2) }] },
        },
      }),
    );
  }

  // Leads
  const leadSeed = [
    ['Sneha Kulkarni', 'Full Interior', LeadStage.NEW, 72, 3500000, 'Instagram'],
    ['Rahul Bansal', 'Commercial Fit-out', LeadStage.PROPOSAL, 88, 12000000, 'Referral'],
    ['Fatima Sheikh', 'Turnkey', LeadStage.NEGOTIATION, 91, 6800000, 'Website'],
    ['Tata Realty (Phase 3)', 'Show-flat Interiors', LeadStage.WON, 95, 35000000, 'Referral'],
  ] as const;
  for (const [name, requirement, stage, score, value, source] of leadSeed) {
    await prisma.lead.create({
      data: { orgId: org.id, name, requirement, stage, score, value, budget: value, source, ownerId: employees[0].id },
    });
  }

  // Invoices + payments
  const inv = await prisma.invoice.create({
    data: { orgId: org.id, code: 'INV-2026-031', clientId: clients[0].id, projectId: projects[0].id, type: 'Milestone', amount: 4260000, gst: 766800, status: InvoiceStatus.PAID, issuedAt: new Date('2026-02-28'), dueAt: new Date('2026-03-15') },
  });
  await prisma.payment.create({ data: { orgId: org.id, invoiceId: inv.id, clientId: clients[0].id, amount: 5026800, mode: 'RTGS' } });

  // BOQ
  const boq = await prisma.boqDoc.create({
    data: { orgId: org.id, projectId: projects[1].id, title: 'Vertex Office — Fit-out BOQ', version: 'v3', status: 'UNDER_REVIEW', total: 27940000, margin: 14.8, revisions: 3 },
  });
  await prisma.boqLine.create({ data: { boqId: boq.id, area: 'Reception', item: 'RCC civil works', unit: 'sq.ft', quantity: 1200, rate: 1850, category: 'Civil' } });

  // Document + audit
  await prisma.document.create({
    data: { orgId: org.id, projectId: projects[0].id, name: 'Malhotra_Floor_Plan_R3.dwg', type: 'CAD', size: '4.2 MB', version: 'R3', locked: true, tags: ['floor-plan', 'approved'] },
  });
  await prisma.auditLog.create({ data: { orgId: org.id, actorId: employees[5].id, action: 'created PO', target: 'PO-2026-020', module: 'Procurement', ip: '49.36.0.0' } });

  console.log('✅ Seed complete:', { org: org.name, users: roleUsers.length, projects: projects.length });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
