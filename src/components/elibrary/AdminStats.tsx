import { BookOpen, Layers, LogIn, Users } from "lucide-react";

const stats = [
  { value: 21, label: "Active staff", icon: Users },
  { value: 8, label: "Departments", icon: Layers },
  { value: 13, label: "Published resources", icon: BookOpen },
  { value: 16, label: "Sign-ins this week", icon: LogIn },
];

export function AdminStats() {
  return (
    <div className="relative z-10 -mt-12 grid grid-cols-2 gap-3 px-3 sm:gap-4 lg:grid-cols-4">
      {stats.map(({ value, label, icon: Icon }) => (
        <div key={label} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)] sm:p-5">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
            <Icon className="h-6 w-6" strokeWidth={1.6} />
          </span>
          <div className="min-w-0 leading-tight">
            <p className="text-2xl font-bold">{value}</p>
            <p className="truncate text-sm text-foreground/80">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
