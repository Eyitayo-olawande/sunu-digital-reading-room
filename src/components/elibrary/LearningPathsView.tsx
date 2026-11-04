import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Layers, Users, Award, CalendarDays, CheckCircle2, Clock3, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import hero from "@/assets/library_banner.png.asset.json";
import { learningPaths, progressFor, nextLearningModule, selectLearningPaths, statusFor, journeyFor, type LearningPath, type LearningTab, type LearningSort } from "./learning-data";

const card = "rounded-xl border border-border bg-card shadow-[var(--shadow-card)]";
const tabs: LearningTab[] = ["All Learning Paths", "Recommended (sample)", "In Progress", "Completed"];
const assigned = learningPaths[0];

function ModuleLink({ path, children, className, outline = false }: { path: LearningPath; children: React.ReactNode; className?: string; outline?: boolean }) {
  const next = nextLearningModule(path);
  if (!next) return null;
  return <Button asChild variant={outline ? "outline" : "default"} className={cn("min-h-10", className)}><Link to="/library/$id" params={{ id: next.resourceId }}>{children}<ArrowRight /></Link></Button>;
}

function ProgressBar({ path }: { path: LearningPath }) {
  const { percent } = progressFor(path);
  return <div className="flex items-center gap-3"><progress aria-label={`${path.title} completion`} value={percent} max={100} className="learning-progress h-2 flex-1" /><span className="w-9 text-right text-xs font-bold">{percent}%</span></div>;
}

