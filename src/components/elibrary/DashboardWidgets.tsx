import { ArrowRight, BookOpen, Bell, Calendar, Check, GraduationCap, Library, Lock, Play, Bookmark, Layers, Megaphone, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import bannerAsset from "@/assets/office_background.jpg.asset.json";
import cutoutAsset from "@/assets/professionals_cutout_v3.png.asset.json";
import moduleImg from "@/assets/module-claim.jpg";
import { journey, learning, nextModule, notices, resources } from "./mock-data";

const card = "rounded-xl border border-border bg-card shadow-[var(--shadow-card)]";

export function WelcomeBanner({ name, subtitle = "Your learning, library and knowledge hub at SUNU Assurances Nigeria.", withStats = false }: { name: string; subtitle?: string; withStats?: boolean }) {
  return (
    <section className={cn("relative rounded-xl", "flex flex-col md:block", withStats ? "md:h-[260px]" : "md:h-[200px] md:mt-[38px]")}>
      <div
        className="absolute inset-0 overflow-hidden rounded-xl bg-card bg-cover bg-[position:60%_center] md:bg-center"
        style={{ backgroundImage: `url(${bannerAsset.url})` }}
      />
      <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-card/90 via-card/60 to-card/10 md:hidden" />
      <img
        src={cutoutAsset.url}
        alt="Two SUNU colleagues collaborating at a laptop"
        className="pointer-events-none relative z-20 order-2 ml-auto mr-2 mt-1 block h-auto w-[88%] max-w-[380px] object-contain object-bottom md:absolute md:bottom-0 md:right-2 md:mt-0 md:mr-0 md:h-[calc(100%+12px)] md:w-auto md:max-w-[58%] lg:right-6 lg:h-[calc(100%+42px)]"
      />
      <div className={cn("relative order-1 flex flex-col justify-center px-6 pt-6 sm:px-10 md:h-full md:pt-0", withStats ? "max-w-xl" : "max-w-full md:max-w-[42%]")}>
        <h1 className="sm:whitespace-nowrap text-2xl font-extrabold tracking-tight sm:text-[26px] sm:leading-tight xl:text-[34px]">
          Welcome back, <span className="text-primary">{name}</span>
        </h1>
        <p className="mt-2 max-w-md text-base text-foreground/80 sm:text-lg">{subtitle}</p>
        <div className="mt-4 h-1 w-12 rounded-full bg-primary" />
      </div>
    </section>
  );
}

export function LearningProgressCard() {
  return (
    <section className="relative h-full overflow-hidden rounded-xl p-5 text-primary-foreground shadow-[var(--shadow-card)] sm:px-7 sm:py-5" style={{ background: "var(--gradient-learning)" }}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">My Learning</h2>
          <p className="text-lg text-primary-foreground/90">{learning.path}</p>
        </div>
        <StatusPill>In progress</StatusPill>
      </div>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-2">
        <p><span className="text-4xl font-bold">{learning.percent}%</span><span className="ml-3 text-lg">completion</span></p>
        <p className="text-sm">{learning.completed} of {learning.total} modules completed</p>
      </div>
      <div className="mt-2 h-2.5 rounded-full bg-primary-foreground/25" role="progressbar" aria-valuenow={learning.percent}>
        <div className="h-full rounded-full bg-primary-foreground" style={{ width: `${learning.percent}%` }} />
      </div>
      <button className="mt-4 inline-flex items-center gap-2 rounded-md bg-card px-5 py-2 font-semibold text-primary hover:bg-primary-soft">
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

const stageDesc: Record<string, string> = {
  Common: "Organisation-wide learning",
  Department: "Claims-related learning",
  Role: "Claims Officer learning",
  Certificate: "Final validation (coming soon)",
};

export function LearningJourney() {
  return (
    <section className={cn(card, "@container h-full min-w-0 p-5")}>
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary"><Layers className="h-5 w-5" /></span>
        <div className="min-w-0">
          <h2 className="text-lg font-bold">My Learning Journey</h2>
          <p className="text-sm text-muted-foreground">A structured path to build your knowledge and meet role requirements.</p>
        </div>
      </div>
      <ol className="mt-4 grid gap-2 @md:grid-cols-4 @md:gap-0">
        {journey.map((s, i) => {
          const prevDone = i > 0 && journey[i - 1]?.state === "completed";
          return (
            <li key={s.label} className={cn("relative grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 rounded-lg px-2 py-1.5 text-left @md:flex @md:flex-col @md:items-center @md:px-1 @md:pb-2 @md:pt-0 @md:text-center", s.state === "current" && "bg-primary-soft")}>
              {i > 0 && (
                <span className={cn("absolute right-1/2 top-[18px] hidden h-0.5 w-full @md:block",
                  s.state === "completed" ? "bg-success" : s.state === "current" && prevDone ? "bg-primary" : "bg-border")} />
              )}
              <span className={cn(
                "relative z-10 row-span-2 grid h-9 w-9 place-items-center rounded-full",
                s.state === "completed" && "bg-success text-primary-foreground",
                s.state === "current" && "border-[3px] border-primary bg-card",
                s.state === "upcoming" && "bg-muted text-muted-foreground",
              )}>
                {s.state === "completed" ? <Check className="h-5 w-5" /> : s.state === "upcoming" ? <Lock className="h-4 w-4" /> : null}
              </span>
              <span className="text-sm font-bold @md:mt-2">{s.label}</span>
              <span className={cn("text-xs leading-snug", s.state === "current" ? "text-primary" : "text-muted-foreground")}>{stageDesc[s.label] ?? s.note}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export function NextModuleCard() {
  return (
    <section className={cn(card, "@container h-full min-w-0 p-5")}>
      <div className="flex flex-col-reverse gap-4 @lg:flex-row">
      <div className="flex min-w-0 flex-1 gap-4">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary"><Play className="h-5 w-5" /></div>
        <div className="min-w-0">
          <p className="text-lg font-bold leading-tight">Next Up</p>
          <p className="text-lg font-bold leading-tight">{nextModule.title}</p>
          <p className="text-sm text-muted-foreground">In {nextModule.path}</p>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2"><BookOpen className="h-4 w-4" />{nextModule.module}</span>
            <span className="inline-flex items-center gap-2"><Calendar className="h-4 w-4" />Due: {nextModule.due}</span>
          </div>
          <button className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 font-semibold text-primary-foreground hover:bg-primary-deep">
            Open module <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <img src={moduleImg} alt="Signing a motor insurance claim form" loading="lazy" width={896} height={752} className="aspect-[16/9] w-full shrink-0 rounded-lg object-cover @lg:aspect-auto @lg:h-40 @lg:w-52" />
      </div>
    </section>
  );
}

const quick = [
  { title: "Explore Library", desc: "Policies, procedures and reference materials", icon: Library },
  { title: "My Learning", desc: "Your enrolled learning paths", icon: GraduationCap },
  { title: "Saved Resources", desc: "Your bookmarks and quick access", icon: Bookmark },
  { title: "Notices", desc: "Updates and announcements", icon: Bell },
];

export function QuickAccess() {
  return (
    <section className={cn(card, "@container h-full min-w-0 p-4")}>
      <h2 className="mb-3 text-lg font-bold">Quick Access</h2>
      <div className="grid grid-cols-1 gap-3 @[18rem]:grid-cols-2 @2xl:grid-cols-4">
        {quick.map(({ title, desc, icon: Icon }) => (
          <button key={title} className="min-h-11 rounded-lg border border-border bg-card p-3 text-left transition hover:border-primary/40">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-primary-soft text-primary"><Icon className="h-4 w-4" /></span>
            <p className="mt-2 text-sm font-semibold leading-tight">{title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

export function FeaturedResources() {
  return (
    <section className={cn(card, "@container h-full min-w-0 p-4")}>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold">Featured Resources</h2>
        <button className="inline-flex items-center gap-1 text-sm font-semibold text-primary">View library <ArrowRight className="h-4 w-4" /></button>
      </div>
      <div className="grid grid-cols-1 gap-3 @[22rem]:grid-cols-2 @3xl:grid-cols-4">
        {resources.map((r) => (
          <article key={r.title} className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="relative">
              <img src={r.image} alt={r.title} loading="lazy" width={992} height={672} className="aspect-[2/1] w-full object-cover @3xl:aspect-auto @3xl:h-20" />
              <span className="absolute bottom-1.5 left-2 rounded bg-card px-2 py-0.5 text-[11px] font-semibold text-primary">{r.category}</span>
            </div>
            <p className="px-3 py-2 text-sm font-semibold leading-snug">{r.title}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

const noticeIcons = [Megaphone, Calendar, Info];

export function RecentNotices() {
  return (
    <section className={cn(card, "h-full min-w-0 p-4")}>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-bold">Recent Notices</h2>
        <button className="inline-flex items-center gap-1 text-sm font-semibold text-primary">View all <ArrowRight className="h-4 w-4" /></button>
      </div>
      {notices.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">No notices right now.</p>
      ) : (
        <ul className="divide-y divide-border">
          {notices.map((n, i) => {
            const Icon = noticeIcons[i % noticeIcons.length] ?? Info;
            return (
              <li key={n.title} className="flex items-start gap-3 py-2.5">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="min-w-0 flex-1 text-sm">{n.title}</span>
                <span className="shrink-0 pt-0.5 text-xs text-muted-foreground">{n.date}</span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
