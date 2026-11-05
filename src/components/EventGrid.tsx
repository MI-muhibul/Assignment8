import type { EventItem } from "@/lib/api";
import { EventCard } from "@/components/EventCard";

export function EventGrid({ events }: { events: EventItem[] }) {
  if (!events.length) return <div className="empty-state"><span className="empty-icon">✳</span><h3>No events just yet</h3><p>Check back soon, or be the first to bring your neighbors together.</p></div>;
  return <div className="event-grid">{events.map((event) => <EventCard event={event} key={event._id} />)}</div>;
}
