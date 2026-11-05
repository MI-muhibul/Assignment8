"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useApp } from "@/components/AppProviders";
import { apiRequest, type User } from "@/lib/api";

export default function RegisterPage() {
  const { signIn, notify } = useApp();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(form: React.FormEvent<HTMLFormElement>) {
    form.preventDefault();
    setBusy(true);
    setError("");
    const data = new FormData(form.currentTarget);
    const password = String(data.get("password"));
    if (password !== data.get("confirmPassword")) {
      setError("Those passwords do not match. Give it another try.");
      setBusy(false);
      return;
    }
    try {
      const result = await apiRequest<{ token: string; user: User }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name: data.get("name"), email: data.get("email"), password }),
      });
      signIn(result.token, result.user);
      notify("You’re in. Let’s make something good happen.");
      router.push("/events");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not create your account.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="auth-wrap">
      <aside className="auth-aside"><Link className="brand" href="/"><span className="brand-mark"><span>g</span></span><span>good<span className="brand-light">neighbors</span></span></Link><h2>There&apos;s room<br />for <em>one more.</em></h2><p>Join the people turning good intentions into good things, right where they live.</p><span className="auth-quote">Small acts. Stronger neighborhoods.</span></aside>
      <div className="auth-content"><span className="eyebrow">GOOD TO HAVE YOU HERE</span><h1>Make an account.</h1><p>It starts with you showing up.</p>
        <form className="auth-form" onSubmit={submit}>
          {error && <div className="form-error" role="alert">{error}</div>}
          <label className="field"><span>Your name</span><input name="name" required minLength={2} maxLength={80} autoComplete="name" placeholder="What should we call you?" /></label>
          <label className="field"><span>Email address</span><input name="email" type="email" required autoComplete="email" placeholder="you@example.com" /></label>
          <label className="field"><span>Password</span><input name="password" type="password" required minLength={8} maxLength={72} autoComplete="new-password" placeholder="At least 8 characters" /></label>
          <label className="field"><span>Confirm password</span><input name="confirmPassword" type="password" required minLength={8} autoComplete="new-password" placeholder="Type it one more time" /></label>
          <button className="button auth-submit" disabled={busy}>{busy ? "Making your account..." : "Join the good"} <span>↗</span></button>
        </form>
        <p className="auth-switch">Already one of us? <Link href="/login">Log in</Link></p>
      </div>
    </section>
  );
}
