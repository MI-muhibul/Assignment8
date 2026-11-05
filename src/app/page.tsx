"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { EventGrid } from "@/components/EventGrid";
import { apiRequest, type EventItem } from "@/lib/api";

const photos = [
  { src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=85", alt: "Volunteers working together in a community garden", label: "Growing together" },
  { src: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=85", alt: "Community volunteers sharing a meal", label: "A seat for everyone" },
  { src: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=85", alt: "Neighbors sorting donations for families", label: "Good things, shared" },
];

export default function Home() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    apiRequest<{ events: EventItem[] }>("/api/events?limit=6")
      .then(({ events: upcoming }) => setEvents(upcoming))
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Events could not be loaded."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-image" />
        <div className="hero-inner">
          <div className="hero-copy">
            <span className="eyebrow eyebrow-light"><span className="eyebrow-dot" /> GOOD STARTS CLOSE TO HOME</span>
            <h1>Good neighbors<br />make <em>good things</em><br />happen.</h1>
            <p>Meet the people who care about your corner of the world. Find a small way to help, and see what grows.</p>
            <div className="hero-actions"><Link href="/events" className="button button-cream">Find your next good thing <span>↗</span></Link><Link href="/create-event" className="hero-text-link">Bring people together <span>→</span></Link></div>
            <div className="hero-proof"><div className="proof-avatars"><span>R</span><span>M</span><span>A</span><span>+</span></div><span>Neighbors showing up, one good day at a time</span></div>
          </div>
          <div className="hero-sticker"><span>Little by little,</span><strong>we make<br />a difference.</strong><span className="sticker-star">✳</span></div>
        </div>
        <div className="hero-caption"><span>COMMUNITY, IN ACTION</span><span>23°48&apos; N — DHAKA, BD</span></div>
      </section>

      <section className="intro-band" id="our-approach">
        <span className="section-index">01 / THE IDEA</span>
        <p>There&apos;s a little good happening <em>everywhere.</em><br />We just help you find your people.</p>
        <span className="intro-note">A neighborhood is more than a place.<br />It&apos;s what we do for each other.</span>
      </section>

      <section className="section section-events">
        <div className="section-heading">
          <div><span className="eyebrow">A REASON TO GET TOGETHER</span><h2>Coming up <em>near you.</em></h2></div>
          <Link href="/events" className="text-link">All upcoming events <span>↗</span></Link>
        </div>
        {error ? <div className="inline-error" role="alert">{error}</div> : loading ? (
          <div className="event-grid">{[1, 2, 3].map((item) => <div className="skeleton event-skeleton" key={item} />)}</div>
        ) : <EventGrid events={events} />}
      </section>

      <section className="how-section">
        <div className="how-heading"><span className="eyebrow eyebrow-light">GOOD THINGS ARE A TEAM SPORT</span><h2>Showing up is<br />the whole <em>thing.</em></h2></div>
        <div className="how-steps">
          <article><span className="step-number">01</span><span className="step-icon">⌕</span><h3>Find your people</h3><p>Browse local events, discover causes you care about, and meet the neighbors behind them.</p></article>
          <article><span className="step-number">02</span><span className="step-icon">↗</span><h3>Make a little plan</h3><p>Join an event, save the date, and bring a friend along for the good stuff.</p></article>
          <article><span className="step-number">03</span><span className="step-icon">✳</span><h3>See what grows</h3><p>One hour, one helping hand, one stronger community. It all adds up.</p></article>
        </div>
      </section>

      <section className="section gallery-section">
        <div className="section-heading">
          <div><span className="eyebrow">GOOD IS HAPPENING</span><h2>Look what we <em>can do.</em></h2></div>
          <p>Real people, lending a hand.<br />Real moments that make a place feel like home.</p>
        </div>
        <div className="photo-grid">{photos.map((photo) => <figure key={photo.label}><img src={photo.src} alt={photo.alt} /><figcaption>{photo.label}<span>↗</span></figcaption></figure>)}</div>
      </section>

      <section className="newsletter">
        <span className="newsletter-mark">✳</span>
        <div><span className="eyebrow eyebrow-light">A LITTLE GOOD IN YOUR INBOX</span><h2>Stay close to<br /><em>what matters.</em></h2><p>New events, kind people, and small ways to help. Now and then.</p></div>
        <form className="newsletter-form" onSubmit={(event) => event.preventDefault()}><label htmlFor="newsletter-email">Your email address</label><div><input id="newsletter-email" type="email" placeholder="you@example.com" required /><button aria-label="Subscribe">↗</button></div><small>No noise. Just good things. Unsubscribe whenever.</small></form>
      </section>
    </>
  );
}
