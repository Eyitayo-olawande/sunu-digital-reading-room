import { Link } from "@tanstack/react-router";
import { Users, Layers, GraduationCap, ClipboardList, Lock, BookOpen, Megaphone, History, ChartNoAxesColumn, CircleHelp, CalendarDays } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import office from "@/assets/administrator-office.png.asset.json";
import colleagues from "@/assets/administrator-colleagues.png.asset.json";
import { adminSummary } from "./admin-data";

const panel = "min-w-0 rounded-lg border border-border bg-card p-4 shadow-[var(--shadow-card)] sm:p-5";
function Panel({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return <section className={`${panel} ${className}`}><h2 className="text-lg font-bold leading-snug">{title}</h2>{children}</section>;
}

export function AdminDashboardView() {
  const data = adminSummary();
  const stats = [
    { label: "Active Users", value: data.activeUsers, note: "Staff records unavailable", icon: Users },
    { label: "Total Resources", value: data.resources, note: `${data.publishedResources} published · ${data.draftResources} draft · ${data.reviewResources} in review`, icon: Layers },
    { label: "Learning Paths", value: data.learningPaths, note: "Sample catalogue", icon: GraduationCap },
    { label: "Active Assignments", value: data.activeAssignments, note: "Organisation records unavailable", icon: ClipboardList },
  ];
  return <div className="mx-auto max-w-[1440px] space-y-4">
    <section className="admin-banner relative isolate">
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-lg bg-card">
        <img src={office.url} alt="" className="h-full w-full object-cover" />
        <div className="admin-banner-fade absolute inset-0" />
      </div>
      <img src={colleagues.url} alt="Two SUNU professionals collaborating at a laptop" className="admin-banner-person pointer-events-none absolute z-10" />
      <div className="admin-banner-copy relative z-20 p-5 sm:p-7">
        <h1 className="text-[28px] font-extrabold leading-tight sm:text-[32px]">Administrator <span className="text-primary">Dashboard</span></h1>
        <p className="mt-2 max-w-md text-base leading-snug">Manage learning, content, users and access across the organisation.</p>
        <div className="mt-3 h-1 w-14 rounded-full bg-primary" />
      </div>
    </section>
    <div className="relative z-20 grid grid-cols-1 gap-3 min-[600px]:grid-cols-2 min-[1440px]:grid-cols-4">
      {stats.map(({ label, value, note, icon: Icon }) => <article key={label} className="flex min-w-0 items-center gap-4 rounded-lg border border-border bg-card px-5 py-4 shadow-[var(--shadow-card)]">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary"><Icon className="h-8 w-8" strokeWidth={1.5} /></span>
        <div className="min-w-0"><p className="text-[32px] font-bold leading-none tabular-nums">{value ?? "—"}</p><h2 className="mt-1.5 text-sm font-semibold">{label}</h2><p className="mt-1.5 text-xs leading-snug text-muted-foreground">{note}</p></div>
      </article>)}
    </div>
    <div className="flex items-start gap-2 text-xs text-muted-foreground"><CircleHelp className="mt-0.5 h-4 w-4 shrink-0" /><p>Visual preview only · Funke Adeyemi · Claims Department · Administrator. The role selector grants no permissions. Catalogue counts are sample records; secure access is not connected.</p></div>
    <div className="admin-panels grid gap-4">
      <div className="grid min-w-0 content-start gap-4">
        <Panel title="Learning Progress (Organisation-wide)">
          <div className="admin-progress-content mt-4 flex flex-wrap items-center gap-5">
            <div className="admin-progress-ring" role="img" aria-label="Organisation completion unavailable; no assigned-module records connected"><div className="absolute inset-0 flex flex-col items-center justify-center text-center"><strong className="text-4xl">—</strong><span className="mt-1 text-xs text-muted-foreground">Overall completion<br />No records</span></div></div>
            <dl className="min-w-[150px] flex-1 space-y-3 text-sm">{["Completed", "In Progress", "Not Started"].map((status, i) => <div key={status} className="flex items-center gap-2 border-b border-border pb-2"><span className={`h-3 w-3 rounded-sm ${i === 0 ? "bg-primary" : i === 1 ? "bg-primary-soft" : "bg-border"}`} /><dt className="flex-1">{status}</dt><dd className="font-semibold">—</dd></div>)}</dl>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Assigned-module records across the organisation are unavailable. Individual sample learning paths are not included in this summary.</p>
        </Panel>
        <Panel title="Learning Completion by Department">
          <div className="mt-5 space-y-4">{data.departments.map(d => <div key={d.name} className="admin-department-row grid items-center gap-3 text-sm"><span className="font-medium">{d.name === "IT" ? "Information Technology" : d.name === "Service" ? "Customer Service" : d.name}</span><div className="admin-empty-track" aria-label={`${d.name}: completion data unavailable`} /><span className="text-muted-foreground">—</span></div>)}</div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Departments from the sample library. No department assignment or completion records are available.</p>
        </Panel>
      </div>
      <div className="grid min-w-0 content-start gap-4">
        <Panel title="Learning Journey – Organisation Overview" className="@container">
          <ol className="admin-journey mt-4">{[
            { name: "Common", note: "Organisation-wide learning", icon: BookOpen },
            { name: "Department", note: "Department-specific learning", icon: Layers },
            { name: "Role", note: "Role-specific learning", icon: Users },
            { name: "Certificate", note: "Coming soon", icon: Lock },
          ].map(({name, note, icon: Icon}) => <li key={name} className={`admin-journey-stage admin-stage-${name.toLowerCase()}`}><span className="admin-journey-node"><Icon className="h-5 w-5" /></span><div><h3 className="text-base font-bold">{name}</h3><p className="mt-1 text-xs leading-snug text-muted-foreground">{note}</p></div></li>)}</ol>
          <p className="mt-4 text-xs text-muted-foreground">Journey structure, not organisation status · Stage totals unavailable.</p>
        </Panel>
        <div className="grid gap-4 min-[768px]:grid-cols-2 min-[1024px]:grid-cols-1 min-[1440px]:grid-cols-2">
          <Panel title="Quick Actions" className="@container">
            <div className="admin-quick-grid mt-4 grid grid-cols-2 gap-3">
              <Button asChild variant="outline" className="admin-quick-action"><Link to="/learning-paths"><Layers />Learning Paths</Link></Button>
              <Button asChild variant="outline" className="admin-quick-action"><Link to="/library"><BookOpen />Knowledge Library</Link></Button>
              <div className="admin-quick-unavailable"><Users /><p>People / Staff</p><span>Not available</span></div>
              <div className="admin-quick-unavailable"><ChartNoAxesColumn /><p>Reports</p><span>Not available</span></div>
            </div>
          </Panel>
          <Panel title="Recent Activity"><div className="mt-4 flex items-start gap-3 border-y border-border py-5"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary"><History className="h-6 w-6" /></span><div><p className="text-sm font-semibold">No activity records available</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">No organisation activity log is connected. Event descriptions and timestamps will appear when records are available.</p></div></div><p className="mt-3 text-xs text-muted-foreground">Source unavailable · Not an access denial or loading error.</p></Panel>
        </div>
        <section className="min-w-0 rounded-lg border border-border bg-primary-soft p-5"><div className="flex items-center gap-3"><Megaphone className="h-9 w-9 shrink-0 text-primary" /><h2 className="text-xl font-bold">System Notices <span className="ml-1 text-xs font-medium text-primary">Sample</span></h2></div><ul className="mt-3 divide-y divide-primary/10">{data.sampleNotices.map(n => <li key={n.title} className="flex flex-wrap items-start gap-x-3 gap-y-1 py-2.5"><p className="min-w-0 flex-1 basis-44 text-sm font-medium">{n.title}</p><span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><CalendarDays className="h-3.5 w-3.5" />{n.date}</span></li>)}</ul><p className="mt-2 text-xs text-muted-foreground">Existing dashboard sample notices · No live notices source connected.</p></section>
      </div>
    </div>
  </div>;
}