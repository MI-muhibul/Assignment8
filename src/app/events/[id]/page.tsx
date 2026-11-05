"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useApp } from "@/components/AppProviders";
import { apiRequest, formatDate, type EventItem } from "@/lib/api";

function EventDetailContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, token, notify } = useApp();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params.id) return;
    apiRequest<{ event: EventItem }>(`/api/events/${params.id}`)
      .then(({ event: found }) => setEvent(found))
      .catch((caught) => setError(caught instanceof Error ? caught.message : "This event could not be loaded."))
      .finally(() => setLoading(false));
  }, [params.id]);

  async function joinEvent() {
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(`/events/${params.id}`)}`);
      return;
    }
    if (!event) return;
    setJoining(true);
    try {
      const result = await apiRequest<{ event: EventItem; message: string }>(`/api/events/${event._id}/join`, { method: "POST" }, token);
      setEvent(result.event);
      notify(result.message);
    } catch (caught) {
      notify(caught instanceof Error ? caught.message : "Could not join this event.", "error");
    } finally {
      setJoining(false);
    }
  }

  if (loading) return <div className="page-wrap"><div className="skeleton skeleton-title" /><div className="skeleton skeleton-panel" /></div>;
  if (error || !event) return <section className="page-wrap"><Link className="back-link" href="/events">← Back to events</Link><div className="inline-error" role="alert" style={{ marginTop: 24 }}>{error || "This event is unavailable."}</div></section>;
  const isJoined = Boolean(user && event.joinedBy?.some((person) => String(person) === user.id));
  const organizer = typeof event.createdBy === "object" ? event.createdBy.name : "A local neighbor";

  return (
    <article className="page-wrap detail-wrap">
      <Link className="back-link" href="/events">← All upcoming events</Link>
      <img className="detail-cover" src={event.imageUrl} alt="" />
      <div className="detail-layout">
        <div>
          <span className="eyebrow">{event.type.toUpperCase()} · {formatDate(event.date).toUpperCase()}</span>
          <h1 className="detail-title">{event.title}</h1>
          <div className="detail-meta"><span>⌖ &nbsp;{event.location}</span><span>✳ &nbsp;Hosted by {organizer}</span><span>◉ &nbsp;{event.joinedBy?.length || 0} neighbors joining</span></div>
          <h2 className="eyebrow">A LITTLE MORE ABOUT IT</h2>
          <p className="detail-description">{event.description}</p>
        </div>
        <aside className="detail-sidebar">
          <h3>Come be part of it.</h3>
          <p>A few helping hands can make a world of difference. Save your spot and meet your neighbors there.</p>
          <button className="button" onClick={joinEvent} disabled={joining || isJoined}>{joining ? "Joining..." : isJoined ? "You’re joining us ✓" : "I’ll be there"}{!isJoined && <span>↗</span>}</button>
          <div className="sidebar-note"><span>✳</span><span>{user ? "Thanks for showing up for your community." : "You’ll need an account to join. It only takes a moment."}</span></div>
        </aside>
      </div>
    </article>
  );
}

export default function EventDetailPage() {
  return <Suspense fallback={<div className="page-wrap"><div className="skeleton skeleton-title" /><div className="skeleton skeleton-panel" /></div>}><EventDetailContent /></Suspense>;
}
