"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Zap, BarChart3, Lock } from "lucide-react";
import { useSession, ROLE_LIST } from "@/erp/stores/useSession";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const login = useSession((s) => s.login);
  const isAuthed = useSession((s) => s.isAuthed);
  const hydrated = useSession((s) => s._hydrated);

  const [role, setRole] = useState("owner");
  const [email, setEmail] = useState("aarav@studio2.in");
  const [password, setPassword] = useState("studio2");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hydrated && isAuthed) router.replace("/erp");
  }, [hydrated, isAuthed, router]);

  const pickRole = (r) => { setRole(r.id); setEmail(r.email); };

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { login(role); router.push("/erp"); }, 650);
  };

  return (
    <div className={styles.page} data-erp-theme="dark">
      {/* Brand panel */}
      <div className={styles.brandPanel}>
        <div className={styles.brandGlow} />
        <div className={styles.brandInner}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoDot} />
            Studio<strong>OS</strong>
          </Link>
          <motion.h1
            className={styles.brandTitle}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            The operating system<br />for Studio II.
          </motion.h1>
          <p className={styles.brandSub}>
            CRM, projects, BOQ, procurement, finance and site execution — one deeply
            integrated platform for architecture &amp; interior teams.
          </p>
          <ul className={styles.features}>
            <li><BarChart3 size={16} /> Real-time business intelligence</li>
            <li><Zap size={16} /> Project &rarr; client &rarr; site, fully linked</li>
            <li><ShieldCheck size={16} /> Role-based, audit-safe &amp; secure</li>
          </ul>
          <span className={styles.brandFoot}>&copy; 2026 Studio II — Enterprise ERP</span>
        </div>
      </div>

      {/* Form panel */}
      <div className={styles.formPanel}>
        <motion.form
          className={styles.form}
          onSubmit={submit}
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className={styles.kicker}>Welcome back</span>
          <h2 className={styles.formTitle}>Sign in to Studio OS</h2>
          <p className={styles.formHint}>Select a role to explore the platform with sample data.</p>

          <div className={styles.roles}>
            {ROLE_LIST.map((r) => (
              <button
                type="button"
                key={r.id}
                className={`${styles.roleChip} ${role === r.id ? styles.roleActive : ""}`}
                onClick={() => pickRole(r)}
              >
                <span className={styles.roleLabel}>{r.label}</span>
                <span className={styles.roleDesc}>{r.desc}</span>
              </button>
            ))}
          </div>

          <label className={styles.field}>
            <span>Work email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>

          <label className={styles.field}>
            <span>Password</span>
            <div className={styles.pwd}>
              <Lock size={15} />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </label>

          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? "Entering…" : <>Enter Studio OS <ArrowRight size={17} /></>}
          </button>

          <Link href="/" className={styles.back}>← Back to studio2.in</Link>
        </motion.form>
      </div>
    </div>
  );
}
