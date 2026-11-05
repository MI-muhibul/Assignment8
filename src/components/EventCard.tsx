import Link from "next/link";
import { formatDate, type EventItem } from "@/lib/api";

export function EventCard({ event }: { event: EventItem }) {
  return (
    <article className="event-card">
      <Link className="event-image-link" href={`/events/${event._id}`} aria-label={`View ${event.title}`}>
        <img className="event-image" src={event.imageUrl} alt="" />
        <span className="event-type">{event.type}</span>
      </Link>
      <div className="event-card-content">
        <span className="event-date">{formatDate(event.date)}</span>
        <h3><Link href={`/events/${event._id}`}>{event.title}</Link></h3>
        <p className="event-location"><span>⌖</span> {event.location}</p>
        <div className="event-card-bottom">
          <span className="event-going">{event.joinedBy?.length || 0} neighbors going</span>
          <Link className="arrow-link" href={`/events/${event._id}`} aria-label={`View ${event.title}`}>↗</Link>
        </div>
      </div>
    </article>
  );
}
