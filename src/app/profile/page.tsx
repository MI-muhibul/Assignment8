"use client";

import { useState } from "react";
import { ProtectedPage } from "@/components/ProtectedPage";
import { useApp } from "@/components/AppProviders";
import { apiRequest, type User } from "@/lib/api";

export default function ProfilePage() {
  const { user, token, refreshUser, notify } = useApp();
  const [profile, setProfile] = useState<{ name: string; imageUrl: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const name = profile?.name ?? user?.name ?? "";
  const imageUrl = profile?.imageUrl ?? user?.imageUrl ?? "";

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await apiRequest<{ user: User }>("/api/auth/profile", {
        method: "PATCH",
        body: JSON.stringify({ name, imageUrl }),
      }, token);
      await refreshUser();
      notify("Your profile is looking good.");
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Could not update your profile.";
      setError(message);
      notify(message, "error");
    } finally {
      setSaving(false);
    }
  }

  return <ProtectedPage><section className="page-wrap"><div className="page-heading"><span className="eyebrow">A FACE TO GO WITH THE GOOD</span><h1>Your <em>profile.</em></h1><p>Update how you show up in the neighborhood.</p></div><div className="profile-grid">
    <aside className="profile-card"><div className="profile-photo">{imageUrl ? <img src={imageUrl} alt="" /> : user?.name.charAt(0).toUpperCase()}</div><h3>{user?.name}</h3><p>{user?.email}</p></aside>
    <form className="form-card event-form" onSubmit={submit}>{error && <div className="form-error" role="alert">{error}</div>}<label className="field"><span>Your name</span><input required minLength={2} maxLength={80} value={name} onChange={(event) => setProfile((current) => ({ name: event.target.value, imageUrl: current?.imageUrl ?? user?.imageUrl ?? "" }))} /></label><label className="field"><span>Profile image URL</span><input type="url" value={imageUrl} onChange={(event) => setProfile((current) => ({ name: current?.name ?? user?.name ?? "", imageUrl: event.target.value }))} placeholder="https://..." /></label><button className="button form-submit" disabled={saving}>{saving ? "Saving..." : "Save profile"} <span>↗</span></button></form>
  </div></section></ProtectedPage>;
}
