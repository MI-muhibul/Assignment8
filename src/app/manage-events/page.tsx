"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ProtectedPage } from "@/components/ProtectedPage";
import { useApp } from "@/components/AppProviders";
import { apiRequest, formatDate, type EventItem } from "@/lib/api";

export default function ManageEventsPage() {
  const { token, notify } = useApp();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loadEvents = useCallback(() => {
    if (!token) return;
    setLoading(true);
    apiRequest<{ events: EventItem[] }>("/api/events/mine/created", {}, token)
      .then(({ events: mine }) => setEvents(mine))
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Your events could not be loaded."))
      .finally(() => setLoading(false));
  }, [token]);
  useEffect(() => {
    const timer = window.setTimeout(loadEvents, 0);
    return () => window.clearTimeout(timer);
  }, [loadEvents]);

  async function removeEvent(event: EventItem) {
    if (!window.confirm(`Delete “${event.title}”? This cannot be undone.`)) return;
    try {
      await apiRequest(`/api/events/${event._id}`, { method: "DELETE" }, token);
      setEvents((current) => current.filter((item) => item._id !== event._id));
      notify("Your event has been deleted.");
    } catch (caught) {
      notify(caught instanceof Error ? caught.message : "Could not delete the event.", "error");
    }
  }

  return <ProtectedPage><section className="page-wrap"><div className="page-heading"><span className="eyebrow">YOUR GOOD THINGS, ALL IN ONE PLACE</span><h1>Manage <em>events.</em></h1><p>Update an event or tidy up your list. Only you can change the events you created.</p><Link className="button button-small" href="/create-event">Create an event <span>↗</span></Link></div>
    {error ? <div className="inline-error" role="alert">{error}</div> : loading ? <div className="skeleton skeleton-panel" style={{ height: 240 }} /> : events.length ? <div className="manage-list">{events.map((event) => <article className="manage-row" key={event._id}><img src={event.imageUrl} alt="" /><div><h3>{event.title}</h3><p>{formatDate(event.date)} · {event.location} · {event.joinedBy?.length || 0} joined</p></div><div className="manage-actions"><Link href={`/manage-events/${event._id}/edit`}>Edit</Link><button className="danger-button" onClick={() => removeEvent(event)}>Delete</button></div></article>)}</div> : <div className="empty-state"><span className="empty-icon">✳</span><h3>Your next idea starts here</h3><p>You haven&apos;t created an event yet. Give your neighbors a reason to get together.</p><Link className="button" href="/create-event">Create your first event <span>↗</span></Link></div>}
  </section></ProtectedPage>;
}
