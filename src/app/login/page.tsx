"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useApp } from "@/components/AppProviders";
import { apiRequest, type User } from "@/lib/api";

function LoginForm() {
  const { signIn, notify } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(form: React.FormEvent<HTMLFormElement>) {
    form.preventDefault();
    setBusy(true);
    setError("");
    const data = new FormData(form.currentTarget);
    try {
      const result = await apiRequest<{ token: string; user: User }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: data.get("email"), password: data.get("password") }),
      });
      signIn(result.token, result.user);
      notify(`Welcome back, ${result.user.name.split(" ")[0]}.`);
      const next = searchParams.get("next");
      router.push(next?.startsWith("/") ? next : "/events");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not sign you in.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      {error && <div className="form-error" role="alert">{error}</div>}
      <label className="field"><span>Email address</span><input name="email" type="email" required autoComplete="email" placeholder="you@example.com" /></label>
      <label className="field"><span>Password</span><input name="password" type="password" required minLength={8} autoComplete="current-password" placeholder="Your password" /></label>
      <button className="button auth-submit" disabled={busy}>{busy ? "One moment..." : "Log in"} <span>↗</span></button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <section className="auth-wrap">
      <aside className="auth-aside"><Link className="brand" href="/"><span className="brand-mark"><span>g</span></span><span>good<span className="brand-light">neighbors</span></span></Link><h2>It&apos;s good<br />to see <em>you.</em></h2><p>Your people, your neighborhood, and your next chance to make a difference are right here.</p><span className="auth-quote">“A little good goes a long way.”</span></aside>
      <div className="auth-content"><span className="eyebrow">PICK UP WHERE YOU LEFT OFF</span><h1>Welcome back.</h1><p>Log in and find your next good thing.</p><Suspense fallback={<div className="skeleton skeleton-panel" style={{ height: 190 }} />}><LoginForm /></Suspense><p className="auth-switch">New around here? <Link href="/register">Make an account</Link></p></div>
    </section>
  );
}
