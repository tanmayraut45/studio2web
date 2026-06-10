"use client";

import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, Search } from "lucide-react";
import { clsx } from "clsx";
import styles from "./DataTable.module.css";

export default function DataTable({
  columns = [],
  rows = [],
  searchable = true,
  searchKeys,
  initialSort,
  pageSize = 8,
  onRowClick,
  dense = false,
  emptyText = "No records found",
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState(initialSort || null);
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    let r = rows;
    if (query.trim()) {
      const q = query.toLowerCase();
      const keys = searchKeys || columns.map((c) => c.key);
      r = r.filter((row) =>
        keys.some((k) => String(row[k] ?? "").toLowerCase().includes(q))
      );
    }
    if (sort) {
      r = [...r].sort((a, b) => {
        const av = a[sort.key], bv = b[sort.key];
        if (av == null) return 1;
        if (bv == null) return -1;
        const cmp = typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av).localeCompare(String(bv));
        return sort.dir === "asc" ? cmp : -cmp;
      });
    }
    return r;
  }, [rows, query, sort, columns, searchKeys]);

  const pages = Math.ceil(filtered.length / pageSize) || 1;
  const safePage = Math.min(page, pages - 1);
  const view = filtered.slice(safePage * pageSize, safePage * pageSize + pageSize);

  const toggleSort = (key) =>
    setSort((s) =>
      s?.key === key
        ? { key, dir: s.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" }
    );

  return (
    <div className={styles.wrap}>
      {searchable && (
        <div className={styles.toolbar}>
          <div className={styles.search}>
            <Search size={15} />
            <input
              placeholder="Search…"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(0); }}
            />
          </div>
          <span className={styles.count}>{filtered.length} records</span>
        </div>
      )}

      <div className={styles.scroll}>
        <table className={clsx(styles.table, dense && styles.dense)}>
          <thead>
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={clsx(c.align === "right" && styles.right, c.sortable !== false && styles.sortable)}
                  onClick={c.sortable !== false ? () => toggleSort(c.key) : undefined}
                  style={c.width ? { width: c.width } : undefined}
                >
                  <span>{c.label}</span>
                  {sort?.key === c.key && (sort.dir === "asc" ? <ChevronUp size={13} /> : <ChevronDown size={13} />)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {view.map((row, i) => (
              <tr
                key={row.id || i}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={onRowClick ? styles.clickable : undefined}
              >
                {columns.map((c) => (
                  <td key={c.key} className={clsx(c.align === "right" && styles.right, c.mono && styles.mono)}>
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
              </tr>
            ))}
            {view.length === 0 && (
              <tr><td colSpan={columns.length} className={styles.empty}>{emptyText}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className={styles.pager}>
          <button disabled={safePage === 0} onClick={() => setPage(safePage - 1)}>Prev</button>
          <span>Page {safePage + 1} / {pages}</span>
          <button disabled={safePage >= pages - 1} onClick={() => setPage(safePage + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}
