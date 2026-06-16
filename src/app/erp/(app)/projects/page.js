"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FolderKanban, Plus, MapPin, Calendar, AlertTriangle, Camera, Mic, Video,
  CloudRain, Users, CheckSquare, MessageSquare, Pencil, Trash2,
} from "lucide-react";
import { PageHeader, KpiCard, Panel, Badge, Avatar, AvatarStack, Btn } from "@/components/erp/ui";
import { Meter, Ring } from "@/components/erp/Charts";
import Gantt from "@/components/erp/Gantt";
import { Drawer } from "@/components/erp/Modal";
import {
  projectStages, tasks, taskStatuses, dailyReports, snags, milestones,
  getClient, getEmployee, projectName, employeeName,
} from "@/erp/data";
import { inrCompact, inr, dateShort, pct } from "@/erp/lib/format";
import { useProjectsStore } from "@/erp/stores/useProjectsStore";
import ProjectForm from "./ProjectForm";
import grid from "@/components/erp/layout.module.css";
import styles from "./projects.module.css";

const HEALTH = { "on-track": "success", "at-risk": "warn", delayed: "danger" };
const PRIORITY = { Urgent: "danger", High: "danger", Medium: "info", Low: "neutral" };

export default function ProjectsPage() {
  const projects = useProjectsStore((s) => s.projects);
  const hydrate = useProjectsStore((s) => s.hydrate);
  const addProject = useProjectsStore((s) => s.addProject);
  const updateProject = useProjectsStore((s) => s.updateProject);
  const removeProject = useProjectsStore((s) => s.removeProject);

  const [filter, setFilter] = useState("all");
  const [tab, setTab] = useState("tasks");
  const [selectedId, setSelectedId] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const selected = selectedId ? projects.find((p) => p.id === selectedId) : null;

  const filtered = filter === "all" ? projects : projects.filter((p) => p.health === filter);

  const activeCount = projects.length;
  const onTrackCount = projects.filter((p) => p.health === "on-track").length;
  const contractValue = projects.reduce((s, p) => s + (p.budget || 0), 0);
  const avgProgress = projects.length
    ? Math.round(projects.reduce((s, p) => s + (p.progress || 0), 0) / projects.length)
    : 0;
  const openSnags = snags.filter((s) => s.status !== "Closed").length;
  const criticalSnags = snags.filter((s) => s.severity === "Critical").length;

  const openProject = (p) => {
    setSelectedId(p.id);
    setEditing(false);
  };

  const closeDrawer = () => {
    setSelectedId(null);
    setEditing(false);
  };

  return (
    <div className={grid.stack}>
      <PageHeader title="Projects" subtitle="Plan, execute and track every site to handover" icon={FolderKanban}>
        <Btn icon={Plus} onClick={() => setAddOpen(true)}>New Project</Btn>
      </PageHeader>

      <div className={grid.kpiGrid}>
        <KpiCard index={0} label="Active Projects" value={activeCount} sub={`${onTrackCount} on track`} accent="gold" />
        <KpiCard index={1} label="Contract Value" value={inrCompact(contractValue)} accent="info" />
        <KpiCard index={2} label="Avg Completion" value={pct(avgProgress, 0)} accent="success" />
        <KpiCard index={3} label="Open Snags" value={openSnags} sub={`${criticalSnags} critical`} accent="danger" />
      </div>

      <Panel title="Portfolio timeline" subtitle="Gantt across all live projects">
        <Gantt items={projects} />
      </Panel>

      <div className={grid.filters}>
        {["all", "on-track", "at-risk", "delayed"].map((f) => (
          <button key={f} className={`${grid.chip} ${filter === f ? grid.chipActive : ""}`} onClick={() => setFilter(f)}>
            {f === "all" ? "All projects" : f.replace("-", " ")}
          </button>
        ))}
      </div>

      <div className={styles.projGrid}>
        {filtered.map((p, i) => {
          const client = getClient(p.client);
          const spent = p.budget ? Math.round((p.actual / p.budget) * 100) : 0;
          return (
            <motion.button
              key={p.id}
              className={styles.projCard}
              onClick={() => openProject(p)}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
            >
              <div className={styles.pcHead}>
                <div className={styles.pcTitle}>
                  <strong>{p.name}</strong>
                  <span><MapPin size={11} /> {p.location}</span>
                </div>
                <Badge tone={HEALTH[p.health]} dot>{p.health.replace("-", " ")}</Badge>
              </div>
              <div className={styles.pcClient}>{client?.company}</div>

              <div className={styles.pcStage}>
                {projectStages.map((st) => {
                  const idx = projectStages.indexOf(p.stage);
                  const cur = projectStages.indexOf(st);
                  return <span key={st} className={styles.stageTick} data-state={cur < idx ? "done" : cur === idx ? "active" : "todo"} title={st} />;
                })}
              </div>
              <div className={styles.pcStageLabel}>Stage: <strong>{p.stage}</strong></div>

              <div className={styles.pcMeter}>
                <div className={styles.pcMeterRow}>
                  <span>Progress</span><span className={styles.mono}>{p.progress}%</span>
                </div>
                <Meter value={p.progress} color={HEALTH[p.health]} />
              </div>

              <div className={styles.pcFoot}>
                <div>
                  <span>Budget</span>
                  <strong>{inrCompact(p.budget)}</strong>
                </div>
                <div>
                  <span>Spent</span>
                  <strong className={spent > p.progress + 10 ? styles.over : ""}>{spent}%</strong>
                </div>
                <div>
                  <span>Margin</span>
                  <strong className={styles.success}>{pct(p.margin)}</strong>
                </div>
                <AvatarStack people={(p.team || []).map((id) => getEmployee(id)).filter(Boolean)} size={26} />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Tabs: tasks / reports / snags */}
      <Panel padded={false}>
        <div className={styles.tabs}>
          {[["tasks", "Tasks"], ["reports", "Daily Site Reports"], ["snags", "Snags & Defects"], ["milestones", "Milestones"]].map(([k, label]) => (
            <button key={k} className={`${styles.tab} ${tab === k ? styles.tabActive : ""}`} onClick={() => setTab(k)}>{label}</button>
          ))}
        </div>
        <div className={styles.tabBody}>
          {tab === "tasks" && (
            <div className={styles.taskBoard}>
              {taskStatuses.map((st) => (
                <div className={styles.taskCol} key={st}>
                  <div className={styles.taskColHead}>
                    <span>{st}</span>
                    <span className={styles.taskCount}>{tasks.filter((t) => t.status === st).length}</span>
                  </div>
                  {tasks.filter((t) => t.status === st).map((t) => (
                    <div className={styles.taskCard} key={t.id}>
                      <div className={styles.taskTop}>
                        <Badge tone={PRIORITY[t.priority]}>{t.priority}</Badge>
                        <span className={styles.taskProj}>{getClient(getProjectClient(projects, t.project))?.initials || ""}</span>
                      </div>
                      <p className={styles.taskTitle}>{t.title}</p>
                      <span className={styles.taskMeta}>{projectName(t.project)}</span>
                      <div className={styles.taskFoot}>
                        <span className={styles.chk}><CheckSquare size={12} /> {t.checklist.filter(Boolean).length}/{t.checklist.length}</span>
                        <span className={styles.chk}><MessageSquare size={12} /> {t.comments}</span>
                        <span className={styles.due}><Calendar size={11} /> {dateShort(t.due).slice(0, 6)}</span>
                        <Avatar name={employeeName(t.assignee)} initials={getEmployee(t.assignee)?.initials} size={22} tone="info" />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {tab === "reports" && (
            dailyReports.length > 0 ? (
              <div className={styles.reportGrid}>
                {dailyReports.map((r) => (
                  <div className={styles.report} key={r.id}>
                    <div className={styles.reportHead}>
                      <strong>{projectName(r.project)}</strong>
                      {r.delay && <Badge tone="danger" dot>Delay</Badge>}
                    </div>
                    <span className={styles.reportDate}>{dateShort(r.date)} · {employeeName(r.by)}</span>
                    <p className={styles.reportText}>{r.progress}</p>
                    <div className={styles.reportStats}>
                      <span><Users size={12} /> {r.labour}</span>
                      <span><CloudRain size={12} /> {r.weather}</span>
                      <span><Camera size={12} /> {r.photos}</span>
                      <span><Video size={12} /> {r.videos}</span>
                      <span><Mic size={12} /> {r.voice}</span>
                      {r.issues > 0 && <span className={styles.issue}><AlertTriangle size={12} /> {r.issues}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyHint}>No site reports yet.</p>
            )
          )}

          {tab === "snags" && (
            snags.length > 0 ? (
              <div className={styles.snagList}>
                {snags.map((s) => (
                  <div className={styles.snagRow} key={s.id}>
                    <span className={styles.snagSev} data-sev={s.severity} />
                    <div className={styles.snagInfo}>
                      <strong>{s.title}</strong>
                      <span>{projectName(s.project)} · {s.area}</span>
                    </div>
                    <Badge tone={s.severity === "Critical" ? "danger" : s.severity === "Major" ? "warn" : "neutral"}>{s.severity}</Badge>
                    <Badge>{s.status}</Badge>
                    <span className={styles.snagDue}>{dateShort(s.due)}</span>
                    <Avatar name={employeeName(s.assignee)} initials={getEmployee(s.assignee)?.initials} size={24} tone="purple" />
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyHint}>No snags logged.</p>
            )
          )}

          {tab === "milestones" && (
            milestones.length > 0 ? (
              <div className={styles.msList}>
                {milestones.map((m) => (
                  <div className={styles.msRow} key={m.id}>
                    <span className={styles.msDot} data-state={m.status} />
                    <div className={styles.msInfo}>
                      <strong>{m.name}</strong>
                      <span>{projectName(m.project)}</span>
                    </div>
                    <span className={styles.msDate}>{dateShort(m.date)}</span>
                    <span className={styles.msPay}>{inrCompact(m.payment)}</span>
                    <Badge tone={m.status === "done" ? "success" : m.status === "delayed" ? "danger" : m.status === "active" ? "warn" : "neutral"}>{m.status}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyHint}>No milestones planned.</p>
            )
          )}
        </div>
      </Panel>

      <Drawer
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="New project"
        width={480}
      >
        {addOpen && (
          <ProjectForm
            initial={null}
            submitLabel="Create project"
            onSubmit={async (v) => {
              await addProject({ ...v, cover: "/images/project1.png" });
              setAddOpen(false);
            }}
            onCancel={() => setAddOpen(false)}
          />
        )}
      </Drawer>

      <ProjectDrawer
        project={selected}
        editing={editing}
        onClose={closeDrawer}
        onEdit={() => setEditing(true)}
        onCancelEdit={() => setEditing(false)}
        onSubmit={async (v) => {
          if (!selected) return;
          await updateProject(selected.id, v);
          setEditing(false);
        }}
        onDelete={async () => {
          if (!selected) return;
          if (!window.confirm(`Delete project "${selected.name}"? This cannot be undone.`)) return;
          await removeProject(selected.id);
          closeDrawer();
        }}
      />
    </div>
  );
}

function getProjectClient(projects, pid) {
  return projects.find((p) => p.id === pid)?.client;
}

function ProjectDrawer({ project, editing, onClose, onEdit, onCancelEdit, onSubmit, onDelete }) {
  if (!project) return <Drawer open={false} onClose={onClose} title="Project" />;
  const client = getClient(project.client);
  const spent = project.budget ? Math.round((project.actual / project.budget) * 100) : 0;
  const pSnags = snags.filter((s) => s.project === project.id);
  const pMs = milestones.filter((m) => m.project === project.id);

  return (
    <Drawer
      open={!!project}
      onClose={onClose}
      title={editing ? "Edit project" : "Project overview"}
      width={480}
    >
      {editing ? (
        <ProjectForm
          initial={project}
          submitLabel="Save changes"
          onSubmit={onSubmit}
          onCancel={onCancelEdit}
        />
      ) : (
        <div className={styles.detail}>
          <div className={styles.dHead}>
            <h3>{project.name}</h3>
            <Badge tone={HEALTH[project.health]} dot>{project.health.replace("-", " ")}</Badge>
          </div>
          <p className={styles.dSub}>{project.code} · {client?.company} · {project.location}</p>

          <div className={styles.dActions}>
            <Btn variant="ghost" icon={Pencil} onClick={onEdit}>Edit</Btn>
            <Btn variant="outline" icon={Trash2} onClick={onDelete}>Delete</Btn>
          </div>

          <div className={styles.dRings}>
            <div className={styles.dRing}><Ring value={project.progress} size={70} color={HEALTH[project.health]} /><span>Progress</span></div>
            <div className={styles.dRing}><Ring value={spent} size={70} color={spent > project.progress + 10 ? "danger" : "info"} /><span>Budget used</span></div>
            <div className={styles.dRing}><Ring value={project.margin} size={70} color="success" /><span>Margin</span></div>
          </div>

          <div className={styles.dKv}>
            <div><span>Budget</span><strong>{inr(project.budget)}</strong></div>
            <div><span>Actual</span><strong>{inr(project.actual)}</strong></div>
            <div><span>Committed</span><strong>{inr(project.committed)}</strong></div>
            <div><span>Due</span><strong>{dateShort(project.due)}</strong></div>
          </div>

          <section className={styles.dSection}>
            <h4>Team</h4>
            <div className={grid.row}>
              <Avatar name={employeeName(project.manager)} initials={getEmployee(project.manager)?.initials} size={32} tone="gold" />
              <div className={styles.mgr}><strong>{employeeName(project.manager)}</strong><span>Project lead</span></div>
              <AvatarStack people={(project.team || []).map((id) => getEmployee(id)).filter(Boolean)} size={30} />
            </div>
          </section>

          <section className={styles.dSection}>
            <h4>Milestones</h4>
            {pMs.length === 0 && <p className={styles.dEmpty}>No milestones.</p>}
            {pMs.map((m) => (
              <div className={styles.msRow} key={m.id}>
                <span className={styles.msDot} data-state={m.status} />
                <div className={styles.msInfo}><strong>{m.name}</strong><span>{dateShort(m.date)}</span></div>
                <span className={styles.msPay}>{inrCompact(m.payment)}</span>
              </div>
            ))}
          </section>

          <section className={styles.dSection}>
            <h4>Open snags ({pSnags.filter((s) => s.status !== "Closed").length})</h4>
            {pSnags.length === 0 && <p className={styles.dEmpty}>No snags.</p>}
            {pSnags.map((s) => (
              <div className={styles.snagRow} key={s.id}>
                <span className={styles.snagSev} data-sev={s.severity} />
                <div className={styles.snagInfo}><strong>{s.title}</strong><span>{s.area}</span></div>
                <Badge>{s.status}</Badge>
              </div>
            ))}
          </section>
        </div>
      )}
    </Drawer>
  );
}
