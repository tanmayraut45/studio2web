import {
  LayoutDashboard, Target, Contact, FolderKanban, HardHat, Palette,
  FolderOpen, Calculator, ShoppingCart, Boxes, Wallet, Receipt,
  BriefcaseBusiness, Globe, BarChart3, Workflow, Sparkles, ShieldCheck,
} from "lucide-react";

// Navigation model — drives Sidebar + Command palette + breadcrumb labels.
export const navGroups = [
  {
    label: "Overview",
    items: [{ name: "Dashboard", href: "/erp", icon: LayoutDashboard }],
  },
  {
    label: "Sales & Clients",
    items: [
      { name: "CRM & Leads", href: "/erp/leads", icon: Target },
      { name: "Clients", href: "/erp/clients", icon: Contact },
      { name: "Client Portal", href: "/erp/portal", icon: Globe },
    ],
  },
  {
    label: "Delivery",
    items: [
      { name: "Projects", href: "/erp/projects", icon: FolderKanban },
      { name: "Site Execution", href: "/erp/site", icon: HardHat },
      { name: "Design Studio", href: "/erp/design", icon: Palette },
      { name: "Documents", href: "/erp/documents", icon: FolderOpen },
    ],
  },
  {
    label: "Commercial",
    items: [
      { name: "BOQ & Estimation", href: "/erp/boq", icon: Calculator },
      { name: "Procurement", href: "/erp/procurement", icon: ShoppingCart },
      { name: "Inventory", href: "/erp/inventory", icon: Boxes },
    ],
  },
  {
    label: "Finance",
    items: [
      { name: "Finance", href: "/erp/finance", icon: Wallet },
      { name: "GST & Tax", href: "/erp/gst", icon: Receipt },
      { name: "HR & Payroll", href: "/erp/hr", icon: BriefcaseBusiness },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { name: "Analytics & BI", href: "/erp/analytics", icon: BarChart3 },
      { name: "Automation", href: "/erp/automation", icon: Workflow },
      { name: "AI Engine", href: "/erp/ai", icon: Sparkles },
    ],
  },
  {
    label: "System",
    items: [{ name: "Security & Settings", href: "/erp/settings", icon: ShieldCheck }],
  },
];

export const allNavItems = navGroups.flatMap((g) =>
  g.items.map((i) => ({ ...i, group: g.label }))
);
