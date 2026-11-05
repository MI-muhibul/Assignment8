"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest, type EventItem } from "@/lib/api";
import { useApp } from "@/components/AppProviders";

type EventFormValues = Pick<EventItem, "title" | "description" | "type" | "imageUrl" | "location" | "date">;

const eventTypes = ["Cleanup", "Plantation", "Donation", "Community", "Education", "Other"];

export function EventForm({ event, eventId }: { event?: EventItem; eventId?: string }) {
  const { token, notify } = useApp();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [values, setValues] = useState<EventFormValues>({
    title: event?.title || "",
    description: event?.description || "",
    type: event?.type || "Community",
    imageUrl: event?.imageUrl || "",
    location: event?.location || "",
    date: event ? new Date(event.date).toISOString().slice(0, 16) : "",
  });

  function update(field: keyof EventFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function submit(form: React.FormEvent<HTMLFormElement>) {
    form.preventDefault();
    setSaving(true);
    setError("");
    try {
      await apiRequest<{ event: EventItem }>(
        eventId ? `/api/events/${eventId}` : "/api/events",
        { method: eventId ? "PATCH" : "POST", body: JSON.stringify({ ...values, date: new Date(values.date).toISOString() }) },
        token,
      );
      notify(eventId ? "Your event details have been updated." : "Your event is live. Thanks for bringing people together!");
      router.push(eventId ? "/manage-events" : "/events");
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Could not save your event.";
      setError(message);
      notify(message, "error");
    } finally {
      setSaving(false);
    }
  }

  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  const minDate = today.toISOString().slice(0, 16);

  return (
    <form className="form-card event-form" onSubmit={submit}>
      {error && <div className="form-error" role="alert">{error}</div>}
      <label className="field"><span>Event name</span><input required minLength={4} maxLength={100} value={values.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. A warmer winter for Mirpur" /></label>
      <label className="field"><span>What are we doing?</span><textarea required minLength={20} maxLength={2000} rows={5} value={values.description} onChange={(e) => update("description", e.target.value)} placeholder="Tell your neighbors what to expect and how this will help..." /></label>
      <div className="form-row">
        <label className="field"><span>Kind of event</span><select value={values.type} onChange={(e) => update("type", e.target.value)}>{eventTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
        <label className="field"><span>When</span><input required type="datetime-local" min={minDate} value={values.date} onChange={(e) => update("date", e.target.value)} /></label>
      </div>
      <label className="field"><span>Where</span><input required minLength={3} maxLength={160} value={values.location} onChange={(e) => update("location", e.target.value)} placeholder="Neighborhood, city" /></label>
      <label className="field"><span>Cover image URL</span><input required type="url" value={values.imageUrl} onChange={(e) => update("imageUrl", e.target.value)} placeholder="https://..." /></label>
      <button className="button form-submit" type="submit" disabled={saving}>{saving ? "Saving your event..." : eventId ? "Save changes" : "Publish event"} <span>↗</span></button>
    </form>
  );
}
