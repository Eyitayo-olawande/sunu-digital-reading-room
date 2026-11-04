import { Link } from "@tanstack/react-router";
import { Users, Layers, GraduationCap, ClipboardList, Lock, BookOpen, Megaphone, History, ChartNoAxesColumn, ArrowRight, CircleHelp } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import office from "@/assets/office_background.jpg.asset.json";
import colleagues from "@/assets/professionals_cutout_v3.png.asset.json";
import { adminSummary } from "./admin-data";

const panel = "min-w-0 rounded-lg border border-border bg-card p-4 shadow-[var(--shadow-card)] sm:p-5";
function Panel({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return <section className={`${panel} ${className}`}><h2 className="text-base font-bold leading-snug">{title}</h2>{children}</section>;
}

export function AdminDashboardView() {
  const data = adminSummary();
  const stats = [
    { label: "Active Users", value: data.activeUsers, note: "Staff records unavailable", icon: Users },
    { label: "Total Resources", value: data.resources, note: `${data.publishedResources} published · sample catalogue`, icon: Layers },
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
      {stats.map(({ label, value, note, icon: Icon }) => <article key={label} className="flex min-w-0 items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-[var(--shadow-card)]">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary"><Icon className="h-6 w-6" strokeWidth={1.6} /></span>
        <div className="min-w-0"><p className="text-[26px] font-bold leading-none">{value ?? "—"}</p><h2 className="mt-1 text-sm font-semibold">{label}</h2><p className="mt-1 text-xs leading-snug text-muted-foreground">{note}</p></div>
      </article>)}
    </div>
    <div className="flex items-start gap-2 text-xs text-muted-foreground"><CircleHelp className="mt-0.5 h-4 w-4 shrink-0" /><p>Administrator preview · Catalogue counts use sample records. Organisation data and secure administrator access are not connected.</p></div>
    <div className="admin-panels grid gap-4">
      <div className="grid min-w-0 content-start gap-4">
        <Panel title="Learning Progress (Organisation-wide)">
          <div className="admin-progress-content mt-4 flex flex-wrap items-center gap-5">
            <div className="relative h-36 w-36 shrink-0 rounded-full border-[18px] border-border"><div className="absolute inset-0 flex flex-col items-center justify-center text-center"><strong className="text-3xl">—</strong><span className="text-xs text-muted-foreground">Completion<br />unavailable</span></div></div>
            <dl className="min-w-[150px] flex-1 space-y-3 text-sm">{["Completed", "In Progress", "Not Started"].map((status, i) => <div key={status} className="flex items-center gap-2 border-b border-border pb-2"><span className={`h-3 w-3 rounded-sm ${i === 0 ? "bg-primary" : i === 1 ? "bg-primary-soft" : "bg-border"}`} /><dt className="flex-1">{status}</dt><dd className="font-semibold">—</dd></div>)}</dl>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Assigned-module records across the organisation are unavailable. Individual sample learning paths are not included in this summary.</p>
        </Panel>
        <Panel title="Learning Completion by Department">
          <div className="mt-4 space-y-3">{data.departments.map(d => <div key={d.name} className="admin-department-row grid items-center gap-2 text-xs"><span className="font-medium">{d.name === "IT" ? "Information Technology" : d.name === "Service" ? "Customer Service" : d.name}</span><div className="h-2.5 rounded-full bg-border" /><span className="text-muted-foreground">—</span></div>)}</div>
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
          ].map(({name, note, icon: Icon}) => <li key={name} className="admin-journey-stage"><span className="admin-journey-node"><Icon className="h-4 w-4" /></span><div><h3 className="text-sm font-bold">{name}</h3><p className="mt-1 text-xs leading-snug text-muted-foreground">{note}</p></div></li>)}</ol>
          <p className="mt-3 text-xs text-muted-foreground">Stage structure only · Organisation stage totals unavailable.</p>
        </Panel>
        <div className="grid gap-4 min-[768px]:grid-cols-2 min-[1024px]:grid-cols-1 min-[1600px]:grid-cols-2">
          <Panel title="Quick Actions">
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button asChild variant="outline" className="h-auto min-h-20 flex-col whitespace-normal bg-primary-soft p-3 text-center text-xs"><Link to="/learning-paths"><Layers className="text-primary" />Learning Paths<ArrowRight className="text-primary" /></Link></Button>
              <Button asChild variant="outline" className="h-auto min-h-20 flex-col whitespace-normal bg-primary-soft p-3 text-center text-xs"><Link to="/library"><BookOpen className="text-primary" />Knowledge Library<ArrowRight className="text-primary" /></Link></Button>
              <div className="flex min-h-20 flex-col items-center justify-center gap-1 rounded-md border border-border p-2 text-center"><Users className="h-5 w-5 text-muted-foreground" /><p className="text-xs font-medium">People / Staff</p><p className="text-[11px] text-muted-foreground">Not available</p></div>
              <div className="flex min-h-20 flex-col items-center justify-center gap-1 rounded-md border border-border p-2 text-center"><ChartNoAxesColumn className="h-5 w-5 text-muted-foreground" /><p className="text-xs font-medium">Reports</p><p className="text-[11px] text-muted-foreground">Not available</p></div>
            </div>
          </Panel>
          <Panel title="Recent Activity"><div className="flex min-h-36 flex-col items-center justify-center gap-3 py-5 text-center"><History className="h-7 w-7 text-muted-foreground" /><p className="text-sm font-medium">No activity log connected</p><p className="text-xs text-muted-foreground">Recent organisation events are unavailable.</p></div></Panel>
        </div>
        <section className="flex min-w-0 items-start gap-4 rounded-lg border border-border bg-primary-soft p-5"><Megaphone className="mt-1 h-9 w-9 shrink-0 text-primary" /><div><h2 className="text-lg font-bold">System Notice</h2><p className="mt-1 text-sm">No system notices available.</p><p className="mt-1 text-xs text-muted-foreground">No live notices source is connected.</p></div></section>
      </div>
    </div>
  </div>;
}