function LearningJourney() {
  const records = journeyFor(assigned);
  const stages = [
    { title: "Common", icon: BookOpen, description: "Organisation-wide learning", state: records[0]?.state },
    { title: "Department", icon: Layers, description: "Claims-related learning", state: records[1]?.state },
    { title: "Role", icon: Users, description: "Claims Officer learning", state: records[2]?.state },
    { title: "Certificate", icon: Award, description: "Coming soon", state: "upcoming" },
  ];
  return <section aria-label="Your learning journey" className={cn(card, "@container p-2")}>
    <div className="flex flex-col @[600px]:flex-row">
      {stages.map((stage, i) => <div key={stage.title} className="flex min-w-0 flex-1 flex-col @[600px]:flex-row items-center">
        <div className={cn("flex w-full items-center gap-4 rounded-lg px-3 py-2.5 @[600px]:min-h-25 @[600px]:flex-col @[600px]:justify-center @[600px]:gap-1 @[600px]:text-center", stage.state === "current" && "bg-primary-soft")}>
          <div className="relative shrink-0 rounded-md bg-primary-soft p-1.5 text-primary"><stage.icon className="h-7 w-7" strokeWidth={1.7} />{stage.state === "completed" && <CheckCircle2 aria-label="Completed" className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-card text-success" />}</div>
          <div><h2 className="text-base font-bold">{stage.title}</h2><p className="mt-0.5 text-sm leading-snug @[600px]:max-w-36">{stage.description}</p>{stage.state === "current" && <span className="text-xs font-medium text-primary">In progress</span>}</div>
        </div>
        {i < 3 && <ArrowRight className="my-1 h-5 w-5 shrink-0 rotate-90 text-muted-foreground @[600px]:mx-1 @[600px]:rotate-0" />}
      </div>)}
    </div>
  </section>;
}

function PathCard({ path, onSelect }: { path: LearningPath; onSelect: () => void }) {
  const completed = statusFor(path) === "Completed";
  const action = completed ? "Review" : statusFor(path) === "In Progress" ? "Continue" : "Start";
  return <article className={cn(card, "flex min-w-0 flex-col overflow-hidden")}>
    <Button variant="ghost" onClick={onSelect} aria-label={`View ${path.title}`} className="relative block h-20 w-full shrink-0 rounded-none p-0 hover:bg-transparent">
      <img src={path.image} alt="" className="h-full w-full object-cover" />
      <span className="absolute bottom-2 left-3 rounded-md bg-primary-soft px-2 py-0.5 text-xs font-semibold text-primary">{path.category}</span>
    </Button>
    <div className="flex flex-1 flex-col gap-2 p-3">
      <Button variant="ghost" onClick={onSelect} className="h-auto min-h-10 items-start justify-start whitespace-normal p-0 text-left text-sm font-bold leading-snug hover:bg-transparent hover:text-primary">{path.title}</Button>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground"><BookOpen className="h-3.5 w-3.5" />{path.modules.length} modules<span aria-hidden>·</span>{path.duration}</div>
      <div className="mt-auto flex min-h-6 flex-col justify-center">{completed ? <span className="inline-flex w-fit items-center gap-1 rounded-md bg-success/10 px-2 py-1 text-xs font-semibold text-success"><CheckCircle2 className="h-3.5 w-3.5" />Completed</span> : <ProgressBar path={path} />}</div>
      <ModuleLink path={path} outline={statusFor(path) !== "In Progress"} className="w-fit min-w-28">{action}</ModuleLink>
    </div>
  </article>;
}

function LearningSummary() {
  const p = progressFor(assigned);
  const next = nextLearningModule(assigned);
  return <aside className="learning-summary grid min-w-0 content-start gap-4">
    <section className={cn(card, "p-4")}>
      <div className="flex gap-3"><Layers className="h-7 w-7 shrink-0 text-primary" /><div><h2 className="text-lg font-bold">My Learning Path</h2><p className="text-sm">{assigned.title}</p></div></div>
      <div className="my-4 flex items-center justify-between gap-4">
        <div className="relative h-28 w-28 shrink-0"><svg viewBox="0 0 120 120" aria-label={`${p.percent}% complete`} className="h-full w-full -rotate-90"><circle cx="60" cy="60" r="48" fill="none" stroke="var(--border)" strokeWidth="15" /><circle cx="60" cy="60" r="48" fill="none" stroke="var(--primary)" strokeWidth="15" pathLength="100" strokeDasharray={`${p.percent} 100`} /></svg><span className="absolute inset-0 grid place-items-center text-2xl font-bold">{p.percent}%</span></div>
        <dl className="min-w-0 flex-1 space-y-3 text-xs">{[["Completed", p.completed, "bg-primary"], ["In Progress", p.inProgress, "bg-primary-soft"], ["Not Started", p.notStarted, "bg-border"]].map(([label, count, color]) => <div key={label} className="flex items-center gap-2"><span className={cn("h-3 w-3 shrink-0 rounded-sm", color)} /><dt>{label}</dt><dd className="ml-auto font-bold">{count}</dd></div>)}</dl>
      </div>
      <ModuleLink path={assigned} className="w-full">Continue Learning</ModuleLink>
    </section>
    <section className="flex items-start gap-3 rounded-xl border border-primary/10 bg-primary-soft p-4"><CalendarDays className="h-7 w-7 shrink-0 text-primary" /><div className="min-w-0"><h2 className="text-lg font-bold">Next Milestone</h2><p className="mt-1 text-sm font-medium">{next?.title}</p><p className="mt-1 text-sm leading-relaxed">Complete the remaining module by <strong>{next?.due}</strong> to finish your role learning.</p><ModuleLink path={assigned} className="mt-3" outline>Open Module</ModuleLink></div></section>
    <section className={cn(card, "learning-certificates p-4")}><div className="flex items-center gap-3"><Award className="h-7 w-7 text-primary" /><h2 className="text-lg font-bold">My Certificates</h2></div><div className="mt-4 flex items-start gap-3 border-t border-border pt-4"><LockKeyhole className="h-5 w-5 shrink-0 text-muted-foreground" /><div><p className="text-sm font-semibold">Coming soon</p><p className="mt-1 text-sm text-muted-foreground">Certificates are not available yet.</p></div></div></section>
  </aside>;
}

export function LearningPathsView() {
  const [tab, setTab] = useState<LearningTab>("All Learning Paths");
  const [sort, setSort] = useState<LearningSort>("Most Relevant");
  const [selected, setSelected] = useState<LearningPath | null>(null);
  const paths = selectLearningPaths(tab, sort);
  return <div className="mx-auto max-w-[1440px] space-y-4">
    <section className="relative isolate overflow-hidden rounded-xl bg-card">
      <div className="absolute inset-0 hidden overflow-hidden lg:block"><img src={hero.url} alt="SUNU professional at her laptop" className="absolute right-0 h-full w-auto max-w-none object-contain" style={{ maskImage: "linear-gradient(to right, transparent, var(--foreground) 38%)", WebkitMaskImage: "linear-gradient(to right, transparent, var(--foreground) 38%)" }} /><div className="absolute inset-0 bg-gradient-to-r from-card from-20% via-card/60 via-42% to-transparent to-65%" /></div>
      <div className="relative z-10 max-w-xl px-6 py-6 sm:px-8 lg:py-7"><h1 className="text-3xl font-extrabold sm:text-4xl">Learning <span className="text-primary">Paths</span></h1><p className="mt-2 max-w-md text-base leading-relaxed">Structured learning to build your knowledge and meet your role requirements.</p><div className="mt-3 h-1 w-14 rounded-full bg-primary" /></div>
      <div className="relative lg:hidden"><img src={hero.url} alt="SUNU professional at her laptop" className="block h-auto w-full" /><div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-5 bg-gradient-to-b from-card to-transparent" /></div>
    </section>
    <div className="grid items-start gap-5 min-[1440px]:grid-cols-[minmax(0,1fr)_310px]">
      <div className="min-w-0 space-y-4">
        <LearningJourney />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter learning paths">{tabs.map(t => <Button key={t} aria-pressed={tab === t} variant={tab === t ? "default" : "outline"} onClick={() => setTab(t)} className="min-h-10 px-3 text-xs">{t} ({selectLearningPaths(t, "Most Relevant").length})</Button>)}</div>
          <label className="flex items-center gap-2 text-xs font-medium">Sort:<select aria-label="Sort learning paths" value={sort} onChange={e => setSort(e.target.value as LearningSort)} className="min-h-10 max-w-full rounded-lg border border-border bg-card px-2">{(["Most Relevant", "Title A–Z", "Progress"] as const).map(s => <option key={s}>{s}</option>)}</select></label>
        </div>
        <div className="learning-path-grid grid gap-4" aria-label="Learning paths">{paths.map(path => <PathCard key={path.id} path={path} onSelect={() => setSelected(path)} />)}</div>
      </div>
      <LearningSummary />
    </div>
    <Dialog open={!!selected} onOpenChange={open => { if (!open) setSelected(null); }}><DialogContent className="max-h-[85dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-xl">{selected && <>
      <DialogHeader><DialogTitle className="pr-5 leading-snug">{selected.title}</DialogTitle><DialogDescription>{selected.category} learning · {selected.modules.length} modules · {selected.duration}</DialogDescription></DialogHeader>
      <ProgressBar path={selected} />
      <ol className="divide-y divide-border">{selected.modules.map((m, i) => <li key={`${m.resourceId}-${i}`} className="flex items-start gap-3 py-3">{m.status === "Completed" ? <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-success" /> : <Clock3 className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />}<div className="min-w-0 flex-1"><p className="text-sm font-semibold">{i + 1}. {m.title}</p><p className="mt-1 text-xs text-muted-foreground">{m.status}{m.due ? ` · Due ${m.due}` : ""}</p></div><Button asChild variant="outline" className="min-h-10"><Link to="/library/$id" params={{ id: m.resourceId }}>{m.status === "Completed" ? "Review" : "Open"}</Link></Button></li>)}</ol>
      <ModuleLink path={selected}>{statusFor(selected) === "Completed" ? "Review" : statusFor(selected) === "In Progress" ? "Continue Learning" : "Start Learning"}</ModuleLink>
    </>}</DialogContent></Dialog>
  </div>;
}