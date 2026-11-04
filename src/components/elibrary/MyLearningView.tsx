import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Layers, CheckCircle2, Clock3, CalendarDays, LockKeyhole, Bell, ChartNoAxesColumnIncreasing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import hero from "@/assets/library_banner.png.asset.json";
import motor from "@/assets/module-claim.jpg";
import { journeyFor, type LearningModule } from "./learning-data";
import { assignedPath, assignedSummary, assignmentsFor, assignmentTabs, nextAssignment, actionFor, type AssignmentTab } from "./my-learning-data";

const frame = "rounded-xl border border-border bg-card shadow-[var(--shadow-card)]";
function ModuleAction({ module, primary = false, label }: { module: LearningModule; primary?: boolean; label?: string }) {
  return <Button asChild variant={primary ? "default" : "outline"} className="min-h-11 shrink-0"><Link to="/library/$id" params={{ id: module.resourceId }}>{label ?? actionFor(module)}<ArrowRight className="h-4 w-4" /></Link></Button>;
}
function Journey() {
  const stages = [...journeyFor(assignedPath), { stage: "Certificate", state: "upcoming" }];
  return <section className={cn(frame, "@container p-4")}>
    <h2 className="flex items-center gap-2 text-lg font-bold"><Layers className="h-5 w-5 text-primary" />My Learning Journey</h2>
    <ol className="mt-4 flex flex-col gap-2 @[580px]:flex-row @[580px]:gap-0">
      {stages.map((s, i) => <li key={s.stage} className="flex min-w-0 flex-1 items-center @[580px]:items-start">
        <div className={cn("flex w-full items-center gap-3 rounded-lg px-3 py-2 @[580px]:flex-col @[580px]:text-center", s.state === "current" && "bg-primary-soft")}>
          <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-full border-2", s.state === "completed" ? "border-success bg-success text-primary-foreground" : s.state === "current" ? "border-primary bg-card text-primary" : "border-border bg-muted text-muted-foreground")}>{s.state === "completed" ? <CheckCircle2 className="h-5 w-5" /> : s.stage === "Certificate" ? <LockKeyhole className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}</span>
          <div className="min-w-0"><p className="text-sm font-bold">{s.stage}</p><p className={cn("mt-1 text-xs", s.state === "current" ? "text-primary" : "text-muted-foreground")}>{s.stage === "Certificate" ? "Coming soon" : s.state === "completed" ? "Completed" : "In Progress"}</p></div>
        </div>
        {i < 3 && <ArrowRight aria-hidden className="hidden h-4 w-4 shrink-0 text-muted-foreground @[580px]:mt-5 @[580px]:block" />}
      </li>)}
    </ol>
  </section>;
}
export function MyLearningView() {
  const [tab, setTab] = useState<AssignmentTab>("All Assignments");
  const summary = assignedSummary();
  const next = nextAssignment();
  const modules = assignmentsFor(tab);
  return <div className="mx-auto max-w-[1440px] space-y-4">
    <section className="relative isolate overflow-hidden rounded-xl bg-card">
      <div className="absolute inset-0 hidden lg:block"><img src={hero.url} alt="SUNU professional learning at her laptop" className="my-learning-photo absolute right-0 h-full w-auto max-w-none object-contain" /><div className="absolute inset-0 bg-gradient-to-r from-card from-25% via-card/80 via-45% to-transparent to-75%" /></div>
      <div className="relative z-10 max-w-xl px-5 py-6 sm:px-7"><p className="text-xs font-semibold text-muted-foreground">YOUR LEARNING</p><h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">My <span className="text-primary">Learning</span></h1><p className="mt-2 max-w-md text-base leading-relaxed">Your assigned learning, progress and next steps, all in one place.</p><div className="mt-3 h-1 w-14 rounded-full bg-primary" /></div>
      <img src={hero.url} alt="SUNU professional at her laptop" className="block h-auto w-full lg:hidden" />
    </section>
    <section aria-label="Learning summary" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {[{ label: "Assigned Modules", value: summary.total, icon: BookOpen }, { label: "Completed", value: summary.completed, icon: CheckCircle2 }, { label: "In Progress", value: summary.inProgress, icon: Clock3 }, { label: "Overall Completion", value: `${summary.percent}%`, icon: ChartNoAxesColumnIncreasing }].map(({ label, value, icon: Icon }) => <div key={label} className={cn(frame, "flex min-w-0 items-center gap-3 p-3 sm:p-4")}><Icon className="hidden h-8 w-8 shrink-0 rounded-lg bg-primary-soft p-1.5 text-primary sm:block" /><div className="min-w-0"><p className="text-xs font-medium text-muted-foreground sm:text-sm">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p></div></div>)}
    </section>
    <div className="grid items-start gap-4 min-[1440px]:grid-cols-[minmax(0,1fr)_310px]">
      <div className="min-w-0 space-y-4">
        {next && <section className="@container overflow-hidden rounded-xl border border-primary/20 bg-primary-soft">
          <div className="grid @[560px]:grid-cols-[minmax(0,1fr)_180px]">
            <div className="min-w-0 p-5"><p className="text-xs font-semibold text-primary">CONTINUE LEARNING · NEXT UP</p><h2 className="mt-2 text-xl font-bold">{next.title}</h2><p className="mt-1 text-sm text-muted-foreground">{assignedPath.title} · Module {assignedPath.modules.indexOf(next) + 1} of {summary.total}</p><p className="mt-3 flex items-center gap-2 text-sm"><CalendarDays className="h-4 w-4 text-primary" />Due 11 January 2027</p><div className="mt-4"><ModuleAction module={next} primary label="Continue Learning" /></div></div>
            <img src={motor} alt="Motor claims documentation" className="hidden h-full min-h-44 w-full object-cover @[560px]:block" />
          </div>
        </section>}
        <section className={cn(frame, "p-4")}>
          <h2 className="text-lg font-bold">My Assigned Learning</h2>
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filter assignments">{assignmentTabs.map(t => <Button key={t} variant={t === tab ? "default" : "outline"} aria-pressed={t === tab} className="min-h-10 px-3 text-xs" onClick={() => setTab(t)}>{t} ({assignmentsFor(t).length})</Button>)}</div>
          <ol aria-label="Assigned modules" className="mt-3 divide-y divide-border">{modules.map(m => <li key={m.resourceId} className="@container py-4"><div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 @[650px]:grid-cols-[minmax(0,1fr)_125px_auto] @[650px]:items-center"><div className="min-w-0"><p className="text-sm font-bold">{m.title}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{assignedPath.title} · {m.stage}</p><p className="mt-1 text-xs text-muted-foreground">{m.due ? `Due ${m.due}` : "No deadline assigned"}</p><span className={cn("mt-2 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium @[650px]:hidden", m.status === "Completed" ? "bg-success/10 text-success" : "bg-primary-soft text-primary")}>{m.status}</span></div><span className={cn("hidden w-fit rounded-md px-2 py-1 text-xs font-medium @[650px]:inline-flex", m.status === "Completed" ? "bg-success/10 text-success" : "bg-primary-soft text-primary")}>{m.status}</span><ModuleAction module={m} primary={m.status === "In Progress"} /></div></li>)}</ol>
          {!modules.length && <div className="py-9 text-center"><CalendarDays className="mx-auto h-7 w-7 text-muted-foreground" /><p className="mt-3 text-sm font-semibold">No upcoming assignments</p><p className="mt-1 text-sm text-muted-foreground">All assigned modules have already been started.</p></div>}
        </section>
        <Journey />
      </div>
      <aside className="my-learning-aside grid min-w-0 gap-4">
        <section className={cn(frame, "p-4")}><h2 className="text-lg font-bold">My Progress</h2><div className="my-4 flex items-center gap-4"><div className="relative h-24 w-24 shrink-0"><svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-label={`${summary.percent}% complete`}><circle cx="60" cy="60" r="48" fill="none" stroke="var(--border)" strokeWidth="14" /><circle cx="60" cy="60" r="48" fill="none" stroke="var(--primary)" strokeWidth="14" pathLength="100" strokeDasharray={`${summary.percent} 100`} /></svg><span className="absolute inset-0 grid place-items-center text-2xl font-bold">{summary.percent}%</span></div><dl className="min-w-0 flex-1 space-y-3 text-xs">{[["Completed", summary.completed], ["In Progress", summary.inProgress], ["Not Started", summary.notStarted]].map(([label, value]) => <div key={label} className="flex justify-between gap-2"><dt>{label}</dt><dd className="font-bold">{value}</dd></div>)}</dl></div><Button asChild variant="outline" className="min-h-11 w-full"><Link to="/learning-paths">View Learning Paths<ArrowRight /></Link></Button></section>
        <section className={cn(frame, "p-4")}><h2 className="text-lg font-bold">Recently Completed</h2><ul className="mt-3 divide-y divide-border">{assignmentsFor("Completed").map(m => <li key={m.resourceId} className="flex items-start gap-2 py-3"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" /><div className="min-w-0"><Link to="/library/$id" params={{ id: m.resourceId }} className="text-sm font-semibold hover:text-primary">{m.title}</Link><p className="mt-1 text-xs text-muted-foreground">Completed · {m.stage}</p></div></li>)}</ul></section>
        <section className="rounded-xl border border-primary/10 bg-primary-soft p-4"><h2 className="flex items-center gap-2 text-lg font-bold"><Bell className="h-5 w-5 text-primary" />Learning Notices</h2><p className="mt-3 text-sm font-semibold">Role learning deadline</p><p className="mt-1 text-sm leading-relaxed">Motor Claim Registration is due 11 January 2027.</p><div className="mt-4 flex items-start gap-2 border-t border-primary/10 pt-3"><LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><div><p className="text-sm font-semibold">Certificates · Coming soon</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">No certificates have been issued.</p></div></div></section>
      </aside>
    </div>
  </div>;
}