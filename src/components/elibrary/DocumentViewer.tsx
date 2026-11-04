import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft, Bookmark, BookmarkCheck, Check, MoreHorizontal, ChevronLeft, ChevronRight, Minus, Plus,
  Maximize, RotateCcw, MoveHorizontal, Info, Layers, ArrowRight, Download, Pencil, X, PanelLeft,
  PanelRight, Play, FileWarning, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DocPage, ViewerDoc } from "./viewer-data";

const ZOOMS = [50, 75, 100, 125, 150, 200];
const BASE_W = 680;

export function DocumentViewer({ doc, canManage }: { doc: ViewerDoc; canManage: boolean }) {
  const r = doc.resource;
  const paged = doc.kind === "paged" || doc.kind === "slides";
  const zoomable = doc.kind === "paged" || doc.kind === "sheet";
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showThumbs, setShowThumbs] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const [sheet, setSheet] = useState<null | "pages" | "info">(null);
  const [fav, setFav] = useState(false);
  const [ack, setAck] = useState<"none" | "confirming" | "done">("none");
  const [menu, setMenu] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const total = doc.pages.length;

  useEffect(() => { const t = setTimeout(() => setLoading(false), 450); return () => clearTimeout(t); }, []);

  const go = (n: number) => setPage(Math.min(total, Math.max(1, n)));
  const stepZoom = (d: 1 | -1) => setZoom((z) => {
    const i = ZOOMS.findIndex((v) => v >= z);
    return ZOOMS[Math.min(ZOOMS.length - 1, Math.max(0, (i === -1 ? ZOOMS.length - 1 : i) + d))];
  });
  const fitWidth = () => {
    const w = stageRef.current?.clientWidth ?? BASE_W;
    setZoom(Math.max(40, Math.min(200, Math.floor(((w - 32) / BASE_W) * 100))));
  };
  const fullscreen = () => {
    const el = viewerRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  };

  useEffect(() => {
    if (!paged) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT") return;
      if (e.key === "ArrowRight") go(page + 1);
      if (e.key === "ArrowLeft") go(page - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const thumbs = (
    <div className="flex h-full flex-col">
      <div className="px-4 pb-3 pt-4 text-base font-bold">{doc.kind === "slides" ? "Slides" : "Pages"} ({total})</div>
      <div className="flex-1 space-y-3 overflow-y-auto px-4 pb-4">
        {doc.pages.map((p, i) => (
          <button key={i} onClick={() => { go(i + 1); setSheet(null); }} aria-label={`Go to page ${i + 1}`} aria-current={page === i + 1}
            className={cn("relative block w-full overflow-hidden rounded-lg border-2 bg-card p-2 text-left transition", page === i + 1 ? "border-primary shadow-sm" : "border-border hover:border-primary/40")}>
            <MiniPage page={p} first={i === 0} title={r.title} slide={doc.kind === "slides"} />
            <span className={cn("absolute bottom-1.5 right-1.5 grid h-6 min-w-6 place-items-center rounded px-1.5 text-xs font-bold", page === i + 1 ? "bg-primary text-primary-foreground" : "bg-card text-foreground border border-border")}>{i + 1}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const info = (
    <div className="space-y-4">
      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="flex items-center gap-2.5 text-lg font-bold"><Info className="h-5 w-5 text-primary" /> Document Details</h2>
        <dl className="mt-3 divide-y divide-border text-sm">
          {([["Content type", r.type], ["Format", r.format], ["Department", r.department], ["Version", doc.version], ["Last updated", r.updated], ["Status", <StatusPill key="s" status={r.status} />]] as const).map(([k, v]) => (
            <div key={k} className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-2 py-2.5"><dt className="text-muted-foreground">{k}</dt><dd className="font-medium">{v}</dd></div>
          ))}
          {canManage && <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-2 py-2.5"><dt className="text-muted-foreground">Owner</dt><dd className="font-medium">{r.owner}</dd></div>}
        </dl>
        <Link to="/library" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">View document information <ArrowRight className="h-4 w-4" /></Link>
      </section>
      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="flex items-center gap-2.5 text-lg font-bold"><Layers className="h-5 w-5 text-primary" /> Related Resources</h2>
        <ul className="mt-3 space-y-2.5">
          {doc.related.length === 0 && <li className="text-sm text-muted-foreground">No related resources yet.</li>}
          {doc.related.map((x) => (
            <li key={x.id}>
              <Link to="/library/$id" params={{ id: x.id }} onClick={() => setSheet(null)} className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted">
                <FormatIcon format={x.format} />
                <div className="min-w-0 flex-1"><div className="text-sm font-semibold leading-snug">{x.title}</div><div className="text-xs text-muted-foreground">{x.department} · {x.type}</div></div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1680px]">
      {/* Header */}
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3 sm:gap-4 lg:flex lg:items-center">
        <Link to="/library" aria-label="Back to Library" className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-border bg-card hover:bg-muted"><ArrowLeft className="h-5 w-5" /></Link>
        <div className="min-w-0 lg:flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h1 className="text-xl font-bold leading-tight sm:text-2xl">{r.title}</h1>
            <StatusPill status={r.status} />
          </div>
          <div className="mt-0.5 text-sm text-muted-foreground">{r.department} · {doc.subtitle}</div>
        </div>
        <div className="col-span-2 flex flex-wrap items-center gap-2 lg:col-span-1 lg:shrink-0">
          <button onClick={() => setFav((f) => !f)} aria-pressed={fav} className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium hover:bg-muted">
            {fav ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4 text-primary" />}{fav ? "Saved to favourites" : "Add to favourites"}
          </button>
          {doc.requiresAcknowledgement && (ack === "done"
            ? <span className="inline-flex h-11 items-center gap-2 rounded-lg bg-success/10 px-4 text-sm font-semibold text-success"><Check className="h-4 w-4" /> Read &amp; acknowledged</span>
            : <button onClick={() => setAck("confirming")} className="inline-flex h-11 items-center gap-2 rounded-lg border border-primary/30 bg-card px-4 text-sm font-semibold text-primary hover:bg-primary-soft"><Check className="h-4 w-4" /> Acknowledge</button>)}
          <div className="relative">
            <button onClick={() => setMenu((m) => !m)} aria-label="More actions" className="grid h-11 w-11 place-items-center rounded-lg border border-border bg-card hover:bg-muted"><MoreHorizontal className="h-5 w-5" /></button>
            {menu && (
              <div className="absolute right-0 z-20 mt-2 w-56 rounded-lg border border-border bg-popover p-1.5 text-sm shadow-lg" onMouseLeave={() => setMenu(false)}>
                {canManage ? <>
                  <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 hover:bg-muted"><Download className="h-4 w-4" /> Download</button>
                  <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 hover:bg-muted"><Pencil className="h-4 w-4" /> Manage document</button>
                </> : <p className="px-3 py-2 text-xs text-muted-foreground">This document opens in your browser. Downloads are restricted.</p>}
              </div>
            )}
          </div>
        </div>
      </div>

      {ack === "confirming" && (
        <div className="mt-4 flex flex-col gap-3 rounded-xl border border-primary/20 bg-primary-soft p-4 sm:flex-row sm:items-center">
          <p className="min-w-0 flex-1 text-sm">I confirm that I have read and understood <strong>{r.title}</strong> (version {doc.version}). This is a read confirmation, not a test.</p>
          <div className="flex shrink-0 gap-2">
            <button onClick={() => setAck("none")} className="h-11 rounded-lg border border-border bg-card px-4 text-sm font-medium">Cancel</button>
            <button onClick={() => setAck("done")} className="h-11 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground">Confirm I've read it</button>
          </div>
        </div>
      )}

      {/* Mobile/tablet panel toggles */}
      <div className="mt-4 flex gap-2 lg:hidden">
        {paged && <button onClick={() => setSheet("pages")} className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-card text-sm font-medium"><PanelLeft className="h-4 w-4" /> Pages ({total})</button>}
        <button onClick={() => setSheet("info")} className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-card text-sm font-medium"><Info className="h-4 w-4" /> Details</button>
      </div>

      <div className="mt-4 flex gap-4">
        {paged && showThumbs && <aside className="hidden h-[calc(100vh-220px)] min-h-[520px] w-[168px] shrink-0 rounded-xl border border-border bg-card lg:block">{thumbs}</aside>}

        <div ref={viewerRef} className="flex h-[calc(100vh-220px)] min-h-[480px] min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2 border-b border-border p-2 sm:p-3">
            {paged && <button onClick={() => setShowThumbs((s) => !s)} aria-label="Toggle page thumbnails" aria-pressed={showThumbs} className="hidden h-10 w-10 place-items-center rounded-lg hover:bg-muted lg:grid"><PanelLeft className="h-4 w-4" /></button>}
            {paged && (
              <div className="flex items-center rounded-lg border border-border">
                <ToolBtn label="Previous page" onClick={() => go(page - 1)} disabled={page === 1}><ChevronLeft className="h-4 w-4" /></ToolBtn>
                <span className="whitespace-nowrap px-2 text-sm">Page <strong>{page}</strong> of {total}</span>
                <ToolBtn label="Next page" onClick={() => go(page + 1)} disabled={page === total}><ChevronRight className="h-4 w-4" /></ToolBtn>
              </div>
            )}
            <div className="ml-auto flex items-center gap-1 sm:gap-2">
              {zoomable && (
                <div className="flex items-center rounded-lg border border-border">
                  <ToolBtn label="Zoom out" onClick={() => stepZoom(-1)} disabled={zoom <= ZOOMS[0]}><Minus className="h-4 w-4" /></ToolBtn>
                  <span className="w-12 text-center text-sm tabular-nums">{zoom}%</span>
                  <ToolBtn label="Zoom in" onClick={() => stepZoom(1)} disabled={zoom >= 200}><Plus className="h-4 w-4" /></ToolBtn>
                </div>
              )}
              {zoomable && <ToolBtn label="Fit to width" onClick={fitWidth}><MoveHorizontal className="h-4 w-4" /></ToolBtn>}
              {doc.kind === "paged" && <ToolBtn label="Rotate" onClick={() => setRotation((x) => (x + 90) % 360)}><RotateCcw className="h-4 w-4" /></ToolBtn>}
              <ToolBtn label="Fullscreen" onClick={fullscreen}><Maximize className="h-4 w-4" /></ToolBtn>
              <button onClick={() => setShowInfo((s) => !s)} aria-label="Toggle document details" aria-pressed={showInfo} className="hidden h-10 w-10 place-items-center rounded-lg hover:bg-muted lg:grid"><PanelRight className="h-4 w-4" /></button>
            </div>
          </div>

          {/* Stage */}
          <div ref={stageRef} className="min-h-0 flex-1 overflow-auto bg-muted p-3 sm:p-6">
            {loading ? (
              <StateBox icon={<Loader2 className="h-8 w-8 animate-spin text-primary" />} title="Loading document…" />
            ) : doc.kind === "unsupported" ? (
              <StateBox icon={<FileWarning className="h-8 w-8 text-primary" />} title="This format can't be previewed" body={`${r.format} files can't be shown in the browser viewer. Contact ${r.owner} for help.`} />
            ) : doc.kind === "video" ? (
              <div className="mx-auto max-w-4xl">
                <div className="relative aspect-video overflow-hidden rounded-xl bg-foreground">
                  <img src={r.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
                  <div className="absolute inset-0 grid place-items-center"><span className="grid h-16 w-16 place-items-center rounded-full bg-card/90"><Play className="h-7 w-7 translate-x-0.5 text-primary" /></span></div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/80 to-transparent p-4 text-sm text-primary-foreground">{r.title} · {r.size}</div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">Video plays in your browser with its own playback controls. Sample preview only.</p>
              </div>
            ) : doc.kind === "sheet" ? (
              <div className="mx-auto origin-top-left overflow-hidden rounded-lg border border-border bg-card" style={{ width: BASE_W * zoom / 100 }}>
                <SheetView page={doc.pages[0]} scale={zoom / 100} />
              </div>
            ) : doc.kind === "slides" ? (
              <div className="mx-auto aspect-video w-full max-w-4xl overflow-hidden rounded-lg bg-card p-8 shadow-sm">
                <PageContent page={doc.pages[page - 1]} first={page === 1} title={r.title} subtitle={doc.subtitle} />
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="shrink-0 bg-card shadow-md transition-transform" style={{ width: BASE_W * zoom / 100, minHeight: BASE_W * 1.3 * zoom / 100, transform: rotation ? `rotate(${rotation}deg)` : undefined }}>
                  <div style={{ fontSize: `${zoom / 100}rem` }} className="p-[2.5em]">
                    <PageContent page={doc.pages[page - 1]} first={page === 1} title={r.title} subtitle={doc.subtitle} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {showInfo && <aside className="hidden w-[340px] shrink-0 overflow-y-auto lg:block xl:w-[360px]" style={{ maxHeight: "calc(100vh - 220px)" }}>{info}</aside>}
      </div>

      {sheet && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
          <button className="flex-1 bg-foreground/40" aria-label="Close panel" onClick={() => setSheet(null)} />
          <div className="flex h-full w-[min(380px,92vw)] flex-col bg-background">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="font-bold">{sheet === "pages" ? "Pages" : "Document information"}</span>
              <button onClick={() => setSheet(null)} aria-label="Close" className="grid h-11 w-11 place-items-center"><X className="h-5 w-5" /></button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">{sheet === "pages" ? thumbs : <div className="p-4">{info}</div>}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function ToolBtn({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return <button aria-label={label} title={label} onClick={onClick} disabled={disabled} className="grid h-10 w-10 place-items-center rounded-lg hover:bg-muted disabled:opacity-40">{children}</button>;
}

function StatusPill({ status }: { status: string }) {
  return <span className={cn("inline-flex rounded-full px-3 py-0.5 text-sm font-semibold", status === "Published" ? "bg-success/15 text-success" : "bg-primary-soft text-primary")}>{status}</span>;
}

function FormatIcon({ format }: { format: string }) {
  return <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary text-[10px] font-bold text-primary-foreground">{format}</span>;
}

function StateBox({ icon, title, body }: { icon: React.ReactNode; title: string; body?: string }) {
  return <div className="grid h-full min-h-[300px] place-items-center text-center"><div>{<div className="mx-auto mb-3 w-fit">{icon}</div>}<div className="font-semibold">{title}</div>{body && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{body}</p>}</div></div>;
}

function PageContent({ page, first, title, subtitle }: { page: DocPage; first: boolean; title: string; subtitle: string }) {
  let n = 0;
  return (
    <div className="text-[1em] text-foreground">
      {first && (
        <div className="relative mb-[1.5em] overflow-hidden border-b-2 border-primary pb-[1em]">
          <div className="pointer-events-none absolute -right-[2em] -top-[3em] h-[10em] w-[16em] rounded-full bg-primary-soft" />
          <h2 className="relative text-[2.2em] font-bold leading-tight">{title}</h2>
          <div className="relative text-[1.15em] text-muted-foreground">{subtitle}</div>
        </div>
      )}
      {page.sections.map((s) => {
        n += 1;
        return (
          <div key={s.heading} className="mb-[1.2em]">
            <h3 className="text-[1.3em] font-bold text-primary">{first ? `${n}. ` : ""}{s.heading}</h3>
            {s.body && <p className="mt-[0.3em] text-[0.95em] leading-relaxed">{s.body}</p>}
            {s.checklist && (
              <table className="mt-[0.6em] w-full border-collapse text-[0.9em]">
                <thead><tr className="bg-primary text-primary-foreground"><th className="w-[3.5em] border border-border p-[0.5em] text-left">No.</th><th className="border border-border p-[0.5em] text-left">Requirement</th><th className="w-[6em] border border-border p-[0.5em]">Check</th></tr></thead>
                <tbody>{s.checklist.map((c, i) => <tr key={c}><td className="border border-border p-[0.5em] text-center">{i + 1}</td><td className="border border-border p-[0.5em]">{c}</td><td className="border border-border p-[0.5em] text-center"><span className="inline-block h-[1em] w-[1em] rounded-sm border border-muted-foreground" /></td></tr>)}</tbody>
              </table>
            )}
          </div>
        );
      })}
    </div>
  );
}

function MiniPage({ page, first, title, slide }: { page: DocPage; first: boolean; title: string; slide: boolean }) {
  return (
    <div className={cn("overflow-hidden", slide ? "aspect-video" : "aspect-[3/4]")} aria-hidden>
      {first && <div className="mb-1 truncate text-[7px] font-bold">{title}</div>}
      <div className="mb-1 truncate text-[6px] font-semibold text-primary">{page.sections[0]?.heading}</div>
      {Array.from({ length: slide ? 4 : 9 }).map((_, i) => <div key={i} className="mb-1 h-[3px] rounded bg-border" style={{ width: `${90 - (i % 3) * 18}%` }} />)}
    </div>
  );
}

function SheetView({ page, scale }: { page: DocPage; scale: number }) {
  const items = page.sections.flatMap((s) => s.checklist ?? [s.heading]);
  return (
    <table className="w-full border-collapse" style={{ fontSize: `${0.85 * scale}rem` }}>
      <thead><tr className="bg-muted"><th className="w-10 border border-border p-1.5" />{["A", "B", "C"].map((c) => <th key={c} className="border border-border p-1.5 font-medium text-muted-foreground">{c}</th>)}</tr></thead>
      <tbody>{items.map((c, i) => <tr key={i}><td className="border border-border bg-muted p-1.5 text-center text-muted-foreground">{i + 1}</td><td className="border border-border p-1.5">{c}</td><td className="border border-border p-1.5">Yes / No</td><td className="border border-border p-1.5" /></tr>)}</tbody>
    </table>
  );
}
