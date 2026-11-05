"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ProtectedPage } from "@/components/ProtectedPage";
import { useApp } from "@/components/AppProviders";
import { apiRequest, type EventItem } from "@/lib/api";
import { EventGrid } from "@/components/EventGrid";

export default function JoinedEventsPage() {
  const { token } = useApp();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(() => {
    if (!token) return;
    setLoading(true);
    apiRequest<{ events: EventItem[] }>("/api/events/mine/joined", {}, token)
      .then(({ events: joined }) => setEvents(joined))
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Your events could not be loaded."))
      .finally(() => setLoading(false));
  }, [token]);
  useEffect(() => {
    const timer = window.setTimeout(load, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  return <ProtectedPage><section className="page-wrap"><div className="page-heading"><span className="eyebrow">YOU SAID YOU&apos;D BE THERE</span><h1>Your good<br /><em>commitments.</em></h1><p>Your upcoming events, sorted by date. We&apos;re glad you&apos;re showing up.</p></div>{error ? <div className="inline-error" role="alert">{error}</div> : loading ? <div className="event-grid">{[1, 2, 3].map((item) => <div className="skeleton event-skeleton" key={item} />)}</div> : events.length ? <EventGrid events={events} /> : <div className="empty-state"><span className="empty-icon">✳</span><h3>Nothing on your calendar yet</h3><p>Find an event you care about and save yourself a spot.</p><Link href="/events" className="button">Explore events <span>↗</span></Link></div>}</section></ProtectedPage>;
}
