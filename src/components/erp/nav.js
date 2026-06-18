import {
  LayoutDashboard,
  Crown,
  Users2,
  Wallet,
  Receipt,
  TrendingUp,
  CreditCard,
  BarChart3,
  Users,
  Shield,
  Sparkles,
  Workflow,
  Settings2,
  Globe,
} from "lucide-react";

export const navItems = [
  { name: "Dashboard", href: "/erp", icon: LayoutDashboard },
  { name: "Keshav Sir", href: "/erp/keshav", icon: Crown, label: "Executive" },
  { name: "Client Management", href: "/erp/client-management", icon: Users2 },
  {
    name: "Finance",
    href: "/erp/finance",
    icon: Wallet,
    children: [
      { name: "Invoices",         href: "/erp/invoices",    icon: Receipt    },
      { name: "Receivables",      href: "/erp/receivables", icon: TrendingUp },
      { name: "Payables",         href: "/erp/payables",    icon: CreditCard },
      { name: "Cash Flow",        href: "/erp/cashflow",    icon: BarChart3  },
      { name: "HR & Payroll",     href: "/erp/hr",          icon: Users      },
      { name: "GST & Compliance", href: "/erp/gst",         icon: Shield     },
    ],
  },
  { name: "Intelligence", href: "/erp/intelligence", icon: Sparkles  },
  { name: "Automation",   href: "/erp/automation",   icon: Workflow   },
  { name: "Settings",     href: "/erp/settings",     icon: Settings2  },
];

const _portalItem = { name: "Client Portal", href: "/erp/portal", icon: Globe, group: "Client Experience" };

export const allNavItems = [
  ...navItems.flatMap((item) => {
    const base = { name: item.name, href: item.href, icon: item.icon, group: item.label ?? item.name };
    if (!item.children) return [base];
    return [
      base,
      ...item.children.map((c) => ({ name: c.name, href: c.href, icon: c.icon, group: item.name })),
    ];
  }),
  _portalItem,
];

// Legacy compat — some pages import navGroups; keep as empty to avoid crash
export const navGroups = [];
