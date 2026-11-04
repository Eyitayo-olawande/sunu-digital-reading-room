import { useState, type ReactNode } from "react";
import {
  BookOpen, Home, Library, GraduationCap, Bookmark, Bell, Users, ShieldCheck, Network,
  Layers, FileText, History, Search, HelpCircle, ChevronRight, ChevronDown, Menu, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { MockUser, Role } from "./mock-data";

const employeeNav = [
  { label: "Overview", icon: Home },
  { label: "Library", icon: Library },
  { label: "My Learning", icon: GraduationCap },
  { label: "Learning Paths", icon: Bookmark },
  { label: "Notices", icon: Bell },
];
const adminNav = [
  { label: "People", icon: Users },
  { label: "Roles", icon: ShieldCheck },
  { label: "Structure & Access", icon: Network },
  { label: "Learning Paths (Admin)", icon: Layers },
  { label: "Wording", icon: FileText },
  { label: "Activity Log", icon: History },
];

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2);
}

function Sidebar({ user, active, onSelect, onClose }: { user: MockUser; active: string; onSelect: (l: string) => void; onClose?: () => void }) {
  const Item = ({ label, icon: Icon }: { label: string; icon: typeof Home }) => (
    <button
      onClick={() => { onSelect(label); onClose?.(); }}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[15px] transition-colors",
        active === label ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground" : "text-sidebar-foreground/90 hover:bg-sidebar-foreground/10",
      )}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" />
      <span className="truncate">{label}</span>
    </button>
  );
  return (
    <aside className="flex h-full w-[256px] flex-col text-sidebar-foreground" style={{ background: "var(--gradient-sidebar)" }}>
      <div className="flex items-center justify-between px-6 pt-6">
        <div className="flex items-center gap-3">
          <BookOpen className="h-9 w-9 shrink-0" strokeWidth={1.5} />
          <div className="leading-tight">
            <div className="text-2xl font-bold tracking-tight">SUNU</div>
            <div className="text-sm text-sidebar-foreground/90">Assurances Nigeria</div>
          </div>
        </div>
        {onClose && <button onClick={onClose} aria-label="Close menu"><X className="h-5 w-5" /></button>}
      </div>
      <div className="mx-6 my-5 border-t border-sidebar-border" />
      <div className="flex items-center gap-3 px-6">
        <BookOpen className="h-8 w-8 shrink-0" strokeWidth={1.5} />
        <div className="leading-tight">
          <div className="text-lg font-semibold">eLibrary</div>
          <div className="text-xs text-sidebar-foreground/85">Knowledge &amp; Learning Hub</div>
        </div>
      </div>
      <nav className="mt-6 flex-1 space-y-1 overflow-y-auto px-3">
        {employeeNav.map((n) => <Item key={n.label} {...n} />)}
        {user.role === "admin" && (
          <>
            <div className="mx-3 my-4 border-t border-sidebar-border" />
            <div className="px-3 pb-2 text-[11px] font-semibold tracking-[0.14em] text-sidebar-foreground/75">ADMINISTRATION</div>
            {adminNav.map((n) => <Item key={n.label} {...n} />)}
          </>
        )}
      </nav>
      <div className="mx-4 border-t border-sidebar-border" />
      <button className="flex items-center gap-3 px-5 py-4 text-left hover:bg-sidebar-foreground/5">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sidebar-accent text-sm font-bold text-sidebar-accent-foreground">{initials(user.name)}</div>
        <div className="min-w-0 flex-1 leading-tight">
          <div className="truncate text-sm font-semibold">{user.name}</div>
          <div className="truncate text-xs text-sidebar-foreground/85">{user.department}</div>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0" />
      </button>
    </aside>
  );
}

export function AppShell({ user, onRoleChange, children }: { user: MockUser; onRoleChange: (r: Role) => void; children: ReactNode }) {
  const [active, setActive] = useState("Overview");
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen w-full bg-background font-sans text-foreground">
      <div className="sticky top-0 hidden h-screen shrink-0 lg:block">
        <Sidebar user={user} active={active} onSelect={setActive} />
      </div>
      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <Sidebar user={user} active={active} onSelect={setActive} onClose={() => setOpen(false)} />
          <button className="flex-1 bg-foreground/40" aria-label="Close menu" onClick={() => setOpen(false)} />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/90 h-16 px-4 backdrop-blur sm:px-7">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu className="h-6 w-6" /></button>
          <label className="flex min-w-0 max-w-xl flex-1 items-center gap-3 rounded-lg border border-border bg-card px-4 py-2.5">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder="Search the library, policies, procedures and more…" />
          </label>
          <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-5">
            <select
              value={user.role}
              onChange={(e) => onRoleChange(e.target.value as Role)}
              className="hidden rounded-md border border-border bg-card px-2 py-1.5 text-xs font-medium sm:block"
              aria-label="Preview as role"
            >
              <option value="employee">View as Employee</option>
              <option value="admin">View as Administrator</option>
            </select>
            <button className="relative" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-primary" />
            </button>
            <HelpCircle className="hidden h-5 w-5 sm:block" />
            <div className="flex items-center gap-1">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-primary-soft text-xs font-bold text-primary">{initials(user.name)}</div>
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </header>
        <main className="flex-1 px-4 py-4 sm:px-7">{children}</main>
      </div>
    </div>
  );
}
