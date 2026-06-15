import {
  LayoutDashboard, Target, Contact, FolderKanban,
  FolderOpen, Boxes, Receipt,
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
    ],
  },
  {
    label: "Delivery",
    items: [
      { name: "Projects", href: "/erp/projects", icon: FolderKanban },
      { name: "Documents", href: "/erp/documents", icon: FolderOpen },
    ],
  },
  {
    label: "Commercial",
    items: [
      { name: "Inventory", href: "/erp/inventory", icon: Boxes },
    ],
  },
  {
    label: "Finance & People",
    items: [
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
    label: "Client Experience",
    items: [
      { name: "Client Portal", href: "/erp/portal", icon: Globe },
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
