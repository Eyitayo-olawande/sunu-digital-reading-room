import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Layers, CheckCircle2, CalendarDays, LockKeyhole, Target, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import background from "@/assets/learning-office.png.asset.json";
import professional from "@/assets/learning-professional.png.asset.json";
import conduct from "@/assets/res-conduct.jpg";
import claims from "@/assets/res-claims.jpg";
import intake from "@/assets/res-intake.jpg";
import motor from "@/assets/module-claim.jpg";
import { journeyFor, type LearningModule } from "./learning-data";
import { assignedPath, assignedSummary, assignmentsFor, assignmentTabs, nextAssignment, actionFor, moduleProgressFor, type AssignmentTab } from "./my-learning-data";

const frame = "rounded-xl border border-border bg-card shadow-[var(--shadow-card)]";
function ModuleAction({ module, primary = false, label }: { module: LearningModule; primary?: boolean; label?: string }) {
  return <Button asChild variant={primary ? "default" : "outline"} className="min-h-11 min-w-28 shrink-0"><Link to="/library/$id" params={{ id: module.resourceId }}>{label ?? actionFor(module)}<ArrowRight className="h-4 w-4" /></Link></Button>;
}
function Journey() {
  const stages = [...journeyFor(assignedPath), { stage: "Certificate", state: "upcoming" }];
  return <section className={cn(frame, "@container p-4")}>
    <h2 className="flex items-center gap-2 text-lg font-bold"><Layers className="h-5 w-5 text-primary" />My Learning Path</h2><p className="mt-1 text-sm">A structured journey to build your knowledge and meet role requirements.</p>
    <ol className="my-journey mt-4">
      {stages.map(s => <li key={s.stage} className={cn("my-journey-stage", `my-journey-${s.state}`)}>
        <span className="my-journey-node">{s.state === "completed" ? <CheckCircle2 className="h-5 w-5" /> : s.stage === "Certificate" ? <LockKeyhole className="h-4 w-4" /> : null}</span>
        <div className={cn("my-journey-label rounded-lg px-3 py-2", s.state === "current" && "bg-primary-soft")}><p className="text-sm font-bold">{s.stage}</p><p className="mt-1 text-xs text-muted-foreground">{s.stage === "Certificate" ? "Coming soon" : s.stage === "Common" ? "Organisation-wide learning" : s.stage === "Department" ? "Claims-related learning" : "Claims Officer learning"}</p></div>
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
    <section className="my-learning-banner relative isolate">
      <div className="absolute inset-0 overflow-hidden rounded-xl bg-card"><img src={background.url} alt="" className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-card from-25% via-card/80 via-45% to-transparent to-75%" /></div>
      <img src={professional.url} alt="SUNU professional learning at his laptop" className="my-learning-person absolute z-10" />
      <div className="my-learning-banner-copy relative z-20 px-5 py-6 sm:px-7"><p className="text-xs font-semibold text-muted-foreground">MY LEARNING</p><h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">My Learning <span className="text-primary">Journey</span></h1><p className="mt-2 max-w-lg text-base leading-relaxed">Build your knowledge and meet your role requirements.</p><div className="mt-3 h-1 w-14 rounded-full bg-primary" /></div>
    </section>
    <div className="grid items-start gap-4 min-[1200px]:grid-cols-[minmax(0,1fr)_320px]">
      <div className="min-w-0 space-y-4">
        <Journey />
        <section className={cn(frame, "p-4")}>
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filter assignments">{assignmentTabs.map(t => <Button key={t} variant={t === tab ? "default" : "outline"} aria-pressed={t === tab} className="min-h-10 px-3 text-xs" onClick={() => setTab(t)}>{t === "All Assignments" ? "My Enrolled Courses" : t} ({assignmentsFor(t).length})</Button>)}</div>
          <ol aria-label="Assigned modules" className="mt-3 divide-y divide-border">{[...modules].sort((a,b) => Number(b.status === "In Progress") - Number(a.status === "In Progress")).map(m => {
            const progress = moduleProgressFor(m);
            return <li key={m.resourceId} className="@container py-3"><div className="my-module-row">
              <img src={m.status === "In Progress" ? motor : m.resourceId === "code-of-conduct" ? conduct : m.resourceId === "claims-intake" ? intake : claims} alt="" className="my-module-image rounded-md object-cover" />
              <div className="my-module-title min-w-0"><p className="text-sm font-bold leading-relaxed">{m.title}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">Module {assignedPath.modules.indexOf(m)+1} of {summary.total} · {m.stage}</p>{m.due && <p className="mt-1 text-xs text-muted-foreground">Due {m.due}</p>}</div>
              <span className={cn("my-module-status w-fit rounded-md px-2 py-1 text-xs font-medium",m.status === "Completed" ? "bg-success/10 text-success" : "bg-primary-soft text-primary")}>{m.status}</span>
              <div className="my-module-progress min-w-0"><p className="mb-1 text-xs font-bold">{progress === null ? "Progress not recorded" : `${progress}%`}</p>{progress === null ? <div aria-label={`${m.title}: progress not recorded`} className="h-2 rounded-full bg-border" /> : <progress aria-label={`${m.title} completion`} value={progress} max={100} className="learning-progress block h-2 w-full" />}</div>
              <div className="my-module-action"><ModuleAction module={m} primary={m.status === "In Progress"} /></div>
            </div></li>;
          })}</ol>
          {!modules.length && <div className="py-9 text-center"><CalendarDays className="mx-auto h-7 w-7 text-muted-foreground" /><p className="mt-3 text-sm font-semibold">No upcoming assignments</p><p className="mt-1 text-sm text-muted-foreground">All assigned modules have already been started.</p></div>}
        </section>
      </div>
      <aside className="my-learning-aside grid min-w-0 gap-4">
        <section className={cn(frame, "p-4")}><h2 className="flex items-center gap-2 text-lg font-bold"><Layers className="h-6 w-6 text-primary" />My Progress</h2><p className="mt-1 text-xs text-muted-foreground">Overall learning-path completion</p><div className="my-5 grid grid-cols-[112px_minmax(0,1fr)] items-center gap-4"><div className="relative h-28 w-28 shrink-0"><svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-label={`${summary.percent}% complete`}><circle cx="60" cy="60" r="48" fill="none" stroke="var(--border)" strokeWidth="14" /><circle cx="60" cy="60" r="48" fill="none" stroke="var(--primary)" strokeWidth="14" pathLength="100" strokeDasharray={`${summary.percent} 100`} /></svg><span className="absolute inset-0 grid place-items-center text-2xl font-bold">{summary.percent}%</span></div><dl className="min-w-0 flex-1 space-y-3 text-xs">{[["Completed", summary.completed], ["In Progress", summary.inProgress], ["Not Started", summary.notStarted]].map(([label, value]) => <div key={label} className="flex justify-between gap-2"><dt>{label}</dt><dd className="font-bold">{value}</dd></div>)}</dl></div><Button asChild variant="ghost" className="min-h-11 w-full justify-end px-0 font-semibold text-primary"><Link to="/learning-paths">View detailed progress<ArrowRight /></Link></Button></section>
        <section className={cn(frame, "p-4")}><h2 className="flex items-center gap-2 text-lg font-bold"><Award className="h-6 w-6 text-primary" />My Certificates</h2><div className="mt-4 flex items-start gap-3 border-t border-border py-4"><LockKeyhole className="h-5 w-5 shrink-0 text-muted-foreground" /><div><p className="text-sm font-semibold">Coming soon</p><p className="mt-1 text-sm text-muted-foreground">No certificates have been issued.</p></div></div></section>
        <section className="flex items-start gap-3 rounded-xl border border-primary/10 bg-primary-soft p-5"><Target className="h-10 w-10 shrink-0 text-primary" /><div className="min-w-0"><h2 className="text-lg font-bold text-primary">Keep going!</h2><p className="mt-1 text-sm leading-relaxed">Complete the remaining module to finish your current role learning.</p>{next && <p className="mt-2 text-xs text-muted-foreground">Next deadline: {next.due}</p>}</div></section>
      </aside>
    </div>
  </div>;
}
