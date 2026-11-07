"use client";

import { useEffect, useRef, useState } from "react";
import { EventGrid } from "@/components/EventGrid";
import { apiRequest, type EventItem } from "@/lib/api";

const filters = ["All", "Cleanup", "Plantation", "Donation", "Community", "Education", "Other"];
const pageSize = 100;

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selected, setSelected] = useState("All");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState("");
  const [loadMoreError, setLoadMoreError] = useState("");
  const requestVersion = useRef(0);

  useEffect(() => {
    const version = ++requestVersion.current;
    const params = new URLSearchParams({ limit: String(pageSize), skip: "0" });
    if (selected !== "All") params.set("type", selected);
    apiRequest<{ events: EventItem[]; hasMore: boolean }>(`/api/events?${params}`)
      .then(({ events: upcoming, hasMore: nextHasMore }) => {
        if (requestVersion.current !== version) return;
        setEvents(upcoming);
        setHasMore(nextHasMore);
      })
      .catch((caught) => {
        if (requestVersion.current === version) {
          setError(caught instanceof Error ? caught.message : "Events could not be loaded.");
        }
      })
      .finally(() => {
        if (requestVersion.current === version) setLoading(false);
      });

    return () => {
      if (requestVersion.current === version) requestVersion.current += 1;
    };
  }, [selected]);

  async function loadMore() {
    const version = requestVersion.current;
    const params = new URLSearchParams({ limit: String(pageSize), skip: String(events.length) });
    if (selected !== "All") params.set("type", selected);
    setLoadingMore(true);
    setLoadMoreError("");
    try {
      const { events: nextEvents, hasMore: nextHasMore } = await apiRequest<{
        events: EventItem[];
        hasMore: boolean;
      }>(`/api/events?${params}`);
      if (requestVersion.current !== version) return;
      setEvents((current) => [...current, ...nextEvents]);
      setHasMore(nextHasMore);
    } catch (caught) {
      if (requestVersion.current === version) {
        setLoadMoreError(caught instanceof Error ? caught.message : "More events could not be loaded.");
      }
    } finally {
      if (requestVersion.current === version) setLoadingMore(false);
    }
  }

  return (
    <section className="page-wrap">
      <div className="page-heading"><span className="eyebrow">YOUR NEIGHBORHOOD, IN MOTION</span><h1>Find your next<br /><em>good thing.</em></h1><p>From a few hours outdoors to a meal shared with neighbors, there&apos;s always a way to pitch in.</p></div>
      <div className="filter-row" aria-label="Filter events by type">
      {filters.map((filter) => <button key={filter} className={selected === filter ? "filter-chip active" : "filter-chip"} onClick={() => {
        if (selected === filter) return;
        requestVersion.current += 1;
        setSelected(filter);
        setEvents([]);
        setHasMore(false);
        setLoading(true);
        setLoadingMore(false);
        setError("");
        setLoadMoreError("");
      }}>{filter}</button>)}
      </div>
      {error ? <div className="inline-error" role="alert">{error}</div> : loading ? <div className="event-grid">{[1, 2, 3].map((item) => <div className="skeleton event-skeleton" key={item} />)}</div> : (
        <>
          <div className="page-event-grid"><EventGrid events={events} /></div>
          {loadMoreError && <div className="inline-error" role="alert">{loadMoreError}</div>}
          {hasMore && <div className="events-load-more"><button className="button button-outline" onClick={loadMore} disabled={loadingMore}>{loadingMore ? "Loading events..." : "Load more events"}</button></div>}
        </>
      )}
    </section>
  );
}
