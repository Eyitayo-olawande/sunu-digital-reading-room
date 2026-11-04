import { ArrowRight, BookOpen, Bell, Calendar, Check, GraduationCap, Library, Lock, Play, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import banner from "@/assets/welcome-banner.jpg";
import moduleImg from "@/assets/module-claim.jpg";
import { journey, learning, nextModule, notices, resources } from "./mock-data";

const card = "rounded-xl border border-border bg-card shadow-[var(--shadow-card)]";

export function WelcomeBanner({ name, image = banner }: { name: string; image?: string }) {
  return (
    <section className={cn(card, "relative overflow-hidden")}>
      <img src={image} alt="Two SUNU colleagues collaborating at a laptop" width={1920} height={640} className="absolute inset-0 h-full w-full object-cover object-[75%_center]" />
      <div className="absolute inset-0 bg-gradient-to-r from-card via-card/85 to-transparent md:via-card/60" />
      <div className="relative max-w-lg px-6 py-10 sm:px-12 sm:py-14">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-[42px] sm:leading-tight">
          Welcome back, <span className="text-primary">{name}</span>
        </h1>
        <p className="mt-3 text-base text-foreground/80 sm:text-lg">Continue your learning, access key resources and stay updated.</p>
        <div className="mt-5 h-1 w-12 rounded-full bg-primary" />
      </div>
    </section>
  );
}

export function LearningProgressCard() {
  return (
    <section className="relative overflow-hidden rounded-xl p-6 text-primary-foreground shadow-[var(--shadow-card)] sm:p-7" style={{ background: "var(--gradient-learning)" }}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">My Learning</h2>
          <p className="mt-1 text-lg text-primary-foreground/90">{learning.path}</p>
        </div>
        <StatusPill>In progress</StatusPill>
      </div>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-2">
        <p><span className="text-4xl font-bold">{learning.percent}%</span><span className="ml-3 text-lg">completion</span></p>
        <p className="text-sm">{learning.completed} of {learning.total} modules completed</p>
      </div>
      <div className="mt-3 h-2.5 rounded-full bg-primary-foreground/25" role="progressbar" aria-valuenow={learning.percent}>
        <div className="h-full rounded-full bg-primary-foreground" style={{ width: `${learning.percent}%` }} />
      </div>
      <button className="mt-6 inline-flex items-center gap-2 rounded-md bg-card px-5 py-2.5 font-semibold text-primary hover:bg-primary-soft">
        Continue learning <ArrowRight className="h-4 w-4" />
      </button>
    </section>
  );
}

export function StatusPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-card px-3 py-1 text-xs font-semibold text-primary">
      <span className="h-1.5 w-1.5 rounded-full bg-primary" />{children}
    </span>
  );
}

export function LearningJourney() {
  return (
    <section className={cn(card, "p-6")}>
      <h2 className="text-lg font-bold">Your learning journey</h2>
      <ol className="mt-6 grid grid-cols-4">
        {journey.map((s, i) => (
          <li key={s.label} className="relative flex flex-col items-center text-center">
            {i > 0 && (
              <span className={cn("absolute right-1/2 top-5 h-0.5 w-full -translate-y-1/2", s.state === "upcoming" ? "border-t-2 border-dashed border-border bg-transparent" : "bg-primary")} />
            )}
            <span className={cn(
              "relative z-10 grid h-10 w-10 place-items-center rounded-full border-2",
              s.state === "completed" && "border-primary bg-primary text-primary-foreground",
              s.state === "current" && "border-primary bg-primary-soft text-primary ring-4 ring-primary-soft",
              s.state === "upcoming" && "border-dashed border-border bg-muted text-muted-foreground",
            )}>
              {s.state === "completed" ? <Check className="h-5 w-5" /> : s.state === "current" ? <span className="h-2.5 w-2.5 rounded-full bg-primary" /> : <Award className="h-4 w-4" />}
            </span>
            <span className={cn("mt-3 text-sm font-semibold", s.state === "upcoming" && "text-muted-foreground")}>{s.label}</span>
            <span className={cn("mt-1 text-xs", s.state === "current" ? "font-medium text-primary" : "text-muted-foreground")}>
              {s.state === "upcoming" && <Lock className="mr-1 inline h-3 w-3" />}{s.note}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function NextModuleCard() {
  return (
    <section className={cn(card, "flex flex-col gap-5 p-5 sm:flex-row")}>
      <div className="flex min-w-0 flex-1 gap-4">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-border text-primary"><Play className="h-5 w-5" /></div>
        <div className="min-w-0">
          <p className="text-lg font-bold">Next Up</p>
          <p className="text-lg font-bold text-primary">{nextModule.title}</p>
          <p className="text-sm text-muted-foreground">In {nextModule.path}</p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2"><BookOpen className="h-4 w-4" />{nextModule.module}</span>
            <span className="inline-flex items-center gap-2"><Calendar className="h-4 w-4" />Due: {nextModule.due}</span>
          </div>
          <button className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 font-semibold text-primary-foreground hover:bg-primary-deep">
            Open module <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <img src={moduleImg} alt="Signing a motor insurance claim form" loading="lazy" width={896} height={752} className="h-44 w-full rounded-lg object-cover sm:w-48" />
    </section>
  );
}

const quick = [
  { title: "Explore Library", desc: "Policies, procedures and reference materials", icon: Library },
  { title: "My Learning", desc: "Your enrolled learning paths", icon: GraduationCap },
  { title: "Notices", desc: "Updates and announcements", icon: Bell },
];

export function QuickAccess() {
  return (
    <section>
      <h2 className="mb-3 text-lg font-bold">Quick Access</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {quick.map(({ title, desc, icon: Icon }) => (
          <button key={title} className={cn(card, "p-5 text-left transition hover:border-primary/40")}>
            <span className="grid h-9 w-9 place-items-center rounded-md bg-primary-soft text-primary"><Icon className="h-5 w-5" /></span>
            <p className="mt-3 font-semibold">{title}</p>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

export function FeaturedResources() {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold">Featured Resources</h2>
        <button className="inline-flex items-center gap-1 text-sm font-semibold text-primary">View library <ArrowRight className="h-4 w-4" /></button>
      </div>
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {resources.map((r) => (
          <article key={r.title} className={cn(card, "overflow-hidden")}>
            <div className="relative">
              <img src={r.image} alt={r.title} loading="lazy" width={992} height={672} className="h-28 w-full object-cover" />
              <span className="absolute bottom-2 left-2 rounded bg-card px-2 py-0.5 text-[11px] font-semibold text-primary">{r.category}</span>
            </div>
            <p className="p-3 text-sm font-semibold leading-snug">{r.title}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function RecentNotices() {
  return (
    <section className={cn(card, "p-5")}>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold">Recent Notices</h2>
        <button className="text-sm font-semibold text-primary underline">View all</button>
      </div>
      {notices.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">No notices right now.</p>
      ) : (
        <ul className="divide-y divide-border">
          {notices.map((n) => (
            <li key={n.title} className="flex items-start gap-3 py-3">
              <Bell className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="min-w-0 flex-1 text-sm">{n.title}</span>
              <span className="shrink-0 text-xs text-muted-foreground">{n.date}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function CertificateTeaser() {
  return (
    <section className="flex items-center gap-4 rounded-xl border border-border bg-primary-soft p-5">
      <Award className="h-10 w-10 shrink-0 text-primary" strokeWidth={1.5} />
      <div>
        <p className="font-bold">Build your expertise</p>
        <p className="text-sm text-muted-foreground">Complete your learning paths and earn your certificate (coming soon).</p>
      </div>
    </section>
  );
}
