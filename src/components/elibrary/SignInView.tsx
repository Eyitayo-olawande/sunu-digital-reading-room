import { useState, type FormEvent } from "react";
import { BookOpen, GraduationCap, ChartNoAxesColumnIncreasing, Lightbulb, UserRound, LockKeyhole, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CorporateLogo } from "./CorporateLogo";
import office from "@/assets/signin-office.jpg";

const benefits = [
  { icon: BookOpen, label: "Access Key Resources" },
  { icon: GraduationCap, label: "Complete Learning Paths" },
  { icon: ChartNoAxesColumnIncreasing, label: "Track Your Progress" },
  { icon: Lightbulb, label: "Build Your Expertise" },
];

export function SignInView() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("Sign-in is not connected in this visual prototype. No credentials have been sent or saved.");
  }
  return <main className="signin-screen">
    <section className="signin-brand" aria-label="SUNU eLibrary">
      <img className="signin-photo" src={office} alt="SUNU professional learning at her laptop in the office" />
      <div className="signin-photo-shade" aria-hidden />
      <div className="signin-branding">
        <div className="min-w-0"><CorporateLogo className="max-h-12 max-w-[120px] drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]" /></div>
        <div className="signin-brand-divider" />
        <div><p className="text-2xl font-bold">eLibrary</p><p className="text-sm">Knowledge &amp; Learning Hub</p></div>
      </div>
      <div className="signin-brand-copy"><h1>Learn.<br />Grow.<br />Perform.</h1><div className="mt-5 h-1.5 w-20 rounded-full bg-primary" /><p>Your digital library for policies, procedures, guidelines and role-based learning.</p></div>
      <div className="signin-benefits">
        {benefits.map(({ icon: Icon, label }) => <div key={label} className="flex min-w-0 flex-col items-center gap-2 text-center"><Icon className="h-8 w-8" strokeWidth={1.6} /><span className="max-w-32 text-sm leading-snug">{label}</span></div>)}
      </div>
    </section>
    <section className="signin-form-panel" aria-label="Sign in">
      <div className="signin-form-card">
        <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">Welcome to the<br />SUNU <span className="text-primary">eLibrary</span></h2>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">Sign in to access your learning, resources and training.</p>
        <form onSubmit={submit} className="mt-7 space-y-5">
          <div><label htmlFor="signin-email" className="mb-2 block text-sm font-semibold">Work email</label><div className="flex items-center gap-3 rounded-lg border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring/30"><UserRound className="h-5 w-5 shrink-0 text-muted-foreground" /><input id="signin-email" name="email" type="email" required autoComplete="off" placeholder="Enter your work email" className="h-12 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground" onChange={() => setMessage("")} /></div></div>
          <div><label htmlFor="signin-password" className="mb-2 block text-sm font-semibold">Password</label><div className="flex items-center gap-3 rounded-lg border border-input bg-background pl-3 focus-within:ring-2 focus-within:ring-ring/30"><LockKeyhole className="h-5 w-5 shrink-0 text-muted-foreground" /><input id="signin-password" name="password" type={visible ? "text" : "password"} required autoComplete="off" placeholder="Enter your password" className="h-12 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground" onChange={() => setMessage("")} /><Button type="button" variant="ghost" size="icon" className="h-12 w-12 shrink-0" aria-label={visible ? "Hide password" : "Show password"} aria-pressed={visible} onClick={() => setVisible(v => !v)}>{visible ? <EyeOff /> : <Eye />}</Button></div></div>
          <p className="text-xs leading-relaxed text-muted-foreground">Visual prototype · Sign-in is not connected.</p>
          <Button type="submit" className="h-12 w-full text-base font-semibold">Sign In<ArrowRight /></Button>
          {message && <p role="status" className="rounded-lg border border-primary/20 bg-primary-soft p-3 text-sm leading-relaxed text-primary">{message}</p>}
        </form>
      </div>
    </section>
  </main>;
}