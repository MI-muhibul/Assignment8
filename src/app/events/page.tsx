"use client";

import { useEffect, useState } from "react";
import { EventGrid } from "@/components/EventGrid";
import { apiRequest, type EventItem } from "@/lib/api";

const filters = ["All", "Cleanup", "Plantation", "Donation", "Community", "Education", "Other"];

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selected, setSelected] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const typeParam = selected === "All" ? "" : `&type=${encodeURIComponent(selected)}`;
    apiRequest<{ events: EventItem[] }>(`/api/events?limit=100${typeParam}`)
      .then(({ events: upcoming }) => setEvents(upcoming))
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Events could not be loaded."))
      .finally(() => setLoading(false));
  }, [selected]);

  return (
    <section className="page-wrap">
      <div className="page-heading"><span className="eyebrow">YOUR NEIGHBORHOOD, IN MOTION</span><h1>Find your next<br /><em>good thing.</em></h1><p>From a few hours outdoors to a meal shared with neighbors, there&apos;s always a way to pitch in.</p></div>
      <div className="filter-row" aria-label="Filter events by type">
        {filters.map((filter) => <button key={filter} className={selected === filter ? "filter-chip active" : "filter-chip"} onClick={() => { setLoading(true); setError(""); setSelected(filter); }}>{filter}</button>)}
      </div>
      {error ? <div className="inline-error" role="alert">{error}</div> : loading ? <div className="event-grid">{[1, 2, 3].map((item) => <div className="skeleton event-skeleton" key={item} />)}</div> : <div className="page-event-grid"><EventGrid events={events} /></div>}
    </section>
  );
}
