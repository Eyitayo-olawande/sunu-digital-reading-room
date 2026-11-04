import { useMemo, useState } from "react";
import {
  Umbrella, ShieldCheck, Users, UsersRound, Laptop, FileText, Search, ArrowRight, Filter,
  LayoutGrid, List, Bookmark, Eye, X, Download, Pencil, SlidersHorizontal, SearchX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import heroAsset from "@/assets/library_banner.png.asset.json";
import {
  departments, docTypes, filterResources, libraryResources, statuses, topics,
  type DocStatus, type DocType, type LibraryFilters, type LibraryResource,
} from "./library-data";

const card = "rounded-xl border border-border bg-card shadow-[var(--shadow-card)]";
const topicIcons = { umbrella: Umbrella, shield: ShieldCheck, users: Users, people: UsersRound, laptop: Laptop, file: FileText };
const typePlural: Record<DocType, string> = { Policy: "Policies", Procedure: "Procedures", Guideline: "Guidelines", Training: "Training", Template: "Templates" };
const empty: LibraryFilters = { query: "", department: "", topic: "", types: [], statuses: ["Published"] };

export function LibraryView({ canManage }: { canManage: boolean }) {
  const [draft, setDraft] = useState("");
  const [f, setF] = useState<LibraryFilters>(empty);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [saved, setSaved] = useState<string[]>([]);
  const [open, setOpen] = useState<LibraryResource | null>(null);
  const [drawer, setDrawer] = useState(false);

  // Counts reflect everything except the content-type chip itself.
  const base = useMemo(() => filterResources(libraryResources, { ...f, types: [] }, canManage), [f, canManage]);
  const results = useMemo(() => filterResources(libraryResources, f, canManage), [f, canManage]);
  const visibleAll = libraryResources.filter((r) => canManage || r.status === "Published");
  const active = !!(f.query || f.department || f.topic || f.types.length || (canManage && (f.statuses.length !== 1 || f.statuses[0] !== "Published")));

  const clear = () => { setF(empty); setDraft(""); };
  const toggleType = (t: DocType) => setF((p) => ({ ...p, types: p.types.includes(t) ? p.types.filter((x) => x !== t) : [...p.types, t] }));
  const toggleStatus = (s: DocStatus) => setF((p) => ({ ...p, statuses: p.statuses.includes(s) ? p.statuses.filter((x) => x !== s) : [...p.statuses, s] }));

  const filterPanel = (
    <FilterPanel f={f} setF={setF} base={base} canManage={canManage} toggleType={toggleType} toggleStatus={toggleStatus} clear={clear} all={visibleAll} />
  );

  return (
    <div className="mx-auto max-w-[1440px] space-y-5">
      {/* Header banner */}
      <section className="relative overflow-hidden rounded-xl bg-card">
        <img src={heroAsset.url} alt="SUNU colleague reviewing a document on her laptop" width={2172} height={724}
          style={{ WebkitMaskImage: "linear-gradient(to right, transparent 0%, #000 28%)", maskImage: "linear-gradient(to right, transparent 0%, #000 28%)" }}
          className="absolute inset-y-0 right-0 h-full w-auto max-w-none object-contain" />
        <div className="absolute inset-0 bg-gradient-to-r from-card from-35% via-card/70 via-55% to-transparent to-80% md:from-card md:from-20% md:via-card/0 md:via-40% md:to-transparent" />
        <div className="relative max-w-xl px-6 py-6 sm:px-10 md:py-8">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Knowledge Library</h1>
          <p className="mt-2 text-base text-foreground/80 sm:text-lg">Find policies, procedures, guidelines and learning materials to support your work.</p>
          <div className="mt-4 h-1 w-14 rounded-full bg-primary" />
        </div>
      </section>

      <div className="grid gap-5 min-[1200px]:grid-cols-[minmax(0,1fr)_250px]">
        <div className="@container min-w-0 space-y-4">
          {/* Search */}
          <form className="flex gap-2 sm:gap-3" onSubmit={(e) => { e.preventDefault(); setF((p) => ({ ...p, query: draft })); }}>
            <label className="flex min-w-0 flex-1 items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-[var(--shadow-card)]">
              <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
              <input value={draft} onChange={(e) => { setDraft(e.target.value); if (!e.target.value) setF((p) => ({ ...p, query: "" })); }}
                aria-label="Search the library" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                placeholder="Search the library (e.g. “claims procedure”, “AML/CFT”, “code of conduct”)" />
              {draft && <button type="button" aria-label="Clear search" onClick={() => { setDraft(""); setF((p) => ({ ...p, query: "" })); }}><X className="h-4 w-4 text-muted-foreground" /></button>}
            </label>
            <button type="submit" className="shrink-0 rounded-lg bg-primary px-4 font-semibold text-primary-foreground hover:bg-primary-deep sm:px-6">Search</button>
            <button type="button" onClick={() => setDrawer(true)} aria-label="Open filters"
              className="grid w-12 shrink-0 place-items-center rounded-lg border border-border bg-card min-[1200px]:hidden">
              <SlidersHorizontal className="h-5 w-5" />
            </button>
          </form>

          {/* Topics */}
          <section>
            <div className="mb-2.5 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold">Browse by topic</h2>
              {f.topic && <button onClick={() => setF((p) => ({ ...p, topic: "" }))} className="inline-flex items-center gap-1 text-sm font-semibold text-primary">View all topics <ArrowRight className="h-4 w-4" /></button>}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
              {topics.map((t) => {
                const Icon = topicIcons[t.icon];
                const on = f.topic === t.name;
                return (
                  <button key={t.name} aria-pressed={on} onClick={() => setF((p) => ({ ...p, topic: on ? "" : t.name }))}
                    className={cn("flex min-h-[96px] flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2.5 text-center transition-colors",
                      on ? "border-primary/50 bg-primary-soft ring-1 ring-primary/20" : "border-border bg-card hover:bg-muted")}>
                    <Icon className="h-6 w-6 text-primary" strokeWidth={1.7} />
                    <span className="text-sm font-semibold leading-tight">{t.name}</span>
                    <span className="text-sm text-muted-foreground">({visibleAll.filter((r) => r.topic === t.name).length})</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Type chips + view toggle */}
          <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
            <Chip on={!f.types.length} onClick={() => setF((p) => ({ ...p, types: [] }))}>All Resources ({base.length})</Chip>
            {docTypes.map((t) => (
              <Chip key={t} on={f.types.length === 1 && f.types[0] === t} onClick={() => setF((p) => ({ ...p, types: [t] }))}>
                {typePlural[t]} ({base.filter((r) => r.type === t).length})
              </Chip>
            ))}
            <div className="ml-auto flex overflow-hidden rounded-lg border border-border">
              <button aria-label="Grid view" aria-pressed={view === "grid"} onClick={() => setView("grid")} className={cn("grid h-9 w-10 place-items-center", view === "grid" ? "bg-primary text-primary-foreground" : "bg-card")}><LayoutGrid className="h-4 w-4" /></button>
              <button aria-label="List view" aria-pressed={view === "list"} onClick={() => setView("list")} className={cn("grid h-9 w-10 place-items-center", view === "list" ? "bg-primary text-primary-foreground" : "bg-card")}><List className="h-4 w-4" /></button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
            <span>Showing {results.length} of {visibleAll.length} resources{f.query && <> for “<b className="text-foreground">{f.query}</b>”</>}</span>
            {active && <button onClick={clear} className="font-semibold text-primary underline">Clear filters</button>}
          </div>

          {results.length === 0 ? (
            <div className={cn(card, "flex flex-col items-center px-6 py-12 text-center")}>
              <SearchX className="h-10 w-10 text-primary" strokeWidth={1.5} />
              <h3 className="mt-3 text-lg font-bold">No resources found</h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">Try a different search term or remove some filters.</p>
              <button onClick={clear} className="mt-4 rounded-lg bg-primary px-5 py-2 font-semibold text-primary-foreground">Clear all filters</button>
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 gap-3.5 @md:grid-cols-2 @3xl:grid-cols-3 @4xl:grid-cols-4">
              {results.map((r) => <ResourceCard key={r.id} r={r} saved={saved.includes(r.id)} onSave={() => setSaved((s) => s.includes(r.id) ? s.filter((x) => x !== r.id) : [...s, r.id])} onOpen={() => setOpen(r)} canManage={canManage} />)}
            </div>
          ) : (
            <div className={cn(card, "divide-y divide-border")}>
              {results.map((r) => (
                <div key={r.id} className="flex items-center gap-3 p-3 sm:gap-4">
                  <img src={r.image} alt="" loading="lazy" className="h-14 w-20 shrink-0 rounded-md object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2"><TypeBadge r={r} />{canManage && r.status !== "Published" && <StatusBadge s={r.status} />}</div>
                    <p className="mt-1 font-semibold leading-snug">{r.title}</p>
                    <p className="text-xs text-muted-foreground">{r.department} • {r.size} • {r.format}</p>
                  </div>
                  <button onClick={() => setOpen(r)} aria-label={`Open ${r.title}`} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border hover:bg-muted"><Eye className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className={cn(card, "hidden self-start px-5 py-4 min-[1200px]:block")}>{filterPanel}</aside>
      </div>

      {drawer && (
        <div className="fixed inset-0 z-50 flex justify-end min-[1200px]:hidden" role="dialog" aria-label="Filters">
          <button className="flex-1 bg-foreground/40" aria-label="Close filters" onClick={() => setDrawer(false)} />
          <div className="h-full w-[min(320px,88vw)] overflow-y-auto bg-card p-5">
            <div className="mb-2 flex justify-end"><button aria-label="Close filters" onClick={() => setDrawer(false)}><X className="h-5 w-5" /></button></div>
            {filterPanel}
            <button onClick={() => setDrawer(false)} className="mt-6 w-full rounded-lg bg-primary py-2.5 font-semibold text-primary-foreground">Show {results.length} results</button>
          </div>
        </div>
      )}

      {open && <ResourceDetail r={open} canManage={canManage} onClose={() => setOpen(null)} />}
    </div>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} aria-pressed={on} className={cn("rounded-full border px-3.5 py-1.5 text-sm font-medium",
      on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-muted")}>{children}</button>
  );
}

function TypeBadge({ r }: { r: LibraryResource }) {
  const label = r.badge ?? r.type;
  const tone = ["Policy", "HR"].includes(label) ? "bg-primary-soft text-primary" : "bg-secondary text-secondary-foreground";
  return <span className={cn("rounded-md px-2 py-0.5 text-xs font-semibold", tone)}>{label}</span>;
}

function StatusBadge({ s }: { s: DocStatus }) {
  return <span className={cn("rounded-md px-2 py-0.5 text-xs font-semibold", s === "Published" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground")}>{s}</span>;
}

function ResourceCard({ r, saved, onSave, onOpen, canManage }: { r: LibraryResource; saved: boolean; onSave: () => void; onOpen: () => void; canManage: boolean }) {
  return (
    <article className={cn(card, "flex flex-col overflow-hidden")}>
      <div className="relative h-32 shrink-0 @md:h-[104px]">
        <img src={r.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <button onClick={onSave} aria-label={saved ? "Remove from saved" : "Save resource"} aria-pressed={saved}
          className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-md bg-card/95">
          <Bookmark className={cn("h-4 w-4", saved && "fill-primary text-primary")} />
        </button>
        <div className="absolute bottom-0 left-3 flex translate-y-1/2 gap-1.5"><TypeBadge r={r} />{canManage && r.status !== "Published" && <StatusBadge s={r.status} />}</div>
      </div>
      <div className="flex flex-1 items-end gap-2 px-3 pb-2.5 pt-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-semibold leading-snug">{r.title}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{r.department} • {r.size} • {r.format}</p>
        </div>
        <button onClick={onOpen} aria-label={`Open ${r.title}`} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border hover:bg-muted"><Eye className="h-4 w-4" /></button>
      </div>
    </article>
  );
}

function FilterPanel({ f, setF, base, all, canManage, toggleType, toggleStatus, clear }: {
  f: LibraryFilters; setF: React.Dispatch<React.SetStateAction<LibraryFilters>>; base: LibraryResource[]; all: LibraryResource[];
  canManage: boolean; toggleType: (t: DocType) => void; toggleStatus: (s: DocStatus) => void; clear: () => void;
}) {
  const sel = "w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm";
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h2 className="flex items-center gap-2 text-lg font-bold"><Filter className="h-5 w-5" /> Filters</h2>
        <button onClick={clear} className="text-sm font-medium text-primary underline">Clear all</button>
      </div>
      <label className="block"><span className="mb-1.5 block text-sm font-semibold">Department</span>
        <select className={sel} value={f.department} onChange={(e) => setF((p) => ({ ...p, department: e.target.value }))}>
          <option value="">All departments</option>{departments.map((d) => <option key={d}>{d}</option>)}
        </select>
      </label>
      <label className="block"><span className="mb-1.5 block text-sm font-semibold">Topic</span>
        <select className={sel} value={f.topic} onChange={(e) => setF((p) => ({ ...p, topic: e.target.value }))}>
          <option value="">All topics</option>{topics.map((t) => <option key={t.name}>{t.name}</option>)}
        </select>
      </label>
      <fieldset><legend className="mb-2 text-sm font-semibold">Content type</legend>
        {docTypes.map((t) => (
          <label key={t} className="flex cursor-pointer items-center gap-3 py-1.5 text-sm">
            <input type="checkbox" className="h-4 w-4 accent-primary" checked={f.types.includes(t)} onChange={() => toggleType(t)} />
            {t} <span className="text-muted-foreground">({base.filter((r) => r.type === t).length})</span>
          </label>
        ))}
      </fieldset>
      <fieldset className="border-t border-border pt-4"><legend className="mb-2 text-sm font-semibold">Status</legend>
        {statuses.map((s) => (
          <label key={s} className={cn("flex items-center gap-3 py-1.5 text-sm", canManage ? "cursor-pointer" : "opacity-60")}>
            <input type="checkbox" className="h-4 w-4 accent-primary" disabled={!canManage}
              checked={canManage ? f.statuses.includes(s) : s === "Published"} onChange={() => toggleStatus(s)} />
            {s} <span className="text-muted-foreground">({all.filter((r) => r.status === s).length})</span>
          </label>
        ))}
        {!canManage && <p className="mt-1 text-xs text-muted-foreground">Only published resources are shown.</p>}
      </fieldset>
    </div>
  );
}

function ResourceDetail({ r, canManage, onClose }: { r: LibraryResource; canManage: boolean; onClose: () => void }) {
  const rows: [string, string][] = [["Type", r.type], ["Department", r.department], ["Topic", r.topic], ["Format", `${r.format} • ${r.size}`], ["Last updated", r.updated], ["Owner", r.owner]];
  if (canManage) rows.push(["Status", r.status], ["Next review", "Apr 2027"]);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4" role="dialog" aria-modal="true" aria-label={r.title} onClick={onClose}>
      <div className={cn(card, "max-h-[90vh] w-full max-w-lg overflow-y-auto")} onClick={(e) => e.stopPropagation()}>
        <img src={r.image} alt="" className="aspect-[16/6] w-full object-cover" />
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0"><TypeBadge r={r} /><h2 className="mt-2 text-xl font-bold">{r.title}</h2></div>
            <button onClick={onClose} aria-label="Close"><X className="h-5 w-5" /></button>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            {rows.map(([k, v]) => <div key={k}><dt className="text-muted-foreground">{k}</dt><dd className="font-medium">{v}</dd></div>)}
          </dl>
          <div className="mt-6 flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-semibold text-primary-foreground"><Eye className="h-4 w-4" /> Open in viewer</button>
            {canManage && <>
              <button className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 font-semibold"><Download className="h-4 w-4" /> Download</button>
              <button className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 font-semibold"><Pencil className="h-4 w-4" /> Manage</button>
            </>}
          </div>
          {!canManage && <p className="mt-3 text-xs text-muted-foreground">This document opens in your browser. Downloads are restricted.</p>}
          <p className="mt-2 text-xs text-muted-foreground">The document viewer will be available in the next stage.</p>
        </div>
      </div>
    </div>
  );
}
