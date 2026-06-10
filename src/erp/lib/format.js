// Formatting helpers — Indian currency + compact notation used across the ERP.

const inrFmt = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export function inr(n) {
  if (n == null || isNaN(n)) return "—";
  return `\u20B9${inrFmt.format(Math.round(n))}`;
}

// Compact: 14200000 -> "₹1.42 Cr", 350000 -> "₹3.50 L"
export function inrCompact(n) {
  if (n == null || isNaN(n)) return "—";
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 10000000) return `${sign}\u20B9${(abs / 10000000).toFixed(2)} Cr`;
  if (abs >= 100000) return `${sign}\u20B9${(abs / 100000).toFixed(2)} L`;
  if (abs >= 1000) return `${sign}\u20B9${(abs / 1000).toFixed(1)}k`;
  return `${sign}\u20B9${inrFmt.format(abs)}`;
}

export function num(n) {
  if (n == null || isNaN(n)) return "—";
  return inrFmt.format(n);
}

export function pct(n, digits = 1) {
  if (n == null || isNaN(n)) return "—";
  return `${Number(n).toFixed(digits)}%`;
}

export function initials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function dateShort(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
