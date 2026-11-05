"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { EventForm } from "@/components/EventForm";
import { ProtectedPage } from "@/components/ProtectedPage";
import { useApp } from "@/components/AppProviders";
import { apiRequest, type EventItem } from "@/lib/api";

function EditEventContent() {
  const { id } = useParams<{ id: string }>();
  const { token } = useApp();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!id || !token) return;
    apiRequest<{ events: EventItem[] }>("/api/events/mine/created", {}, token)
      .then(({ events }) => {
        const found = events.find((item) => item._id === id);
        if (found) setEvent(found);
        else setError("This event is not in your list, or it may have been removed.");
      })
      .catch((caught) => setError(caught instanceof Error ? caught.message : "The event could not be loaded."));
  }, [id, token]);

  return <ProtectedPage><section className="page-wrap form-layout"><Link href="/manage-events" className="back-link">← Back to your events</Link><div className="page-heading" style={{ marginTop: 24 }}><span className="eyebrow">A QUICK UPDATE</span><h1>Edit your<br /><em>event.</em></h1><p>Make the changes your neighbors need to know about.</p></div>{error ? <div className="inline-error" role="alert">{error}</div> : event ? <EventForm event={event} eventId={event._id} /> : <div className="skeleton skeleton-panel" style={{ height: 470 }} />}</section></ProtectedPage>;
}

export default function EditEventPage() {
  return <Suspense fallback={<div className="page-wrap"><div className="skeleton skeleton-title" /><div className="skeleton skeleton-panel" /></div>}><EditEventContent /></Suspense>;
}
