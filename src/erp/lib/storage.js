/**
 * storage.js — Persistence seam for the Studio2 ERP.
 *
 * This module is the ONLY place in the ERP that talks to a data store.
 * UI components, pages, and Zustand stores import collections from here
 * and never touch localStorage / fetch directly. Today this is backed by
 * window.localStorage and seeded from src/erp/data/*.js; tomorrow it will
 * be backed by a real API — and nothing else in the app needs to change.
 *
 * Public API:
 *   createCollection(key, seed)  -> { list, get, create, update, remove,
 *                                     reset, subscribe, key }
 *   resetCollection(key)         -> wipes a single collection's storage
 *   exportAll()                  -> { [key]: items[] } snapshot for debugging
 *
 * Migration path to a real backend:
 *   1. Replace the `read`/`write` helpers below with `fetch()` calls to
 *      `/api/${key}` (GET for read, PUT for write — or per-method REST).
 *   2. Move `subscribe()` to use a websocket or polling channel if real-time
 *      updates are required.
 *   3. No changes needed in pages or Zustand stores — the async contract
 *      and the shape of returned items stay identical.
 */

const STORAGE_PREFIX = "studio2-erp:";

const registry = new Map();
const subscribers = new Map();

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function storageKey(key) {
  return `${STORAGE_PREFIX}${key}`;
}

function read(key, seed) {
  if (!isBrowser()) return Array.isArray(seed) ? [...seed] : [];
  const raw = window.localStorage.getItem(storageKey(key));
  if (raw === null) {
    const initial = Array.isArray(seed) ? [...seed] : [];
    window.localStorage.setItem(storageKey(key), JSON.stringify(initial));
    return initial;
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return Array.isArray(seed) ? [...seed] : [];
  }
}

function write(key, items) {
  if (!isBrowser()) return;
  window.localStorage.setItem(storageKey(key), JSON.stringify(items));
}

function notify(key, items) {
  const set = subscribers.get(key);
  if (!set) return;
  for (const fn of set) {
    try {
      fn(items);
    } catch {
      // a misbehaving subscriber must not break other listeners or the mutation
    }
  }
}

function makeId(key) {
  const prefix = (key || "x").slice(0, 1);
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

// Max string field length to prevent localStorage bloat / injection attacks
const STR_MAX = 4000;

// Strip null bytes and non-printable control chars (keep \n \r \t), truncate.
function sanitizeStr(v) {
  if (typeof v !== "string") return v;
  // eslint-disable-next-line no-control-regex
  return v.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").slice(0, STR_MAX);
}

// Recursively sanitize an object's string fields before writing to storage.
function sanitize(item) {
  if (item === null || item === undefined) return item;
  if (typeof item === "string") return sanitizeStr(item);
  if (typeof item !== "object" || Array.isArray(item)) return item;
  const out = {};
  for (const [k, v] of Object.entries(item)) {
    if (typeof v === "string") out[k] = sanitizeStr(v);
    else if (v !== null && typeof v === "object" && !Array.isArray(v)) out[k] = sanitize(v);
    else out[k] = v;
  }
  return out;
}

export function createCollection(key, seed = []) {
  if (registry.has(key)) return registry.get(key);

  const seedSnapshot = Array.isArray(seed) ? [...seed] : [];
  subscribers.set(key, new Set());

  const api = {
    key,

    list() {
      return Promise.resolve(read(key, seedSnapshot));
    },

    get(id) {
      const items = read(key, seedSnapshot);
      const found = items.find((it) => it && it.id === id);
      return Promise.resolve(found || null);
    },

    create(item) {
      const clean = sanitize(item || {});
      if (!isBrowser()) {
        return Promise.resolve({ ...clean, id: clean.id || makeId(key) });
      }
      const items = read(key, seedSnapshot);
      const next = { ...clean, id: clean.id || makeId(key) };
      const updated = [...items, next];
      write(key, updated);
      notify(key, updated);
      return Promise.resolve(next);
    },

    update(id, patch) {
      const clean = sanitize(patch || {});
      if (!isBrowser()) {
        return Promise.resolve({ id, ...clean });
      }
      const items = read(key, seedSnapshot);
      let result = null;
      const updated = items.map((it) => {
        if (it && it.id === id) {
          result = { ...it, ...clean };
          return result;
        }
        return it;
      });
      write(key, updated);
      notify(key, updated);
      return Promise.resolve(result);
    },

    remove(id) {
      if (!isBrowser()) return Promise.resolve(false);
      const items = read(key, seedSnapshot);
      const updated = items.filter((it) => !(it && it.id === id));
      const changed = updated.length !== items.length;
      if (changed) {
        write(key, updated);
        notify(key, updated);
      }
      return Promise.resolve(changed);
    },

    reset() {
      if (!isBrowser()) return Promise.resolve();
      const fresh = [...seedSnapshot];
      write(key, fresh);
      notify(key, fresh);
      return Promise.resolve();
    },

    subscribe(fn) {
      if (typeof fn !== "function") return () => {};
      const set = subscribers.get(key) || new Set();
      set.add(fn);
      subscribers.set(key, set);
      return () => {
        const s = subscribers.get(key);
        if (s) s.delete(fn);
      };
    },
  };

  registry.set(key, api);
  return api;
}

export function resetCollection(key) {
  if (!isBrowser()) return;
  window.localStorage.removeItem(storageKey(key));
  const entry = registry.get(key);
  if (entry) {
    entry.list().then((items) => notify(key, items));
  }
}

export function exportAll() {
  const out = {};
  for (const [key, api] of registry.entries()) {
    out[key] = isBrowser() ? read(key, []) : [];
    void api;
  }
  return out;
}
